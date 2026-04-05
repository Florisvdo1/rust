import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../../store/AppContext'
import { savePlaceItem, deletePlaceItem, PlaceItem } from '../../db'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TutorialCard } from '../../components/ui/TutorialCard'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ─── Room definitions ────────────────────────────────────────────────────────

const ROOMS: { id: string; label: string; path: string }[] = [
  {
    id: 'woonkamer',
    label: 'Woonkamer',
    path: 'M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z M9 21V12h6v9',
  },
  {
    id: 'badkamer',
    label: 'Badkamer',
    path: 'M7 7h10v8a2 2 0 01-2 2H9a2 2 0 01-2-2V7z M5 7h14 M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2',
  },
  {
    id: 'slaapkamer',
    label: 'Slaapkamer',
    path: 'M2 20v-7a2 2 0 012-2h16a2 2 0 012 2v7 M2 13V9a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2v4',
  },
  {
    id: 'keuken',
    label: 'Keuken',
    path: 'M3 3h18v4H3z M3 7v13 M21 7v13 M8 7v3a1 1 0 002 0V7 M14 7v3a1 1 0 002 0V7 M3 17h18',
  },
  {
    id: 'hal',
    label: 'Hal',
    path: 'M13 3h8v18h-8 M3 3h10 M3 21h10 M3 3v18 M9 9v6',
  },
  {
    id: 'werkplek',
    label: 'Werkplek',
    path: 'M2 17h20v2H2z M4 17V9a1 1 0 011-1h14a1 1 0 011 1v8 M8 21h8 M12 17v4',
  },
  {
    id: 'wasruimte',
    label: 'Wasruimte',
    path: 'M3 6h18v15H3z M3 6a3 3 0 016 0 M12 13.5a3 3 0 100-6 3 3 0 000 6z M7 6v1',
  },
  {
    id: 'kast',
    label: 'Kast',
    path: 'M3 3h18v18H3z M12 3v18 M3 9h18 M3 15h18',
  },
  {
    id: 'tafel',
    label: 'Tafel',
    path: 'M2 10h20 M6 10v8 M18 10v8 M4 10V7h16v3',
  },
  {
    id: 'lade',
    label: 'Lade',
    path: 'M2 6h20v5H2z M2 11h20v5H2z M2 16h20v5H2z M10 9h4 M10 14h4 M10 19h4',
  },
  {
    id: 'bank',
    label: 'Bank',
    path: 'M2 14h20v5H2z M2 14v-2a2 2 0 012-2h16a2 2 0 012 2v2 M4 19v2 M20 19v2 M6 10V8a2 2 0 012-2h8a2 2 0 012 2v2',
  },
  {
    id: 'tv-meubel',
    label: 'Tv-meubel',
    path: 'M2 8h20v10H2z M8 18v3 M16 18v3 M5 18h14 M2 8L5 4h14l3 4',
  },
  {
    id: 'bureau',
    label: 'Bureau',
    path: 'M2 14h20v5H2z M4 19v2 M20 19v2 M8 14V8a1 1 0 011-1h6a1 1 0 011 1v6',
  },
  {
    id: 'keukenkastje',
    label: 'Keukenkastje',
    path: 'M3 4h18v7H3z M3 11h18v9H3z M12 4v7 M12 11v9 M9 7.5h2 M13 7.5h2 M9 15.5h2 M13 15.5h2',
  },
]

function getRoomDef(id: string) {
  return ROOMS.find(r => r.id === id) ?? ROOMS[0]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoomIcon({ roomId, size = 18, color = 'currentColor' }: { roomId: string; size?: number; color?: string }) {
  const room = getRoomDef(roomId)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={room.path} />
    </svg>
  )
}

function CameraIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

// ─── Image card ───────────────────────────────────────────────────────────────

interface PlaceCardProps {
  item: PlaceItem
  onTap: (item: PlaceItem) => void
}

function PlaceCard({ item, onTap }: PlaceCardProps) {
  return (
    <button
      onClick={() => onTap(item)}
      style={{
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Image area */}
      <div style={{
        width: '100%',
        background: 'var(--c-surface2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        maxHeight: 160,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {item.imageData ? (
          <img
            src={item.imageData}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: 160,
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            color: 'var(--c-text-muted)',
            padding: 'var(--sp-5)',
          }}>
            <CameraIcon size={28} />
            <span style={{ fontSize: 'var(--fs-xs)' }}>Voeg foto toe</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: 'var(--sp-3)', flex: 1 }}>
        <div style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          color: 'var(--c-text-primary)',
          marginBottom: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.title}
        </div>
        {item.label && (
          <div style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--c-text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.label}
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--c-surface2)',
  border: '1px solid var(--c-border)',
  borderRadius: 'var(--r-md)',
  padding: '10px 14px',
  fontSize: 'var(--fs-sm)',
  color: 'var(--c-text-primary)',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--fs-xs)',
  color: 'var(--c-text-muted)',
  marginBottom: 6,
  display: 'block',
  fontWeight: 500,
}

// ─── Main screen ──────────────────────────────────────────────────────────────

interface FormState {
  title: string
  room: string
  subzone: string
  label: string
  notes: string
  tags: string
  imageData: string
}

const emptyForm = (): FormState => ({
  title: '',
  room: ROOMS[0].id,
  subzone: '',
  label: '',
  notes: '',
  tags: '',
  imageData: '',
})

export default function Plaatsen() {
  const { state, refreshPlaces } = useApp()
  const places = state.places

  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PlaceItem | null>(null)
  const [detailItem, setDetailItem] = useState<PlaceItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRoom, setActiveRoom] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // Derived: rooms that have items
  const occupiedRooms = Array.from(new Set(places.map(p => p.room))).filter(Boolean)

  // Filtered items
  const filtered = places.filter(item => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.label.toLowerCase().includes(q) ||
      (item.notes ?? '').toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    const matchesRoom = !activeRoom || item.room === activeRoom
    return matchesSearch && matchesRoom
  })

  // Group filtered items by room
  const grouped = filtered.reduce<Record<string, PlaceItem[]>>((acc, item) => {
    if (!acc[item.room]) acc[item.room] = []
    acc[item.room].push(item)
    return acc
  }, {})

  const groupedRooms = Object.keys(grouped).sort()

  function openAdd(prefillRoom?: string) {
    setForm({ ...emptyForm(), room: prefillRoom ?? ROOMS[0].id })
    setEditItem(null)
    setShowAdd(true)
  }

  function openEdit(item: PlaceItem) {
    setForm({
      title: item.title,
      room: item.room,
      subzone: item.subzone ?? '',
      label: item.label,
      notes: item.notes ?? '',
      tags: item.tags.join(', '),
      imageData: item.imageData ?? '',
    })
    setEditItem(item)
    setDetailItem(null)
    setShowAdd(true)
  }

  function handleFormChange(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleImageFile(file: File, isEdit: boolean) {
    const reader = new FileReader()
    reader.onload = e => {
      const data = e.target?.result as string
      if (isEdit) {
        setForm(prev => ({ ...prev, imageData: data }))
      } else {
        setForm(prev => ({ ...prev, imageData: data }))
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      if (editItem) {
        await savePlaceItem({
          ...editItem,
          title: form.title.trim(),
          room: form.room,
          subzone: form.subzone.trim() || undefined,
          label: form.label.trim(),
          notes: form.notes.trim() || undefined,
          tags,
          imageData: form.imageData || undefined,
          updatedAt: Date.now(),
        })
      } else {
        await savePlaceItem({
          id: uid(),
          title: form.title.trim(),
          room: form.room,
          subzone: form.subzone.trim() || undefined,
          label: form.label.trim(),
          notes: form.notes.trim() || undefined,
          tags,
          imageData: form.imageData || undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
      }
      await refreshPlaces()
      setShowAdd(false)
      setEditItem(null)
      setForm(emptyForm())
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await deletePlaceItem(id)
    await refreshPlaces()
    setDetailItem(null)
    setDeleteConfirm(false)
  }

  function closeSheet() {
    setShowAdd(false)
    setEditItem(null)
    setForm(emptyForm())
  }

  function closeDetail() {
    setDetailItem(null)
    setDeleteConfirm(false)
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 'calc(var(--nav-h) + var(--sp-8) + var(--safe-bottom))',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: 'calc(var(--sp-6) + var(--safe-top)) var(--sp-5) var(--sp-3)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(180deg, var(--c-bg) 70%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--c-text-primary)', margin: 0 }}>
              Plaatsen
            </h1>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', margin: '2px 0 0' }}>
              Visueel geheugen voor spullen
            </p>
          </div>
          <button
            onClick={() => openAdd()}
            aria-label="Voeg locatie toe"
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
            }}
          >
            <PlusIcon size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--c-text-muted)',
            pointerEvents: 'none',
            display: 'flex',
          }}>
            <SearchIcon />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Zoek op naam, label of tag…"
            style={{ ...inputStyle, paddingLeft: 38, background: 'var(--c-surface)' }}
          />
        </div>
      </div>

      <div style={{ padding: '0 var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        {/* Tutorial */}
        <TutorialCard
          title="Leg op met foto waar spullen liggen"
          why="Nooit meer zoeken naar je sleutels, medicijnen of documenten. Voeg een foto toe en wijs de kamer aan."
          steps={[
            "Tik op + om een locatie toe te voegen",
            "Kies de kamer en voeg een foto toe",
            "Geef het een naam en label",
            "Gebruik de zoekbalk om snel te vinden",
          ]}
          example="Paspoort → Slaapkamer, bovenste lade, blauwe map"
          firstAction="Voeg eerste locatie toe"
          onAction={() => openAdd()}
        />

        {/* Room filter tabs */}
        {occupiedRooms.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 'var(--sp-2)',
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            <button
              onClick={() => setActiveRoom('')}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 'var(--r-full)',
                fontSize: 'var(--fs-sm)',
                fontWeight: activeRoom === '' ? 600 : 400,
                background: activeRoom === '' ? 'var(--c-accent)' : 'var(--c-surface)',
                color: activeRoom === '' ? 'white' : 'var(--c-text-secondary)',
                border: `1px solid ${activeRoom === '' ? 'var(--c-accent)' : 'var(--c-border)'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              Alles
            </button>
            {occupiedRooms.map(roomId => {
              const def = getRoomDef(roomId)
              const isActive = activeRoom === roomId
              return (
                <button
                  key={roomId}
                  onClick={() => setActiveRoom(roomId)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: 'var(--r-full)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? 'var(--c-accent)' : 'var(--c-surface)',
                    color: isActive ? 'white' : 'var(--c-text-secondary)',
                    border: `1px solid ${isActive ? 'var(--c-accent)' : 'var(--c-border)'}`,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <RoomIcon roomId={roomId} size={14} color={isActive ? 'white' : 'var(--c-text-muted)'} />
                  {def.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Content */}
        {places.length === 0 ? (
          // Empty state
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
              <CameraIcon size={40} />
            </div>
            <div style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-secondary)' }}>
              Nog geen locaties opgeslagen
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', maxWidth: 260, lineHeight: 1.6 }}>
              Voeg foto's toe van waar je spullen bewaart. Zo vind je ze altijd terug.
            </div>
            <button
              onClick={() => openAdd()}
              style={{
                marginTop: 'var(--sp-2)',
                padding: '10px 20px',
                background: 'var(--g-accent)',
                borderRadius: 'var(--r-md)',
                color: 'white',
                fontSize: 'var(--fs-sm)',
                fontWeight: 600,
                boxShadow: 'var(--sh-accent)',
              }}
            >
              Eerste locatie toevoegen
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--sp-8)',
            textAlign: 'center',
            color: 'var(--c-text-muted)',
            fontSize: 'var(--fs-sm)',
          }}>
            Geen resultaten gevonden
          </div>
        ) : (
          // Grouped rooms
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {groupedRooms.map(roomId => {
              const items = grouped[roomId]
              const def = getRoomDef(roomId)
              return (
                <div key={roomId}>
                  {/* Room header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--sp-3)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--r-md)',
                        background: 'rgba(74,120,168,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--c-accent)',
                      }}>
                        <RoomIcon roomId={roomId} size={16} color="var(--c-accent)" />
                      </div>
                      <span style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--c-text-primary)' }}>
                        {def.label}
                      </span>
                      <span style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--c-text-muted)',
                        background: 'var(--c-surface)',
                        border: '1px solid var(--c-border)',
                        borderRadius: 'var(--r-full)',
                        padding: '1px 8px',
                      }}>
                        {items.length}
                      </span>
                    </div>
                    <button
                      onClick={() => openAdd(roomId)}
                      aria-label={`Toevoegen aan ${def.label}`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--r-md)',
                        background: 'rgba(74,120,168,0.12)',
                        border: '1px solid rgba(74,120,168,0.2)',
                        color: 'var(--c-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>

                  {/* 2-column grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--sp-3)',
                  }}>
                    {items.map(item => (
                      <PlaceCard key={item.id} item={item} onTap={setDetailItem} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit BottomSheet ── */}
      <BottomSheet
        open={showAdd}
        onClose={closeSheet}
        title={editItem ? 'Locatie bewerken' : 'Locatie toevoegen'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

          {/* Image upload */}
          <div>
            <label style={labelStyle}>Foto</label>
            <div
              onClick={() => (editItem ? editFileInputRef : fileInputRef).current?.click()}
              style={{
                width: '100%',
                minHeight: form.imageData ? 'auto' : 120,
                borderRadius: 'var(--r-lg)',
                border: `2px dashed ${form.imageData ? 'var(--c-border)' : 'rgba(74,120,168,0.3)'}`,
                background: 'var(--c-surface2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {form.imageData ? (
                <img
                  src={form.imageData}
                  alt="Preview"
                  style={{ width: '100%', objectFit: 'contain', maxHeight: 200, display: 'block' }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--c-text-muted)',
                  padding: 'var(--sp-5)',
                }}>
                  <CameraIcon size={32} />
                  <span style={{ fontSize: 'var(--fs-sm)' }}>Tik om foto te kiezen</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageFile(file, false)
              }}
            />
            <input
              ref={editFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageFile(file, true)
              }}
            />
            {form.imageData && (
              <button
                onClick={() => handleFormChange('imageData', '')}
                style={{
                  marginTop: 8,
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--c-text-muted)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Foto verwijderen
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Naam *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleFormChange('title', e.target.value)}
              placeholder="Bijv. Paspoort"
              style={inputStyle}
            />
          </div>

          {/* Room select */}
          <div>
            <label style={labelStyle}>Kamer</label>
            <select
              value={form.room}
              onChange={e => handleFormChange('room', e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              {ROOMS.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Subzone */}
          <div>
            <label style={labelStyle}>Precieze plek (optioneel)</label>
            <input
              type="text"
              value={form.subzone}
              onChange={e => handleFormChange('subzone', e.target.value)}
              placeholder="Bijv. Bovenste lade, blauwe map"
              style={inputStyle}
            />
          </div>

          {/* Label */}
          <div>
            <label style={labelStyle}>Label</label>
            <input
              type="text"
              value={form.label}
              onChange={e => handleFormChange('label', e.target.value)}
              placeholder="Bijv. Reisdocumenten"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notitie</label>
            <textarea
              value={form.notes}
              onChange={e => handleFormChange('notes', e.target.value)}
              placeholder="Extra informatie…"
              rows={3}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags (komma gescheiden)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => handleFormChange('tags', e.target.value)}
              placeholder="Bijv. administratie, belangrijk"
              style={inputStyle}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!form.title.trim() || saving}
            style={{
              padding: '13px',
              background: form.title.trim() ? 'var(--g-accent)' : 'var(--c-surface2)',
              borderRadius: 'var(--r-md)',
              color: form.title.trim() ? 'white' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-base)',
              fontWeight: 600,
              width: '100%',
              boxShadow: form.title.trim() ? 'var(--sh-accent)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {saving ? 'Opslaan…' : editItem ? 'Wijzigingen opslaan' : 'Toevoegen'}
          </button>
        </div>
      </BottomSheet>

      {/* ── Detail BottomSheet ── */}
      <BottomSheet
        open={!!detailItem}
        onClose={closeDetail}
        title={detailItem?.title ?? ''}
      >
        {detailItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

            {/* Full image */}
            {detailItem.imageData && (
              <div style={{
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                background: 'var(--c-surface2)',
                border: '1px solid var(--c-border)',
              }}>
                <img
                  src={detailItem.imageData}
                  alt={detailItem.title}
                  style={{ width: '100%', objectFit: 'contain', display: 'block', maxHeight: 280 }}
                />
              </div>
            )}

            {/* Meta */}
            <div style={{
              background: 'var(--c-surface2)',
              border: '1px solid var(--c-border)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--sp-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 64 }}>Kamer</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RoomIcon roomId={detailItem.room} size={14} color="var(--c-accent)" />
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-primary)' }}>
                    {getRoomDef(detailItem.room).label}
                  </span>
                </div>
              </div>
              {detailItem.subzone && (
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 64 }}>Plek</span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-primary)' }}>{detailItem.subzone}</span>
                </div>
              )}
              {detailItem.label && (
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 64 }}>Label</span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-primary)' }}>{detailItem.label}</span>
                </div>
              )}
              {detailItem.notes && (
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 64 }}>Notitie</span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>{detailItem.notes}</span>
                </div>
              )}
              {detailItem.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', minWidth: 64 }}>Tags</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {detailItem.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--c-baby-blue)',
                          background: 'rgba(74,120,168,0.12)',
                          border: '1px solid rgba(74,120,168,0.2)',
                          borderRadius: 'var(--r-full)',
                          padding: '2px 8px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button
                onClick={() => openEdit(detailItem)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--c-surface2)',
                  border: '1px solid var(--c-border)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--c-text-primary)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <EditIcon /> Bewerken
              </button>

              {deleteConfirm ? (
                <button
                  onClick={() => handleDelete(detailItem.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(160,64,64,0.2)',
                    border: '1px solid rgba(200,80,80,0.35)',
                    borderRadius: 'var(--r-md)',
                    color: '#e07070',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Bevestig verwijderen
                </button>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid var(--c-border)',
                    borderRadius: 'var(--r-md)',
                    color: 'var(--c-text-muted)',
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <TrashIcon /> Verwijderen
                </button>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
