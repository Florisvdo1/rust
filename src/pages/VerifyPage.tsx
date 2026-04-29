import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type VerifyState = 'checking' | 'success' | 'expired' | 'error' | 'no_code'

const BG: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'linear-gradient(160deg, #1e293b 0%, #2d3a4a 50%, #3d5068 100%)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 24px calc(env(safe-area-inset-bottom, 0px) + 20px)',
  zIndex: 1000,
}
const CARD: React.CSSProperties = {
  width: '100%', maxWidth: 360, textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
}
const LOGO: React.CSSProperties = {
  width: 80, height: 80, borderRadius: 24,
  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid rgba(255,255,255,0.15)',
}
const BTN: React.CSSProperties = {
  padding: '16px', borderRadius: 16,
  background: 'rgba(255,255,255,0.95)', color: '#1e293b',
  fontSize: 16, fontWeight: 700, width: '100%', minHeight: 52, border: 'none', cursor: 'pointer',
}

export const VerifyPage: React.FC = () => {
  const [state, setState] = useState<VerifyState>('checking')

  useEffect(() => {
    if (!supabase) { setState('error'); return }

    // Immediate URL error check (e.g. expired OTP redirect from Supabase)
    const params = new URLSearchParams(window.location.search)
    const errorCode = params.get('error_code')
    const errorDesc = params.get('error_description') ?? ''
    if (errorCode) {
      setState(errorCode === 'otp_expired' || errorDesc.toLowerCase().includes('expired') ? 'expired' : 'error')
      return
    }

    // Detect whether there is any token material in the URL
    const hasCode = !!params.get('code') || !!params.get('token_hash') || !!params.get('access_token')
    const hasHash = window.location.hash.includes('access_token')
    if (!hasCode && !hasHash) { setState('no_code'); return }

    // Primary: detectSessionInUrl: true means Supabase auto-exchanges code on init.
    // Subscribe to catch the SIGNED_IN / USER_UPDATED event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') setState('success')
    })

    // Fallback: session may already be set if exchange completed before subscribe
    const t1 = setTimeout(async () => {
      const { data } = await supabase!.auth.getSession()
      if (data.session) setState(s => s === 'checking' ? 'success' : s)
    }, 600)

    // Timeout: if still checking after 6s, something went wrong
    const t2 = setTimeout(() => {
      setState(s => s === 'checking' ? 'error' : s)
    }, 6000)

    return () => { subscription.unsubscribe(); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const goHome = () => { window.location.href = '/' }

  return (
    <div style={BG}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(149,184,209,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(149,184,209,0.05)', pointerEvents: 'none' }} />

      <div style={CARD}>
        <div style={LOGO}>
          <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.04em', fontFamily: "'DM Sans', sans-serif" }}>R</span>
        </div>

        {state === 'checking' && (
          <>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: -8 }}>Account bevestigen...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{ fontSize: 52, lineHeight: 1, color: '#a8d5ba' }}>✓</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>E-mailadres bevestigd!</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Je account is actief. Je kunt nu inloggen.</p>
            </div>
            <button onClick={goHome} style={BTN}>Ga naar inloggen</button>
          </>
        )}

        {state === 'expired' && (
          <>
            <div style={{ fontSize: 44, lineHeight: 1, color: 'rgba(255,200,100,0.9)' }}>⚠</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Link verlopen of ongeldig</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>De verificatielink is verlopen. Vraag een nieuwe aan via de registratiepagina.</p>
            </div>
            <button onClick={goHome} style={BTN}>Ga naar inloggen</button>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 44, lineHeight: 1, color: 'rgba(201,99,110,0.9)' }}>✕</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Verificatie mislukt</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Er is iets misgegaan. Probeer opnieuw via de registratiepagina.</p>
            </div>
            <button onClick={goHome} style={BTN}>Ga naar inloggen</button>
          </>
        )}

        {state === 'no_code' && (
          <>
            <div style={{ fontSize: 44, lineHeight: 1, color: 'rgba(255,255,255,0.4)' }}>?</div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Geen verificatielink gevonden</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Open de link uit je verificatiemail opnieuw, of vraag een nieuwe aan.</p>
            </div>
            <button onClick={goHome} style={BTN}>Ga naar inloggen</button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
