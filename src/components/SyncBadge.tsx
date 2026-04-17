import React from 'react'

export const SyncBadge: React.FC<{ synced: boolean }> = ({ synced }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 10px', borderRadius: 99,
    background: synced ? 'rgba(107,170,125,0.12)' : 'rgba(142,170,189,0.10)',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
    color: synced ? '#5a9e6e' : 'var(--text-muted)',
    flexShrink: 0,
  }}>
    <div style={{
      width: 5, height: 5, borderRadius: '50%',
      background: synced ? '#6baa7d' : 'var(--text-muted)',
    }} />
    {synced ? 'Cloud' : 'Lokaal'}
  </div>
)
