import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PW = 8

function authErrorMessage(message: string, mode: 'login' | 'register'): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'E-mailadres of wachtwoord klopt niet.'
  if (m.includes('email not confirmed')) return 'Bevestig eerst je e-mailadres via de link in je inbox.'
  if (m.includes('too many') || m.includes('rate limit')) return 'Te veel pogingen. Probeer het later opnieuw.'
  if (mode === 'register' && (m.includes('already registered') || m.includes('already exists') || m.includes('unique'))) return 'Er bestaat al een account met dit e-mailadres.'
  if (mode === 'register' && m.includes('password')) return `Wachtwoord voldoet niet. Kies minimaal ${MIN_PW} tekens.`
  return mode === 'login' ? 'Inloggen mislukt. Probeer het opnieuw.' : 'Registratie mislukt: ' + message
}

type Mode = 'welcome' | 'login' | 'register'

interface AuthPageProps {
  onComplete: () => void
  onGuest: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({ onComplete, onGuest }) => {
  const setUser = useStore(s => s.setUser)
  const setGuest = useStore(s => s.setGuest)

  const [mode, setMode] = useState<Mode>('welcome')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const handleGuest = () => {
    setGuest(true)
    onGuest()
  }

  const handleLogin = async () => {
    if (!email.trim()) { setError('Vul je e-mailadres in.'); return }
    if (!EMAIL_RE.test(email.trim())) { setError('Ongeldig e-mailadres.'); return }
    if (!password) { setError('Vul je wachtwoord in.'); return }
    setLoading(true)
    setError(null)

    if (!supabase) {
      setUser({ id: 'local-' + Date.now(), email: email.trim(), username: email.split('@')[0] })
      onComplete()
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError(authErrorMessage(authError.message, 'login'))
    } else if (data.session) {
      setUser({
        id: data.session.user.id,
        email: data.session.user.email ?? email,
        username: (data.session.user.user_metadata?.username as string) ?? email.split('@')[0],
      })
      onComplete()
    } else {
      setError('Bevestig je e-mailadres via de link in je inbox, dan kun je inloggen.')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!email.trim()) { setError('Vul je e-mailadres in.'); return }
    if (!EMAIL_RE.test(email.trim())) { setError('Ongeldig e-mailadres.'); return }
    if (!username.trim()) { setError('Vul een gebruikersnaam in.'); return }
    if (!password) { setError('Kies een wachtwoord.'); return }
    if (password.length < MIN_PW) { setError(`Wachtwoord moet minimaal ${MIN_PW} tekens bevatten.`); return }
    if (password !== passwordConfirm) { setError('Wachtwoorden komen niet overeen.'); return }
    setLoading(true)
    setError(null)

    if (!supabase) {
      setUser({ id: 'local-' + Date.now(), email: email.trim(), username: username.trim() })
      onComplete()
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { username: username.trim() } },
    })

    if (authError) {
      setError(authErrorMessage(authError.message, 'register'))
    } else if (data.session) {
      setUser({
        id: data.session.user.id,
        email: data.session.user.email ?? email,
        username: username.trim(),
      })
      onComplete()
    } else if (data.user) {
      setSuccess('Account aangemaakt! Controleer je e-mail voor een bevestigingslink, dan kun je inloggen.')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, #1e293b 0%, #2d3a4a 50%, #3d5068 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 24px calc(env(safe-area-inset-bottom, 0px) + 20px)',
      zIndex: 1000,
      overflowY: 'auto',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 220, height: 220,
        borderRadius: '50%', background: 'rgba(149,184,209,0.07)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
        borderRadius: '50%', background: 'rgba(149,184,209,0.05)', pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        {mode === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}
          >
            {/* Logo */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 24,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{
                  fontSize: 28, fontWeight: 700, color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '-0.04em',
                }}>R</span>
              </div>
              <h1 style={{
                fontSize: 38, fontWeight: 700, color: 'white',
                letterSpacing: '-0.04em', marginBottom: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}>RUST</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                Jouw rust, structuur en balans
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => setMode('register')}
                style={{
                  padding: '16px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.95)', color: '#1e293b',
                  fontSize: 16, fontWeight: 700, width: '100%', minHeight: 52,
                  border: 'none',
                }}
              >
                Account aanmaken
              </button>
              <button
                onClick={() => setMode('login')}
                style={{
                  padding: '16px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)', color: 'white',
                  fontSize: 16, fontWeight: 600, width: '100%', minHeight: 52,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Inloggen
              </button>
              <button
                onClick={handleGuest}
                style={{
                  padding: '12px', fontSize: 14, color: 'rgba(255,255,255,0.45)',
                  fontWeight: 500, background: 'none', border: 'none', marginTop: 4,
                }}
              >
                Doorgaan zonder account
              </button>
            </div>
          </motion.div>
        )}

        {(mode === 'login' || mode === 'register') && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', maxWidth: 360 }}
          >
            {/* Back + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <button
                onClick={() => { setMode('welcome'); setError(null); setSuccess(null) }}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                  {mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
                </h2>
              </div>
            </div>

            {/* Success */}
            {success && (
              <div style={{
                background: 'rgba(107,170,125,0.2)', border: '1px solid rgba(107,170,125,0.4)',
                borderRadius: 12, padding: '12px 16px', marginBottom: 16,
              }}>
                <p style={{ fontSize: 14, color: '#a8d5ba' }}>{success}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(201,99,110,0.2)', border: '1px solid rgba(201,99,110,0.4)',
                borderRadius: 12, padding: '12px 16px', marginBottom: 16,
              }}>
                <p style={{ fontSize: 14, color: '#f9b4bb' }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'register' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, display: 'block' }}>
                    Gebruikersnaam
                  </label>
                  <input
                    type="text"
                    placeholder="jouwnaambijv"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12, fontSize: 16, color: 'white',
                      minHeight: 50,
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, display: 'block' }}>
                  E-mailadres
                </label>
                <input
                  type="email"
                  placeholder="naam@email.nl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12, fontSize: 16, color: 'white',
                    minHeight: 50,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, display: 'block' }}>
                  Wachtwoord
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimaal 8 tekens"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    style={{
                      width: '100%', padding: '14px 48px 14px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 12, fontSize: 16, color: 'white',
                      minHeight: 50,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 4, cursor: 'pointer',
                    }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {mode === 'register' && (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.5 }}>
                    Minimaal {MIN_PW} tekens. Je kunt je wachtwoord later wijzigen via Meer → Profiel.
                  </p>
                )}
              </div>

              {mode === 'register' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, display: 'block' }}>
                    Wachtwoord bevestigen
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      placeholder="Herhaal wachtwoord"
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                      style={{
                        width: '100%', padding: '14px 48px 14px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 12, fontSize: 16, color: 'white',
                        minHeight: 50,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(v => !v)}
                      aria-label={showPasswordConfirm ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 4, cursor: 'pointer',
                      }}
                    >
                      {showPasswordConfirm ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={mode === 'login' ? handleLogin : handleRegister}
                disabled={loading}
                style={{
                  padding: '16px', borderRadius: 16, marginTop: 4,
                  background: loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
                  color: '#1e293b', fontSize: 16, fontWeight: 700,
                  width: '100%', minHeight: 52,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Even wachten...' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
              </button>

              <button
                onClick={() => {
                  setError(null)
                  setSuccess(null)
                  setMode(mode === 'login' ? 'register' : 'login')
                }}
                style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.5)',
                  background: 'none', border: 'none', padding: '8px',
                  textAlign: 'center',
                }}
              >
                {mode === 'login' ? 'Nog geen account? Registreer' : 'Al een account? Inloggen'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
