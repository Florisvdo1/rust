import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'

function todayStr() { return new Date().toISOString().split('T')[0] }
function formatDateNL(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}

const moodLabels = ['', 'Zwaar', 'Moeilijk', 'Oké', 'Goed', 'Geweldig']
const moodColors = ['', '#c9636e', '#d4a257', '#8eaabd', '#81b29a', '#5c7a99']
const moodEmoji = ['', '😔', '😕', '😐', '🙂', '😊']
const energyLabels = ['', 'Uitgeput', 'Moe', 'Gemiddeld', 'Energiek', 'Vol energie']
const stressLabels = ['', 'Heel ontspannen', 'Rustig', 'Lichte spanning', 'Gespannen', 'Erg gespannen']

const guidedPrompts = [
  { label: 'Wat ging goed?', key: 'wentWell', placeholder: 'Iets kleins of groots dat goed ging vandaag...' },
  { label: 'Wat was moeilijk?', key: 'wasDifficult', placeholder: 'Wat kostte energie of was lastig?' },
  { label: 'Wat wil ik onthouden?', key: 'rememberTomorrow', placeholder: 'Iets voor morgen of voor jezelf...' },
  { label: 'Vrij schrijven', key: 'freewriting', placeholder: 'Schrijf alles wat in je opkomt...' },
]

export const DagboekPage: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry } = useStore()
  const [showAdd, setShowAdd] = useState(false)

  const today = todayStr()
  const todayEntry = journalEntries.find(e => e.date === today)

  const [mood, setMood] = useState(todayEntry?.mood || 3)
  const [energy, setEnergy] = useState(todayEntry?.energy || 3)
  const [stress, setStress] = useState(todayEntry?.stress || 2)
  const [wentWell, setWentWell] = useState(todayEntry?.wentWell || '')
  const [wasDifficult, setWasDifficult] = useState(todayEntry?.wasDifficult || '')
  const [rememberTomorrow, setRememberTomorrow] = useState(todayEntry?.rememberTomorrow || '')
  const [freewriting, setFreewriting] = useState(todayEntry?.freewriting || '')

  const recentEntries = useMemo(() =>
    journalEntries.filter(e => e.date !== today).slice(0, 5),
    [journalEntries, today]
  )

  const openAdd = () => {
    if (todayEntry) {
      setMood(todayEntry.mood); setEnergy(todayEntry.energy); setStress(todayEntry.stress)
      setWentWell(todayEntry.wentWell); setWasDifficult(todayEntry.wasDifficult)
      setRememberTomorrow(todayEntry.rememberTomorrow); setFreewriting(todayEntry.freewriting)
    }
    setShowAdd(true)
  }

  const handleSave = () => {
    const data = { date: today, mood, energy, stress, wentWell, wasDifficult, rememberTomorrow, freewriting }
    if (todayEntry) {
      updateJournalEntry(todayEntry.id, data)
    } else {
      addJournalEntry(data)
    }
    setShowAdd(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader title="Dagboek" subtitle="Hoe ga je ervoor?" />
      <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>

        {/* Today card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: todayEntry
              ? `linear-gradient(135deg, ${moodColors[todayEntry.mood]}22, var(--white))`
              : 'linear-gradient(135deg, var(--white), var(--cloud))',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)',
            marginBottom: 16, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {formatDateNL(today)}
          </p>
          {todayEntry ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 36 }}>{moodEmoji[todayEntry.mood]}</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: moodColors[todayEntry.mood] }}>
                    {moodLabels[todayEntry.mood]}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Energie: {energyLabels[todayEntry.energy]} · Spanning: {stressLabels[todayEntry.stress]}
                  </p>
                </div>
              </div>
              {[
                { key: 'wentWell', label: 'Wat ging goed', value: todayEntry.wentWell },
                { key: 'wasDifficult', label: 'Wat was moeilijk', value: todayEntry.wasDifficult },
                { key: 'rememberTomorrow', label: 'Wat wil ik onthouden', value: todayEntry.rememberTomorrow },
              ].filter(f => f.value).map(f => (
                <div key={f.key} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>{f.label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {f.value.slice(0, 80)}{f.value.length > 80 ? '...' : ''}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
              Hoe gaat het met je vandaag?
            </p>
          )}
          <button onClick={openAdd} className={todayEntry ? 'btn-secondary' : 'btn-primary'}
            style={{ width: '100%', minHeight: 44 }}>
            {todayEntry ? 'Aanpassen' : 'Invullen'}
          </button>
        </motion.div>

        {/* Recent entries */}
        {recentEntries.length > 0 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: 'var(--granite-blue)' }}>Eerdere invoeren</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentEntries.map(entry => (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-lg)', border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 22 }}>{moodEmoji[entry.mood]}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--granite-blue)' }}>
                        {formatDateNL(entry.date)}
                      </p>
                      <p style={{ fontSize: 12, color: moodColors[entry.mood], fontWeight: 600 }}>
                        {moodLabels[entry.mood]} · Energie {entry.energy}/5
                      </p>
                    </div>
                  </div>
                  {(entry.wentWell || entry.wasDifficult) && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: 4 }}>
                      {(entry.wentWell || entry.wasDifficult).slice(0, 80)}
                      {(entry.wentWell || entry.wasDifficult).length > 80 ? '...' : ''}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Entry sheet */}
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
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                zIndex: 91, maxHeight: '94vh', display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ padding: '12px var(--space-xl) var(--space-md)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Dagboek invullen</h3>
                  <button onClick={() => setShowAdd(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: 'var(--space-lg) var(--space-xl)' }}>

                {/* Mood */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>Hoe voel je je? {moodEmoji[mood]}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setMood(v)} style={{
                        flex: 1, padding: '10px 4px', borderRadius: 10,
                        background: mood === v ? moodColors[v] : 'var(--cloud)',
                        color: mood === v ? 'white' : 'var(--text-muted)',
                        fontSize: 20, border: mood === v ? 'none' : '1px solid var(--border)',
                      }}>{moodEmoji[v]}</button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: moodColors[mood], fontWeight: 600, textAlign: 'center', marginTop: 5 }}>
                    {moodLabels[mood]}
                  </p>
                </div>

                {/* Energy */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Energieniveau</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setEnergy(v)} style={{
                        flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: v === energy ? 700 : 500,
                        background: v === energy ? 'var(--soft-blue)' : 'var(--cloud)',
                        color: v === energy ? 'white' : 'var(--text-muted)',
                        border: v === energy ? 'none' : '1px solid var(--border)',
                      }}>{v}</button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--soft-blue)', fontWeight: 600, marginTop: 4, textAlign: 'center' }}>
                    {energyLabels[energy]}
                  </p>
                </div>

                {/* Stress */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Spanning</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setStress(v)} style={{
                        flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: v === stress ? 700 : 500,
                        background: v === stress ? (v <= 2 ? '#81b29a' : v === 3 ? '#8eaabd' : '#d4a257') : 'var(--cloud)',
                        color: v === stress ? 'white' : 'var(--text-muted)',
                        border: v === stress ? 'none' : '1px solid var(--border)',
                      }}>{v}</button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: stress <= 2 ? '#81b29a' : stress === 3 ? '#8eaabd' : '#d4a257', fontWeight: 600, marginTop: 4, textAlign: 'center' }}>
                    {stressLabels[stress]}
                  </p>
                </div>

                {/* Guided prompts */}
                {guidedPrompts.map(prompt => (
                  <div key={prompt.key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--granite-blue)', marginBottom: 6, display: 'block' }}>
                      {prompt.label}
                    </label>
                    <textarea
                      placeholder={prompt.placeholder}
                      value={
                        prompt.key === 'wentWell' ? wentWell :
                        prompt.key === 'wasDifficult' ? wasDifficult :
                        prompt.key === 'rememberTomorrow' ? rememberTomorrow : freewriting
                      }
                      onChange={e => {
                        const v = e.target.value
                        if (prompt.key === 'wentWell') setWentWell(v)
                        else if (prompt.key === 'wasDifficult') setWasDifficult(v)
                        else if (prompt.key === 'rememberTomorrow') setRememberTomorrow(v)
                        else setFreewriting(v)
                      }}
                      className="input-field"
                      style={{ minHeight: 70, resize: 'none' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{
                padding: 'var(--space-md) var(--space-xl)',
                paddingBottom: 'calc(var(--safe-bottom) + var(--space-md))',
                borderTop: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0,
              }}>
                <button onClick={handleSave} className="btn-primary" style={{ width: '100%' }}>Opslaan</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
