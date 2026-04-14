import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'

function todayStr() { return new Date().toISOString().split('T')[0] }

export const GezondheidPage: React.FC = () => {
  const { healthItems, healthLogs, dailyHealth, addHealthItem, removeHealthItem, toggleHealthLog, updateDailyHealth } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<'supplement' | 'medication'>('supplement')
  const [dosage, setDosage] = useState('')
  const [schedule, setSchedule] = useState('')

  const today = todayStr()
  const todayHealth = dailyHealth.find(d => d.date === today)
  const hydration = todayHealth?.hydration ?? 0
  const sleepHours = todayHealth?.sleepHours ?? 0
  const sleepQuality = todayHealth?.sleepQuality ?? 3

  const handleAddItem = () => {
    if (!name.trim()) return
    addHealthItem({ name, type, dosage, schedule })
    setName(''); setDosage(''); setSchedule(''); setShowAdd(false)
  }

  const isItemTaken = (itemId: string) => {
    return healthLogs.some(l => l.itemId === itemId && l.date === today && l.taken)
  }

  const adjustHydration = (delta: number) => {
    updateDailyHealth(today, { hydration: Math.max(0, Math.min(12, hydration + delta)) })
  }

  const adjustSleep = (delta: number) => {
    updateDailyHealth(today, { sleepHours: Math.max(0, Math.min(14, Math.round((sleepHours + delta) * 2) / 2)) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader title="Gezondheid" subtitle="Supplementen, hydratatie & slaap" />
      <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>

        {/* Today summary card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--granite-blue) 0%, var(--soft-blue) 100%)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)',
            marginBottom: 16, color: 'var(--white)',
            display: 'flex', gap: 20, alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" style={{ marginBottom: 4 }}>
              <path d="M12 3c-4 5-6 8-6 11a6 6 0 0012 0c0-3-2-6-6-11z"/>
            </svg>
            <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{hydration}</p>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>glazen water</p>
          </div>
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" style={{ marginBottom: 4 }}>
              <path d="M2 12a10 10 0 1020 0 10 10 0 00-20 0z"/><path d="M12 6v6l4 2"/>
            </svg>
            <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{sleepHours}</p>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>uur slaap</p>
          </div>
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" style={{ marginBottom: 4 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{sleepQuality}</p>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>slaapkwaliteit</p>
          </div>
        </motion.div>

        {/* Hydration */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: 'linear-gradient(135deg, #dce9f3 0%, #bdd5ea 100%)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--soft-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Hydratatie</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <button onClick={() => adjustHydration(-1)} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(92,122,153,0.2)', flexShrink: 0,
            }}>−</button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: 'var(--granite-blue)', lineHeight: 1 }}>{hydration}</p>
              <p style={{ fontSize: 12, color: 'var(--soft-blue)', marginTop: 2 }}>van 8 glazen</p>
            </div>
            <button onClick={() => adjustHydration(1)} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(92,122,153,0.2)', flexShrink: 0,
            }}>+</button>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 8 }, (_, i) => i + 1).map(g => (
              <button key={g} onClick={() => updateDailyHealth(today, { hydration: hydration === g ? g - 1 : g })}
                style={{
                  flex: 1, height: 28, borderRadius: 'var(--radius-sm)',
                  background: g <= hydration ? 'var(--soft-blue)' : 'rgba(255,255,255,0.6)',
                  border: g <= hydration ? 'none' : '1px solid rgba(92,122,153,0.2)',
                  transition: 'all 0.15s',
                }} />
            ))}
          </div>
        </motion.div>

        {/* Sleep */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: 'var(--white)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)', marginBottom: 16,
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Slaap</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Uren slaap</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => adjustSleep(-0.5)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>−</button>
                <span style={{ fontSize: 24, fontWeight: 700, minWidth: 44, textAlign: 'center' }}>{sleepHours}u</span>
                <button onClick={() => adjustSleep(0.5)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>+</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Kwaliteit</p>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => updateDailyHealth(today, { sleepQuality: v })}
                    style={{
                      flex: 1, height: 36, borderRadius: 8,
                      background: v <= sleepQuality ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: v <= sleepQuality ? 'var(--white)' : 'var(--text-muted)',
                      fontSize: 13, fontWeight: 600,
                      border: v <= sleepQuality ? 'none' : '1px solid var(--border)',
                    }}>{v}</button>
                ))}
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>
                {['', 'Slecht', 'Matig', 'Goed', 'Erg goed', 'Uitstekend'][sleepQuality]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Supplements & Medication */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Supplementen & medicatie</h2>
            <button onClick={() => setShowAdd(true)} style={{ fontSize: 13, color: 'var(--soft-blue)', fontWeight: 600, padding: '6px 12px' }}>
              + Toevoegen
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {healthItems.map(item => {
              const taken = isItemTaken(item.id)
              return (
                <motion.div key={item.id} layout style={{
                  background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 12,
                  opacity: taken ? 0.65 : 1, transition: 'opacity 0.2s',
                }}>
                  <button onClick={() => toggleHealthLog(item.id, today)} style={{
                    width: 30, height: 30, borderRadius: 9,
                    border: `2px solid ${taken ? 'var(--success)' : 'var(--border-strong)'}`,
                    background: taken ? 'var(--success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {taken && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, textDecoration: taken ? 'line-through' : 'none' }}>{item.name}</span>
                      <span style={{
                        fontSize: 10, padding: '1px 7px', borderRadius: 'var(--radius-full)',
                        background: item.type === 'supplement' ? '#81b29a22' : '#95b8d122',
                        color: item.type === 'supplement' ? '#5a8a68' : '#5c7a99',
                        fontWeight: 600,
                      }}>{item.type === 'supplement' ? 'Supplement' : 'Medicatie'}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {item.dosage}{item.schedule ? ` · ${item.schedule}` : ''}
                    </p>
                  </div>
                  <button onClick={() => removeHealthItem(item.id)}
                    style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 18, flexShrink: 0 }}>×</button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Notities vandaag</p>
          <textarea
            placeholder="Hoe voel je je vandaag? Bijzonderheden?"
            value={todayHealth?.notes || ''}
            onChange={e => updateDailyHealth(today, { notes: e.target.value })}
            className="input-field"
            style={{ minHeight: 80, resize: 'none' }}
          />
        </div>
      </div>

      {/* Add sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--white)', borderRadius: '20px 20px 0 0', zIndex: 91,
                padding: 'var(--space-xl)',
                paddingBottom: 'calc(var(--safe-bottom) + var(--space-xl))',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Toevoegen</h3>
                <button onClick={() => setShowAdd(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {(['supplement', 'medication'] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                    background: type === t ? 'var(--granite-blue)' : 'var(--cloud)',
                    color: type === t ? 'var(--white)' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 600,
                  }}>{t === 'supplement' ? 'Supplement' : 'Medicatie'}</button>
                ))}
              </div>

              <input type="text" placeholder="Naam" value={name} onChange={e => setName(e.target.value)}
                className="input-field" style={{ marginBottom: 12 }} autoFocus />
              <input type="text" placeholder="Dosering (bijv. 400mg)" value={dosage} onChange={e => setDosage(e.target.value)}
                className="input-field" style={{ marginBottom: 12 }} />
              <input type="text" placeholder="Schema (bijv. Dagelijks bij avondeten)" value={schedule} onChange={e => setSchedule(e.target.value)}
                className="input-field" style={{ marginBottom: 16 }} />
              <button onClick={handleAddItem} disabled={!name.trim()} className="btn-primary" style={{ width: '100%' }}>
                Toevoegen
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
