import React, { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../store/AppContext'
import { saveMedication, deleteMedication, MedicationItem } from '../../db'
import { format } from 'date-fns'
import { BottomSheet } from '../../components/ui/BottomSheet'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function daysUntil(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m ?? 0)
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PillIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07z" />
      <line x1="8.5" y1="11.5" x2="15.5" y2="4.5" />
    </svg>
  )
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function WarningIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function EditIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

// ─── Medication card (today overview) ────────────────────────────────────────

interface MedTodayCardProps {
  item: MedicationItem
  today: string
  onToggleTaken: (item: MedicationItem, index: number) => void
  onEdit: (item: MedicationItem) => void
  onDelete: (id: string) => void
}

function MedTodayCard({ item, today, onToggleTaken, onEdit, onDelete }: MedTodayCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const takenToday = item.taken[today] ?? []
  const sortedTimes = [...item.times].sort((a, b) => parseTime(a) - parseTime(b))
  const takenCount = takenToday.filter(Boolean).length
  const totalCount = sortedTimes.length

  const allTaken = totalCount > 0 && takenCount === totalCount
  const someTaken = takenCount > 0 && takenCount < totalCount
  const noneTaken = takenCount === 0

  const refillWarning = item.refillDate ? daysUntil(item.refillDate) <= 7 && daysUntil(item.refillDate) >= 0 : false
  const refillPassed = item.refillDate ? daysUntil(item.refillDate) < 0 : false

  let borderColor = 'var(--c-border)'
  let bgColor = 'var(--c-surface)'

  if (allTaken) {
    borderColor = 'rgba(74,160,100,0.3)'
    bgColor = 'rgba(74,160,100,0.06)'
  } else if (someTaken) {
    borderColor = 'rgba(180,140,60,0.3)'
    bgColor = 'rgba(180,140,60,0.05)'
  }

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-4)',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-primary)' }}>
              {item.name}
            </span>
            {item.dose && (
              <span style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--c-text-muted)',
                background: 'var(--c-surface2)',
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-full)',
                padding: '1px 8px',
              }}>
                {item.dose}
              </span>
            )}
            {allTaken && (
              <span style={{
                fontSize: 'var(--fs-xs)',
                color: '#4aa064',
                background: 'rgba(74,160,100,0.12)',
                border: '1px solid rgba(74,160,100,0.25)',
                borderRadius: 'var(--r-full)',
                padding: '1px 8px',
                fontWeight: 500,
              }}>
                Alles ingenomen
              </span>
            )}
          </div>

          {/* Refill warnings */}
          {(refillWarning || refillPassed) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
              fontSize: 'var(--fs-xs)',
              color: refillPassed ? '#e07070' : '#c0a040',
              fontWeight: 500,
            }}>
              <WarningIcon size={12} />
              {refillPassed
                ? `Herdatumering was op ${item.refillDate}`
                : `Herdatumering over ${daysUntil(item.refillDate!)} dag${daysUntil(item.refillDate!) !== 1 ? 'en' : ''}`}
            </div>
          )}
        </div>

        {/* Edit / delete */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
          <button
            onClick={() => onEdit(item)}
            aria-label="Bewerken"
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-sm)',
              color: 'var(--c-text-muted)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <EditIcon />
          </button>
          {confirmDelete ? (
            <button
              onClick={() => { onDelete(item.id); setConfirmDelete(false) }}
              style={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--r-sm)',
                color: '#e07070',
                background: 'rgba(160,64,64,0.2)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--fs-xs)',
                fontWeight: 700,
              }}
            >
              ✓
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
              aria-label="Verwijderen"
              style={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--r-sm)',
                color: 'var(--c-text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <p style={{
          fontSize: 'var(--fs-xs)',
          color: 'var(--c-text-muted)',
          lineHeight: 1.5,
          marginBottom: 'var(--sp-3)',
          margin: '0 0 var(--sp-3)',
        }}>
          {item.notes}
        </p>
      )}

      {/* Time slots */}
      {sortedTimes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {sortedTimes.map((time, index) => {
            const originalIndex = item.times.indexOf(time)
            const taken = takenToday[originalIndex] ?? false
            return (
              <button
                key={`${time}-${index}`}
                onClick={() => onToggleTaken(item, originalIndex)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  background: taken ? 'rgba(74,160,100,0.12)' : 'var(--c-surface2)',
                  border: `1px solid ${taken ? 'rgba(74,160,100,0.3)' : 'var(--c-border)'}`,
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 'var(--r-full)',
                  border: `2px solid ${taken ? '#4aa064' : 'var(--c-border2)'}`,
                  background: taken ? '#4aa064' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  {taken && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                  <span style={{ color: 'var(--c-text-muted)' }}>
                    <ClockIcon size={13} />
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    color: taken ? '#4aa064' : 'var(--c-text-primary)',
                  }}>
                    {time}
                  </span>
                </div>

                <span style={{
                  fontSize: 'var(--fs-xs)',
                  color: taken ? '#4aa064' : 'var(--c-text-muted)',
                  fontWeight: taken ? 600 : 400,
                }}>
                  {taken ? 'Ingenomen' : 'Niet ingenomen'}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', fontStyle: 'italic' }}>
          Geen tijden ingesteld
        </div>
      )}

      {/* Progress summary if multiple times */}
      {totalCount > 1 && (
        <div style={{
          marginTop: 'var(--sp-3)',
          fontSize: 'var(--fs-xs)',
          color: allTaken ? '#4aa064' : someTaken ? '#c0a040' : 'var(--c-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <div style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: 'var(--c-surface2)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(takenCount / totalCount) * 100}%`,
              background: allTaken ? '#4aa064' : someTaken ? '#c0a040' : 'var(--c-surface2)',
              borderRadius: 2,
              transition: 'width 0.3s',
            }} />
          </div>
          <span style={{ flexShrink: 0 }}>{takenCount}/{totalCount}</span>
        </div>
      )}
    </div>
  )
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string
  dose: string
  times: string[]
  notes: string
  refillDate: string
}

const emptyForm = (): FormState => ({
  name: '',
  dose: '',
  times: ['08:00'],
  notes: '',
  refillDate: '',
})

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--c-surface2)',
  border: '1px solid var(--c-border)',
  borderRadius: 'var(--r-md)',
  padding: '10px 14px',
  fontSize: 'var(--fs-sm)',
  color: 'var(--c-text-primary)',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const fieldLabel: React.CSSProperties = {
  fontSize: 'var(--fs-xs)',
  color: 'var(--c-text-muted)',
  fontWeight: 500,
  marginBottom: 6,
  display: 'block',
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Gezondheid() {
  const { state, refreshMedications } = useApp()
  const medications = state.medications

  const today = todayStr()

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<MedicationItem | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [tutorialDismissed, setTutorialDismissed] = useState(false)

  // Sort medications by name
  const sortedMeds = [...medications].sort((a, b) => a.name.localeCompare(b.name))

  function openAdd() {
    setForm(emptyForm())
    setEditItem(null)
    setShowAdd(true)
  }

  function openEdit(item: MedicationItem) {
    setForm({
      name: item.name,
      dose: item.dose ?? '',
      times: item.times.length > 0 ? [...item.times] : ['08:00'],
      notes: item.notes ?? '',
      refillDate: item.refillDate ?? '',
    })
    setEditItem(item)
    setShowAdd(true)
  }

  function closeSheet() {
    setShowAdd(false)
    setEditItem(null)
    setForm(emptyForm())
  }

  function handleFormChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addTimeSlot() {
    setForm(prev => ({ ...prev, times: [...prev.times, '12:00'] }))
  }

  function removeTimeSlot(index: number) {
    setForm(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }))
  }

  function updateTimeSlot(index: number, value: string) {
    setForm(prev => {
      const times = [...prev.times]
      times[index] = value
      return { ...prev, times }
    })
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const now = Date.now()
      const cleanTimes = form.times.filter(t => t.trim()).sort((a, b) => parseTime(a) - parseTime(b))

      if (editItem) {
        await saveMedication({
          ...editItem,
          name: form.name.trim(),
          dose: form.dose.trim() || undefined,
          times: cleanTimes,
          notes: form.notes.trim() || undefined,
          refillDate: form.refillDate || undefined,
          updatedAt: now,
        })
      } else {
        await saveMedication({
          id: uid(),
          name: form.name.trim(),
          dose: form.dose.trim() || undefined,
          times: cleanTimes,
          taken: {},
          notes: form.notes.trim() || undefined,
          refillDate: form.refillDate || undefined,
          createdAt: now,
          updatedAt: now,
        })
      }
      await refreshMedications()
      closeSheet()
    } finally {
      setSaving(false)
    }
  }

  const handleToggleTaken = useCallback(async (item: MedicationItem, timeIndex: number) => {
    const currentTaken = item.taken[today] ?? Array(item.times.length).fill(false)
    const newTaken = [...currentTaken]
    // Ensure array is long enough
    while (newTaken.length < item.times.length) newTaken.push(false)
    newTaken[timeIndex] = !newTaken[timeIndex]
    const updatedItem: MedicationItem = {
      ...item,
      taken: {
        ...item.taken,
        [today]: newTaken,
      },
      updatedAt: Date.now(),
    }
    await saveMedication(updatedItem)
    await refreshMedications()
  }, [today, refreshMedications])

  const handleDelete = useCallback(async (id: string) => {
    await deleteMedication(id)
    await refreshMedications()
  }, [refreshMedications])

  // Refill alerts summary
  const refillAlerts = sortedMeds.filter(m => {
    if (!m.refillDate) return false
    const d = daysUntil(m.refillDate)
    return d >= 0 && d <= 7
  })

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-4)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(180deg, var(--c-bg) 70%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--c-text-primary)', margin: 0 }}>
              Gezondheid
            </h1>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', margin: '2px 0 0' }}>
              Medicatie &amp; supplementen
            </p>
          </div>
          <button
            onClick={openAdd}
            aria-label="Medicatie toevoegen"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--r-full)',
              background: 'var(--g-accent)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--sh-accent)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <PlusIcon size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        {/* Tutorial */}
        {!tutorialDismissed && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(74,120,168,0.1), rgba(104,150,200,0.06))',
            border: '1px solid rgba(104,150,200,0.2)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
            position: 'relative',
          }}>
            <button
              onClick={() => setTutorialDismissed(true)}
              style={{
                position: 'absolute',
                top: 'var(--sp-3)',
                right: 'var(--sp-3)',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--r-full)',
                color: 'var(--c-text-muted)',
                fontSize: 18,
                background: 'rgba(42,61,90,0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Sluit uitleg"
            >
              ×
            </button>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-baby-blue)', marginBottom: 'var(--sp-2)' }}>
              Hoe werkt Gezondheid?
            </div>
            <ul style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--c-text-secondary)',
              paddingLeft: 'var(--sp-4)',
              lineHeight: 1.7,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-1)',
              listStyle: 'disc',
              margin: 0,
            }}>
              <li>Voeg medicatie of supplementen toe met tijdslots.</li>
              <li>Tik op een tijdslot om het als ingenomen te markeren.</li>
              <li>Voeg een herdatumering toe zodat je op tijd bestelt.</li>
              <li>Notities helpen je bijzonderheden te onthouden.</li>
            </ul>
          </div>
        )}

        {/* Refill alerts banner */}
        {refillAlerts.length > 0 && (
          <div style={{
            background: 'rgba(180,140,60,0.08)',
            border: '1px solid rgba(180,140,60,0.3)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
            display: 'flex',
            gap: 'var(--sp-3)',
            alignItems: 'flex-start',
          }}>
            <span style={{ color: '#c0a040', flexShrink: 0, marginTop: 1 }}>
              <WarningIcon size={18} />
            </span>
            <div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: '#c0a040', marginBottom: 4 }}>
                Herdatumering bijna bereikt
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>
                {refillAlerts.map(m => {
                  const d = daysUntil(m.refillDate!)
                  return (
                    <span key={m.id}>
                      {m.name}{m.dose ? ` (${m.dose})` : ''} — nog {d} dag{d !== 1 ? 'en' : ''}
                    </span>
                  )
                }).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, ' · ', el], [])}
              </div>
            </div>
          </div>
        )}

        {/* Today section */}
        {sortedMeds.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              marginBottom: 'var(--sp-3)',
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 'var(--r-md)',
                background: 'rgba(74,120,168,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--c-accent)',
              }}>
                <PillIcon size={16} color="var(--c-accent)" />
              </div>
              <span style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-primary)' }}>
                Vandaag
              </span>
              <span style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--c-text-muted)',
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-full)',
                padding: '1px 8px',
              }}>
                {format(new Date(), 'd MMM')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {sortedMeds.map(med => (
                <MedTodayCard
                  key={med.id}
                  item={med}
                  today={today}
                  onToggleTaken={handleToggleTaken}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {sortedMeds.length === 0 && (
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-10)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--sp-3)',
          }}>
            <div style={{ color: 'var(--c-text-muted)' }}>
              <PillIcon size={40} color="var(--c-text-muted)" />
            </div>
            <div style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-secondary)' }}>
              Geen medicatie of supplementen
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', maxWidth: 260, lineHeight: 1.6 }}>
              Voeg je medicatie of supplementen toe om bij te houden wanneer je ze neemt.
            </div>
            <button
              onClick={openAdd}
              style={{
                marginTop: 'var(--sp-2)',
                padding: '10px 20px',
                background: 'var(--g-accent)',
                borderRadius: 'var(--r-md)',
                color: 'white',
                fontSize: 'var(--fs-sm)',
                fontWeight: 600,
                boxShadow: 'var(--sh-accent)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Eerste medicatie toevoegen
            </button>
          </div>
        )}
      </div>

      {/* ── Add / Edit BottomSheet ── */}
      <BottomSheet
        open={showAdd}
        onClose={closeSheet}
        title={editItem ? 'Medicatie bewerken' : 'Medicatie toevoegen'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

          {/* Name */}
          <div>
            <label style={fieldLabel}>Naam *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleFormChange('name', e.target.value)}
              placeholder="Bijv. Melatonine"
              style={inputBase}
              autoFocus
            />
          </div>

          {/* Dose */}
          <div>
            <label style={fieldLabel}>Dosering</label>
            <input
              type="text"
              value={form.dose}
              onChange={e => handleFormChange('dose', e.target.value)}
              placeholder="Bijv. 5 mg, 1 capsule"
              style={inputBase}
            />
          </div>

          {/* Time slots */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ ...fieldLabel, margin: 0 }}>Tijdslots</label>
              <button
                onClick={addTimeSlot}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 'var(--r-full)',
                  border: '1px solid rgba(74,120,168,0.3)',
                  background: 'rgba(74,120,168,0.1)',
                  color: 'var(--c-accent)',
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <PlusIcon size={12} /> Tijd toevoegen
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {form.times.map((time, index) => (
                <div key={index} style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
                  <input
                    type="time"
                    value={time}
                    onChange={e => updateTimeSlot(index, e.target.value)}
                    style={{ ...inputBase, flex: 1 }}
                  />
                  {form.times.length > 1 && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      style={{
                        width: 34,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--r-md)',
                        border: '1px solid var(--c-border)',
                        background: 'transparent',
                        color: 'var(--c-text-muted)',
                        fontSize: 18,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      aria-label="Tijdslot verwijderen"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={fieldLabel}>Notitie</label>
            <textarea
              value={form.notes}
              onChange={e => handleFormChange('notes', e.target.value)}
              placeholder="Bijv. neem in met eten, of bewaar koel"
              rows={3}
              style={{ ...inputBase, resize: 'none' }}
            />
          </div>

          {/* Refill date */}
          <div>
            <label style={fieldLabel}>Herdatumering (optioneel)</label>
            <input
              type="date"
              value={form.refillDate}
              onChange={e => handleFormChange('refillDate', e.target.value)}
              style={inputBase}
            />
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 4, margin: '4px 0 0' }}>
              Je krijgt een melding als de datum binnen 7 dagen is.
            </p>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || saving}
            style={{
              padding: '13px',
              background: form.name.trim() ? 'var(--g-accent)' : 'var(--c-surface2)',
              borderRadius: 'var(--r-md)',
              color: form.name.trim() ? 'white' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-base)',
              fontWeight: 600,
              width: '100%',
              boxShadow: form.name.trim() ? 'var(--sh-accent)' : 'none',
              transition: 'all 0.15s',
              border: 'none',
              cursor: form.name.trim() ? 'pointer' : 'default',
            }}
          >
            {saving ? 'Opslaan…' : editItem ? 'Wijzigingen opslaan' : 'Toevoegen'}
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
