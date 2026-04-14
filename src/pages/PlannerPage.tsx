import React, { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { activities, categories, durationOptions } from '@/lib/activities'
import { iconMap } from '@/icons/ActivityIcons'

function todayStr() { return new Date().toISOString().split('T')[0] }
function dayOffset(offset: number) {
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}
function dayLabel(offset: number) {
  if (offset === 0) return 'Vandaag'
  if (offset === 1) return 'Morgen'
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6:00 - 23:00
const QUARTER_HEIGHT = 20
const HOUR_HEIGHT = QUARTER_HEIGHT * 4

export const PlannerPage: React.FC = () => {
  const { plannerItems, addPlannerItem, removePlannerItem } = useStore()
  const [selectedDay, setSelectedDay] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)
  const [traySearch, setTraySearch] = useState('')
  const [trayCategory, setTrayCategory] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [placingMode, setPlacingMode] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  const currentDate = dayOffset(selectedDay)
  const dayItems = useMemo(
    () => plannerItems.filter(i => i.date === currentDate),
    [plannerItems, currentDate]
  )

  const filteredActivities = useMemo(() => {
    let list = activities
    if (trayCategory) list = list.filter(a => a.category === trayCategory)
    if (traySearch) {
      const q = traySearch.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
    }
    return list
  }, [trayCategory, traySearch])

  const handleSlotTap = useCallback((hour: number, quarter: number) => {
    if (!selectedActivity || !placingMode) return
    addPlannerItem({
      date: currentDate,
      hour,
      quarter,
      duration: selectedDuration,
      activityId: selectedActivity.id,
      activityName: selectedActivity.name,
      category: selectedActivity.category,
      color: selectedActivity.color,
      iconId: selectedActivity.iconId,
    })
    setPlacingMode(false)
    setSelectedActivity(null)
    setTrayOpen(false)
  }, [selectedActivity, placingMode, currentDate, selectedDuration, addPlannerItem])

  const startPlacing = (activity: typeof activities[0]) => {
    setSelectedActivity(activity)
    setPlacingMode(true)
    setTrayOpen(false)
  }

  const cancelPlacing = () => {
    setPlacingMode(false)
    setSelectedActivity(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader title="Planner" subtitle={new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })} />

      {/* Day tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '0 var(--space-lg)',
        overflowX: 'auto',
        flexShrink: 0,
        paddingBottom: 12,
      }}>
        {Array.from({ length: 7 }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 13,
              fontWeight: selectedDay === i ? 700 : 500,
              whiteSpace: 'nowrap',
              background: selectedDay === i ? 'var(--granite-blue)' : 'var(--white)',
              color: selectedDay === i ? 'var(--white)' : 'var(--text-secondary)',
              border: selectedDay === i ? 'none' : '1px solid var(--border)',
              minHeight: 36,
              transition: 'all 0.2s',
            }}
          >
            {dayLabel(i)}
          </button>
        ))}
      </div>

      {/* Placing mode bar */}
      <AnimatePresence>
        {placingMode && selectedActivity && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: 'var(--granite-blue)',
              color: 'var(--white)',
              padding: '10px var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Tik op een tijdslot: {selectedActivity.name} ({selectedDuration} min)
            </span>
            <button onClick={cancelPlacing} style={{ color: 'var(--baby-blue)', fontSize: 13, fontWeight: 600 }}>
              Annuleer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="page-scroll"
        style={{ padding: '0 var(--space-lg)', flex: 1 }}
      >
        <div style={{ position: 'relative', paddingLeft: 52 }}>
          {HOURS.map(hour => (
            <div key={hour} style={{ position: 'relative', height: HOUR_HEIGHT }}>
              {/* Hour label */}
              <div style={{
                position: 'absolute',
                left: -52,
                top: -8,
                width: 44,
                textAlign: 'right',
                fontSize: 12,
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}>
                {String(hour).padStart(2, '0')}:00
              </div>

              {/* Hour line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'var(--border)',
              }} />

              {/* Quarter slots */}
              {[0, 1, 2, 3].map(q => {
                const isTarget = placingMode
                const hasItem = dayItems.some(it => it.hour === hour && it.quarter === q)
                return (
                  <button
                    key={q}
                    onClick={() => handleSlotTap(hour, q)}
                    style={{
                      position: 'absolute',
                      top: q * QUARTER_HEIGHT,
                      left: 0,
                      right: 0,
                      height: QUARTER_HEIGHT,
                      background: isTarget && !hasItem ? 'rgba(149,184,209,0.08)' : 'transparent',
                      borderBottom: q < 3 ? '1px dotted var(--border)' : 'none',
                      cursor: isTarget ? 'pointer' : 'default',
                      transition: 'background 0.15s',
                    }}
                  />
                )
              })}

              {/* Placed items */}
              {dayItems.filter(it => it.hour === hour).map(item => {
                const topPx = item.quarter * QUARTER_HEIGHT
                const heightPx = Math.max((item.duration / 15) * QUARTER_HEIGHT, QUARTER_HEIGHT)
                const IconComp = iconMap[item.iconId]
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: topPx + 1,
                      left: 4,
                      right: 4,
                      height: heightPx - 2,
                      background: item.color + '22',
                      borderLeft: `3px solid ${item.color}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      overflow: 'hidden',
                      zIndex: 5,
                    }}
                  >
                    {IconComp && <div style={{ color: item.color, flexShrink: 0, opacity: 0.8 }}><IconComp /></div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.activityName}</p>
                      {heightPx >= 36 && (
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.duration} min</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removePlannerItem(item.id) }}
                      style={{ fontSize: 16, color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}
                    >×</button>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* FAB to open tray */}
      {!trayOpen && !placingMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTrayOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-height) + var(--safe-bottom) + 16px)',
            right: 20,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--granite-blue)',
            color: 'var(--white)',
            fontSize: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
          }}
        >
          +
        </motion.button>
      )}

      {/* Activity Tray */}
      <AnimatePresence>
        {trayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrayOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
                zIndex: 90,
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '75vh',
                background: 'var(--white)',
                borderRadius: '20px 20px 0 0',
                zIndex: 91,
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 'var(--safe-bottom)',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </div>

              {/* Search */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder="Zoek activiteit..."
                  value={traySearch}
                  onChange={e => setTraySearch(e.target.value)}
                  className="input-field"
                  style={{ fontSize: 15 }}
                />
              </div>

              {/* Duration picker */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Duur</p>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  {durationOptions.slice(0, 12).map(d => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDuration(d.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 12,
                        fontWeight: selectedDuration === d.value ? 700 : 500,
                        background: selectedDuration === d.value ? 'var(--granite-blue)' : 'var(--cloud)',
                        color: selectedDuration === d.value ? 'var(--white)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        minHeight: 32,
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category pills */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  <button
                    onClick={() => setTrayCategory(null)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 12,
                      fontWeight: !trayCategory ? 700 : 500,
                      background: !trayCategory ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: !trayCategory ? 'var(--white)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      minHeight: 32,
                    }}
                  >
                    Alles
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setTrayCategory(c.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 12,
                        fontWeight: trayCategory === c.id ? 700 : 500,
                        background: trayCategory === c.id ? c.color + '33' : 'var(--cloud)',
                        color: trayCategory === c.id ? c.color : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        minHeight: 32,
                        border: trayCategory === c.id ? `1px solid ${c.color}44` : '1px solid transparent',
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {filteredActivities.map(a => {
                    const IconComp = iconMap[a.iconId]
                    return (
                      <button
                        key={a.id}
                        onClick={() => startPlacing(a)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          padding: '12px 4px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--cloud)',
                          border: '1px solid var(--border)',
                          minHeight: 72,
                        }}
                      >
                        <div style={{ color: a.color }}>
                          {IconComp ? <IconComp /> : <div style={{ width: 24, height: 24, borderRadius: '50%', background: a.color + '33' }} />}
                        </div>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>{a.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
