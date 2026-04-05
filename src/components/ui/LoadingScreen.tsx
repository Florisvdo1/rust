import React from 'react'

export function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--g-bg)', gap: 16
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="var(--c-surface)" stroke="var(--c-border)" strokeWidth="1"/>
        <text x="24" y="31" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="700" fontSize="20" fill="var(--c-baby-blue)" letterSpacing="2">R</text>
      </svg>
      <div style={{
        width: 32, height: 3, borderRadius: 2,
        background: 'var(--c-surface2)', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', background: 'var(--c-accent)',
          animation: 'loading 1.2s ease-in-out infinite',
          borderRadius: 2
        }} />
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
