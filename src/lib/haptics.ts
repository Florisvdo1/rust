/**
 * Haptic feedback — silent fail on unsupported (iOS Safari, etc.)
 */
export type HapticStrength = 'light' | 'medium' | 'heavy'

const PATTERNS: Record<HapticStrength, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: [20, 10, 20],
}

export function haptic(strength: HapticStrength = 'light'): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(PATTERNS[strength])
    }
  } catch {
    // Silent fail — iOS Safari, some browsers block vibrate
  }
}

/**
 * Play a short Web Audio chime after a user interaction.
 * Only works if AudioContext was already unlocked by a prior gesture.
 */
let _ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return _ctx
  } catch {
    return null
  }
}

export function playChime(frequency = 528, duration = 0.18): void {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = 'sine'
    const now = ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.start(now)
    osc.stop(now + duration)
  } catch {
    // Silent fail
  }
}

export function playBreathingPhaseChime(): void {
  playChime(432, 0.22)
}

export function playBreathingStartChime(): void {
  playChime(528, 0.3)
  setTimeout(() => playChime(660, 0.2), 200)
}
