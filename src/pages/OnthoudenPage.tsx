import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Snackbar } from '@/components/Snackbar'
import type { Note } from '@/types'

const noteCategories = ['Algemeen', 'Persoonlijk', 'Werk', 'Gezondheid', 'Boodschappen', 'Ideeën', 'Afspraken', 'Financiën']
const noteTemplates = [
  'Wat wil je niet vergeten?',
  'Wat moet je nog regelen?',
  'Welke afspraak wil je onthouden?',
  'Wat wil je later opzoeken?',
  'Wat nam je voor vandaag?',
  'Wat liep goed vandaag?',
]

type Filter = 'all' | 'pinned' | 'urgent' | 'done'

export const OnthoudenPage: React.FC = () => {
  const { notes, addNote, updateNote, removeNote } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Algemeen')
  const [pinned, setPinned] = useState(false)
  const [urgent, setUrgent] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [undoNote, setUndoNote] = useState<Note | null>(null)
  const [snackOpen, setSnackOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = notes.filter(n => !n.archived)
    if (filter === 'pinned') list = list.filter(n => n.pinned)
    if (filter === 'urgent') list = list.filter(n => n.urgent && !n.done)
    if (filter === 'done') list = list.filter(n => n.done)
    if (filter === 'all') list = list.filter(n => !n.done)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    }
    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      if (a.urgent && !b.urgent) return -1
      return 0
    })
  }, [notes, filter, search])

  const resetForm = () => {
    setTitle(''); setContent(''); setCategory('Algemeen'); setPinned(false); setUrgent(false)
    setEditId(null); setShowAdd(false)
  }

  const handleSave = () => {
    if (!title.trim()) return
    if (editId) {
      updateNote(editId, { title, content, category, pinned, urgent })
    } else {
      addNote({ title, content, category, pinned, urgent, done: false, archived: false })
    }
    resetForm()
  }

  const handleDeleteConfirmed = () => {
    const note = notes.find(n => n.id === confirmDeleteId)
    if (note) { setUndoNote(note); removeNote(note.id); setSnackOpen(true) }
    setConfirmDeleteId(null)
  }

  const handleUndo = () => {
    if (undoNote) addNote({ title: undoNote.title, content: undoNote.content, category: undoNote.category, pinned: undoNote.pinned, urgent: undoNote.urgent, done: undoNote.done, archived: undoNote.archived })
    setUndoNote(null)
  }

  const startEdit = (note: typeof notes[0]) => {
    setEditId(note.id); setTitle(note.title); setContent(note.content)
    setCategory(note.category); setPinned(note.pinned); setUrgent(note.urgent)
    setShowAdd(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader title="Onthouden" subtitle="Je externe geheugen" />

      <div style={{ padding: '0 var(--space-lg)', marginBottom: 12 }}>
        <input type="text" placeholder="Zoek in notities..." value={search}
          onChange={e => setSearch(e.target.value)} className="input-field" />
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 var(--space-lg)', marginBottom: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {([['all', 'Alles'], ['pinned', 'Vastgepind'], ['urgent', 'Urgent'], ['done', 'Afgerond']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13,
            fontWeight: filter === val ? 700 : 500,
            background: filter === val ? 'var(--granite-blue)' : 'var(--cloud)',
            color: filter === val ? 'var(--white)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap', minHeight: 34, flexShrink: 0,
          }}>{label}</button>
        ))}
      </div>

      <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <p style={{ fontSize: 14, marginBottom: 4 }}>Geen notities gevonden</p>
            <p style={{ fontSize: 12 }}>Tik op + om iets toe te voegen</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
              {filtered.map(note => (
                <motion.div key={note.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-lg)',
                    border: `1px solid ${note.urgent ? 'rgba(201,99,110,0.35)' : 'var(--border)'}`,
                    boxShadow: 'var(--shadow-sm)', opacity: note.done ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <button onClick={() => updateNote(note.id, { done: !note.done })} style={{
                      width: 24, height: 24, borderRadius: 7,
                      border: `2px solid ${note.done ? 'var(--success)' : 'var(--border-strong)'}`,
                      background: note.done ? 'var(--success)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {note.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, textDecoration: note.done ? 'line-through' : 'none', flex: 1 }}>
                          {note.title}
                        </h3>
                        {note.pinned && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--soft-blue)" stroke="none">
                            <path d="M12 2l1.5 4.5h4.5l-3.5 2.5 1.5 4.5L12 11l-4 2.5 1.5-4.5L6 6.5h4.5z"/>
                          </svg>
                        )}
                        {note.urgent && (
                          <span style={{ fontSize: 10, background: 'var(--danger)', color: 'white', padding: '2px 7px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>Urgent</span>
                        )}
                      </div>
                      {note.content && (
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 8 }}>
                          {note.content.slice(0, 120)}{note.content.length > 120 ? '…' : ''}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--cloud)', padding: '4px 10px', borderRadius: 'var(--radius-full)', lineHeight: 1 }}>
                          {note.category}
                        </span>
                        <button onClick={() => startEdit(note)} style={{ fontSize: 12, color: 'var(--soft-blue)', fontWeight: 600, minHeight: 36, padding: '0 8px' }}>Bewerk</button>
                        <button onClick={() => updateNote(note.id, { pinned: !note.pinned })} style={{ fontSize: 12, color: note.pinned ? 'var(--soft-blue)' : 'var(--text-muted)', minHeight: 36, padding: '0 8px' }}>
                          {note.pinned ? 'Losmaken' : 'Vastpinnen'}
                        </button>
                        <button onClick={() => setConfirmDeleteId(note.id)} style={{ fontSize: 12, color: 'var(--danger)', minHeight: 36, padding: '0 8px' }}>Verwijder</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB */}
      {!showAdd && (
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { resetForm(); setShowAdd(true) }}
          style={{
            position: 'fixed', bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)',
            right: 20, width: 56, height: 56, borderRadius: '50%',
            background: 'var(--granite-blue)', color: 'var(--white)',
            fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)', zIndex: 50,
          }}>+</motion.button>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Notitie verwijderen?"
        message="De notitie wordt verwijderd. Je kunt dit direct ongedaan maken."
        confirmLabel="Verwijderen"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <Snackbar
        open={snackOpen}
        message="Notitie verwijderd"
        actionLabel="Ongedaan"
        onAction={handleUndo}
        onClose={() => { setSnackOpen(false); setUndoNote(null) }}
      />

      {/* Add/Edit Sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={resetForm} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                zIndex: 91, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ padding: '12px var(--space-xl) var(--space-md)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editId ? 'Notitie bewerken' : 'Nieuwe notitie'}</h3>
                  <button onClick={resetForm} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: 'var(--space-lg) var(--space-xl)' }}>
                <input type="text"
                  placeholder={noteTemplates[Math.floor(Math.random() * noteTemplates.length)]}
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="input-field" style={{ marginBottom: 12 }} autoFocus />
                <textarea placeholder="Extra details of context..."
                  value={content} onChange={e => setContent(e.target.value)}
                  className="input-field" style={{ marginBottom: 14, minHeight: 80, resize: 'none' }} />

                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Categorie</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {noteCategories.map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 12,
                      fontWeight: category === c ? 700 : 500,
                      background: category === c ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: category === c ? 'var(--white)' : 'var(--text-secondary)',
                    }}>{c}</button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <button onClick={() => setPinned(!pinned)} style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
                    background: pinned ? 'var(--accent-soft)' : 'var(--cloud)',
                    color: pinned ? 'var(--granite-blue)' : 'var(--text-muted)',
                    border: pinned ? '1px solid var(--accent)' : '1px solid var(--border)',
                  }}>
                    {pinned ? '📌 Vastgepind' : '📌 Vastpinnen'}
                  </button>
                  <button onClick={() => setUrgent(!urgent)} style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
                    background: urgent ? 'rgba(201,99,110,0.1)' : 'var(--cloud)',
                    color: urgent ? 'var(--danger)' : 'var(--text-muted)',
                    border: urgent ? '1px solid rgba(201,99,110,0.35)' : '1px solid var(--border)',
                  }}>
                    {urgent ? '⚡ Urgent' : '⚡ Urgent'}
                  </button>
                </div>
              </div>

              {/* Sticky save */}
              <div style={{
                padding: 'var(--space-md) var(--space-xl)',
                paddingBottom: 'calc(var(--safe-bottom) + var(--space-md))',
                borderTop: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0,
              }}>
                <button onClick={handleSave} disabled={!title.trim()} className="btn-primary" style={{ width: '100%' }}>
                  {editId ? 'Opslaan' : 'Toevoegen'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
