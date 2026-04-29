import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Verwijderen',
  cancelLabel = 'Annuleren',
  danger = true,
  onConfirm,
  onCancel,
}) => createPortal(
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
        />
        {/* Centering container — flex avoids CSS transform conflict with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 400 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 201,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              width: '100%',
              maxWidth: 320,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              pointerEvents: 'all',
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: message ? 8 : 20 }}>{title}</h3>
            {message && (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                {message}
              </p>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onCancel}
                className="btn-secondary"
                style={{ flex: 1, minHeight: 44 }}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={danger ? 'btn-danger' : 'btn-primary'}
                style={{ flex: 1, minHeight: 44 }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>,
  document.body
)
