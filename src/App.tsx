import React, { Suspense, lazy } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import { NavBar } from './components/layout/NavBar'
import { LoadingScreen } from './components/ui/LoadingScreen'

const Vandaag = lazy(() => import('./screens/Vandaag/Vandaag'))
const Planner = lazy(() => import('./screens/Planner/Planner'))
const Onthouden = lazy(() => import('./screens/Onthouden/Onthouden'))
const Plaatsen = lazy(() => import('./screens/Plaatsen/Plaatsen'))
const Dagboek = lazy(() => import('./screens/Dagboek/Dagboek'))
const Gezondheid = lazy(() => import('./screens/Gezondheid/Gezondheid'))
const Ademhaling = lazy(() => import('./screens/Ademhaling/Ademhaling'))
const Meer = lazy(() => import('./screens/Meer/Meer'))

function AppInner() {
  const { state } = useApp()

  if (state.loading) return <LoadingScreen />

  const screens: Record<string, React.ReactNode> = {
    vandaag: <Vandaag />,
    planner: <Planner />,
    onthouden: <Onthouden />,
    plaatsen: <Plaatsen />,
    dagboek: <Dagboek />,
    gezondheid: <Gezondheid />,
    ademhaling: <Ademhaling />,
    meer: <Meer />
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--g-bg)', overflow: 'hidden'
    }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Suspense fallback={<LoadingScreen />}>
          {Object.entries(screens).map(([key, screen]) => (
            <div key={key} style={{
              position: 'absolute', inset: 0,
              opacity: state.activeTab === key ? 1 : 0,
              pointerEvents: state.activeTab === key ? 'auto' : 'none',
              transition: 'opacity 200ms ease',
              display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
              {screen}
            </div>
          ))}
        </Suspense>
      </div>
      <NavBar />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
