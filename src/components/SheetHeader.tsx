import React from 'react'

interface SheetHeaderProps {
  title: string
  onClose: () => void
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title, onClose }) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px', flexShrink: 0 }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-xl)', marginBottom: 4, flexShrink: 0 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
      <button
        onClick={onClose}
        aria-label="Sluiten"
        style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cloud)', fontSize: 18, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >×</button>
    </div>
  </>
)
