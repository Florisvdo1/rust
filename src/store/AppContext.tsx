import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import {
  getSettings, saveSettings, AppSettings,
  getRememberItems, RememberItem,
  getMedications, MedicationItem,
  getJournalEntries, JournalEntry,
  getPlaceItems, PlaceItem,
  requestPersistentStorage
} from '../db'
import { seedDemoData } from '../data/seed'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'settings',
  reducedMotion: false,
  lowSensory: false,
  muteSounds: true,
  haptics: false,
  beginnerMode: true,
  showAdvancedBreathing: false,
  theme: 'dark',
  bodyGuides: true,
  encouragement: true,
  safetyNotices: 'full',
  instructionVerbosity: 'full',
  onboardingDone: false
}

interface AppState {
  settings: AppSettings
  remember: RememberItem[]
  medications: MedicationItem[]
  journal: JournalEntry[]
  places: PlaceItem[]
  activeTab: string
  loading: boolean
}

type Action =
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_REMEMBER'; payload: RememberItem[] }
  | { type: 'SET_MEDICATIONS'; payload: MedicationItem[] }
  | { type: 'SET_JOURNAL'; payload: JournalEntry[] }
  | { type: 'SET_PLACES'; payload: PlaceItem[] }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SETTINGS': return { ...state, settings: action.payload }
    case 'SET_REMEMBER': return { ...state, remember: action.payload }
    case 'SET_MEDICATIONS': return { ...state, medications: action.payload }
    case 'SET_JOURNAL': return { ...state, journal: action.payload }
    case 'SET_PLACES': return { ...state, places: action.payload }
    case 'SET_TAB': return { ...state, activeTab: action.payload }
    case 'SET_LOADING': return { ...state, loading: action.payload }
    default: return state
  }
}

interface AppContextValue {
  state: AppState
  setTab: (tab: string) => void
  updateSettings: (s: Partial<AppSettings>) => void
  refreshRemember: () => void
  refreshMedications: () => void
  refreshJournal: () => void
  refreshPlaces: () => void
}

const AppContext = createContext<AppContextValue>(null!)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    settings: DEFAULT_SETTINGS,
    remember: [],
    medications: [],
    journal: [],
    places: [],
    activeTab: 'vandaag',
    loading: true
  })

  useEffect(() => {
    async function init() {
      await requestPersistentStorage()
      let settings = await getSettings()
      if (!settings) {
        settings = DEFAULT_SETTINGS
        await saveSettings(settings)
        await seedDemoData()
      }
      dispatch({ type: 'SET_SETTINGS', payload: settings })
      await loadAll()
      dispatch({ type: 'SET_LOADING', payload: false })
    }
    init()
  }, [])

  async function loadAll() {
    const [remember, medications, journal, places] = await Promise.all([
      getRememberItems(),
      getMedications(),
      getJournalEntries(),
      getPlaceItems()
    ])
    dispatch({ type: 'SET_REMEMBER', payload: remember })
    dispatch({ type: 'SET_MEDICATIONS', payload: medications })
    dispatch({ type: 'SET_JOURNAL', payload: journal })
    dispatch({ type: 'SET_PLACES', payload: places })
  }

  const setTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_TAB', payload: tab })
  }, [])

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    const next = { ...state.settings, ...partial }
    dispatch({ type: 'SET_SETTINGS', payload: next })
    await saveSettings(next)
  }, [state.settings])

  const refreshRemember = useCallback(async () => {
    dispatch({ type: 'SET_REMEMBER', payload: await getRememberItems() })
  }, [])

  const refreshMedications = useCallback(async () => {
    dispatch({ type: 'SET_MEDICATIONS', payload: await getMedications() })
  }, [])

  const refreshJournal = useCallback(async () => {
    dispatch({ type: 'SET_JOURNAL', payload: await getJournalEntries() })
  }, [])

  const refreshPlaces = useCallback(async () => {
    dispatch({ type: 'SET_PLACES', payload: await getPlaceItems() })
  }, [])

  return (
    <AppContext.Provider value={{ state, setTab, updateSettings, refreshRemember, refreshMedications, refreshJournal, refreshPlaces }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
