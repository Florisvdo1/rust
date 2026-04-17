import { supabase } from './supabase'
import type { Note, Place, PlannerItem, JournalEntry, HealthItem, HealthLog, DailyHealth, BreathingSession } from '@/types'

export interface CloudData {
  notes: Note[]
  places: Place[]
  plannerItems: PlannerItem[]
  journalEntries: JournalEntry[]
  healthItems: HealthItem[]
  healthLogs: HealthLog[]
  dailyHealth: DailyHealth[]
  breathingSessions: BreathingSession[]
}

const warn = (ctx: string, err: { message: string }) => console.warn(`[sync:${ctx}]`, err.message)

export async function syncNote(userId: string, note: Note) {
  if (!supabase) return
  const { error } = await supabase.from('notes').upsert({
    id: note.id, user_id: userId, title: note.title, content: note.content,
    category: note.category, pinned: note.pinned, urgent: note.urgent,
    done: note.done, archived: note.archived,
    created_at: note.createdAt, updated_at: note.updatedAt,
  })
  if (error) warn('note', error)
}

export async function deleteCloudNote(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) warn('deleteNote', error)
}

export async function syncPlace(userId: string, place: Place) {
  if (!supabase) return
  const { error } = await supabase.from('places').upsert({
    id: place.id, user_id: userId, room: place.room, object_label: place.objectLabel,
    where_precisely: place.wherePrecisely ?? null, subzone: place.subzone ?? null,
    container: place.container ?? null, position: place.position ?? null,
    notes: place.notes ?? null, image_url: place.imageUrl ?? null,
    created_at: place.createdAt,
  })
  if (error) warn('place', error)
}

export async function deleteCloudPlace(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('places').delete().eq('id', id)
  if (error) warn('deletePlace', error)
}

export async function syncJournalEntry(userId: string, entry: JournalEntry) {
  if (!supabase) return
  const { error } = await supabase.from('journal_entries').upsert({
    id: entry.id, user_id: userId, date: entry.date, mood: entry.mood,
    energy: entry.energy, stress: entry.stress, went_well: entry.wentWell,
    was_difficult: entry.wasDifficult, remember_tomorrow: entry.rememberTomorrow,
    freewriting: entry.freewriting, created_at: entry.createdAt,
  })
  if (error) warn('journal', error)
}

export async function syncHealthItem(userId: string, item: HealthItem) {
  if (!supabase) return
  const { error } = await supabase.from('health_items').upsert({
    id: item.id, user_id: userId, name: item.name, type: item.type,
    dosage: item.dosage, schedule: item.schedule, created_at: item.createdAt,
  })
  if (error) warn('healthItem', error)
}

export async function deleteCloudHealthItem(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('health_items').delete().eq('id', id)
  if (error) warn('deleteHealthItem', error)
}

export async function syncHealthLog(userId: string, log: HealthLog) {
  if (!supabase) return
  const { error } = await supabase.from('health_logs').upsert({
    id: log.id, user_id: userId, item_id: log.itemId, date: log.date,
    taken: log.taken, time: log.time ?? null,
  })
  if (error) warn('healthLog', error)
}

export async function syncDailyHealth(userId: string, dh: DailyHealth) {
  if (!supabase) return
  const { error } = await supabase.from('daily_health').upsert(
    {
      id: dh.id, user_id: userId, date: dh.date, hydration: dh.hydration,
      sleep_hours: dh.sleepHours, sleep_quality: dh.sleepQuality, notes: dh.notes,
    },
    { onConflict: 'user_id,date' }
  )
  if (error) warn('dailyHealth', error)
}

export async function syncBreathingSession(userId: string, session: BreathingSession) {
  if (!supabase) return
  const { error } = await supabase.from('breathing_sessions').upsert({
    id: session.id, user_id: userId, exercise_id: session.exerciseId,
    duration: session.duration, completed: session.completed,
    completed_at: session.completedAt,
  })
  if (error) warn('breathing', error)
}

export async function syncPlannerItem(userId: string, item: PlannerItem) {
  if (!supabase) return
  const { error } = await supabase.from('planner_items').upsert({
    id: item.id, user_id: userId, date: item.date, hour: item.hour,
    quarter: item.quarter, duration: item.duration,
    activity_id: item.activityId, activity_name: item.activityName,
    category: item.category, color: item.color, icon_id: item.iconId,
    notes: item.notes ?? null, source: item.source ?? null,
    health_type: item.healthType ?? null, health_dosage: item.healthDosage ?? null,
    health_quantity: item.healthQuantity ?? null, health_note: item.healthNote ?? null,
    created_at: item.createdAt,
  })
  if (error) warn('planner', error)
}

export async function deleteCloudPlannerItem(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('planner_items').delete().eq('id', id)
  if (error) warn('deletePlanner', error)
}

// ── Map DB rows → TypeScript types ───────────────────────────────────────────

function mapNote(r: Record<string, unknown>): Note {
  return {
    id: r.id as string, title: r.title as string, content: (r.content as string) || '',
    category: (r.category as string) || 'Algemeen',
    pinned: (r.pinned as boolean) || false, urgent: (r.urgent as boolean) || false,
    done: (r.done as boolean) || false, archived: (r.archived as boolean) || false,
    createdAt: r.created_at as string, updatedAt: r.updated_at as string,
  }
}

function mapPlace(r: Record<string, unknown>): Place {
  return {
    id: r.id as string, room: r.room as string, objectLabel: r.object_label as string,
    wherePrecisely: (r.where_precisely as string) ?? undefined,
    subzone: (r.subzone as string) ?? undefined,
    container: (r.container as string) ?? undefined,
    position: (r.position as string) ?? undefined,
    notes: (r.notes as string) ?? undefined,
    imageUrl: (r.image_url as string) ?? undefined,
    createdAt: r.created_at as string,
  }
}

function mapPlannerItem(r: Record<string, unknown>): PlannerItem {
  return {
    id: r.id as string, date: r.date as string, hour: r.hour as number,
    quarter: r.quarter as number, duration: r.duration as number,
    activityId: r.activity_id as string, activityName: r.activity_name as string,
    category: r.category as string, color: r.color as string, iconId: r.icon_id as string,
    notes: (r.notes as string) ?? undefined, source: (r.source as 'gezondheid') ?? undefined,
    healthType: (r.health_type as PlannerItem['healthType']) ?? undefined,
    healthDosage: (r.health_dosage as string) ?? undefined,
    healthQuantity: (r.health_quantity as number) ?? undefined,
    healthNote: (r.health_note as string) ?? undefined,
    createdAt: r.created_at as string,
  }
}

function mapJournalEntry(r: Record<string, unknown>): JournalEntry {
  return {
    id: r.id as string, date: r.date as string,
    mood: (r.mood as number) || 3, energy: (r.energy as number) || 3, stress: (r.stress as number) || 2,
    wentWell: (r.went_well as string) || '', wasDifficult: (r.was_difficult as string) || '',
    rememberTomorrow: (r.remember_tomorrow as string) || '', freewriting: (r.freewriting as string) || '',
    createdAt: r.created_at as string,
  }
}

function mapHealthItem(r: Record<string, unknown>): HealthItem {
  return {
    id: r.id as string, name: r.name as string,
    type: r.type as 'supplement' | 'medication',
    dosage: (r.dosage as string) || '', schedule: (r.schedule as string) || '',
    createdAt: r.created_at as string,
  }
}

function mapHealthLog(r: Record<string, unknown>): HealthLog {
  return {
    id: r.id as string, itemId: r.item_id as string, date: r.date as string,
    taken: r.taken as boolean, time: (r.time as string) ?? undefined,
  }
}

function mapDailyHealth(r: Record<string, unknown>): DailyHealth {
  return {
    id: r.id as string, date: r.date as string,
    hydration: (r.hydration as number) || 0, sleepHours: (r.sleep_hours as number) || 0,
    sleepQuality: (r.sleep_quality as number) || 3, notes: (r.notes as string) || '',
  }
}

function mapBreathingSession(r: Record<string, unknown>): BreathingSession {
  return {
    id: r.id as string, exerciseId: r.exercise_id as string, duration: r.duration as number,
    completed: r.completed as boolean, completedAt: r.completed_at as string,
  }
}

// ── Load all cloud data for a user ────────────────────────────────────────────

export async function loadCloudData(userId: string): Promise<CloudData | null> {
  if (!supabase) return null
  try {
    const [nR, pR, plR, jR, hiR, hlR, dhR, bR] = await Promise.all([
      supabase.from('notes').select('*').eq('user_id', userId),
      supabase.from('places').select('*').eq('user_id', userId),
      supabase.from('planner_items').select('*').eq('user_id', userId),
      supabase.from('journal_entries').select('*').eq('user_id', userId),
      supabase.from('health_items').select('*').eq('user_id', userId),
      supabase.from('health_logs').select('*').eq('user_id', userId),
      supabase.from('daily_health').select('*').eq('user_id', userId),
      supabase.from('breathing_sessions').select('*').eq('user_id', userId),
    ])
    return {
      notes: (nR.data || []).map(mapNote),
      places: (pR.data || []).map(mapPlace),
      plannerItems: (plR.data || []).map(mapPlannerItem),
      journalEntries: (jR.data || []).map(mapJournalEntry),
      healthItems: (hiR.data || []).map(mapHealthItem),
      healthLogs: (hlR.data || []).map(mapHealthLog),
      dailyHealth: (dhR.data || []).map(mapDailyHealth),
      breathingSessions: (bR.data || []).map(mapBreathingSession),
    }
  } catch (e) {
    console.warn('[sync] loadCloudData:', e)
    return null
  }
}

export async function migrateGuestDataToCloud(userId: string, data: Partial<CloudData>) {
  if (!supabase) return
  try {
    await Promise.all([
      ...(data.notes || []).map(n => syncNote(userId, n)),
      ...(data.places || []).map(p => syncPlace(userId, p)),
      ...(data.plannerItems || []).map(p => syncPlannerItem(userId, p)),
      ...(data.journalEntries || []).map(e => syncJournalEntry(userId, e)),
      ...(data.healthItems || []).map(i => syncHealthItem(userId, i)),
      ...(data.healthLogs || []).map(l => syncHealthLog(userId, l)),
      ...(data.dailyHealth || []).map(d => syncDailyHealth(userId, d)),
      ...(data.breathingSessions || []).map(s => syncBreathingSession(userId, s)),
    ])
  } catch (e) {
    console.warn('[sync] migrate:', e)
  }
}
