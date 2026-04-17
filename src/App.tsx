import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { ConfirmDialog } from '@/components/ConfirmDialog'
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
  const { user, isGuest, setUser, guestDataMigrationDone, setGuestDataMigrationDone, clearUserData, notes, places, plannerItems } = useStore()
  const [authChecked, setAuthChecked] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showMigration, setShowMigration] = useState(false)
  // Track whether the current auth flow came from a guest session
  const hadGuestDataRef = useRef(false)

  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email ?? '',
            username: (data.session.user.user_metadata?.username as string) ?? data.session.user.email?.split('@')[0],
          })
        } else {
          // No valid Supabase session — clear any stale persisted user to prevent bypass
          setUser(null)
        }
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
      // Capture whether there is existing local data before auth screen opens
      hadGuestDataRef.current = notes.length > 0 || places.length > 0 || plannerItems.length > 0
      setShowAuth(true)
    } else {
      setShowAuth(false)
    }
  }, [authChecked, user, isGuest]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthComplete = () => {
    // After a successful login/register, if there was guest data and migration
    // has never been prompted, show the one-time migration dialog
    if (hadGuestDataRef.current && !guestDataMigrationDone) {
      setShowMigration(true)
    }
    setShowAuth(false)
  }

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
        onComplete={handleAuthComplete}
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

      {/* One-time guest data migration prompt */}
      <ConfirmDialog
        open={showMigration}
        title="Gast-gegevens gevonden"
        message="Je hebt eerder notities, plaatsen of andere gegevens als gast aangemaakt. Wil je deze bewaren?"
        confirmLabel="Bewaren"
        cancelLabel="Verwijderen"
        danger={false}
        onConfirm={() => { setGuestDataMigrationDone(); setShowMigration(false) }}
        onCancel={() => { clearUserData(); setGuestDataMigrationDone(); setShowMigration(false) }}
      />
    </BrowserRouter>
  )
}
