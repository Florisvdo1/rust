import React, { useEffect, useRef } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: string
}

export function BottomSheet({ open, onClose, title, children, height = 'auto' }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
    }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div
        ref={ref}
        style={{
          position: 'relative',
          background: 'var(--c-surface)',
          borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0',
          border: '1px solid var(--c-border)',
          borderBottom: 'none',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'calc(var(--safe-bottom) + 8px)',
          animation: 'slideUp 250ms cubic-bezier(0.34,1.56,0.64,1)'
        }}
      >
        {/* Header with close button */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 10px',
          borderBottom: title ? '1px solid var(--c-border)' : 'none',
          flexShrink: 0
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {title ? (
              <h3 style={{
                fontSize: 'var(--fs-md)', fontWeight: 600,
                color: 'var(--c-text-primary)', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {title}
              </h3>
            ) : (
              <div style={{
                width: 32, height: 4, borderRadius: 2,
                background: 'var(--c-border2)', margin: '0 auto'
              }} />
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            style={{
              width: 32, height: 32, borderRadius: 'var(--r-full)',
              background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
              color: 'var(--c-text-muted)', cursor: 'pointer',
              fontSize: 16, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginLeft: 12,
              transition: 'background var(--t-base)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
