import React, { useState, useCallback, useRef } from 'react'
import { useApp } from '../../store/AppContext'
import { exportAllData, importAllData } from '../../db'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { format } from 'date-fns'

// ─── Toggle Switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  id?: string
}

function Toggle({ value, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        flexShrink: 0,
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        position: 'relative',
        background: value ? 'var(--g-accent)' : 'var(--c-border2, #3a3a4a)',
        transition: 'background 220ms ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
          transition: 'left 220ms cubic-bezier(0.34,1.3,0.64,1)',
          display: 'block',
        }}
      />
    </button>
  )
}

// ─── Setting Row ──────────────────────────────────────────────────────────────

interface SettingRowProps {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
  last?: boolean
}

function SettingRow({ label, description, value, onChange, last }: SettingRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 0',
        borderBottom: last ? 'none' : '1px solid var(--c-border)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 500,
          color: 'var(--c-text-primary)',
          marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 'var(--fs-xs, 11px)',
          color: 'var(--c-text-muted)',
          lineHeight: 1.4,
        }}>
          {description}
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

interface SectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function Section({ title, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      background: 'var(--c-surface)',
      borderRadius: 'var(--r-xl, 16px)',
      border: '1px solid var(--c-border)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderBottom: open ? '1px solid var(--c-border)' : 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          color: 'var(--c-text-secondary, var(--c-text-muted))',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        <span style={{
          color: 'var(--c-text-muted)',
          fontSize: 13,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 220ms ease',
          display: 'inline-block',
          lineHeight: 1,
        }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string
  visible: boolean
  type: 'info' | 'success' | 'error'
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast.visible) return null
  const bg =
    toast.type === 'error' ? '#c0392b' :
    toast.type === 'success' ? '#27ae60' :
    'var(--c-surface)'

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--safe-bottom, 0px) + 88px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bg,
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 10,
      fontSize: 'var(--fs-sm)',
      fontWeight: 500,
      zIndex: 500,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      animation: 'toastFadeIn 200ms ease',
      pointerEvents: 'none',
    }}>
      {toast.message}
      <style>{`
        @keyframes toastFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Meer() {
  const { state, updateSettings } = useApp()
  const { settings } = state

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, type: 'info' })

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, visible: true, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }, [])

  // Export
  const handleExport = useCallback(async () => {
    if (exportLoading) return
    setExportLoading(true)
    try {
      const json = await exportAllData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rust-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Back-up geëxporteerd', 'success')
    } catch {
      showToast('Export mislukt', 'error')
    } finally {
      setExportLoading(false)
    }
  }, [exportLoading, showToast])

  // Import
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportLoading(true)
    try {
      const text = await file.text()
      await importAllData(text)
      showToast('Back-up geïmporteerd', 'success')
    } catch {
      showToast('Import mislukt — controleer het bestand', 'error')
    } finally {
      setImportLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [showToast])

  // Tutorial module info toasts
  const tutorialModules = [
    { label: 'Vandaag', info: 'Het Vandaag-scherm toont je dagelijkse overzicht, planning en prioriteiten.' },
    { label: 'Planner', info: 'Sleep taken naar tijdslots in de Planner voor een rustige dagindeling.' },
    { label: 'Inademen', info: 'Kies een ademhalingsoefening afgestemd op jouw behoeften.' },
    { label: 'Dagboek', info: 'Noteer gedachten en stemmingen in je persoonlijke dagboek.' },
    { label: 'Opslaan', info: 'Sla herinneringen, medicatie en plaatsen veilig op.' },
  ]

  const actionButtonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--r-lg, 12px)',
    border: '1px solid var(--c-border)',
    background: 'var(--c-surface2, var(--c-bg))',
    color: 'var(--c-text-primary)',
    fontSize: 'var(--fs-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 150ms ease',
    marginBottom: 8,
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'var(--c-bg)',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={{
        padding: '0 16px',
        paddingBottom: 'calc(var(--safe-bottom, 0px) + 100px)',
        maxWidth: 480,
        margin: '0 auto',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0 8px',
        }}>
          <h1 style={{
            fontSize: 'var(--fs-xl, 22px)',
            fontWeight: 700,
            color: 'var(--c-text-primary)',
            margin: 0,
          }}>
            Meer
          </h1>
          <span style={{
            fontSize: 'var(--fs-xs, 11px)',
            color: 'var(--c-text-muted)',
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: 20,
            padding: '3px 10px',
          }}>
            v1.0.0
          </span>
        </div>

        {/* ── Logo Block ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0 20px',
          gap: 8,
        }}>
          {/* SVG Logo */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="56" height="56" rx="16" fill="var(--g-accent, #5B8DEF)" opacity="0.15" />
            <circle cx="28" cy="28" r="12" stroke="var(--g-accent, #5B8DEF)" strokeWidth="2.5" fill="none" />
            {/* Inhale arc – top */}
            <path
              d="M28 16 Q36 22 36 28"
              stroke="var(--g-accent, #5B8DEF)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            {/* Center dot */}
            <circle cx="28" cy="28" r="3" fill="var(--g-accent, #5B8DEF)" />
          </svg>

          <span style={{
            fontSize: 'var(--fs-xl, 22px)',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: 'var(--c-text-primary)',
          }}>
            RUST
          </span>
          <span style={{
            fontSize: 'var(--fs-xs, 11px)',
            color: 'var(--c-text-muted)',
            letterSpacing: '0.04em',
          }}>
            Kalme dagelijkse ondersteuning
          </span>
        </div>

        {/* ── Weergave & Beleving ── */}
        <Section title="Weergave & Beleving" defaultOpen={true}>
          <SettingRow
            label="Verminderde beweging"
            description="Minimaliseert animaties en overgangen in de app."
            value={settings.reducedMotion}
            onChange={v => updateSettings({ reducedMotion: v })}
          />
          <SettingRow
            label="Lage sensorische modus"
            description="Rustiger kleurgebruik en minder visuele prikkels."
            value={settings.lowSensory}
            onChange={v => updateSettings({ lowSensory: v })}
          />
          <SettingRow
            label="Haptische feedback"
            description="Trilling bij interacties, indien ondersteund."
            value={settings.haptics}
            onChange={v => updateSettings({ haptics: v })}
          />
          <SettingRow
            label="Geavanceerde ademhaling tonen"
            description="Toon uitgebreide opties in het Inademen-scherm."
            value={settings.showAdvancedBreathing}
            onChange={v => updateSettings({ showAdvancedBreathing: v })}
            last
          />
        </Section>

        {/* ── Ademhaling ── */}
        <Section title="Ademhaling">
          <SettingRow
            label="Beginnersmodus"
            description="Eenvoudigere oefeningen en meer uitleg voor nieuwe gebruikers."
            value={settings.beginnerMode}
            onChange={v => updateSettings({ beginnerMode: v })}
          />
          <SettingRow
            label="Geavanceerde oefeningen"
            description="Toon uitgebreide ademhalingstechnieken en variaties."
            value={settings.showAdvancedBreathing}
            onChange={v => updateSettings({ showAdvancedBreathing: v })}
          />
          <SettingRow
            label="Lichaamsgeleiders"
            description="Visuele gids die meebeweegt met je ademhaling."
            value={settings.bodyGuides}
            onChange={v => updateSettings({ bodyGuides: v })}
          />
          <SettingRow
            label="Aanmoedigingsberichten"
            description="Kleine motiverende berichten tijdens oefeningen."
            value={settings.encouragement}
            onChange={v => updateSettings({ encouragement: v })}
            last
          />
        </Section>

        {/* ── Gegevens ── */}
        <Section title="Gegevens">
          <div style={{ paddingTop: 8, paddingBottom: 4 }}>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              style={{
                ...actionButtonStyle,
                opacity: exportLoading ? 0.5 : 1,
              }}
            >
              <span style={{ marginRight: 8 }}>⬇</span>
              {exportLoading ? 'Exporteren…' : 'Exporteer back-up'}
            </button>

            <button
              onClick={handleImportClick}
              disabled={importLoading}
              style={{
                ...actionButtonStyle,
                opacity: importLoading ? 0.5 : 1,
              }}
            >
              <span style={{ marginRight: 8 }}>⬆</span>
              {importLoading ? 'Importeren…' : 'Importeer back-up'}
            </button>

            <div style={{
              marginTop: 8,
              marginBottom: 12,
              padding: '12px 14px',
              background: 'var(--c-bg)',
              border: '1px solid var(--c-border)',
              borderRadius: 10,
            }}>
              <p style={{
                margin: 0,
                fontSize: 'var(--fs-xs, 11px)',
                color: 'var(--c-text-muted)',
                lineHeight: 1.6,
              }}>
                Jouw gegevens worden lokaal opgeslagen op dit apparaat. Exporteer regelmatig een back-up om gegevens te bewaren.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Over RUST ── */}
        <Section title="Over RUST">
          <div style={{ paddingTop: 12, paddingBottom: 4 }}>

            {/* App identity */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--g-accent, #5B8DEF)',
                opacity: 0.15,
                flexShrink: 0,
              }} />
              <div>
                <div style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 700,
                  color: 'var(--c-text-primary)',
                }}>
                  RUST — versie 1.0.0
                </div>
                <div style={{
                  fontSize: 'var(--fs-xs, 11px)',
                  color: 'var(--c-text-muted)',
                }}>
                  Kalme dagelijkse ondersteuning
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--c-bg)',
              border: '1px solid var(--c-border)',
              borderRadius: 10,
              marginBottom: 10,
            }}>
              <p style={{ margin: 0, fontSize: 'var(--fs-xs, 11px)', color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
                RUST is een persoonlijk hulpmiddel, geen medische behandeling. Raadpleeg bij klachten altijd een professional.
              </p>
            </div>

            {/* Privacy */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--c-bg)',
              border: '1px solid var(--c-border)',
              borderRadius: 10,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 'var(--fs-xs, 11px)',
                fontWeight: 600,
                color: 'var(--c-text-secondary, var(--c-text-muted))',
                marginBottom: 4,
                letterSpacing: '0.03em',
              }}>
                Privacy
              </div>
              <p style={{ margin: 0, fontSize: 'var(--fs-xs, 11px)', color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
                Alle gegevens blijven op jouw apparaat. Niets wordt gedeeld of opgeslagen in de cloud.
              </p>
            </div>

            {/* Tutorial links */}
            <div style={{
              fontSize: 'var(--fs-xs, 11px)',
              fontWeight: 600,
              color: 'var(--c-text-secondary, var(--c-text-muted))',
              marginBottom: 8,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
              Hulp per module
            </div>
            {tutorialModules.map((m, i) => (
              <button
                key={m.label}
                onClick={() => showToast(m.info, 'info')}
                style={{
                  ...actionButtonStyle,
                  marginBottom: i === tutorialModules.length - 1 ? 12 : 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Hulp: {m.label}</span>
                <span style={{ color: 'var(--c-text-muted)', fontSize: 12 }}>?</span>
              </button>
            ))}
          </div>
        </Section>

      </div>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  )
}
