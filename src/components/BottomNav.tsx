import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_HEIGHT = 68
const COLLAPSED_HEIGHT = 32

const tabs = [
  {
    id: 'vandaag',
    label: 'Vandaag',
    path: '/',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  {
    id: 'onthouden',
    label: 'Onthouden',
    path: '/onthouden',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
  {
    id: 'planner',
    label: 'Planner',
    path: '/planner',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    id: 'ademhaling',
    label: 'Adem',
    path: '/ademhaling',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z"/>
        <path d="M12 13v4"/>
      </svg>
    ),
  },
  {
    id: 'dagboek',
    label: 'Dagboek',
    path: '/dagboek',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h4v16H4z"/>
        <path d="M8 4h12v16H8"/>
        <path d="M12 8h4M12 12h4M12 16h2"/>
      </svg>
    ),
  },
  {
    id: 'meer',
    label: 'Meer',
    path: '/meer',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2d3a4a' : '#8eaabd'} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    ),
  },
]

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('nav-collapsed') === 'true'
  )

  // Sync CSS variable and body class whenever collapsed changes
  useEffect(() => {
    document.body.classList.toggle('nav-collapsed', collapsed)
    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      collapsed ? `${COLLAPSED_HEIGHT}px` : `${NAV_HEIGHT}px`
    )
  }, [collapsed])

  // Set initial CSS variable on mount
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--bottom-nav-height',
      collapsed ? `${COLLAPSED_HEIGHT}px` : `${NAV_HEIGHT}px`
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('nav-collapsed', String(next))
  }

  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/') return 'vandaag'
    return tabs.find(t => path.startsWith(t.path) && t.path !== '/')?.id || 'vandaag'
  }

  const activeTab = getActiveTab()

  // ── Collapsed state: just a small "open menu" pill ─────────────────
  if (collapsed) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 'calc(var(--safe-bottom) + 4px)',
        height: `calc(${COLLAPSED_HEIGHT}px + var(--safe-bottom))`,
        pointerEvents: 'none',
      }}>
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={toggle}
          style={{
            pointerEvents: 'all',
            background: 'rgba(45,58,74,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
            padding: '6px 20px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(30,41,59,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 28,
          }}
          aria-label="Menu openen"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          Menu openen
        </motion.button>
      </div>
    )
  }

  // ── Visible nav ──────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* "Verbergen" collapse pill — half above nav, centered */}
      <div style={{
        position: 'absolute',
        top: -14,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 101,
        pointerEvents: 'none',
      }}>
        <button
          onClick={toggle}
          style={{
            pointerEvents: 'all',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 14px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label="Navigatie verbergen"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
          Verbergen
        </button>
      </div>

      <nav style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'var(--safe-bottom)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: `${NAV_HEIGHT}px`,
          maxWidth: 540,
          margin: '0 auto',
          padding: '0 2px',
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
                  gap: 2,
                  flex: 1,
                  minWidth: 0,
                  padding: '5px 0',
                  position: 'relative',
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
                        bottom: -5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 3,
                        height: 3,
                        borderRadius: '50%',
                        background: 'var(--granite-blue)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--granite-blue)' : 'var(--text-muted)',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
