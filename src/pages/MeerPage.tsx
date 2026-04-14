import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { supabase } from '@/lib/supabase'

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
  }}>
    <div style={{ color: danger ? 'var(--danger)' : 'var(--soft-blue)' }}>{icon}</div>
    <span style={{ fontSize: 15, fontWeight: 500, flex: 1, textAlign: 'left', color: danger ? 'var(--danger)' : 'inherit' }}>{label}</span>
    {!danger && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>}
  </button>
)

export const MeerPage: React.FC = () => {
  const { settings, updateSettings, user, isGuest, setUser, setGuest } = useStore()

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setGuest(false)
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
                <MenuItem label="Profiel" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>} />
                <MenuItem label="Privacy & beveiliging" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />
                <MenuItem label="Gegevens exporteren" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>} />
                <MenuItem label="Uitloggen" danger
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>}
                  onClick={handleLogout}
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
            <MenuItem label="Over RUST" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h0"/></svg>} />
            <MenuItem label="Hulp & ondersteuning" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h0"/></svg>} />
            <MenuItem label="Toegankelijkheid" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="4" r="2"/><path d="M12 6v6M8 8l4 2 4-2M10 18l2-4 2 4"/></svg>} />
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>
          RUST v1.0.0 · Gemaakt met zorg
        </p>
      </div>
    </div>
  )
}
