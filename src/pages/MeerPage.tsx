import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { SheetHeader } from '@/components/SheetHeader'
import { downloadFile } from '@/lib/download'
import { supabase } from '@/lib/supabase'

type Screen = 'profiel' | 'privacy' | 'export' | 'about' | 'hulp' | 'toegankelijkheid' | null

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void; description?: string }> = ({ label, value, onChange, description }) => (
  <button onClick={() => onChange(!value)} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', width: '100%', borderBottom: '1px solid var(--border)',
  }}>
    <div>
      <p style={{ fontSize: 15, fontWeight: 500, textAlign: 'left' }}>{label}</p>
      {description && <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'left', marginTop: 2 }}>{description}</p>}
    </div>
    <div style={{
      width: 48, height: 28, borderRadius: 14,
      background: value ? 'var(--soft-blue)' : 'var(--border-strong)',
      padding: 2, transition: 'background 0.2s',
      display: 'flex', alignItems: 'center', flexShrink: 0,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        transform: value ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 0.2s',
      }} />
    </div>
  </button>
)

const MenuItem: React.FC<{ label: string; icon: React.ReactNode; onClick?: () => void; danger?: boolean }> = ({ label, icon, onClick, danger }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 0', width: '100%', borderBottom: '1px solid var(--border)',
    minHeight: 52,
  }}>
    <div style={{ color: danger ? 'var(--danger)' : 'var(--soft-blue)' }}>{icon}</div>
    <span style={{ fontSize: 15, fontWeight: 500, flex: 1, textAlign: 'left', color: danger ? 'var(--danger)' : 'inherit' }}>{label}</span>
    {!danger && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>}
  </button>
)


export const MeerPage: React.FC = () => {
  const {
    settings, updateSettings,
    user, isGuest, setUser, setGuest,
    plannerItems, notes, places, journalEntries,
    healthItems, healthLogs, dailyHealth, breathingSessions,
  } = useStore()

  const [screen, setScreen] = useState<Screen>(null)
  const [confirmLogout, setConfirmLogout] = useState(false)

  // Profile edit state
  const [newUsername, setNewUsername] = useState(user?.username || user?.email?.split('@')[0] || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  // Password reset state
  const [resetEmail, setResetEmail] = useState(user?.email || '')
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('larger-text', settings.largerText ?? false)
    document.body.classList.toggle('reduce-motion', settings.reduceMotion ?? false)
    return () => {
      document.body.classList.remove('larger-text', 'reduce-motion')
    }
  }, [settings.largerText, settings.reduceMotion])

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null); setGuest(false)
  }

  const handleSaveProfile = async () => {
    if (!newUsername.trim()) return
    setProfileSaving(true)
    if (user) {
      if (supabase) {
        await supabase.auth.updateUser({ data: { username: newUsername.trim() } })
        const { error } = await supabase.from('profiles').upsert({ id: user.id, username: newUsername.trim() })
        if (error) { setProfileMsg('Kon profiel niet opslaan in cloud, maar lokaal bijgewerkt.') }
        else { setProfileMsg('Profiel opgeslagen.') }
      } else {
        setProfileMsg('Profiel lokaal bijgewerkt.')
      }
      setUser({ ...user, username: newUsername.trim() })
    }
    setProfileSaving(false)
    setTimeout(() => setProfileMsg(null), 2500)
  }

  const handlePasswordReset = async () => {
    if (!supabase || !resetEmail.trim()) { setProfileMsg('Vul je e-mailadres in.'); return }
    await supabase.auth.resetPasswordForEmail(resetEmail.trim())
    setResetSent(true)
  }

  const handleSignOutAll = async () => {
    if (supabase) await supabase.auth.signOut({ scope: 'global' })
    setUser(null); setGuest(false)
  }

  const handleExportJSON = () => {
    const data = { exportedAt: new Date().toISOString(), version: '1.2.0', plannerItems, notes, places, journalEntries, healthItems, healthLogs, dailyHealth, breathingSessions, settings }
    downloadFile(JSON.stringify(data, null, 2), `rust-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
  }

  const handleExportCSV = () => {
    const rows = [
      ['Type', 'Datum', 'Naam', 'Details'],
      ...plannerItems.map(i => ['Planner', i.date, i.activityName, `${i.hour}:${String(i.quarter * 15).padStart(2, '0')} (${i.duration}m)`]),
      ...notes.map(n => ['Notitie', n.createdAt.split('T')[0], n.title, n.content.slice(0, 80)]),
      ...places.map(p => ['Plaats', p.createdAt.split('T')[0], p.objectLabel, p.room]),
      ...journalEntries.map(e => ['Dagboek', e.date, `Stemming ${e.mood}/5`, e.wentWell.slice(0, 60)]),
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    downloadFile(csv, `rust-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;')
  }

  const openScreen = (s: Screen) => {
    setScreen(s)
    setProfileMsg(null)
    setResetSent(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader title="Meer" subtitle="Instellingen en account" showSettings={false} />
      <div className="page-scroll" style={{ padding: '0 var(--space-lg)' }}>

        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--granite-blue) 0%, var(--soft-blue) 100%)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)',
            marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16,
            color: 'var(--white)', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700,
          }}>
            {user ? (user.username?.[0] || user.email[0]).toUpperCase() : 'G'}
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700 }}>
              {user ? (user.username || user.email.split('@')[0]) : 'Gast'}
            </p>
            <p style={{ fontSize: 12, opacity: 0.6 }}>
              {user ? user.email : 'Niet ingelogd — data lokaal opgeslagen'}
            </p>
          </div>
        </motion.div>

        {/* Account */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Account</p>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '0 var(--space-lg)', border: '1px solid var(--border)' }}>
            {user ? (
              <>
                <MenuItem label="Profiel" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>} onClick={() => openScreen('profiel')} />
                <MenuItem label="Privacy & beveiliging" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} onClick={() => openScreen('privacy')} />
                <MenuItem label="Gegevens exporteren" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>} onClick={() => openScreen('export')} />
                <MenuItem label="Uitloggen" danger
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>}
                  onClick={() => setConfirmLogout(true)}
                />
              </>
            ) : (
              <>
                <MenuItem label="Inloggen / Registreren"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>}
                  onClick={() => { setUser(null); setGuest(false) }}
                />
                {isGuest && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 0 14px', lineHeight: 1.5 }}>
                    Je gebruikt de app als gast. Gegevens worden lokaal opgeslagen en zijn mogelijk niet permanent beschikbaar.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Voorkeuren</p>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '0 var(--space-lg)', border: '1px solid var(--border)' }}>
            <Toggle label="Trillingen" description="Feedback bij interacties" value={settings.haptics} onChange={v => updateSettings({ haptics: v })} />
            <Toggle label="Geluiden" description="Geluidsfeedback bij acties" value={settings.sounds} onChange={v => updateSettings({ sounds: v })} />
            <Toggle label="Ademhaling: startgeluid" description="Toon bij start van oefening" value={settings.startTone ?? false} onChange={v => updateSettings({ startTone: v })} />
            <Toggle label="Ademhaling: chime" description="Belgeluid bij fase-overgang" value={settings.breathingChime ?? false} onChange={v => updateSettings({ breathingChime: v })} />
            <Toggle label="Ademhaling: trillingen" description="Trillen bij faseovergangen" value={settings.breathingVibration} onChange={v => updateSettings({ breathingVibration: v })} />
            <Toggle label="Planner sleep-trillingen" description="Trillen bij slepen in planner" value={settings.plannerDragHaptics} onChange={v => updateSettings({ plannerDragHaptics: v })} />
          </div>
        </div>

        {/* Info */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Informatie</p>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '0 var(--space-lg)', border: '1px solid var(--border)' }}>
            <MenuItem label="Over RUST" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg>} onClick={() => openScreen('about')} />
            <MenuItem label="Hulp & ondersteuning" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h0"/></svg>} onClick={() => openScreen('hulp')} />
            <MenuItem label="Toegankelijkheid" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="4" r="2"/><path d="M12 6v6M8 8l4 2 4-2M10 18l2-4 2 4"/></svg>} onClick={() => openScreen('toegankelijkheid')} />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>
          RUST v1.2.0 · Gemaakt met zorg
        </p>
      </div>

      {/* ─── Confirm logout ─────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmLogout}
        title="Uitloggen?"
        message="Je lokale gegevens blijven bewaard op dit apparaat."
        confirmLabel="Uitloggen"
        onConfirm={() => { handleLogout(); setConfirmLogout(false) }}
        onCancel={() => setConfirmLogout(false)}
      />

      {/* ─── Sub-page sheets ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {screen !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setScreen(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                zIndex: 91, display: 'flex', flexDirection: 'column', maxHeight: '90vh',
              }}
            >

              {/* ── PROFIEL ── */}
              {screen === 'profiel' && (
                <>
                  <SheetHeader title="Profiel" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Gebruikersnaam</p>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className="input-field"
                      style={{ marginBottom: 16 }}
                      placeholder="Jouw naam"
                    />

                    {user && (
                      <div style={{ background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16 }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>E-mailadres</p>
                        <p style={{ fontSize: 15, fontWeight: 500 }}>{user.email}</p>
                      </div>
                    )}

                    {profileMsg && (
                      <div style={{ background: '#81b29a22', border: '1px solid #81b29a44', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: '#5a8a68' }}>{profileMsg}</p>
                      </div>
                    )}

                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, marginTop: 8 }}>Wachtwoord opnieuw instellen</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
                      Een resetlink wordt naar je e-mailadres gestuurd.
                    </p>
                    {resetSent ? (
                      <div style={{ background: '#81b29a22', border: '1px solid #81b29a44', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: '#5a8a68' }}>Resetlink verstuurd naar {resetEmail}</p>
                      </div>
                    ) : (
                      <button onClick={handlePasswordReset}
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--cloud)', fontSize: 14, fontWeight: 500, marginBottom: 20 }}>
                        Stuur resetlink
                      </button>
                    )}
                  </div>
                  <div className="sticky-save-bar">
                    <button onClick={handleSaveProfile} disabled={profileSaving || !newUsername.trim()} className="btn-primary" style={{ width: '100%' }} aria-label="Opslaan">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      {profileSaving ? 'Opslaan...' : 'Opslaan'}
                    </button>
                  </div>
                </>
              )}

              {/* ── PRIVACY ── */}
              {screen === 'privacy' && (
                <>
                  <SheetHeader title="Privacy & beveiliging" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    <div style={{ background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 20 }}>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        RUST slaat je gegevens op in je browser (lokaal) en optioneel in je Supabase-account als je bent ingelogd. Er worden geen gegevens gedeeld met derden.
                      </p>
                    </div>

                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sessiebeheer</p>
                    <button onClick={handleSignOutAll}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
                        background: 'rgba(201,99,110,0.1)', border: '1px solid rgba(201,99,110,0.35)',
                        color: 'var(--danger)', fontSize: 14, fontWeight: 600,
                        marginBottom: 20,
                      }}>
                      Uitloggen op alle apparaten
                    </button>

                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Gegevens & privacy</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                      Je kunt alle gegevens downloaden via "Gegevens exporteren". Lokale gegevens kun je verwijderen door de browser-cache te wissen.
                    </p>

                    <div style={{ background: 'var(--ice-blue)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--soft-blue)', marginBottom: 4 }}>Gegevensbescherming</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        RUST verwerkt geen gezondheidsgegevens die buiten de app worden gedeeld. Supabase voldoet aan AVG/GDPR-vereisten.
                      </p>
                    </div>
                    <div style={{ height: 20 }} />
                  </div>
                </>
              )}

              {/* ── EXPORT ── */}
              {screen === 'export' && (
                <>
                  <SheetHeader title="Gegevens exporteren" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                      Download een kopie van al je RUST-gegevens. Dit omvat je planner, notities, plaatsen, dagboek en gezondheidsdata.
                    </p>

                    {[
                      { label: 'Download als JSON', sub: 'Volledig bestand, geschikt voor back-up of migratie', fn: handleExportJSON, icon: '{ }' },
                      { label: 'Download als CSV', sub: 'Tabelindeling voor gebruik in Excel of Numbers', fn: handleExportCSV, icon: '⊟' },
                    ].map(btn => (
                      <button key={btn.label} onClick={btn.fn}
                        style={{
                          width: '100%', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border)', background: 'var(--white)',
                          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10,
                          textAlign: 'left',
                        }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-soft)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'var(--soft-blue)',
                          flexShrink: 0,
                        }}>{btn.icon}</div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 600 }}>{btn.label}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{btn.sub}</p>
                        </div>
                      </button>
                    ))}

                    <div style={{ background: 'var(--cloud)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginTop: 12 }}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Export bevat: {plannerItems.length} planner-items · {notes.length} notities · {places.length} plaatsen · {journalEntries.length} dagboekentries
                      </p>
                    </div>
                    <div style={{ height: 20 }} />
                  </div>
                </>
              )}

              {/* ── ABOUT ── */}
              {screen === 'about' && (
                <>
                  <SheetHeader title="Over RUST" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 20, background: 'var(--granite-blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: 'white', letterSpacing: '-0.04em' }}>R</span>
                      </div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>RUST</h2>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Versie 1.2.0</p>
                    </div>

                    {[
                      { title: 'Wat is RUST?', text: 'RUST is een Nederlandse dagelijkse assistent voor mensen met ADHD, autisme of andere neurodivergente kenmerken. De app helpt je structuur te vinden in je dag, dingen te onthouden en rust te bewaren.' },
                      { title: 'Modules', text: 'Vandaag · Onthouden · Planner · Ademhaling · Dagboek · Gezondheid · Plaatsen' },
                      { title: 'Techniek', text: 'Gebouwd met React 19, TypeScript, Vite en Supabase. Data wordt lokaal opgeslagen en optioneel gesynchroniseerd via je account.' },
                      { title: 'Gemaakt met zorg', text: 'RUST is ontworpen met oog voor eenvoud, rust en toegankelijkheid. Geen advertenties, geen tracking.' },
                    ].map(s => (
                      <div key={s.title} style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--soft-blue)', marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.text}</p>
                      </div>
                    ))}
                    <div style={{ height: 20 }} />
                  </div>
                </>
              )}

              {/* ── HULP ── */}
              {screen === 'hulp' && (
                <>
                  <SheetHeader title="Hulp & ondersteuning" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    {[
                      { q: 'Hoe sla ik iets op in de Planner?', a: 'Tik op de + knop onderin het Planner-scherm. Kies een activiteit en een duur, en tik dan op een tijdslot in de tijdlijn.' },
                      { q: 'Hoe werkt Onthouden?', a: 'Tik op + om een nieuwe notitie te maken. Je kunt categorieën, urgent-markering en vastpinnen gebruiken om alles overzichtelijk te houden.' },
                      { q: 'Hoe verbind ik mijn account?', a: 'Ga naar Meer > Account. Log in of maak een account aan om je gegevens in de cloud te bewaren.' },
                      { q: 'Worden mijn gegevens gedeeld?', a: 'Nee. RUST deelt geen gegevens met derden. Gegevens worden lokaal of in je eigen Supabase-account bewaard.' },
                      { q: 'Hoe reset ik mijn wachtwoord?', a: 'Ga naar Meer > Profiel > Stuur resetlink. Je ontvangt een e-mail met een resetlink.' },
                      { q: 'Hoe exporteer ik mijn data?', a: 'Ga naar Meer > Gegevens exporteren. Je kunt een JSON- of CSV-bestand downloaden met al je RUST-gegevens.' },
                    ].map(faq => (
                      <div key={faq.q} style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{faq.q}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
                      </div>
                    ))}
                    <div style={{ height: 20 }} />
                  </div>
                </>
              )}

              {/* ── TOEGANKELIJKHEID ── */}
              {screen === 'toegankelijkheid' && (
                <>
                  <SheetHeader title="Toegankelijkheid" onClose={() => setScreen(null)} />
                  <div className="sheet-scroll" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                      Pas de weergave aan voor jouw behoeften.
                    </p>
                    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '0 var(--space-lg)', border: '1px solid var(--border)', marginBottom: 20 }}>
                      <Toggle
                        label="Grotere tekst"
                        description="Vergroot de tekstgrootte door de hele app"
                        value={settings.largerText ?? false}
                        onChange={v => updateSettings({ largerText: v })}
                      />
                      <Toggle
                        label="Minder animaties"
                        description="Verminder beweging en overgangen"
                        value={settings.reduceMotion ?? false}
                        onChange={v => updateSettings({ reduceMotion: v })}
                      />
                    </div>
                    <div style={{ background: 'var(--ice-blue)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--soft-blue)', marginBottom: 4 }}>Tip</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Gebruik ook de systeeminstellingen van je apparaat voor extra toegankelijkheidsopties zoals inverteerde kleuren of verhoogd contrast.
                      </p>
                    </div>
                    <div style={{ height: 20 }} />
                  </div>
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
