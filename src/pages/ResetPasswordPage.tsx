import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ResetState = 'loading' | 'form' | 'success' | 'expired' | 'error'

const MIN_PW = 8

const BG: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'linear-gradient(160deg, #1e293b 0%, #2d3a4a 50%, #3d5068 100%)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 24px calc(env(safe-area-inset-bottom, 0px) + 20px)',
  zIndex: 1000, overflowY: 'auto',
}
const CARD: React.CSSProperties = { width: '100%', maxWidth: 360 }
const LOGO: React.CSSProperties = {
  width: 80, height: 80, borderRadius: 24,
  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid rgba(255,255,255,0.15)', margin: '0 auto 20px',
}
const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '14px 48px 14px 16px',
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 12, fontSize: 16, color: 'white', minHeight: 50, boxSizing: 'border-box',
}
const LABEL_STYLE: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, display: 'block' }
const EYE_BTN: React.CSSProperties = {
  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
  color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, cursor: 'pointer',
}
const PRIMARY_BTN = (loading: boolean): React.CSSProperties => ({
  padding: '16px', borderRadius: 16, marginTop: 4,
  background: loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
  color: '#1e293b', fontSize: 16, fontWeight: 700,
  width: '100%', minHeight: 52, opacity: loading ? 0.7 : 1, border: 'none', cursor: loading ? 'default' : 'pointer',
})

const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const EyeOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export const ResetPasswordPage: React.FC = () => {
  const [state, setState] = useState<ResetState>('loading')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) { setState('error'); return }

    // Check for URL error params from Supabase redirect
    const params = new URLSearchParams(window.location.search)
    const errorCode = params.get('error_code')
    const errorDesc = params.get('error_description') ?? ''
    if (errorCode) {
      setState(errorCode === 'otp_expired' || errorDesc.toLowerCase().includes('expired') ? 'expired' : 'error')
      return
    }

    // Primary: detectSessionInUrl: true auto-processes the token.
    // PASSWORD_RECOVERY fires for reset links; SIGNED_IN also fires.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setState(s => s === 'loading' ? 'form' : s)
      }
    })

    // Fallback: if session already established before subscribe
    const t1 = setTimeout(async () => {
      const { data } = await supabase!.auth.getSession()
      if (data.session) setState(s => s === 'loading' ? 'form' : s)
    }, 600)

    // 6s timeout: if no event, link is probably invalid/expired
    const t2 = setTimeout(() => {
      setState(s => s === 'loading' ? 'expired' : s)
    }, 6000)

    return () => { subscription.unsubscribe(); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleSubmit = async () => {
    setFormError(null)
    if (!newPassword) { setFormError('Vul een nieuw wachtwoord in.'); return }
    if (newPassword.length < MIN_PW) { setFormError(`Wachtwoord moet minimaal ${MIN_PW} tekens bevatten.`); return }
    if (newPassword !== confirmPassword) { setFormError('Wachtwoorden komen niet overeen.'); return }
    if (!supabase) { setFormError('Geen verbinding beschikbaar.'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) {
      setFormError('Wachtwoord wijzigen mislukt: ' + error.message)
    } else {
      setState('success')
      // Sign out recovery session after delay so user logs in fresh
      setTimeout(() => supabase?.auth.signOut(), 1500)
    }
  }

  const goHome = () => { window.location.href = '/' }

  return (
    <div style={BG}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(149,184,209,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(149,184,209,0.05)', pointerEvents: 'none' }} />

      <div style={CARD}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={LOGO}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.04em', fontFamily: "'DM Sans', sans-serif" }}>R</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>Nieuw wachtwoord</h1>
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Link controleren...</p>
          </div>
        )}

        {/* Form */}
        {state === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 4 }}>
              Kies een nieuw wachtwoord van minimaal {MIN_PW} tekens.
            </p>
            {formError && (
              <div style={{ background: 'rgba(201,99,110,0.2)', border: '1px solid rgba(201,99,110,0.4)', borderRadius: 12, padding: '12px 16px' }}>
                <p style={{ fontSize: 14, color: '#f9b4bb' }}>{formError}</p>
              </div>
            )}
            <div>
              <label style={LABEL_STYLE}>Nieuw wachtwoord</label>
              <div style={{ position: 'relative' }}>
                <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimaal 8 tekens" autoComplete="new-password" style={INPUT_STYLE} />
                <button type="button" onClick={() => setShowNew(v => !v)} style={EYE_BTN} aria-label={showNew ? 'Verberg' : 'Toon'}>{showNew ? <EyeOff /> : <EyeOn />}</button>
              </div>
            </div>
            <div>
              <label style={LABEL_STYLE}>Wachtwoord bevestigen</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Herhaal wachtwoord" autoComplete="new-password" style={INPUT_STYLE} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={EYE_BTN} aria-label={showConfirm ? 'Verberg' : 'Toon'}>{showConfirm ? <EyeOff /> : <EyeOn />}</button>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={PRIMARY_BTN(loading)}>
              {loading ? 'Even wachten...' : 'Wachtwoord wijzigen'}
            </button>
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 52, lineHeight: 1, color: '#a8d5ba' }}>✓</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Wachtwoord succesvol gewijzigd</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Je kunt nu inloggen met je nieuwe wachtwoord.</p>
            </div>
            <button onClick={goHome} style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.95)', color: '#1e293b', fontSize: 16, fontWeight: 700, width: '100%', minHeight: 52, border: 'none', cursor: 'pointer' }}>Ga naar inloggen</button>
          </div>
        )}

        {/* Expired / Error */}
        {(state === 'expired' || state === 'error') && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 44, lineHeight: 1, color: 'rgba(255,200,100,0.9)' }}>⚠</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Ongeldige of verlopen link</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Vraag opnieuw een herstelmail aan via de inlogpagina.</p>
            </div>
            <button onClick={goHome} style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.95)', color: '#1e293b', fontSize: 16, fontWeight: 700, width: '100%', minHeight: 52, border: 'none', cursor: 'pointer' }}>Vraag opnieuw een herstelmail aan</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
