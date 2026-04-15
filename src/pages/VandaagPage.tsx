import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '@/store'

const tips = [
  'Neem vandaag even een moment om bewust te ademen.',
  'Drink een extra glas water vandaag.',
  'Schrijf drie dingen op waar je dankbaar voor bent.',
  'Neem een korte wandeling en geniet van de buitenlucht.',
  'Gun jezelf een rustmoment zonder scherm.',
  'Strek je lichaam even uit tussen het werken door.',
  'Bel iemand die je al een tijdje niet hebt gesproken.',
  'Leg je telefoon even weg en lees een paar pagina\'s.',
  'Doe iets creatiefs, ook al is het maar vijf minuten.',
  'Sluit je ogen en luister naar de geluiden om je heen.',
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

function formatDate(): string {
  return new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getDailyTip(): string {
  const day = Math.floor(Date.now() / 86400000) % tips.length
  return tips[day]
}

// Premium module shortcuts
const MODULES = [
  {
    id: 'onthouden', label: 'Onthouden', path: '/onthouden',
    desc: 'Notities & herinneringen', color: '#d4a257',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
  {
    id: 'planner', label: 'Planner', path: '/planner',
    desc: 'Dag indelen', color: '#5c7a99',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    id: 'ademhaling', label: 'Ademhaling', path: '/ademhaling',
    desc: 'Rust vinden', color: '#95b8d1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z"/>
        <path d="M12 13v4"/>
      </svg>
    ),
  },
  {
    id: 'dagboek', label: 'Dagboek', path: '/dagboek',
    desc: 'Hoe gaat het?', color: '#81b29a',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h4v16H4z"/>
        <path d="M8 4h12v16H8"/>
        <path d="M12 8h4M12 12h4M12 16h2"/>
      </svg>
    ),
  },
  {
    id: 'gezondheid', label: 'Gezondheid', path: '/gezondheid',
    desc: 'Water, slaap, medicatie', color: '#e8a87c',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'plaatsen', label: 'Plaatsen', path: '/plaatsen',
    desc: 'Waar heb ik het gelaten?', color: '#a8c5a0',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
]

export const VandaagPage: React.FC = () => {
  const navigate = useNavigate()
  const plannerItems = useStore(s => s.plannerItems)
  const notes = useStore(s => s.notes)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const todayStr = now.toISOString().split('T')[0]
  const todayItems = plannerItems.filter(i => i.date === todayStr)
  const pinnedNotes = notes.filter(n => n.pinned && !n.done && !n.archived)

  return (
    <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>
      {/* Header */}
      <div style={{ paddingTop: 'calc(var(--safe-top) + 20px)', paddingBottom: 8 }}>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: 4 }}
        >
          {formatDate()}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700,
            color: 'var(--granite-blue)', letterSpacing: '-0.03em',
          }}
        >
          {getGreeting()}
        </motion.h1>
      </div>

      {/* Daily tip card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{
          background: 'linear-gradient(135deg, var(--granite-blue) 0%, var(--soft-blue) 100%)',
          borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)',
          marginTop: 'var(--space-lg)', color: 'var(--white)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>
          Tip van de dag
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 400 }}>{getDailyTip()}</p>
      </motion.div>

      {/* Today's schedule overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ marginTop: 'var(--space-xl)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--granite-blue)' }}>Vandaag gepland</h2>
          <button onClick={() => navigate('/planner')} style={{ fontSize: 13, color: 'var(--soft-blue)', fontWeight: 600 }}>Bekijk alles</button>
        </div>

        {todayItems.length === 0 ? (
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-2xl)', textAlign: 'center', border: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Nog niets gepland voor vandaag</p>
            <button onClick={() => navigate('/planner')} style={{
              marginTop: 12, padding: '10px 20px', background: 'var(--accent-soft)',
              color: 'var(--granite-blue)', borderRadius: 'var(--radius-full)',
              fontSize: 13, fontWeight: 600,
            }}>Plan je dag</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayItems.slice(0, 5).map(item => (
              <div key={item.id} style={{
                background: 'var(--white)', borderRadius: 'var(--radius-md)',
                padding: '12px 16px', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 4, height: 32, borderRadius: 2, background: item.color || 'var(--mist-blue)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{item.activityName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {String(item.hour).padStart(2, '0')}:{String(item.quarter * 15).padStart(2, '0')} · {item.duration} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pinned notes */}
      {pinnedNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ marginTop: 'var(--space-xl)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--granite-blue)' }}>Vastgepind</h2>
            <button onClick={() => navigate('/onthouden')} style={{ fontSize: 13, color: 'var(--soft-blue)', fontWeight: 600 }}>Alles</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pinnedNotes.slice(0, 3).map(note => (
              <div key={note.id} style={{
                background: 'var(--white)', borderRadius: 'var(--radius-md)',
                padding: '12px 16px', border: '1px solid var(--border)',
              }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{note.title}</p>
                {note.content && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {note.content.slice(0, 60)}{note.content.length > 60 ? '…' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Premium module shortcut cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--granite-blue)', marginBottom: 12 }}>Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {MODULES.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              onClick={() => navigate(mod.path)}
              style={{
                background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                padding: '14px 14px 12px',
                border: '1px solid var(--border)',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 8,
                minHeight: 88,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: mod.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: mod.color,
              }}>
                {mod.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--granite-blue)', lineHeight: 1.2 }}>{mod.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>{mod.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
