import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { VandaagPage } from '@/pages/VandaagPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { OnthoudenPage } from '@/pages/OnthoudenPage'
import { PlaatsenPage } from '@/pages/PlaatsenPage'
import { DagboekPage } from '@/pages/DagboekPage'
import { GezondheidPage } from '@/pages/GezondheidPage'
import { AdemhalingPage } from '@/pages/AdemhalingPage'
import { MeerPage } from '@/pages/MeerPage'
import { AuthPage } from '@/pages/AuthPage'
import { useStore } from '@/store'
import { supabase } from '@/lib/supabase'

export const App: React.FC = () => {
  const { user, isGuest, setUser } = useStore()
  const [authChecked, setAuthChecked] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Restore session from Supabase if configured
    const checkSession = async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email ?? '',
            username: (data.session.user.user_metadata?.username as string) ?? data.session.user.email?.split('@')[0],
          })
        }
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email ?? '',
              username: (session.user.user_metadata?.username as string) ?? session.user.email?.split('@')[0],
            })
          } else {
            setUser(null)
          }
        })
      }
      setAuthChecked(true)
    }
    checkSession()
  }, [setUser])

  useEffect(() => {
    if (authChecked && !user && !isGuest) {
      setShowAuth(true)
    } else {
      setShowAuth(false)
    }
  }, [authChecked, user, isGuest])

  if (!authChecked) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh',
        background: 'linear-gradient(160deg, #1e293b 0%, #2d3a4a 100%)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.04em' }}>R</span>
        </div>
      </div>
    )
  }

  if (showAuth) {
    return (
      <AuthPage
        onComplete={() => setShowAuth(false)}
        onGuest={() => setShowAuth(false)}
      />
    )
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100dvh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<VandaagPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/onthouden" element={<OnthoudenPage />} />
            <Route path="/plaatsen" element={<PlaatsenPage />} />
            <Route path="/dagboek" element={<DagboekPage />} />
            <Route path="/gezondheid" element={<GezondheidPage />} />
            <Route path="/ademhaling" element={<AdemhalingPage />} />
            <Route path="/meer" element={<MeerPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
