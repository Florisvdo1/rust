import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface PlannerItem {
  id: string
  date: string // 'YYYY-MM-DD'
  slotKey: string // 'HH:MM' e.g. '09:00'
  iconId: string
  label: string
  duration: number // minutes
  completed: boolean
  notes?: string
  color?: string
  createdAt: number
  updatedAt: number
}

export interface RememberItem {
  id: string
  text: string
  urgency: 'laag' | 'normaal' | 'hoog'
  category: string
  done: boolean
  pinned: boolean
  count?: number
  assignedDate?: string
  createdAt: number
  updatedAt: number
}

export interface PlaceItem {
  id: string
  title: string
  room: string
  subzone?: string
  label: string
  notes?: string
  tags: string[]
  imageData?: string // base64
  createdAt: number
  updatedAt: number
}

export interface JournalEntry {
  id: string
  date: string
  type: 'vrij' | 'geleid'
  mood?: number // 1-5
  energy?: number // 1-5
  stress?: number // 1-5
  wentWell?: string
  wasHard?: string
  rememberTomorrow?: string
  freeText?: string
  imageData?: string
  draft: boolean
  createdAt: number
  updatedAt: number
}

export interface MedicationItem {
  id: string
  name: string
  dose?: string
  times: string[] // ['08:00', '20:00']
  taken: Record<string, boolean[]> // date -> taken per time
  notes?: string
  refillDate?: string
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  id: 'settings'
  reducedMotion: boolean
  lowSensory: boolean
  muteSounds: boolean
  haptics: boolean
  beginnerMode: boolean
  showAdvancedBreathing: boolean
  theme: 'dark'
  bodyGuides: boolean
  encouragement: boolean
  safetyNotices: 'full' | 'compact'
  instructionVerbosity: 'full' | 'compact'
  onboardingDone: boolean
}

interface RustDB extends DBSchema {
  planner: { key: string; value: PlannerItem; indexes: { byDate: string } }
  remember: { key: string; value: RememberItem }
  places: { key: string; value: PlaceItem; indexes: { byRoom: string } }
  journal: { key: string; value: JournalEntry; indexes: { byDate: string } }
  medication: { key: string; value: MedicationItem }
  settings: { key: string; value: AppSettings }
}

let dbInstance: IDBPDatabase<RustDB> | null = null

export async function getDB(): Promise<IDBPDatabase<RustDB>> {
  if (dbInstance) return dbInstance
  dbInstance = await openDB<RustDB>('rust-app', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const plannerStore = db.createObjectStore('planner', { keyPath: 'id' })
        plannerStore.createIndex('byDate', 'date')
        db.createObjectStore('remember', { keyPath: 'id' })
        const placesStore = db.createObjectStore('places', { keyPath: 'id' })
        placesStore.createIndex('byRoom', 'room')
        const journalStore = db.createObjectStore('journal', { keyPath: 'id' })
        journalStore.createIndex('byDate', 'date')
        db.createObjectStore('medication', { keyPath: 'id' })
        db.createObjectStore('settings', { keyPath: 'id' })
      }
    }
  })
  return dbInstance
}

// Planner
export async function getPlannerItems(date: string): Promise<PlannerItem[]> {
  const db = await getDB()
  return db.getAllFromIndex('planner', 'byDate', date)
}
export async function savePlannerItem(item: PlannerItem): Promise<void> {
  const db = await getDB()
  await db.put('planner', { ...item, updatedAt: Date.now() })
}
export async function deletePlannerItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('planner', id)
}

// Remember
export async function getRememberItems(): Promise<RememberItem[]> {
  const db = await getDB()
  return db.getAll('remember')
}
export async function saveRememberItem(item: RememberItem): Promise<void> {
  const db = await getDB()
  await db.put('remember', { ...item, updatedAt: Date.now() })
}
export async function deleteRememberItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('remember', id)
}

// Places
export async function getPlaceItems(): Promise<PlaceItem[]> {
  const db = await getDB()
  return db.getAll('places')
}
export async function savePlaceItem(item: PlaceItem): Promise<void> {
  const db = await getDB()
  await db.put('places', { ...item, updatedAt: Date.now() })
}
export async function deletePlaceItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('places', id)
}

// Journal
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDB()
  return db.getAll('journal')
}
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB()
  await db.put('journal', { ...entry, updatedAt: Date.now() })
}
export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('journal', id)
}

// Medication
export async function getMedications(): Promise<MedicationItem[]> {
  const db = await getDB()
  return db.getAll('medication')
}
export async function saveMedication(item: MedicationItem): Promise<void> {
  const db = await getDB()
  await db.put('medication', item)
}
export async function deleteMedication(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('medication', id)
}

// Settings
export async function getSettings(): Promise<AppSettings | undefined> {
  const db = await getDB()
  return db.get('settings', 'settings')
}
export async function saveSettings(s: AppSettings): Promise<void> {
  const db = await getDB()
  await db.put('settings', s)
}

// Export/Import
export async function exportAllData(): Promise<string> {
  const db = await getDB()
  const data = {
    planner: await db.getAll('planner'),
    remember: await db.getAll('remember'),
    places: await db.getAll('places'),
    journal: await db.getAll('journal'),
    medication: await db.getAll('medication'),
    settings: await db.getAll('settings'),
    exportedAt: Date.now(),
    version: 2
  }
  return JSON.stringify(data, null, 2)
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json)
  const db = await getDB()
  const tx = db.transaction(['planner','remember','places','journal','medication','settings'], 'readwrite')
  for (const store of ['planner','remember','places','journal','medication','settings'] as const) {
    await tx.objectStore(store).clear()
    for (const item of (data[store] || [])) {
      await tx.objectStore(store).put(item)
    }
  }
  await tx.done
}

// Persistent storage request
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist()
  }
  return false
}
