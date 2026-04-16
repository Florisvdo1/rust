import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SnackbarProps {
  open: boolean
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  duration?: number
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 12px)',
            left: 16,
            right: 16,
            background: 'var(--granite-blue)',
            color: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            zIndex: 150,
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <span style={{ fontSize: 14, flex: 1, lineHeight: 1.4 }}>{message}</span>
          {actionLabel && onAction && (
            <button
              onClick={() => { onAction(); onClose() }}
              style={{ fontSize: 13, fontWeight: 700, color: 'var(--baby-blue)', flexShrink: 0, minHeight: 36, padding: '0 4px' }}
            >
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
