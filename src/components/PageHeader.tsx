import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
  showSettings?: boolean
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right, showSettings = true }) => {
  const navigate = useNavigate()

  return (
    <div style={{
      paddingTop: 'calc(var(--safe-top) + 12px)',
      paddingLeft: 'var(--space-xl)',
      paddingRight: 'var(--space-xl)',
      paddingBottom: 'var(--space-md)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      minHeight: 'calc(var(--header-height) + var(--safe-top))',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showSettings && (
          <button
            onClick={() => navigate('/meer')}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(45,58,74,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginBottom: subtitle ? 4 : 0,
            }}
            aria-label="Instellingen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--soft-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
        )}
        <div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--granite-blue)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}>{title}</h1>
          {subtitle && (
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginTop: 2,
            }}>{subtitle}</p>
          )}
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
