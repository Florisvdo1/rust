import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { breathingExercises, durationChoices } from '@/lib/breathing'
import { haptic, playBreathingPhaseChime, playBreathingStartChime } from '@/lib/haptics'
import type { BreathingExercise, BreathPhase } from '@/types'

type Stage = 'overview' | 'detail' | 'duration' | 'countdown' | 'active' | 'complete'

// Nostril visual for alternate nostril breathing
const NostrilVisual: React.FC<{ phase: BreathPhase }> = ({ phase }) => {
  const isLeft = phase.type.includes('left')
  const isRight = phase.type.includes('right')
  const isHold = phase.type === 'hold'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {/* Nose outline */}
        <path d="M40 10 C40 10 28 35 25 50 C23 58 30 65 40 65 C50 65 57 58 55 50 C52 35 40 10 40 10Z"
          stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
        {/* Left nostril */}
        <ellipse cx="33" cy="55" rx="5" ry="6"
          fill={isLeft ? '#95b8d1' : isHold ? '#e8a87c55' : 'rgba(255,255,255,0.1)'}
          stroke={isLeft ? '#bdd5ea' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
        {/* Right nostril */}
        <ellipse cx="47" cy="55" rx="5" ry="6"
          fill={isRight ? '#95b8d1' : isHold ? '#e8a87c55' : 'rgba(255,255,255,0.1)'}
          stroke={isRight ? '#bdd5ea' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      </svg>

      {/* Hand cue */}
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        {isLeft && 'Duim op rechter neusgat'}
        {isRight && 'Ringvinger op linker neusgat'}
        {isHold && 'Beide dicht'}
      </div>
    </div>
  )
}

// Breathing visual circle
const BreathCircle: React.FC<{ phase: BreathPhase; progress: number; isAlternate?: boolean }> = ({ phase, progress, isAlternate }) => {
  const isInhale = phase.type.includes('inhale')
  const isExhale = phase.type.includes('exhale')
  const isHold = phase.type === 'hold'

  const scale = isInhale
    ? 0.6 + 0.4 * progress
    : isExhale
    ? 1.0 - 0.4 * progress
    : 0.8

  const opacity = isInhale
    ? 0.3 + 0.7 * progress
    : isExhale
    ? 1.0 - 0.5 * progress
    : 0.7

  return (
    <div style={{
      width: 200, height: 200, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Outer ripple */}
      {(isInhale || isExhale) && (
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          borderRadius: '50%', border: '1px solid rgba(149,184,209,0.2)',
          animation: 'ripple 3s ease-out infinite',
        }} />
      )}

      {/* Progression ring */}
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute' }}>
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(149,184,209,0.5)" strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 90}`}
          strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>

      {/* Main breath circle */}
      <div style={{
        width: 140, height: 140,
        borderRadius: '50%',
        background: isHold
          ? 'radial-gradient(circle, rgba(232,168,124,0.3), rgba(232,168,124,0.1))'
          : isInhale
          ? 'radial-gradient(circle, rgba(149,184,209,0.4), rgba(92,122,153,0.15))'
          : 'radial-gradient(circle, rgba(189,213,234,0.3), rgba(149,184,209,0.08))',
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out, background 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isInhale
          ? '0 0 40px rgba(149,184,209,0.3)'
          : isHold
          ? '0 0 30px rgba(232,168,124,0.2)'
          : '0 0 20px rgba(149,184,209,0.1)',
      }}>
        {/* Phase icon */}
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
          {isInhale && '↑'}
          {isExhale && '↓'}
          {isHold && '•'}
        </div>
      </div>
    </div>
  )
}

export const AdemhalingPage: React.FC = () => {
  const { addBreathingSession, settings } = useStore()
  const [stage, setStage] = useState<Stage>('overview')
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(0)
  const [countdown, setCountdown] = useState(3)
  const [paused, setPaused] = useState(false)

  // Session state
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const timerRef = useRef<number | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Countdown handler
  useEffect(() => {
    if (stage !== 'countdown') return
    if (countdown <= 0) {
      startSession()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [stage, countdown])

  const startSession = useCallback(() => {
    if (!selectedExercise) return
    setStage('active')
    setCurrentPhaseIndex(0)
    setPhaseSecondsLeft(selectedExercise.phases[0].duration)
    setTotalSecondsLeft(selectedDuration)
    setCycleCount(0)
    setPaused(false)
  }, [selectedExercise, selectedDuration])

  // Main session timer
  useEffect(() => {
    if (stage !== 'active' || paused || !selectedExercise) return

    timerRef.current = window.setInterval(() => {
      setTotalSecondsLeft(prev => {
        if (prev <= 1) {
          // Session complete
          if (timerRef.current) clearInterval(timerRef.current)
          setStage('complete')
          addBreathingSession({
            exerciseId: selectedExercise.id,
            duration: selectedDuration,
            completedAt: new Date().toISOString(),
            completed: true,
          })
          return 0
        }
        return prev - 1
      })

      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          // Move to next phase — fire haptic/chime on transition
          setCurrentPhaseIndex(pi => {
            const nextIndex = (pi + 1) % selectedExercise.phases.length
            if (nextIndex === 0) setCycleCount(c => c + 1)
            setPhaseSecondsLeft(selectedExercise.phases[nextIndex].duration)
            // Haptic + optional chime on phase change
            if (settings.breathingVibration) haptic('light')
            if (settings.breathingChime) playBreathingPhaseChime()
            return nextIndex
          })
          return 0 // Will be immediately overwritten above
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stage, paused, selectedExercise, selectedDuration, addBreathingSession])

  const handleSelectExercise = (ex: BreathingExercise) => {
    setSelectedExercise(ex)
    setStage('detail')
  }

  const handleStartCountdown = () => {
    if (selectedDuration === 0) return
    haptic('medium')
    if (settings.startTone) playBreathingStartChime()
    setCountdown(3)
    setStage('countdown')
  }

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStage('overview')
    setSelectedExercise(null)
    setSelectedDuration(0)
    setPaused(false)
  }

  const handleRestart = () => {
    setCountdown(3)
    setStage('countdown')
  }

  const currentPhase = selectedExercise?.phases[currentPhaseIndex]
  const phaseProgress = currentPhase
    ? 1 - (phaseSecondsLeft / currentPhase.duration)
    : 0

  // OVERVIEW
  if (stage === 'overview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PageHeader title="Ademhaling" subtitle="Rust vinden in je adem" />
        <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {breathingExercises.map((ex, i) => (
              <motion.button
                key={ex.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleSelectExercise(ex)}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-xl)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'left',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: -10, right: -10, width: 60, height: 60,
                  borderRadius: '50%', background: 'var(--accent-soft)',
                }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, position: 'relative' }}>{ex.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, position: 'relative' }}>{ex.description}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, position: 'relative' }}>
                  {ex.phases.map((p, j) => (
                    <span key={j} style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 'var(--radius-full)',
                      background: p.type.includes('inhale') ? '#95b8d122' : p.type === 'hold' ? '#e8a87c22' : '#81b29a22',
                      color: p.type.includes('inhale') ? '#5c7a99' : p.type === 'hold' ? '#c9916e' : '#6baa7d',
                      fontWeight: 600,
                    }}>
                      {p.label} {p.duration}s
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // DETAIL / EXPLANATION
  if (stage === 'detail' && selectedExercise) {
    const inst = selectedExercise.instructions
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <PageHeader
          title={selectedExercise.name}
          right={<button onClick={() => setStage('overview')} style={{ fontSize: 13, color: 'var(--soft-blue)', fontWeight: 600 }}>Terug</button>}
        />
        <div className="sheet-scroll" style={{ padding: '0 var(--space-lg)' }}>
          {/* Explanation card */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)', border: '1px solid var(--border)',
            marginBottom: 16,
          }}>
            {[
              ['Waar is het voor?', inst.whatFor],
              ['Inademen', inst.inhale],
              ['Uitademen', inst.exhale],
              ['Neus of mond', inst.noseOrMouth],
              ['Buik', inst.belly],
              ['Schouders', inst.shoulders],
              ['Adem vasthouden', inst.holdBreath],
              ...(inst.handPosition ? [['Handpositie', inst.handPosition]] : []),
            ].map(([label, text], i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--soft-blue)', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}

            {/* Safety cue */}
            <div style={{
              background: '#e8a87c15', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', border: '1px solid #e8a87c33',
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#c9916e', marginBottom: 2 }}>Let op</p>
              <p style={{ fontSize: 13, color: '#a07050', lineHeight: 1.4 }}>{inst.safetyCue}</p>
            </div>
          </div>

          {/* Duration selection */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Kies een duur</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {durationChoices.map(d => (
                <button key={d.value} onClick={() => setSelectedDuration(d.value)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                  background: selectedDuration === d.value ? 'var(--granite-blue)' : 'var(--cloud)',
                  color: selectedDuration === d.value ? 'var(--white)' : 'var(--text-secondary)',
                  fontSize: 14, fontWeight: 600,
                  border: selectedDuration === d.value ? 'none' : '1px solid var(--border)',
                }}>{d.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky start button — always visible */}
        <div className="sticky-save-bar">
          <button
            onClick={handleStartCountdown}
            disabled={selectedDuration === 0}
            className="btn-primary"
            style={{ width: '100%' }}
            aria-label="Start oefening"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            {selectedDuration === 0 ? 'Kies een duur' : 'Start oefening'}
          </button>
        </div>
      </div>
    )
  }

  // COUNTDOWN
  if (stage === 'countdown') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: 'linear-gradient(180deg, var(--muted-navy) 0%, var(--granite-blue) 100%)',
      }}>
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 80, fontWeight: 700, color: 'var(--white)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {countdown > 0 ? countdown : ''}
        </motion.div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 16 }}>Maak je klaar...</p>
      </div>
    )
  }

  // ACTIVE SESSION
  if (stage === 'active' && selectedExercise && currentPhase) {
    const minutes = Math.floor(totalSecondsLeft / 60)
    const seconds = totalSecondsLeft % 60
    const nextPhaseIndex = (currentPhaseIndex + 1) % selectedExercise.phases.length

    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        height: '100%',
        background: 'linear-gradient(180deg, var(--muted-navy) 0%, var(--granite-blue) 100%)',
        padding: 'var(--space-xl)',
        paddingTop: 'calc(var(--safe-top) + 20px)',
      }}>
        {/* Timer */}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Exercise name */}
        <h2 style={{ color: 'var(--white)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
          {selectedExercise.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 24 }}>
          Cyclus {cycleCount + 1}
        </p>

        {/* Breath visual */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          {selectedExercise.isAlternateNostril && (
            <NostrilVisual phase={currentPhase} />
          )}

          <BreathCircle phase={currentPhase} progress={phaseProgress} isAlternate={selectedExercise.isAlternateNostril} />

          {/* Phase label */}
          <div style={{ textAlign: 'center' }}>
            <motion.p
              key={currentPhase.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'var(--white)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}
            >
              {currentPhase.label}
            </motion.p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {phaseSecondsLeft}
            </p>
          </div>

          {/* Body focus */}
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)',
            padding: '12px 20px', textAlign: 'center', maxWidth: 280,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>{currentPhase.bodyFocus}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>{currentPhase.howToBreathe}</p>
          </div>

          {/* What's next */}
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Hierna: {currentPhase.whatsNext}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 16, paddingBottom: 'var(--safe-bottom)' }}>
          <button onClick={handleStop} style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', color: 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          </button>
          <button onClick={() => setPaused(!paused)} style={{
            width: 72, height: 72, borderRadius: '50%',
            background: paused ? 'var(--mist-blue)' : 'rgba(255,255,255,0.15)',
            color: 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}>
            {paused ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 20,12 8,19"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            )}
          </button>
          <div style={{ width: 56 }} /> {/* Spacer for alignment */}
        </div>
      </div>
    )
  }

  // COMPLETE
  if (stage === 'complete') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(180deg, var(--muted-navy) 0%, var(--granite-blue) 100%)',
        padding: 'var(--space-xl)',
      }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(149,184,209,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--mist-blue)" strokeWidth="2" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
        </motion.div>

        <h2 style={{ color: 'var(--white)', fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Goed gedaan
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>
          {selectedExercise?.name} · {Math.floor(selectedDuration / 60)} minuten
        </p>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column', width: '100%', maxWidth: 280 }}>
          <button onClick={handleRestart} className="btn-secondary" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'var(--white)' }}>
            Opnieuw
          </button>
          <button onClick={handleStop} className="btn-primary" style={{ width: '100%', background: 'var(--mist-blue)', color: 'var(--granite-blue)' }}>
            Terug naar overzicht
          </button>
        </div>
      </div>
    )
  }

  return null
}
