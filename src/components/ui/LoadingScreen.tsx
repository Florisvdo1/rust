import React from 'react'

export function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--g-bg)', gap: 20
    }}>
      <svg width="120" height="48" viewBox="0 0 120 48" fill="none" aria-label="RUST">
        <defs>
          <linearGradient id="loadGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6896c8"/>
            <stop offset="100%" stopColor="#a8c8e0"/>
          </linearGradient>
        </defs>
        <text
          x="60" y="36"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="800"
          fontSize="32"
          letterSpacing="8"
          fill="url(#loadGrad)"
        >RUST</text>
      </svg>
      <div style={{
        width: 40, height: 3, borderRadius: 2,
        background: 'var(--c-surface2)', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', background: 'var(--g-accent)',
          animation: 'loading 1.2s ease-in-out infinite',
          borderRadius: 2
        }} />
      </div>
      <div style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--c-text-subtle)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        Kalme dagelijkse ondersteuning
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 80%; margin-left: 10%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
