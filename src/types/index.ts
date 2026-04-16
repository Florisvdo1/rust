// Auth types
export interface AuthUser {
  id: string
  email: string
  username?: string
}

// Planner types
export interface PlannerItem {
  id: string
  date: string
  hour: number
  quarter: number // 0-3
  duration: number // minutes
  activityId: string
  activityName: string
  category: string
  color: string
  iconId: string
  notes?: string
  source?: 'gezondheid'
  healthType?: 'supplement' | 'medicatie' | 'overig'
  healthDosage?: string
  healthQuantity?: number
  healthNote?: string
  createdAt: string
}

// Note types
export interface Note {
  id: string
  title: string
  content: string
  category: string
  pinned: boolean
  urgent: boolean
  done: boolean
  archived: boolean
  createdAt: string
  updatedAt: string
}

// Place types
export interface Place {
  id: string
  room: string
  objectLabel: string
  wherePrecisely?: string
  subzone?: string
  container?: string
  position?: string
  notes?: string
  imageUrl?: string
  createdAt: string
}

// Journal types
export interface JournalEntry {
  id: string
  date: string
  mood: number // 1-5
  energy: number // 1-5
  stress: number // 1-5
  wentWell: string
  wasDifficult: string
  rememberTomorrow: string
  freewriting: string
  createdAt: string
}

// Health types
export interface HealthItem {
  id: string
  name: string
  type: 'supplement' | 'medication'
  dosage: string
  schedule: string
  createdAt: string
}

export interface HealthLog {
  id: string
  itemId: string
  date: string
  taken: boolean
  time?: string
}

export interface DailyHealth {
  id: string
  date: string
  hydration: number // glasses
  sleepHours: number
  sleepQuality: number // 1-5
  notes: string
}

// Breathing types
export interface BreathingExercise {
  id: string
  name: string
  description: string
  instructions: {
    whatFor: string
    inhale: string
    exhale: string
    noseOrMouth: string
    belly: string
    shoulders: string
    holdBreath: string
    handPosition?: string
    safetyCue: string
  }
  phases: BreathPhase[]
  isAlternateNostril?: boolean
}

export interface BreathPhase {
  type: 'inhale' | 'exhale' | 'hold' | 'inhale-left' | 'inhale-right' | 'exhale-left' | 'exhale-right'
  duration: number // seconds
  label: string
  bodyFocus: string
  howToBreathe: string
  whatsNext: string
}

export interface BreathingSession {
  id: string
  exerciseId: string
  duration: number
  completedAt: string
  completed: boolean
}

// Activity types
export interface Activity {
  id: string
  name: string
  category: string
  subcategory?: string
  iconId: string
  color: string
}

export interface ActivityCategory {
  id: string
  name: string
  color: string
  subcategories?: string[]
}

// Settings
export interface UserSettings {
  haptics: boolean
  sounds: boolean
  breathingVibration: boolean
  plannerDragHaptics: boolean
  darkMode: boolean
  breathingChime: boolean
  startTone: boolean
  largerText?: boolean
  reduceMotion?: boolean
}
