import React from 'react'
import { useApp } from '../../store/AppContext'

const TABS = [
  {
    id: 'vandaag',
    label: 'Vandaag',
    svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
  },
  {
    id: 'planner',
    label: 'Planner',
    svg: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
  },
  {
    id: 'onthouden',
    label: 'Onthouden',
    svg: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
  },
  {
    id: 'plaatsen',
    label: 'Plaatsen',
    svg: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
  },
  {
    id: 'dagboek',
    label: 'Dagboek',
    svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'
  },
  {
    id: 'gezondheid',
    label: 'Gezondheid',
    svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
  },
  {
    id: 'ademhaling',
    label: 'Ademhaling',
    svg: '<circle cx="12" cy="12" r="10"/><path d="M8 12s1-4 4-4 4 4 4 4-1 4-4 4-4-4-4-4z"/>'
  },
  {
    id: 'meer',
    label: 'Meer',
    svg: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>'
  }
]

export function NavBar() {
  const { state, setTab } = useApp()

  return (
    <nav style={{
      background: 'rgba(15,26,46,0.88)',
      borderTop: '1px solid rgba(42,61,90,0.6)',
      paddingBottom: 'max(var(--safe-bottom), 6px)',
      backdropFilter: 'blur(24px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      flexShrink: 0,
      zIndex: 100,
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none'
      } as React.CSSProperties}>
        {TABS.map(tab => {
          const active = state.activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                flex: '0 0 auto',
                minWidth: 68,
                height: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 150ms ease',
                color: active ? 'var(--c-accent)' : 'var(--c-text-muted)',
                position: 'relative',
                WebkitTapHighlightColor: 'transparent'
              } as React.CSSProperties}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: tab.svg }}
              />
              <span style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.01em',
                lineHeight: 1
              }}>
                {tab.label}
              </span>
              {active && (
                <span style={{
                  position: 'absolute',
                  bottom: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 18,
                  height: 2,
                  borderRadius: 1,
                  background: 'var(--c-accent)'
                }} />
              )}
            </button>
          )
        })}
      </div>
      <style>{`
        nav div::-webkit-scrollbar { display: none; }
      `}</style>
    </nav>
  )
}
