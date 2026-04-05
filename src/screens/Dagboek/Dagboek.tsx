import React, { useState, useEffect, useCallback } from 'react'
import { useApp } from '../../store/AppContext'
import { saveJournalEntry, deleteJournalEntry, JournalEntry } from '../../db'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { BottomSheet } from '../../components/ui/BottomSheet'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ─── Constants ────────────────────────────────────────────────────────────────

const MOOD_EMOJIS: Record<number, string> = {
  1: '😔',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '😄',
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Zwaar',
  2: 'Matig',
  3: 'Oké',
  4: 'Goed',
  5: 'Geweldig',
}

const JOURNAL_PROMPTS = [
  'Wat heb je vandaag goed gedaan?',
  'Wat gaf je energie vandaag?',
  'Eén ding dat je trots op bent',
  'Hoe voelde je lichaam vandaag?',
]

type Mode = 'lijst' | 'schrijven' | 'geleid'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}

function formatDutchDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return format(d, 'd MMMM yyyy', { locale: nl })
  } catch {
    return dateStr
  }
}

function snippet(text: string | undefined, max = 50): string {
  if (!text) return ''
  const clean = text.replace(/\n/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MoodDot({ value, active, onClick }: { value: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={MOOD_LABELS[value]}
      style={{
        fontSize: active ? 28 : 22,
        lineHeight: 1,
        transition: 'all 0.15s',
        transform: active ? 'scale(1.2)' : 'scale(1)',
        filter: active ? 'none' : 'grayscale(0.6) opacity(0.5)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
      }}
    >
      {MOOD_EMOJIS[value]}
    </button>
  )
}

function EnergyDot({ level }: { level: number }) {
  const colors = ['#3a3a4a', '#3a3a4a', '#4a7468', '#6a9a68', '#8aba58']
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: i <= level ? 10 + i * 2 : 6,
            borderRadius: 2,
            background: i <= level ? colors[level - 1] : 'var(--c-surface2)',
            transition: 'all 0.15s',
          }}
        />
      ))}
    </div>
  )
}

function StressDot({ level }: { level: number }) {
  const color = level <= 2 ? '#4a8468' : level === 3 ? '#8a7840' : '#8a4840'
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i <= level ? color : 'var(--c-surface2)',
          }}
        />
      ))}
    </div>
  )
}

function SliderInput({
  label,
  value,
  onChange,
  renderValue,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  renderValue?: (v: number) => React.ReactNode
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', fontWeight: 500 }}>{label}</span>
        {renderValue ? (
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-primary)' }}>{renderValue(value)}</span>
        ) : (
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>{value}/5</span>
        )}
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--c-accent)' }}
      />
    </div>
  )
}

// ─── Entry card ───────────────────────────────────────────────────────────────

interface EntryCardProps {
  entry: JournalEntry
  onTap: (entry: JournalEntry) => void
  onDelete: (id: string) => void
}

function EntryCard({ entry, onTap, onDelete }: EntryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const text = entry.type === 'vrij' ? entry.freeText : entry.wentWell

  return (
    <div
      style={{
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-4)',
        display: 'flex',
        gap: 'var(--sp-3)',
        alignItems: 'flex-start',
        cursor: 'pointer',
      }}
      onClick={() => onTap(entry)}
    >
      {/* Mood / type indicator */}
      <div style={{
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: 'var(--r-md)',
        background: 'var(--c-surface2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
      }}>
        {entry.mood ? MOOD_EMOJIS[entry.mood] : (entry.type === 'vrij' ? '✏️' : '📋')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
            {formatDutchDate(entry.date)}
          </span>
          <span style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--c-text-muted)',
            background: 'var(--c-surface2)',
            borderRadius: 'var(--r-full)',
            padding: '1px 8px',
            border: '1px solid var(--c-border)',
          }}>
            {entry.type === 'vrij' ? 'Vrij' : 'Geleid'}
          </span>
        </div>

        {/* Indicators row */}
        {(entry.energy !== undefined || entry.stress !== undefined) && (
          <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 6, alignItems: 'center' }}>
            {entry.energy !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Energie</span>
                <EnergyDot level={entry.energy} />
              </div>
            )}
            {entry.stress !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Stress</span>
                <StressDot level={entry.stress} />
              </div>
            )}
          </div>
        )}

        {text && (
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--c-text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}>
            {snippet(text, 60)}
          </p>
        )}
      </div>

      {/* Delete */}
      <div
        style={{ flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {confirmDelete ? (
          <button
            onClick={() => onDelete(entry.id)}
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-sm)',
              color: '#e07070',
              background: 'rgba(160,64,64,0.2)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✓
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-sm)',
              color: 'var(--c-text-muted)',
              background: 'transparent',
              fontSize: 18,
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Verwijder notitie"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Draft persistence keys ───────────────────────────────────────────────────

const DRAFT_KEY = 'rust-journal-draft'

function loadDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? ''
  } catch {
    return ''
  }
}

function saveDraftLocal(text: string) {
  try {
    localStorage.setItem(DRAFT_KEY, text)
  } catch { /* ignore */ }
}

function clearDraftLocal() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch { /* ignore */ }
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Dagboek() {
  const { state, refreshJournal } = useApp()
  const entries = state.journal

  const [mode, setMode] = useState<Mode>('lijst')
  const [editId, setEditId] = useState<string | null>(null)
  const [detailEntry, setDetailEntry] = useState<JournalEntry | null>(null)

  // Vrij schrijven state
  const [freeText, setFreeText] = useState('')
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Geleid state
  const [geleidMood, setGeleidMood] = useState(3)
  const [geleidEnergy, setGeleidEnergy] = useState(3)
  const [geleidStress, setGeleidStress] = useState(3)
  const [geleidWentWell, setGeleidWentWell] = useState('')
  const [geleidWasHard, setGeleidWasHard] = useState('')
  const [geleidRemember, setGeleidRemember] = useState('')

  const [saving, setSaving] = useState(false)
  const [tutorialDismissed, setTutorialDismissed] = useState(false)

  const today = todayStr()
  const todayEntry = entries.find(e => e.date === today && !e.draft)

  // Sort entries newest first, exclude drafts in the list
  const sortedEntries = [...entries]
    .filter(e => !e.draft)
    .sort((a, b) => b.createdAt - a.createdAt)

  // Draft restore for free writing
  useEffect(() => {
    if (mode === 'schrijven') {
      if (editId) {
        const existing = entries.find(e => e.id === editId)
        if (existing) {
          setFreeText(existing.freeText ?? '')
          return
        }
      }
      setFreeText(loadDraft())
    }
  }, [mode, editId])

  // Word count
  useEffect(() => {
    const words = freeText.trim() ? freeText.trim().split(/\s+/).length : 0
    setWordCount(words)
  }, [freeText])

  // Autosave debounce for free writing
  useEffect(() => {
    if (mode !== 'schrijven') return
    const timer = setTimeout(async () => {
      if (!freeText.trim()) return
      await autoSaveFree(freeText)
    }, 2000)
    return () => clearTimeout(timer)
  }, [freeText, mode])

  const autoSaveFree = useCallback(async (text: string) => {
    saveDraftLocal(text)
    // Also persist as draft entry
    const now = Date.now()
    if (editId) {
      const existing = entries.find(e => e.id === editId)
      if (existing) {
        await saveJournalEntry({ ...existing, freeText: text, updatedAt: now })
        await refreshJournal()
      }
    } else {
      // check if there's already a vrij draft for today
      const existing = entries.find(e => e.date === today && e.type === 'vrij' && e.draft)
      if (existing) {
        await saveJournalEntry({ ...existing, freeText: text, updatedAt: now })
        await refreshJournal()
      } else {
        const newEntry: JournalEntry = {
          id: uid(),
          date: today,
          type: 'vrij',
          freeText: text,
          draft: true,
          createdAt: now,
          updatedAt: now,
        }
        await saveJournalEntry(newEntry)
        setEditId(newEntry.id)
        await refreshJournal()
      }
    }
    setSavedIndicator(true)
    setTimeout(() => setSavedIndicator(false), 1800)
  }, [editId, entries, today, refreshJournal])

  function openVrij() {
    setEditId(null)
    setMode('schrijven')
  }

  function openGeleid() {
    setGeleidMood(3)
    setGeleidEnergy(3)
    setGeleidStress(3)
    setGeleidWentWell('')
    setGeleidWasHard('')
    setGeleidRemember('')
    setEditId(null)
    setMode('geleid')
  }

  function openEditEntry(entry: JournalEntry) {
    setDetailEntry(null)
    if (entry.type === 'vrij') {
      setEditId(entry.id)
      setFreeText(entry.freeText ?? '')
      setMode('schrijven')
    } else {
      setEditId(entry.id)
      setGeleidMood(entry.mood ?? 3)
      setGeleidEnergy(entry.energy ?? 3)
      setGeleidStress(entry.stress ?? 3)
      setGeleidWentWell(entry.wentWell ?? '')
      setGeleidWasHard(entry.wasHard ?? '')
      setGeleidRemember(entry.rememberTomorrow ?? '')
      setMode('geleid')
    }
  }

  async function saveVrij() {
    if (!freeText.trim()) return
    setSaving(true)
    try {
      const now = Date.now()
      if (editId) {
        const existing = entries.find(e => e.id === editId)
        if (existing) {
          await saveJournalEntry({ ...existing, freeText: freeText.trim(), draft: false, updatedAt: now })
        }
      } else {
        const existingDraft = entries.find(e => e.date === today && e.type === 'vrij' && e.draft)
        if (existingDraft) {
          await saveJournalEntry({ ...existingDraft, freeText: freeText.trim(), draft: false, updatedAt: now })
        } else {
          await saveJournalEntry({
            id: uid(),
            date: today,
            type: 'vrij',
            freeText: freeText.trim(),
            draft: false,
            createdAt: now,
            updatedAt: now,
          })
        }
      }
      clearDraftLocal()
      await refreshJournal()
      setMode('lijst')
      setEditId(null)
      setFreeText('')
    } finally {
      setSaving(false)
    }
  }

  async function saveGeleid() {
    setSaving(true)
    try {
      const now = Date.now()
      if (editId) {
        const existing = entries.find(e => e.id === editId)
        if (existing) {
          await saveJournalEntry({
            ...existing,
            mood: geleidMood,
            energy: geleidEnergy,
            stress: geleidStress,
            wentWell: geleidWentWell.trim() || undefined,
            wasHard: geleidWasHard.trim() || undefined,
            rememberTomorrow: geleidRemember.trim() || undefined,
            draft: false,
            updatedAt: now,
          })
        }
      } else {
        await saveJournalEntry({
          id: uid(),
          date: today,
          type: 'geleid',
          mood: geleidMood,
          energy: geleidEnergy,
          stress: geleidStress,
          wentWell: geleidWentWell.trim() || undefined,
          wasHard: geleidWasHard.trim() || undefined,
          rememberTomorrow: geleidRemember.trim() || undefined,
          draft: false,
          createdAt: now,
          updatedAt: now,
        })
      }
      await refreshJournal()
      setMode('lijst')
      setEditId(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteEntry(id: string) {
    await deleteJournalEntry(id)
    await refreshJournal()
    setDetailEntry(null)
  }

  function backToList() {
    setMode('lijst')
    setEditId(null)
    setFreeText('')
  }

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

  // ── Render modes ────────────────────────────────────────────────────────────

  if (mode === 'schrijven') {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
      }}>
        {/* Header */}
        <div style={{
          padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          borderBottom: '1px solid var(--c-border)',
          background: 'var(--c-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={backToList}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-md)',
              color: 'var(--c-text-secondary)',
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              fontSize: 18,
              flexShrink: 0,
            }}
            aria-label="Terug"
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, color: 'var(--c-text-primary)', margin: 0 }}>
              {editId ? 'Notitie bewerken' : 'Vrij schrijven'}
            </h2>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 2 }}>
              {formatDutchDate(today)} · {wordCount} woord{wordCount !== 1 ? 'en' : ''}
              {savedIndicator && (
                <span style={{ marginLeft: 8, color: 'var(--c-success)' }}>· Opgeslagen</span>
              )}
            </div>
          </div>
          <button
            onClick={saveVrij}
            disabled={!freeText.trim() || saving}
            style={{
              padding: '8px 16px',
              background: freeText.trim() ? 'var(--g-accent)' : 'var(--c-surface2)',
              borderRadius: 'var(--r-md)',
              color: freeText.trim() ? 'white' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 600,
              flexShrink: 0,
              border: 'none',
              cursor: freeText.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
          >
            {saving ? '…' : 'Opslaan'}
          </button>
        </div>

        {/* Prompts */}
        <div style={{ padding: 'var(--sp-4) var(--sp-5) 0' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {JOURNAL_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setFreeText(prev => prev + (prev ? '\n\n' : '') + prompt + '\n')}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 'var(--r-full)',
                  border: '1px solid var(--c-border)',
                  background: 'var(--c-surface)',
                  color: 'var(--c-text-secondary)',
                  fontSize: 'var(--fs-xs)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div style={{ flex: 1, padding: 'var(--sp-4) var(--sp-5)' }}>
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder="Begin te schrijven…"
            autoFocus
            style={{
              ...inputBase,
              minHeight: 340,
              resize: 'vertical',
              lineHeight: 1.7,
              fontSize: 'var(--fs-base)',
              padding: 'var(--sp-4)',
            }}
          />
        </div>

        {/* Bottom save */}
        <div style={{ padding: '0 var(--sp-5) var(--sp-4)' }}>
          <button
            onClick={saveVrij}
            disabled={!freeText.trim() || saving}
            style={{
              width: '100%',
              padding: '13px',
              background: freeText.trim() ? 'var(--g-accent)' : 'var(--c-surface2)',
              borderRadius: 'var(--r-md)',
              color: freeText.trim() ? 'white' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-base)',
              fontWeight: 600,
              boxShadow: freeText.trim() ? 'var(--sh-accent)' : 'none',
              transition: 'all 0.15s',
              border: 'none',
              cursor: freeText.trim() ? 'pointer' : 'default',
            }}
          >
            {saving ? 'Opslaan…' : 'Opslaan & Sluiten'}
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'geleid') {
    return (
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
      }}>
        {/* Header */}
        <div style={{
          padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          borderBottom: '1px solid var(--c-border)',
          background: 'linear-gradient(180deg, var(--c-bg) 70%, transparent 100%)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={backToList}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-md)',
              color: 'var(--c-text-secondary)',
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              fontSize: 18,
              flexShrink: 0,
            }}
            aria-label="Terug"
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, color: 'var(--c-text-primary)', margin: 0 }}>
              {editId ? 'Check-in bewerken' : 'Geleide check-in'}
            </h2>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 2 }}>
              {formatDutchDate(today)}
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

          {/* Mood */}
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
          }}>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-text-primary)', marginBottom: 'var(--sp-3)' }}>
              Hoe voel je je vandaag?
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(v => (
                <MoodDot key={v} value={v} active={geleidMood === v} onClick={() => setGeleidMood(v)} />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
              {MOOD_LABELS[geleidMood]}
            </div>
          </div>

          {/* Energy + Stress sliders */}
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
          }}>
            <SliderInput
              label="Energieniveau"
              value={geleidEnergy}
              onChange={setGeleidEnergy}
              renderValue={v => <EnergyDot level={v} />}
            />
            <SliderInput
              label="Stressniveau"
              value={geleidStress}
              onChange={setGeleidStress}
              renderValue={v => <StressDot level={v} />}
            />
          </div>

          {/* Reflectie vragen */}
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
          }}>
            <div>
              <label style={fieldLabel}>Wat ging goed? ✨</label>
              <textarea
                value={geleidWentWell}
                onChange={e => setGeleidWentWell(e.target.value)}
                placeholder="Eén of meer dingen die positief waren…"
                rows={3}
                style={{ ...inputBase, resize: 'none' }}
              />
            </div>
            <div>
              <label style={fieldLabel}>Wat was moeilijk?</label>
              <textarea
                value={geleidWasHard}
                onChange={e => setGeleidWasHard(e.target.value)}
                placeholder="Wat vroeg meer van je dan verwacht…"
                rows={3}
                style={{ ...inputBase, resize: 'none' }}
              />
            </div>
            <div>
              <label style={fieldLabel}>Wat wil ik morgen onthouden?</label>
              <textarea
                value={geleidRemember}
                onChange={e => setGeleidRemember(e.target.value)}
                placeholder="Een inzicht, voornemen of gedachte voor morgen…"
                rows={3}
                style={{ ...inputBase, resize: 'none' }}
              />
            </div>
          </div>

          {/* Save */}
          <button
            onClick={saveGeleid}
            disabled={saving}
            style={{
              padding: '13px',
              background: 'var(--g-accent)',
              borderRadius: 'var(--r-md)',
              color: 'white',
              fontSize: 'var(--fs-base)',
              fontWeight: 600,
              width: '100%',
              boxShadow: 'var(--sh-accent)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {saving ? 'Opslaan…' : 'Opslaan'}
          </button>
        </div>
      </div>
    )
  }

  // ── Lijst mode ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
    }}>

      {/* Header */}
      <div style={{
        padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-4)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(180deg, var(--c-bg) 70%, transparent 100%)',
      }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 'var(--sp-1)' }}>
          Dagboek
        </h1>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', marginBottom: 'var(--sp-4)' }}>
          Jouw persoonlijke ruimte
        </p>

        {/* Mode buttons */}
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <button
            onClick={openVrij}
            style={{
              flex: 1,
              padding: '11px',
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-md)',
              color: 'var(--c-text-primary)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            ✏️ Vrij schrijven
          </button>
          <button
            onClick={openGeleid}
            style={{
              flex: 1,
              padding: '11px',
              background: 'var(--g-accent)',
              border: 'none',
              borderRadius: 'var(--r-md)',
              color: 'white',
              fontSize: 'var(--fs-sm)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: 'var(--sh-accent)',
            }}
          >
            📋 Geleide check-in
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
              Je dagboek, jouw manier
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
              <li>Schrijf vrij, zonder structuur of regels.</li>
              <li>Of gebruik een geleide check-in voor stemming, energie en stress.</li>
              <li>Alles wordt automatisch opgeslagen op je apparaat.</li>
            </ul>
          </div>
        )}

        {/* Today's entry preview */}
        {todayEntry && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(74,120,168,0.12), rgba(94,130,180,0.06))',
            border: '1px solid rgba(74,120,168,0.25)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>
                  {todayEntry.mood ? MOOD_EMOJIS[todayEntry.mood] : '📝'}
                </span>
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-baby-blue)' }}>
                  Vandaag
                </span>
              </div>
              <button
                onClick={() => openEditEntry(todayEntry)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--r-full)',
                  border: '1px solid rgba(74,120,168,0.3)',
                  background: 'rgba(74,120,168,0.1)',
                  color: 'var(--c-accent)',
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Bewerken
              </button>
            </div>
            {(todayEntry.energy !== undefined || todayEntry.stress !== undefined) && (
              <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>
                {todayEntry.energy !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Energie</span>
                    <EnergyDot level={todayEntry.energy} />
                  </div>
                )}
                {todayEntry.stress !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Stress</span>
                    <StressDot level={todayEntry.stress} />
                  </div>
                )}
              </div>
            )}
            {(todayEntry.freeText || todayEntry.wentWell) && (
              <p style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--c-text-secondary)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {snippet(todayEntry.freeText || todayEntry.wentWell, 80)}
              </p>
            )}
          </div>
        )}

        {/* Entry list */}
        {sortedEntries.length === 0 ? (
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
            <span style={{ fontSize: 36 }}>📔</span>
            <div style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-secondary)' }}>
              Je dagboek is nog leeg
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', maxWidth: 240, lineHeight: 1.6 }}>
              Schrijf je eerste notitie of doe een geleide check-in om te beginnen.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {sortedEntries.map(entry => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onTap={setDetailEntry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <BottomSheet
        open={!!detailEntry}
        onClose={() => setDetailEntry(null)}
        title={detailEntry ? formatDutchDate(detailEntry.date) : ''}
      >
        {detailEntry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

            {/* Mood + indicators */}
            {(detailEntry.mood || detailEntry.energy !== undefined || detailEntry.stress !== undefined) && (
              <div style={{
                background: 'var(--c-surface2)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-4)',
                display: 'flex',
                gap: 'var(--sp-5)',
                alignItems: 'center',
              }}>
                {detailEntry.mood && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 28 }}>{MOOD_EMOJIS[detailEntry.mood]}</span>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>{MOOD_LABELS[detailEntry.mood]}</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {detailEntry.energy !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 56 }}>Energie</span>
                      <EnergyDot level={detailEntry.energy} />
                    </div>
                  )}
                  {detailEntry.stress !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 56 }}>Stress</span>
                      <StressDot level={detailEntry.stress} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Free text */}
            {detailEntry.freeText && (
              <div style={{
                background: 'var(--c-surface2)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-4)',
              }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 8, fontWeight: 500 }}>Notitie</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {detailEntry.freeText}
                </p>
              </div>
            )}

            {/* Guided fields */}
            {detailEntry.wentWell && (
              <div style={{ background: 'var(--c-surface2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-success)', marginBottom: 6, fontWeight: 600 }}>Wat ging goed ✨</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {detailEntry.wentWell}
                </p>
              </div>
            )}
            {detailEntry.wasHard && (
              <div style={{ background: 'var(--c-surface2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 6, fontWeight: 500 }}>Wat was moeilijk</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {detailEntry.wasHard}
                </p>
              </div>
            )}
            {detailEntry.rememberTomorrow && (
              <div style={{ background: 'var(--c-surface2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-baby-blue)', marginBottom: 6, fontWeight: 500 }}>Voor morgen</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {detailEntry.rememberTomorrow}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button
                onClick={() => openEditEntry(detailEntry)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--c-surface2)',
                  border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--c-text-primary)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Bewerken
              </button>
              <button
                onClick={() => handleDeleteEntry(detailEntry.id)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--c-text-muted)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Verwijderen
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
