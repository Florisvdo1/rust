import React, { useState, useCallback } from 'react'
import { useApp } from '../../store/AppContext'
import { saveRememberItem, deleteRememberItem, RememberItem } from '../../db'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

const CATEGORIES = ['Gezondheid', 'Administratie', 'Thuis', 'Werk', 'Sociaal', 'Overig'] as const
type Category = typeof CATEGORIES[number]
type FilterType = 'alles' | 'open' | 'klaar' | 'gepind'
type Urgency = 'laag' | 'normaal' | 'hoog'

function urgencyColor(urgency: Urgency): string {
  if (urgency === 'hoog') return 'rgba(160,64,64,0.22)'
  if (urgency === 'laag') return 'rgba(60,80,100,0.30)'
  return 'transparent'
}

function urgencyBorderColor(urgency: Urgency): string {
  if (urgency === 'hoog') return 'rgba(200,80,80,0.35)'
  if (urgency === 'laag') return 'rgba(74,120,168,0.25)'
  return 'var(--c-border)'
}

function urgencyLabel(urgency: Urgency): string {
  if (urgency === 'hoog') return 'Hoog'
  if (urgency === 'laag') return 'Laag'
  return 'Normaal'
}

function urgencyTextColor(urgency: Urgency): string {
  if (urgency === 'hoog') return '#e07070'
  if (urgency === 'laag') return 'var(--c-text-muted)'
  return 'var(--c-text-secondary)'
}

interface UrgencyButtonProps {
  value: Urgency
  selected: boolean
  onClick: () => void
}
function UrgencyButton({ value, selected, onClick }: UrgencyButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--sp-1) var(--sp-3)',
        borderRadius: 'var(--r-full)',
        fontSize: 'var(--fs-xs)',
        fontWeight: 500,
        border: `1px solid ${selected ? urgencyBorderColor(value) : 'var(--c-border)'}`,
        background: selected ? urgencyColor(value) : 'transparent',
        color: selected ? urgencyTextColor(value) : 'var(--c-text-muted)',
        transition: 'all var(--t-base)',
      }}
    >
      {urgencyLabel(value)}
    </button>
  )
}

interface RememberCardProps {
  item: RememberItem
  onToggleDone: (item: RememberItem) => void
  onTogglePin: (item: RememberItem) => void
  onDelete: (id: string) => void
  onTaakNaarPlanner: () => void
}
function RememberCard({ item, onToggleDone, onTogglePin, onDelete, onTaakNaarPlanner }: RememberCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div style={{
      background: item.done
        ? 'linear-gradient(135deg, rgba(26,39,64,0.5), rgba(30,46,72,0.5))'
        : `linear-gradient(135deg, ${urgencyColor(item.urgency) || 'var(--c-surface)'} 0%, var(--c-surface2) 100%)`,
      border: `1px solid ${item.done ? 'var(--c-border)' : urgencyBorderColor(item.urgency)}`,
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-4)',
      opacity: item.done ? 0.7 : 1,
      transition: 'all var(--t-base)',
    }}>
      <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
        {/* Done toggle */}
        <button
          onClick={() => onToggleDone(item)}
          style={{
            flexShrink: 0, marginTop: 2,
            width: 22, height: 22,
            borderRadius: 'var(--r-full)',
            border: `2px solid ${item.done ? 'var(--c-success)' : 'var(--c-border2)'}`,
            background: item.done ? 'var(--c-success)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--t-base)',
          }}
          aria-label={item.done ? 'Markeer als open' : 'Markeer als klaar'}
        >
          {item.done && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 'var(--fs-base)',
            color: item.done ? 'var(--c-text-muted)' : 'var(--c-text-primary)',
            textDecoration: item.done ? 'line-through' : 'none',
            lineHeight: 1.5,
            wordBreak: 'break-word',
            marginBottom: 'var(--sp-2)',
          }}>
            {item.text}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
            {item.urgency !== 'normaal' && (
              <span style={{
                fontSize: 'var(--fs-xs)', fontWeight: 500,
                color: urgencyTextColor(item.urgency),
                background: urgencyColor(item.urgency),
                border: `1px solid ${urgencyBorderColor(item.urgency)}`,
                borderRadius: 'var(--r-full)',
                padding: '2px var(--sp-2)',
              }}>
                {urgencyLabel(item.urgency)}
              </span>
            )}
            <span style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--c-text-muted)',
              background: 'rgba(42,61,90,0.5)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-full)',
              padding: '2px var(--sp-2)',
            }}>
              {item.category}
            </span>
          </div>

          {/* Actions row */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Planner button */}
            <button
              onClick={onTaakNaarPlanner}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '3px var(--sp-3)',
                background: 'rgba(74,120,168,0.12)',
                border: '1px solid rgba(74,120,168,0.25)',
                borderRadius: 'var(--r-full)',
                color: 'var(--c-accent)',
                fontSize: 'var(--fs-xs)', fontWeight: 500,
                transition: 'all var(--t-base)',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Naar planner
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', flexShrink: 0 }}>
          {/* Pin */}
          <button
            onClick={() => onTogglePin(item)}
            aria-label={item.pinned ? 'Ontpin' : 'Pin'}
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--r-sm)',
              color: item.pinned ? '#f0c040' : 'var(--c-text-muted)',
              background: item.pinned ? 'rgba(240,192,64,0.1)' : 'transparent',
              transition: 'all var(--t-base)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={item.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>

          {/* Delete */}
          {confirmDelete ? (
            <button
              onClick={() => onDelete(item.id)}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--r-sm)',
                color: '#e07070',
                background: 'rgba(160,64,64,0.2)',
                fontSize: 'var(--fs-xs)', fontWeight: 700,
              }}
              aria-label="Bevestig verwijderen"
            >
              ✓
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              onBlur={() => setTimeout(() => setConfirmDelete(false), 200)}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--r-sm)',
                color: 'var(--c-text-muted)',
                background: 'transparent',
                fontSize: 18, lineHeight: 1,
                transition: 'all var(--t-base)',
              }}
              aria-label="Verwijder item"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const FILTER_LABELS: Record<FilterType, string> = {
  alles: 'Alles',
  open: 'Open',
  klaar: 'Klaar',
  gepind: 'Gepind',
}

export default function Onthouden() {
  const { state, setTab, refreshRemember } = useApp()
  const items = state.remember

  const [filter, setFilter] = useState<FilterType>('alles')
  const [search, setSearch] = useState('')
  const [newText, setNewText] = useState('')
  const [newUrgency, setNewUrgency] = useState<Urgency>('normaal')
  const [newCategory, setNewCategory] = useState<Category>('Overig')
  const [tutorialDismissed, setTutorialDismissed] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const filtered = items
    .filter(item => {
      if (filter === 'open') return !item.done
      if (filter === 'klaar') return item.done
      if (filter === 'gepind') return item.pinned
      return true
    })
    .filter(item =>
      search.trim() === '' ||
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned first, then by creation date desc
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.createdAt - a.createdAt
    })

  const handleAdd = useCallback(async () => {
    const text = newText.trim()
    if (!text) return
    await saveRememberItem({
      id: uid(),
      text,
      urgency: newUrgency,
      category: newCategory,
      done: false,
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await refreshRemember()
    setNewText('')
    setNewUrgency('normaal')
    setNewCategory('Overig')
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 1800)
  }, [newText, newUrgency, newCategory, refreshRemember])

  const handleToggleDone = useCallback(async (item: RememberItem) => {
    await saveRememberItem({ ...item, done: !item.done })
    await refreshRemember()
  }, [refreshRemember])

  const handleTogglePin = useCallback(async (item: RememberItem) => {
    await saveRememberItem({ ...item, pinned: !item.pinned })
    await refreshRemember()
  }, [refreshRemember])

  const handleDelete = useCallback(async (id: string) => {
    await deleteRememberItem(id)
    await refreshRemember()
  }, [refreshRemember])

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-4)',
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(180deg, var(--c-bg) 70%, transparent 100%)',
      }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 'var(--sp-1)' }}>
          Onthouden
        </h1>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
          Leg snel vast wat je niet wilt vergeten
        </p>
      </div>

      <div style={{ padding: '0 var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        {/* Tutorial card */}
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
                position: 'absolute', top: 'var(--sp-3)', right: 'var(--sp-3)',
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--r-full)',
                color: 'var(--c-text-muted)',
                fontSize: 18, lineHeight: 1,
                background: 'rgba(42,61,90,0.4)',
              }}
              aria-label="Sluit uitleg"
            >
              ×
            </button>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-baby-blue)', marginBottom: 'var(--sp-2)' }}>
              Hoe werkt Onthouden?
            </div>
            <ul style={{
              fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)',
              paddingLeft: 'var(--sp-4)', lineHeight: 1.7,
              display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)',
              listStyle: 'disc',
            }}>
              <li>Typ snel iets wat je wilt onthouden en tik op <strong>Voeg toe</strong>.</li>
              <li>Kies een urgentie (Laag / Normaal / Hoog) en categorie.</li>
              <li>Pin belangrijke items met de ster.</li>
              <li>Klaar? Vink het item af of stuur het naar de planner.</li>
            </ul>
          </div>
        )}

        {/* Quick add */}
        <div style={{
          background: 'var(--g-card)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-4)',
          display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)',
        }}>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() } }}
            placeholder="Wat wil je onthouden?"
            rows={2}
            style={{ fontSize: 'var(--fs-base)', resize: 'none' }}
          />

          {/* Urgency */}
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 'var(--sp-2)' }}>
              Urgentie
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {(['laag', 'normaal', 'hoog'] as Urgency[]).map(u => (
                <UrgencyButton key={u} value={u} selected={newUrgency === u} onClick={() => setNewUrgency(u)} />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 'var(--sp-2)' }}>
              Categorie
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  style={{
                    padding: '3px var(--sp-3)',
                    borderRadius: 'var(--r-full)',
                    fontSize: 'var(--fs-xs)',
                    border: `1px solid ${newCategory === cat ? 'var(--c-accent)' : 'var(--c-border)'}`,
                    background: newCategory === cat ? 'rgba(104,150,200,0.18)' : 'transparent',
                    color: newCategory === cat ? 'var(--c-accent)' : 'var(--c-text-muted)',
                    transition: 'all var(--t-base)',
                    fontWeight: newCategory === cat ? 600 : 400,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            style={{
              padding: 'var(--sp-3)',
              background: newText.trim() ? 'var(--g-accent)' : 'var(--c-surface3)',
              borderRadius: 'var(--r-md)',
              color: newText.trim() ? 'white' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-base)', fontWeight: 600,
              boxShadow: newText.trim() ? 'var(--sh-accent)' : 'none',
              transition: 'all var(--t-base)',
            }}
          >
            {addSuccess ? '✓ Opgeslagen' : 'Voeg toe'}
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex', gap: 'var(--sp-1)',
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-1)',
        }}>
          {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: 'var(--sp-2)',
                borderRadius: 'var(--r-md)',
                fontSize: 'var(--fs-sm)', fontWeight: filter === f ? 600 : 400,
                background: filter === f ? 'var(--c-surface2)' : 'transparent',
                color: filter === f ? 'var(--c-text-primary)' : 'var(--c-text-muted)',
                transition: 'all var(--t-base)',
                boxShadow: filter === f ? 'var(--sh-sm)' : 'none',
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--c-text-muted)" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Zoek in items…"
            style={{ paddingLeft: 36, fontSize: 'var(--fs-sm)' }}
          />
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', textAlign: 'right' }}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </div>
        )}

        {/* Items list */}
        {filtered.length === 0 ? (
          <div style={{
            background: 'var(--g-card)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-8)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-3)' }}>
              {search ? '🔍' : filter === 'gepind' ? '⭐' : filter === 'klaar' ? '✅' : '🗒️'}
            </div>
            <div style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-secondary)', marginBottom: 'var(--sp-2)' }}>
              {search
                ? 'Geen items gevonden voor deze zoekopdracht'
                : filter === 'gepind'
                  ? 'Je hebt nog niets gepind'
                  : filter === 'klaar'
                    ? 'Nog niets afgevinkt'
                    : filter === 'open'
                      ? 'Niets meer te doen'
                      : 'Voeg je eerste item toe hierboven'}
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  marginTop: 'var(--sp-2)',
                  padding: 'var(--sp-2) var(--sp-4)',
                  background: 'var(--c-surface3)',
                  borderRadius: 'var(--r-full)',
                  color: 'var(--c-text-secondary)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                Zoekopdracht wissen
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {filtered.map(item => (
              <RememberCard
                key={item.id}
                item={item}
                onToggleDone={handleToggleDone}
                onTogglePin={handleTogglePin}
                onDelete={handleDelete}
                onTaakNaarPlanner={() => setTab('planner')}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
