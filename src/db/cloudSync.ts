/**
 * RUST Cloud Sync — Supabase backed cloud save
 *
 * Strategy: local-first with background sync.
 * - All writes go to IndexedDB first (instant)
 * - Background sync pushes changes to Supabase
 * - On app load, merges remote data with local (latest updatedAt wins)
 */

import { supabase, isSupabaseReady } from './supabase'
import { exportAllData, importAllData } from './index'

// Tables expected in Supabase (mirrors IndexedDB stores)
const SYNC_TABLES = ['planner', 'remember', 'places', 'journal', 'medication', 'settings'] as const

export interface SyncStatus {
  lastSync: number | null
  syncing: boolean
  error: string | null
}

let syncStatus: SyncStatus = {
  lastSync: null,
  syncing: false,
  error: null,
}

export function getSyncStatus(): SyncStatus {
  return { ...syncStatus }
}

/**
 * Push all local data to Supabase cloud backup.
 * Uses a single JSON blob per user for simplicity and safety.
 */
export async function pushToCloud(): Promise<boolean> {
  if (!isSupabaseReady() || !supabase) {
    console.warn('[RUST Sync] Supabase not configured')
    return false
  }

  try {
    syncStatus = { ...syncStatus, syncing: true, error: null }

    const session = await supabase.auth.getSession()
    const userId = session.data.session?.user?.id

    if (!userId) {
      // No authenticated user — cloud save requires auth
      syncStatus = { ...syncStatus, syncing: false, error: 'Niet ingelogd' }
      return false
    }

    const data = await exportAllData()

    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        data: JSON.parse(data),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('[RUST Sync] Push failed:', error)
      syncStatus = { ...syncStatus, syncing: false, error: error.message }
      return false
    }

    syncStatus = { lastSync: Date.now(), syncing: false, error: null }
    localStorage.setItem('rust_last_sync', String(Date.now()))
    return true
  } catch (err: any) {
    console.error('[RUST Sync] Push error:', err)
    syncStatus = { ...syncStatus, syncing: false, error: err.message || 'Onbekende fout' }
    return false
  }
}

/**
 * Pull data from Supabase and merge with local.
 * Remote data replaces local if remote updatedAt is newer.
 */
export async function pullFromCloud(): Promise<boolean> {
  if (!isSupabaseReady() || !supabase) return false

  try {
    syncStatus = { ...syncStatus, syncing: true, error: null }

    const session = await supabase.auth.getSession()
    const userId = session.data.session?.user?.id

    if (!userId) {
      syncStatus = { ...syncStatus, syncing: false, error: 'Niet ingelogd' }
      return false
    }

    const { data, error } = await supabase
      .from('user_data')
      .select('data, updated_at')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data yet — first sync, push local data up
        syncStatus = { ...syncStatus, syncing: false }
        return await pushToCloud()
      }
      console.error('[RUST Sync] Pull failed:', error)
      syncStatus = { ...syncStatus, syncing: false, error: error.message }
      return false
    }

    if (data?.data) {
      const localSyncTime = parseInt(localStorage.getItem('rust_last_sync') || '0')
      const remoteSyncTime = new Date(data.updated_at).getTime()

      // Only import if remote is newer
      if (remoteSyncTime > localSyncTime) {
        await importAllData(JSON.stringify(data.data))
        localStorage.setItem('rust_last_sync', String(remoteSyncTime))
      }
    }

    syncStatus = { lastSync: Date.now(), syncing: false, error: null }
    return true
  } catch (err: any) {
    console.error('[RUST Sync] Pull error:', err)
    syncStatus = { ...syncStatus, syncing: false, error: err.message || 'Onbekende fout' }
    return false
  }
}

/**
 * Upload image to Supabase private storage bucket.
 */
export async function uploadImage(
  file: File | Blob,
  fileName: string
): Promise<string | null> {
  if (!isSupabaseReady() || !supabase) return null

  try {
    const session = await supabase.auth.getSession()
    const userId = session.data.session?.user?.id
    if (!userId) return null

    const path = `${userId}/${fileName}`
    const { error } = await supabase.storage
      .from('user-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('[RUST Sync] Image upload failed:', error)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('user-images')
      .getPublicUrl(path)

    return urlData?.publicUrl || null
  } catch (err) {
    console.error('[RUST Sync] Image upload error:', err)
    return null
  }
}
