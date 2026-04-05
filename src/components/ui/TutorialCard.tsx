import React, { useState } from 'react'

interface TutorialCardProps {
  title: string
  why: string
  steps: string[]
  example: string
  firstAction: string
  onAction: () => void
}

export function TutorialCard({ title, why, steps, example, firstAction, onAction }: TutorialCardProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3050 0%, #243660 100%)',
      border: '1px solid var(--c-border2)',
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-5)',
      marginBottom: 'var(--sp-4)',
      position: 'relative'
    }}>
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', top: 12, right: 12,
          color: 'var(--c-text-muted)', fontSize: 18, lineHeight: 1,
          padding: 4, background: 'transparent', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        aria-label="Sluit hulp"
      >
        ×
      </button>
      <div style={{
        fontSize: 'var(--fs-xs)', color: 'var(--c-baby-blue)', fontWeight: 600,
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em'
      }}>
        Hoe werkt dit?
      </div>
      <div style={{
        fontWeight: 600, fontSize: 'var(--fs-md)',
        color: 'var(--c-text-primary)', marginBottom: 8
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', marginBottom: 12
      }}>
        {why}
      </div>
      <ol style={{
        paddingLeft: 18, marginBottom: 12,
        display: 'flex', flexDirection: 'column', gap: 4,
        margin: '0 0 12px 0', paddingInlineStart: 18
      }}>
        {steps.map((s, i) => (
          <li key={i} style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
            {s}
          </li>
        ))}
      </ol>
      <div style={{
        background: 'rgba(74,120,168,0.1)', borderRadius: 'var(--r-sm)',
        padding: '8px 12px', marginBottom: 12,
        fontSize: 'var(--fs-sm)', color: 'var(--c-baby-blue)', fontStyle: 'italic'
      }}>
        Voorbeeld: {example}
      </div>
      <button
        onClick={onAction}
        style={{
          background: 'var(--g-accent)', color: 'white',
          borderRadius: 'var(--r-md)', padding: '10px 16px',
          fontSize: 'var(--fs-sm)', fontWeight: 500,
          width: '100%', textAlign: 'center',
          border: 'none', cursor: 'pointer',
          display: 'block'
        }}
      >
        {firstAction}
      </button>
    </div>
  )
}
