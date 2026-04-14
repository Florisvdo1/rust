import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  {
    id: 'vandaag',
    label: 'Vandaag',
    path: '/',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  {
    id: 'planner',
    label: 'Planner',
    path: '/planner',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    id: 'ademhaling',
    label: 'Adem',
    path: '/ademhaling',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z"/><path d="M12 13v4"/>
      </svg>
    ),
  },
  {
    id: 'dagboek',
    label: 'Dagboek',
    path: '/dagboek',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h4v16H4z"/><path d="M8 4h12v16H8"/><path d="M12 8h4M12 12h4M12 16h2"/>
      </svg>
    ),
  },
  {
    id: 'meer',
    label: 'Meer',
    path: '/meer',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </svg>
    ),
  },
]

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/') return 'vandaag'
    return tabs.find(t => path.startsWith(t.path) && t.path !== '/')?.id || 'vandaag'
  }

  const activeTab = getActiveTab()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 'var(--safe-bottom)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 'var(--nav-height)',
        maxWidth: 500,
        margin: '0 auto',
        padding: '0 4px',
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                flex: 1,
                padding: '6px 0',
                position: 'relative',
                minWidth: 56,
                minHeight: 48,
              }}
              aria-label={tab.label}
            >
              <div style={{ position: 'relative' }}>
                {tab.icon(isActive)}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--granite-blue)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--granite-blue)' : 'var(--text-muted)',
                letterSpacing: '0.01em',
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
