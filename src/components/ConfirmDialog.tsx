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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 400 }}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
            width: 'min(320px, calc(100vw - 40px))',
            zIndex: 201,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
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
        </motion.div>
      </>
    )}
  </AnimatePresence>,
  document.body
)
