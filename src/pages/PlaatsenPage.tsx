import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { supabase } from '@/lib/supabase'

const ROOMS = [
  'Woonkamer', 'Slaapkamer', 'Keuken', 'Badkamer', 'Kantoor', 'Gang',
  'Berging', 'Auto', 'Tas', 'Jas', 'Broek', 'Rugzak',
  'Portemonnee', 'Fiets', 'Scooter', 'Schuur', 'Balkon', 'Tuin',
  'Toilet', 'Wasruimte', 'Meterkast', 'Nachtkastje', 'Bureau',
  'Bank', 'Kast', 'Lade', 'Plank', 'Kapstok', 'Sleutels', 'Anders',
]

export const PlaatsenPage: React.FC = () => {
  const { places, addPlace, updatePlace, removePlace, user } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Form fields
  const [room, setRoom] = useState('Woonkamer')
  const [objectLabel, setObjectLabel] = useState('')
  const [wherePrecisely, setWherePrecisely] = useState('')
  const [subzone, setSubzone] = useState('')
  const [container, setContainer] = useState('')
  const [position, setPosition] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterRoom, setFilterRoom] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    let list = places
    if (filterRoom) list = list.filter(p => p.room === filterRoom)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.objectLabel.toLowerCase().includes(q) ||
        p.room.toLowerCase().includes(q) ||
        (p.subzone?.toLowerCase().includes(q)) ||
        (p.wherePrecisely?.toLowerCase().includes(q)) ||
        (p.notes?.toLowerCase().includes(q))
      )
    }
    return list
  }, [places, filterRoom, search])

  const resetForm = () => {
    setObjectLabel(''); setWherePrecisely(''); setSubzone(''); setContainer('')
    setPosition(''); setNotes(''); setRoom('Woonkamer'); setImageUrl('')
    setImagePreview(null); setEditId(null); setShowAdd(false)
    setUploadError(null); setUploading(false); setSaveState('idle')
  }

  const openAdd = (preselectedRoom?: string) => {
    resetForm()
    if (preselectedRoom) setRoom(preselectedRoom)
    setShowAdd(true)
  }

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to Supabase storage when logged in
    if (supabase && user) {
      setUploading(true)
      try {
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `${user.id}/places/${Date.now()}.${ext}`
        const { error } = await supabase.storage
          .from('user-photos')
          .upload(path, file, { upsert: true })
        if (error) {
          setUploadError('Foto als preview opgeslagen. Cloud upload mislukt.')
        } else {
          const { data: urlData } = supabase.storage
            .from('user-photos')
            .getPublicUrl(path)
          setImageUrl(urlData.publicUrl)
        }
      } catch {
        setUploadError('Foto als preview opgeslagen. Cloud upload mislukt.')
      }
      setUploading(false)
    } else if (!user) {
      setUploadError('Niet ingelogd — foto alleen lokaal opgeslagen als preview.')
    }
  }

  const handleSave = async () => {
    if (!objectLabel.trim()) return
    setSaveState('saving')
    const finalImageUrl = imageUrl || imagePreview || ''

    try {
      if (editId) {
        updatePlace(editId, { room, objectLabel, wherePrecisely, subzone, container, position, notes, imageUrl: finalImageUrl })
      } else {
        addPlace({ room, objectLabel, wherePrecisely, subzone, container, position, notes, imageUrl: finalImageUrl })
      }
      setSaveState('saved')
      setTimeout(resetForm, 600)
    } catch {
      setSaveState('error')
    }
  }

  const startEdit = (p: typeof places[0]) => {
    setEditId(p.id); setRoom(p.room); setObjectLabel(p.objectLabel)
    setWherePrecisely(p.wherePrecisely || ''); setSubzone(p.subzone || '')
    setContainer(p.container || ''); setPosition(p.position || '')
    setNotes(p.notes || ''); setImageUrl(p.imageUrl || '')
    setImagePreview(p.imageUrl || null); setSaveState('idle')
    setShowAdd(true)
  }

  const roomCounts = useMemo(() => {
    const c: Record<string, number> = {}
    places.forEach(p => { c[p.room] = (c[p.room] || 0) + 1 })
    return c
  }, [places])

  const saveLabel = saveState === 'saving' ? 'Bezig...' :
    saveState === 'saved' ? (uploadError ? 'Lokaal opgeslagen (foto niet in cloud)' : 'Opgeslagen ✓') :
    saveState === 'error' ? 'Kon niet opslaan' :
    uploading ? 'Foto wordt geüpload...' :
    editId ? 'Opslaan' : 'Toevoegen'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <PageHeader title="Plaatsen" subtitle="Waar heb ik het gelaten?" />

      <div style={{ padding: '0 var(--space-lg)', marginBottom: 10, flexShrink: 0 }}>
        <input type="text" placeholder="Zoek voorwerp of plek..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input-field" />
      </div>

      {/* Room filters */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 var(--space-lg)',
        marginBottom: 10, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', flexShrink: 0,
      }}>
        <button onClick={() => setFilterRoom(null)} style={{
          padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12,
          fontWeight: !filterRoom ? 700 : 500,
          background: !filterRoom ? 'var(--granite-blue)' : 'var(--cloud)',
          color: !filterRoom ? 'var(--white)' : 'var(--text-secondary)',
          whiteSpace: 'nowrap', minHeight: 32, flexShrink: 0,
        }}>Alles</button>
        {ROOMS.filter(r => roomCounts[r]).map(r => (
          <button key={r} onClick={() => setFilterRoom(filterRoom === r ? null : r)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12,
            fontWeight: filterRoom === r ? 700 : 500,
            background: filterRoom === r ? 'var(--granite-blue)' : 'var(--cloud)',
            color: filterRoom === r ? 'var(--white)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap', minHeight: 32, flexShrink: 0,
          }}>
            {r} ({roomCounts[r]})
          </button>
        ))}
      </div>

      <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="var(--border-strong)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <path d="M3 12l9-9 9 9"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
            <p style={{ fontSize: 14, marginBottom: 4 }}>Nog geen plekken opgeslagen</p>
            <p style={{ fontSize: 12 }}>Tik op + om een plek toe te voegen</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-lg)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 'var(--radius-md)',
                    background: p.imageUrl ? 'transparent' : 'var(--accent-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, overflow: 'hidden',
                  }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.objectLabel}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="var(--soft-blue)" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 12l9-9 9 9"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.objectLabel}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {p.room}
                      {p.wherePrecisely ? ` · ${p.wherePrecisely}` : ''}
                      {p.subzone ? ` · ${p.subzone}` : ''}
                      {p.container ? ` · ${p.container}` : ''}
                      {p.position ? ` (${p.position})` : ''}
                    </p>
                    {p.notes && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>{p.notes}</p>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button onClick={() => startEdit(p)} style={{ fontSize: 12, color: 'var(--soft-blue)', fontWeight: 600, minHeight: 36, padding: '0 8px' }}>Bewerk</button>
                      <button onClick={() => setConfirmDeleteId(p.id)} style={{ fontSize: 12, color: 'var(--danger)', minHeight: 36, padding: '0 8px' }}>Verwijder</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB — prefills active filter category */}
      {!showAdd && (
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={() => openAdd(filterRoom || undefined)}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)',
            right: 20, width: 56, height: 56, borderRadius: '50%',
            background: 'var(--granite-blue)', color: 'var(--white)',
            fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)', zIndex: 50,
          }}
          aria-label="Plek toevoegen"
        >+</motion.button>
      )}

      {/* Add/Edit Sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={resetForm}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 90 }} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                zIndex: 91, maxHeight: '96dvh',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Sheet header — drag handle closes */}
              <button
                onClick={resetForm}
                style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px', flexShrink: 0, width: '100%' }}
                aria-label="Sluiten"
              >
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </button>
              <div style={{
                padding: '0 var(--space-xl) var(--space-md)',
                borderBottom: '1px solid var(--border)', flexShrink: 0,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                    {editId ? 'Plek bewerken' : 'Nieuwe plek'}
                  </h3>
                  <button onClick={resetForm} style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--cloud)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: 'var(--text-muted)',
                  }} aria-label="Sluiten">×</button>
                </div>
              </div>

              {/* Scrollable form */}
              <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                {/* Object name */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  Wat? <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input type="text" placeholder="bijv. autosleutels" value={objectLabel}
                  onChange={e => setObjectLabel(e.target.value)} className="input-field"
                  style={{ marginBottom: 16 }} autoFocus />

                {/* Category / Room */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
                  Categorie
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {ROOMS.map(r => (
                    <button key={r} onClick={() => setRoom(r)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 12,
                      fontWeight: room === r ? 700 : 500,
                      background: room === r ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: room === r ? 'var(--white)' : 'var(--text-secondary)',
                    }}>{r}</button>
                  ))}
                </div>

                {/* Where precisely */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  Waar precies
                </label>
                <input type="text" placeholder="bijv. bij de voordeur, op het aanrecht"
                  value={wherePrecisely} onChange={e => setWherePrecisely(e.target.value)}
                  className="input-field" style={{ marginBottom: 12 }} />

                {/* Sub-location */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  Subplek <span style={{ fontWeight: 400 }}>(optioneel)</span>
                </label>
                <input type="text" placeholder="bijv. bovenste la, rechter kast"
                  value={subzone} onChange={e => setSubzone(e.target.value)}
                  className="input-field" style={{ marginBottom: 12 }} />

                {/* Container */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  Container/lade/plank <span style={{ fontWeight: 400 }}>(optioneel)</span>
                </label>
                <input type="text" placeholder="bijv. zwarte bak, rode map"
                  value={container} onChange={e => setContainer(e.target.value)}
                  className="input-field" style={{ marginBottom: 12 }} />

                {/* Position */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
                  Positie <span style={{ fontWeight: 400 }}>(optioneel)</span>
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['Links', 'Rechts', 'Boven', 'Onder', 'Midden', 'Achteraan', 'Vooraan'].map(pos => (
                    <button key={pos} onClick={() => setPosition(position === pos ? '' : pos)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 12,
                      fontWeight: position === pos ? 700 : 500,
                      background: position === pos ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: position === pos ? 'var(--white)' : 'var(--text-secondary)',
                    }}>{pos}</button>
                  ))}
                </div>

                {/* Notes */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  Notitie
                </label>
                <textarea placeholder="Eventuele extra informatie..."
                  value={notes} onChange={e => setNotes(e.target.value)} className="input-field"
                  style={{ marginBottom: 16, minHeight: 60, resize: 'none' }} />

                {/* Photo */}
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
                  Foto <span style={{ fontWeight: 400 }}>(optioneel)</span>
                </label>

                {imagePreview ? (
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <img src={imagePreview} alt="Voorbeeld"
                      style={{
                        width: '100%', height: 160, objectFit: 'contain',
                        borderRadius: 12, background: 'var(--cloud)', display: 'block',
                      }} />
                    <button onClick={() => { setImagePreview(null); setImageUrl('') }}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                      }}
                      aria-label="Foto verwijderen"
                    >×</button>
                    {uploading && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        background: 'rgba(0,0,0,0.6)', color: 'white',
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                      }}>Uploaden naar cloud...</div>
                    )}
                    {uploadError && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8, right: 8,
                        background: 'rgba(201,99,110,0.9)', color: 'white',
                        padding: '6px 10px', borderRadius: 8, fontSize: 11, lineHeight: 1.4,
                      }}>{uploadError}</div>
                    )}
                    {imageUrl && !uploading && !uploadError && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        background: 'rgba(107,170,125,0.9)', color: 'white',
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                      }}>✓ In cloud opgeslagen</div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', padding: 16, borderRadius: 12,
                      border: '1.5px dashed var(--border-strong)',
                      background: 'var(--cloud)', marginBottom: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      color: 'var(--text-secondary)',
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Foto kiezen of maken</span>
                  </button>
                )}

                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/gif"
                  capture="environment"
                  onChange={handlePhotoSelect} style={{ display: 'none' }} />

                <div style={{ height: 8 }} />
              </div>

              {/* Sticky save — always above keyboard/nav */}
              <div className="sticky-save-bar">
                <button
                  onClick={handleSave}
                  disabled={!objectLabel.trim() || uploading || saveState === 'saving'}
                  className="btn-primary"
                  style={{ width: '100%' }}
                  aria-label="Opslaan"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {saveLabel}
                </button>
                {!user && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
                    Niet ingelogd — gegevens worden lokaal opgeslagen
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Plek verwijderen?"
        message="Dit verwijdert de opgeslagen locatie en foto permanent."
        confirmLabel="Verwijderen"
        onConfirm={() => { if (confirmDeleteId) removePlace(confirmDeleteId); setConfirmDeleteId(null) }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
