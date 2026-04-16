import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlannerItem, Note, Place, JournalEntry, HealthItem, HealthLog, DailyHealth, BreathingSession, UserSettings, AuthUser } from '@/types'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

interface AppState {
  // Auth
  user: AuthUser | null
  isGuest: boolean
  setUser: (user: AuthUser | null) => void
  setGuest: (guest: boolean) => void

  // Planner
  plannerItems: PlannerItem[]
  addPlannerItem: (item: Omit<PlannerItem, 'id' | 'createdAt'>) => void
  removePlannerItem: (id: string) => void
  updatePlannerItem: (id: string, updates: Partial<PlannerItem>) => void

  // Notes
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  removeNote: (id: string) => void

  // Places
  places: Place[]
  addPlace: (place: Omit<Place, 'id' | 'createdAt'>) => void
  updatePlace: (id: string, updates: Partial<Place>) => void
  removePlace: (id: string) => void

  // Journal
  journalEntries: JournalEntry[]
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void

  // Health
  healthItems: HealthItem[]
  healthLogs: HealthLog[]
  dailyHealth: DailyHealth[]
  addHealthItem: (item: Omit<HealthItem, 'id' | 'createdAt'>) => void
  removeHealthItem: (id: string) => void
  toggleHealthLog: (itemId: string, date: string) => void
  updateDailyHealth: (date: string, data: Partial<DailyHealth>) => void

  // Breathing
  breathingSessions: BreathingSession[]
  addBreathingSession: (session: Omit<BreathingSession, 'id'>) => void

  // Settings
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isGuest: false,
      setUser: (user) => set({ user, isGuest: false }),
      setGuest: (guest) => set({ isGuest: guest }),

      // Planner
      plannerItems: [],
      addPlannerItem: (item) =>
        set((s) => ({
          plannerItems: [...s.plannerItems, { ...item, id: uid(), createdAt: new Date().toISOString() }],
        })),
      removePlannerItem: (id) =>
        set((s) => ({ plannerItems: s.plannerItems.filter((i) => i.id !== id) })),
      updatePlannerItem: (id, updates) =>
        set((s) => ({
          plannerItems: s.plannerItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),

      // Notes
      notes: [],
      addNote: (note) =>
        set((s) => ({
          notes: [
            { ...note, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ...s.notes,
          ],
        })),
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // Places
      places: [],
      addPlace: (place) =>
        set((s) => ({
          places: [...s.places, { ...place, id: uid(), createdAt: new Date().toISOString() }],
        })),
      updatePlace: (id, updates) =>
        set((s) => ({
          places: s.places.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePlace: (id) => set((s) => ({ places: s.places.filter((p) => p.id !== id) })),

      // Journal
      journalEntries: [],
      addJournalEntry: (entry) =>
        set((s) => ({
          journalEntries: [
            { ...entry, id: uid(), createdAt: new Date().toISOString() },
            ...s.journalEntries,
          ],
        })),
      updateJournalEntry: (id, updates) =>
        set((s) => ({
          journalEntries: s.journalEntries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      // Health
      healthItems: [
        {
          id: 'default-magnesium',
          name: 'Magnesium',
          type: 'supplement',
          dosage: '400mg',
          schedule: 'Dagelijks bij het avondeten',
          createdAt: new Date().toISOString(),
        },
      ],
      healthLogs: [],
      dailyHealth: [],
      addHealthItem: (item) =>
        set((s) => ({
          healthItems: [...s.healthItems, { ...item, id: uid(), createdAt: new Date().toISOString() }],
        })),
      removeHealthItem: (id) =>
        set((s) => ({
          healthItems: s.healthItems.filter((i) => i.id !== id),
          healthLogs: s.healthLogs.filter((l) => l.itemId !== id),
        })),
      toggleHealthLog: (itemId, date) =>
        set((s) => {
          const existing = s.healthLogs.find((l) => l.itemId === itemId && l.date === date)
          if (existing) {
            return {
              healthLogs: s.healthLogs.map((l) =>
                l.id === existing.id ? { ...l, taken: !l.taken } : l
              ),
            }
          }
          return {
            healthLogs: [
              ...s.healthLogs,
              { id: uid(), itemId, date, taken: true, time: new Date().toISOString() },
            ],
          }
        }),
      updateDailyHealth: (date, data) =>
        set((s) => {
          const existing = s.dailyHealth.find((d) => d.date === date)
          if (existing) {
            return {
              dailyHealth: s.dailyHealth.map((d) =>
                d.date === date ? { ...d, ...data } : d
              ),
            }
          }
          return {
            dailyHealth: [
              ...s.dailyHealth,
              { id: uid(), date, hydration: 0, sleepHours: 0, sleepQuality: 3, notes: '', ...data },
            ],
          }
        }),

      // Breathing
      breathingSessions: [],
      addBreathingSession: (session) =>
        set((s) => ({
          breathingSessions: [...s.breathingSessions, { ...session, id: uid() }],
        })),

      // Settings
      settings: {
        haptics: true,
        sounds: false,
        breathingVibration: true,
        plannerDragHaptics: true,
        darkMode: false,
        breathingChime: false,
        startTone: false,
        largerText: false,
        reduceMotion: false,
      },
      updateSettings: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),
    }),
    {
      name: 'rust-app-storage',
    }
  )
)
