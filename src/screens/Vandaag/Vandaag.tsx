import React, { useEffect, useState, useRef } from 'react'
import { format, isToday } from 'date-fns'
import { nl } from 'date-fns/locale'
import { useApp } from '../../store/AppContext'
import { getPlannerItems, PlannerItem, saveRememberItem } from '../../db'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

const JOURNAL_PROMPTS = [
  'Wat gaf je vandaag energie?',
  'Wat voelde zwaar vandaag, en waarom is dat oké?',
  'Noem één ding dat goed ging, hoe klein ook.',
  'Wat heeft je lichaam vandaag nodig?',
  'Wat wil je loslaten voor morgen?',
  'Wie of wat heeft je vandaag geholpen?',
  'Wat was het rustigste moment van vandaag?',
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Goedenacht'
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

function formatSlotTime(slotKey: string): string {
  return slotKey
}

interface ProgressBarProps {
  done: number
  total: number
}
function ProgressBar({ done, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 'var(--sp-2)'
      }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
          Voortgang vandaag
        </span>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {done} van {total} klaar
        </span>
      </div>
      <div style={{
        height: 6, borderRadius: 'var(--r-full)',
        background: 'var(--c-surface3)', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 'var(--r-full)',
          background: pct === 100
            ? 'linear-gradient(90deg, #4a9970, #5db888)'
            : 'var(--g-accent)',
          transition: 'width 600ms cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  )
}

interface PlannerRowProps {
  item: PlannerItem
  onToggle: (item: PlannerItem) => void
}
function PlannerRow({ item, onToggle }: PlannerRowProps) {
  return (
    <button
      onClick={() => onToggle(item)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        width: '100%', textAlign: 'left',
        padding: 'var(--sp-3) var(--sp-4)',
        background: item.completed ? 'rgba(74,153,112,0.07)' : 'var(--c-surface2)',
        border: `1px solid ${item.completed ? 'rgba(74,153,112,0.25)' : 'var(--c-border)'}`,
        borderRadius: 'var(--r-md)',
        transition: 'all var(--t-base)',
        marginBottom: 'var(--sp-2)',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 'var(--r-full)', flexShrink: 0,
        border: `2px solid ${item.completed ? 'var(--c-success)' : 'var(--c-border2)'}`,
        background: item.completed ? 'var(--c-success)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all var(--t-base)',
      }}>
        {item.completed && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-base)',
          color: item.completed ? 'var(--c-text-muted)' : 'var(--c-text-primary)',
          textDecoration: item.completed ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.label}
        </div>
        {item.notes && (
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.notes}
          </div>
        )}
      </div>
      <div style={{
        fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)',
        fontVariantNumeric: 'tabular-nums', flexShrink: 0,
      }}>
        {formatSlotTime(item.slotKey)}
      </div>
    </button>
  )
}

export default function Vandaag() {
  const { state, setTab, refreshRemember } = useApp()
  const { medications } = state

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const dateLabel = format(today, 'EEEE, d MMMM yyyy', { locale: nl })
  const dateCapitalized = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)

  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([])
  const [quickCapture, setQuickCapture] = useState('')
  const [captureSuccess, setCaptureSuccess] = useState(false)
  const [completedOpen, setCompletedOpen] = useState(false)
  const promptRef = useRef(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)])

  useEffect(() => {
    getPlannerItems(todayStr).then(items => {
      const sorted = [...items].sort((a, b) => a.slotKey.localeCompare(b.slotKey))
      setPlannerItems(sorted)
    })
  }, [todayStr])

  // Next medication due
  const nowMinutes = today.getHours() * 60 + today.getMinutes()
  const nextMed = (() => {
    let best: { name: string; time: string; minutesFromNow: number } | null = null
    for (const med of medications) {
      const takenToday = med.taken?.[todayStr] ?? []
      for (let i = 0; i < med.times.length; i++) {
        if (takenToday[i]) continue
        const [h, m] = med.times[i].split(':').map(Number)
        const mins = h * 60 + m
        const diff = mins >= nowMinutes ? mins - nowMinutes : mins + 1440 - nowMinutes
        if (!best || diff < best.minutesFromNow) {
          best = { name: med.name, time: med.times[i], minutesFromNow: diff }
        }
      }
    }
    return best
  })()

  // Next planner item not yet done
  const nextPlanner = plannerItems.find(i => !i.completed && i.slotKey >= format(today, 'HH:mm'))
    ?? plannerItems.find(i => !i.completed)

  const todoDone = plannerItems.filter(i => i.completed)
  const todoOpen = plannerItems.filter(i => !i.completed)
  const totalTasks = plannerItems.length

  async function handleToggle(item: PlannerItem) {
    const { savePlannerItem } = await import('../../db')
    const updated = { ...item, completed: !item.completed, updatedAt: Date.now() }
    await savePlannerItem(updated)
    setPlannerItems(prev => prev.map(p => p.id === item.id ? updated : p))
  }

  async function handleQuickCapture() {
    const text = quickCapture.trim()
    if (!text) return
    await saveRememberItem({
      id: uid(),
      text,
      urgency: 'normaal',
      category: 'Overig',
      done: false,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await refreshRemember()
    setQuickCapture('')
    setCaptureSuccess(true)
    setTimeout(() => setCaptureSuccess(false), 2000)
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-4)',
        background: 'linear-gradient(180deg, var(--c-bg) 60%, transparent 100%)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        {/* RUST wordmark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <svg width="64" height="28" viewBox="0 0 64 28" fill="none" aria-label="RUST">
              <text
                x="0" y="22"
                fontFamily="Inter, sans-serif"
                fontWeight="700"
                fontSize="26"
                letterSpacing="6"
                fill="url(#rustGrad)"
              >RUST</text>
              <defs>
                <linearGradient id="rustGrad" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6896c8"/>
                  <stop offset="100%" stopColor="#a8c8e0"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 2, letterSpacing: '0.04em' }}>
              {dateCapitalized}
            </div>
          </div>
          {/* Breathing shortcut */}
          <button
            onClick={() => setTab('ademhaling')}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              padding: 'var(--sp-2) var(--sp-3)',
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-full)',
              color: 'var(--c-baby-blue)',
              fontSize: 'var(--fs-sm)',
              transition: 'all var(--t-base)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 22a8 8 0 0 1-8-8c0-4 4-8 4-8s0 4 4 4 4-4 4-4 4 4 4 8a8 8 0 0 1-8 8z"/>
            </svg>
            Adem
          </button>
        </div>

        <div style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--fs-lg)', fontWeight: 500, color: 'var(--c-text-primary)' }}>
          {getGreeting()}
        </div>
      </div>

      <div style={{ padding: '0 var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        {/* Summary cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          {/* Next medication */}
          <button
            onClick={() => setTab('gezondheid')}
            style={{
              background: 'var(--g-card)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--sp-4)',
              textAlign: 'left',
              transition: 'all var(--t-base)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-baby-blue)" strokeWidth="2" strokeLinecap="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Medicatie
              </span>
            </div>
            {nextMed ? (
              <>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-text-primary)', marginBottom: 2 }}>
                  {nextMed.name}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-baby-blue)', fontVariantNumeric: 'tabular-nums' }}>
                  {nextMed.time}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
                {medications.length === 0 ? 'Geen ingesteld' : 'Alles ingenomen'}
              </div>
            )}
          </button>

          {/* Next planner item */}
          <button
            onClick={() => setTab('planner')}
            style={{
              background: 'var(--g-card)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--sp-4)',
              textAlign: 'left',
              transition: 'all var(--t-base)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Volgende
              </span>
            </div>
            {nextPlanner ? (
              <>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-text-primary)', marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {nextPlanner.label}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-accent)', fontVariantNumeric: 'tabular-nums' }}>
                  {nextPlanner.slotKey}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
                {totalTasks === 0 ? 'Geen items' : 'Alles gedaan'}
              </div>
            )}
          </button>
        </div>

        {/* Progress card */}
        {totalTasks > 0 && (
          <div style={{
            background: 'var(--g-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
          }}>
            <ProgressBar done={todoDone.length} total={totalTasks} />
          </div>
        )}

        {/* Nog te doen */}
        {todoOpen.length > 0 && (
          <div>
            <div style={{
              fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              marginBottom: 'var(--sp-3)',
            }}>
              Nog te doen
            </div>
            {todoOpen.map(item => (
              <PlannerRow key={item.id} item={item} onToggle={handleToggle} />
            ))}
          </div>
        )}

        {totalTasks === 0 && (
          <div style={{
            background: 'var(--g-card)', border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-2)' }}>📅</div>
            <div style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-secondary)', marginBottom: 'var(--sp-1)' }}>
              Geen items gepland voor vandaag
            </div>
            <button
              onClick={() => setTab('planner')}
              style={{
                marginTop: 'var(--sp-3)',
                padding: 'var(--sp-2) var(--sp-4)',
                background: 'var(--g-accent)',
                borderRadius: 'var(--r-full)',
                color: 'white',
                fontSize: 'var(--fs-sm)',
                fontWeight: 500,
              }}
            >
              Naar planner
            </button>
          </div>
        )}

        {/* Klaar vandaag (collapsible) */}
        {todoDone.length > 0 && (
          <div>
            <button
              onClick={() => setCompletedOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', textAlign: 'left',
                fontSize: 'var(--fs-sm)', fontWeight: 600,
                color: 'var(--c-text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: completedOpen ? 'var(--sp-3)' : 0,
                padding: 'var(--sp-2) 0',
                transition: 'color var(--t-base)',
              }}
            >
              <span>Klaar vandaag ({todoDone.length})</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                style={{ transform: completedOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--t-base)' }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {completedOpen && todoDone.map(item => (
              <PlannerRow key={item.id} item={item} onToggle={handleToggle} />
            ))}
          </div>
        )}

        {/* Quick capture */}
        <div style={{
          background: 'var(--g-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-4)',
        }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-text-secondary)', marginBottom: 'var(--sp-3)' }}>
            Snel onthouden
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <input
              type="text"
              value={quickCapture}
              onChange={e => setQuickCapture(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleQuickCapture() }}
              placeholder="Voeg iets toe om te onthouden…"
              style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
            />
            <button
              onClick={handleQuickCapture}
              disabled={!quickCapture.trim()}
              style={{
                padding: '0 var(--sp-4)',
                background: quickCapture.trim() ? 'var(--g-accent)' : 'var(--c-surface3)',
                borderRadius: 'var(--r-md)',
                color: quickCapture.trim() ? 'white' : 'var(--c-text-muted)',
                fontSize: 'var(--fs-sm)', fontWeight: 500,
                transition: 'all var(--t-base)',
                whiteSpace: 'nowrap',
              }}
            >
              {captureSuccess ? '✓ Opgeslagen' : 'Voeg toe'}
            </button>
          </div>
        </div>

        {/* Journal prompt */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(74,120,168,0.12) 0%, rgba(104,150,200,0.08) 100%)',
          border: '1px solid rgba(104,150,200,0.25)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--r-md)',
              background: 'rgba(104,150,200,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-baby-blue)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-baby-blue)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 'var(--sp-2)' }}>
                Dagboek prompt
              </div>
              <div style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-primary)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                {promptRef.current}
              </div>
              <button
                onClick={() => setTab('dagboek')}
                style={{
                  padding: 'var(--sp-2) var(--sp-4)',
                  background: 'rgba(104,150,200,0.2)',
                  border: '1px solid rgba(104,150,200,0.35)',
                  borderRadius: 'var(--r-full)',
                  color: 'var(--c-baby-blue)',
                  fontSize: 'var(--fs-sm)', fontWeight: 500,
                  transition: 'all var(--t-base)',
                }}
              >
                Schrijf nu
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
