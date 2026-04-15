import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store'

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
    if (!email.trim() || !password) {
      setError('Vul je e-mailadres en wachtwoord in.')
      return
    }
    setLoading(true)
    setError(null)

    if (!supabase) {
      // Local fallback when Supabase not configured
      setUser({ id: 'local-' + Date.now(), email: email.trim(), username: email.split('@')[0] })
      onComplete()
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError('Inloggen mislukt. Controleer je gegevens.')
    } else if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email ?? email,
        username: (data.user.user_metadata?.username as string) ?? email.split('@')[0],
      })
      onComplete()
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!email.trim() || !username.trim() || !password) {
      setError('Vul alle verplichte velden in.')
      return
    }
    if (password !== passwordConfirm) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.')
      return
    }
    setLoading(true)
    setError(null)

    if (!supabase) {
      setUser({ id: 'local-' + Date.now(), email: email.trim(), username: username.trim() })
      onComplete()
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: undefined,
      },
    })

    if (authError) {
      setError('Registratie mislukt: ' + authError.message)
    } else if (data.user) {
      // Check if email confirmation required
      if (data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? email,
          username: username.trim(),
        })
        onComplete()
      } else {
        setSuccess('Account aangemaakt! Je kunt nu inloggen.')
        setMode('login')
      }
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
                    placeholder="Minimaal 6 tekens"
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
                    Schrijf je wachtwoord ergens veilig op. Wachtwoord wijzigen is in deze versie nog niet beschikbaar.
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
