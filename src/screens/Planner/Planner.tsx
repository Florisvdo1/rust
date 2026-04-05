import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import { format, addDays } from 'date-fns'
import { nl } from 'date-fns/locale'
import {
  PlannerItem,
  getPlannerItems,
  savePlannerItem,
  deletePlannerItem,
} from '../../db'
import { Icon, ICONS, ICON_CATEGORIES, IconDef } from '../../components/icons/IconLibrary'
import { BottomSheet } from '../../components/ui/BottomSheet'

// ─── Utilities ────────────────────────────────────────────────────────────────

const uid = (): string =>
  Math.random().toString(36).slice(2) + Date.now().toString(36)

function todayBase(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function dateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

// ─── Slot generation ──────────────────────────────────────────────────────────

interface SlotDef {
  key: string   // 'HH:MM'
  hour: number
  minute: number
  isHourStart: boolean
  label: string  // display label e.g. '06:00'
}

function generateSlots(): SlotDef[] {
  const slots: SlotDef[] = []
  // 06:00 → 28:45 (which is 04:45 next day) = 23 hours = 92 slots
  for (let h = 6; h < 29; h++) {
    const displayHour = h % 24
    for (const m of [0, 15, 30, 45]) {
      const key = `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({
        key,
        hour: displayHour,
        minute: m,
        isHourStart: m === 0,
        label: `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      })
    }
  }
  return slots
}

const ALL_SLOTS = generateSlots()

// ─── Duration options ─────────────────────────────────────────────────────────

const DURATION_OPTIONS: { label: string; minutes: number }[] = [
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
  { label: '25 min', minutes: 25 },
  { label: '30 min', minutes: 30 },
  { label: '35 min', minutes: 35 },
  { label: '40 min', minutes: 40 },
  { label: '45 min', minutes: 45 },
  { label: '50 min', minutes: 50 },
  { label: '55 min', minutes: 55 },
  { label: '1 uur', minutes: 60 },
  { label: '1,5 uur', minutes: 90 },
  { label: '2 uur', minutes: 120 },
  { label: '2,5 uur', minutes: 150 },
  { label: '3 uur', minutes: 180 },
  { label: '4 uur', minutes: 240 },
  { label: '5 uur', minutes: 300 },
  { label: '6 uur', minutes: 360 },
  { label: '7 uur', minutes: 420 },
  { label: '8 uur', minutes: 480 },
  { label: '9 uur', minutes: 540 },
  { label: '10 uur', minutes: 600 },
]

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}u ${m}m` : `${h}u`
}

// ─── Day tabs ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Vandaag', 'Morgen', 'Dag 3', 'Dag 4', 'Dag 5']

// ─── Inline SVG icon renderer ─────────────────────────────────────────────────

function SvgIcon({ svg, size = 20, color = '#fff' }: { svg: string; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ flexShrink: 0, display: 'block' }}
    />
  )
}

// ─── Check icon ───────────────────────────────────────────────────────────────

function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Trash icon ───────────────────────────────────────────────────────────────

function TrashIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

// ─── Copy icon ────────────────────────────────────────────────────────────────

function CopyIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// ─── Main Planner component ───────────────────────────────────────────────────

export function Planner() {
  const base = useMemo(() => todayBase(), [])

  // ── State ──────────────────────────────────────────────────────────────────
  const [dayIndex, setDayIndex] = useState(0)
  const [items, setItems] = useState<PlannerItem[]>([])
  const [loading, setLoading] = useState(true)

  // Deck state
  const [deckExpanded, setDeckExpanded] = useState(false)
  const [deckSearch, setDeckSearch] = useState('')
  const [deckCategory, setDeckCategory] = useState<string>('Alle')
  const [recentIconIds, setRecentIconIds] = useState<string[]>([])

  // Tap-mode (no drag)
  const [selectedIcon, setSelectedIcon] = useState<IconDef | null>(null)

  // Drag state
  const draggingRef = useRef(false)
  const dragIconRef = useRef<IconDef | null>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const activeSlotRef = useRef<string | null>(null)
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Slot refs for hit-testing
  const slotElRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Edit sheet
  const [editItem, setEditItem] = useState<PlannerItem | null>(null)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  // Duration sheet
  const [durationSheetOpen, setDurationSheetOpen] = useState(false)

  // Scrollable timeline ref (to prevent scroll during drag)
  const timelineRef = useRef<HTMLDivElement>(null)

  // ── Computed date ──────────────────────────────────────────────────────────
  const selectedDate = useMemo(
    () => addDays(base, dayIndex),
    [base, dayIndex]
  )
  const selectedDateStr = useMemo(() => dateKey(selectedDate), [selectedDate])

  // ── Load items when date changes ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getPlannerItems(selectedDateStr).then((result) => {
      if (!cancelled) {
        setItems(result)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [selectedDateStr])

  // ── Items keyed by slot ────────────────────────────────────────────────────
  const itemsBySlot = useMemo(() => {
    const map = new Map<string, PlannerItem>()
    for (const item of items) {
      map.set(item.slotKey, item)
    }
    return map
  }, [items])

  // ── Filtered icons ─────────────────────────────────────────────────────────
  const filteredIcons = useMemo(() => {
    let list = ICONS
    if (deckCategory !== 'Alle') {
      list = list.filter((ic) => ic.category === deckCategory)
    }
    if (deckSearch.trim()) {
      const q = deckSearch.trim().toLowerCase()
      list = list.filter(
        (ic) =>
          ic.label.toLowerCase().includes(q) ||
          ic.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [deckCategory, deckSearch])

  const recentIcons = useMemo(
    () =>
      recentIconIds
        .map((id) => ICONS.find((ic) => ic.id === id))
        .filter(Boolean) as IconDef[],
    [recentIconIds]
  )

  // ── Add recent icon ────────────────────────────────────────────────────────
  const markIconUsed = useCallback((iconId: string) => {
    setRecentIconIds((prev) => {
      const next = [iconId, ...prev.filter((id) => id !== iconId)].slice(0, 5)
      return next
    })
  }, [])

  // ── Place item in slot ─────────────────────────────────────────────────────
  const placeItem = useCallback(
    async (icon: IconDef, slotKey: string) => {
      const existing = itemsBySlot.get(slotKey)
      const now = Date.now()
      const item: PlannerItem = existing
        ? { ...existing, iconId: icon.id, label: icon.label, updatedAt: now }
        : {
            id: uid(),
            date: selectedDateStr,
            slotKey,
            iconId: icon.id,
            label: icon.label,
            duration: 30,
            completed: false,
            createdAt: now,
            updatedAt: now,
          }
      await savePlannerItem(item)
      markIconUsed(icon.id)
      setItems((prev) => {
        const next = prev.filter((i) => i.slotKey !== slotKey)
        return [...next, item]
      })
    },
    [itemsBySlot, selectedDateStr, markIconUsed]
  )

  // ── Delete item ────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (item: PlannerItem) => {
    await deletePlannerItem(item.id)
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setEditSheetOpen(false)
    setEditItem(null)
  }, [])

  // ── Toggle complete ────────────────────────────────────────────────────────
  const toggleComplete = useCallback(async (item: PlannerItem) => {
    const updated = { ...item, completed: !item.completed, updatedAt: Date.now() }
    await savePlannerItem(updated)
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    if (editItem?.id === updated.id) setEditItem(updated)
  }, [editItem])

  // ── Duplicate item ─────────────────────────────────────────────────────────
  const duplicateItem = useCallback(
    async (item: PlannerItem) => {
      // Find next empty slot after current
      const currentIdx = ALL_SLOTS.findIndex((s) => s.key === item.slotKey)
      let targetSlot: string | null = null
      for (let i = currentIdx + 1; i < ALL_SLOTS.length; i++) {
        const key = ALL_SLOTS[i].key
        if (!itemsBySlot.has(key)) {
          targetSlot = key
          break
        }
      }
      if (!targetSlot) return
      const now = Date.now()
      const copy: PlannerItem = {
        ...item,
        id: uid(),
        slotKey: targetSlot,
        createdAt: now,
        updatedAt: now,
      }
      await savePlannerItem(copy)
      setItems((prev) => [...prev, copy])
      setEditSheetOpen(false)
    },
    [itemsBySlot]
  )

  // ── Update duration ────────────────────────────────────────────────────────
  const updateDuration = useCallback(
    async (minutes: number) => {
      if (!editItem) return
      const updated = { ...editItem, duration: minutes, updatedAt: Date.now() }
      await savePlannerItem(updated)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setEditItem(updated)
      setDurationSheetOpen(false)
    },
    [editItem]
  )

  // ─── Tap slot (for tap-mode icon placement) ────────────────────────────────
  const handleSlotTap = useCallback(
    (slotKey: string) => {
      if (selectedIcon) {
        placeItem(selectedIcon, slotKey)
        setSelectedIcon(null)
        return
      }
      const item = itemsBySlot.get(slotKey)
      if (item) {
        setEditItem(item)
        setEditSheetOpen(true)
      }
    },
    [selectedIcon, itemsBySlot, placeItem]
  )

  // ─── Drag & Drop ───────────────────────────────────────────────────────────

  const createGhost = useCallback((icon: IconDef, x: number, y: number) => {
    const ghost = document.createElement('div')
    ghost.style.cssText = `
      position: fixed;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--c-surface2), var(--c-surface3));
      border: 1.5px solid var(--c-accent);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(74,120,168,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%) scale(1.08);
      transition: transform 100ms ease;
      will-change: transform, left, top;
    `
    ghost.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${icon.svg}
      </svg>
    `
    ghost.style.left = `${x}px`
    ghost.style.top = `${y}px`
    document.body.appendChild(ghost)
    ghostRef.current = ghost
  }, [])

  const removeGhost = useCallback(() => {
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current)
      ghostRef.current = null
    }
  }, [])

  const findSlotUnder = useCallback((x: number, y: number): string | null => {
    for (const [key, el] of slotElRefs.current.entries()) {
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return key
      }
    }
    return null
  }, [])

  const handleDeckIconPointerDown = useCallback(
    (e: React.PointerEvent, icon: IconDef) => {
      e.preventDefault()
      e.stopPropagation()

      draggingRef.current = true
      dragIconRef.current = icon
      setIsDragging(true)
      setSelectedIcon(null)

      createGhost(icon, e.clientX, e.clientY)

      // Prevent timeline scroll during drag
      if (timelineRef.current) {
        timelineRef.current.style.overflowY = 'hidden'
      }

      const onMove = (me: PointerEvent) => {
        if (!draggingRef.current) return
        if (ghostRef.current) {
          ghostRef.current.style.left = `${me.clientX}px`
          ghostRef.current.style.top = `${me.clientY}px`
        }
        const slot = findSlotUnder(me.clientX, me.clientY)
        if (slot !== activeSlotRef.current) {
          activeSlotRef.current = slot
          setActiveSlot(slot)
        }
      }

      const onUp = (ue: PointerEvent) => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onUp)

        const slot = findSlotUnder(ue.clientX, ue.clientY)
        removeGhost()

        if (slot && dragIconRef.current) {
          placeItem(dragIconRef.current, slot)
        }

        draggingRef.current = false
        dragIconRef.current = null
        activeSlotRef.current = null
        setActiveSlot(null)
        setIsDragging(false)

        if (timelineRef.current) {
          timelineRef.current.style.overflowY = 'auto'
        }
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onUp)
    },
    [createGhost, removeGhost, findSlotUnder, placeItem]
  )

  const handleDeckIconTap = useCallback((icon: IconDef) => {
    if (isDragging) return
    setSelectedIcon((prev) => (prev?.id === icon.id ? null : icon))
    setDeckExpanded(false)
  }, [isDragging])

  // ─── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      removeGhost()
    }
  }, [removeGhost])

  // ─── Categories for deck ───────────────────────────────────────────────────
  const allCategories = useMemo(() => ['Alle', ...ICON_CATEGORIES], [])

  // ─── Register slot ref ────────────────────────────────────────────────────
  const registerSlotRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) {
      slotElRefs.current.set(key, el)
    } else {
      slotElRefs.current.delete(key)
    }
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--c-bg)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Day selector header ────────────────────────────────────────────── */}
      <DayTabs
        dayIndex={dayIndex}
        onSelect={setDayIndex}
        base={base}
      />

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <div
        ref={timelineRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'var(--c-bg2)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loading ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 200, color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)',
          }}>
            Laden…
          </div>
        ) : (
          <div style={{ padding: '8px 0 24px' }}>
            {ALL_SLOTS.map((slot) => {
              const item = itemsBySlot.get(slot.key)
              const isActive = activeSlot === slot.key
              const isSelected = selectedIcon !== null

              return (
                <SlotRow
                  key={slot.key}
                  slot={slot}
                  item={item}
                  isActive={isActive}
                  isSelectedMode={isSelected}
                  registerRef={registerSlotRef}
                  onTap={handleSlotTap}
                  onEditTap={(item) => {
                    setEditItem(item)
                    setEditSheetOpen(true)
                  }}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* ── Icon deck ─────────────────────────────────────────────────────── */}
      <IconDeck
        expanded={deckExpanded}
        onToggle={() => setDeckExpanded((v) => !v)}
        search={deckSearch}
        onSearchChange={setDeckSearch}
        category={deckCategory}
        onCategoryChange={setDeckCategory}
        categories={allCategories}
        icons={filteredIcons}
        recentIcons={recentIcons}
        selectedIconId={selectedIcon?.id ?? null}
        onIconPointerDown={handleDeckIconPointerDown}
        onIconTap={handleDeckIconTap}
      />

      {/* ── Selected icon hint ─────────────────────────────────────────────── */}
      {selectedIcon && !isDragging && (
        <div style={{
          position: 'fixed',
          bottom: deckExpanded ? 360 : 180,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(74,120,168,0.9)',
          color: '#fff',
          padding: '6px 16px',
          borderRadius: 20,
          fontSize: 'var(--fs-xs)',
          fontWeight: 600,
          pointerEvents: 'none',
          zIndex: 100,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          Tik een tijdslot om te plaatsen
        </div>
      )}

      {/* ── Edit sheet ────────────────────────────────────────────────────── */}
      <BottomSheet
        open={editSheetOpen}
        onClose={() => { setEditSheetOpen(false); setEditItem(null) }}
        title={editItem?.label ?? ''}
      >
        {editItem && (
          <EditItemContent
            item={editItem}
            onToggleComplete={() => toggleComplete(editItem)}
            onDelete={() => removeItem(editItem)}
            onDuplicate={() => duplicateItem(editItem)}
            onChangeDuration={() => {
              setEditSheetOpen(false)
              setDurationSheetOpen(true)
            }}
          />
        )}
      </BottomSheet>

      {/* ── Duration sheet ────────────────────────────────────────────────── */}
      <BottomSheet
        open={durationSheetOpen}
        onClose={() => {
          setDurationSheetOpen(false)
          if (editItem) setEditSheetOpen(true)
        }}
        title="Duur instellen"
      >
        <DurationPicker
          current={editItem?.duration ?? 30}
          onSelect={updateDuration}
        />
      </BottomSheet>
    </div>
  )
}

// ─── DayTabs ──────────────────────────────────────────────────────────────────

interface DayTabsProps {
  dayIndex: number
  onSelect: (i: number) => void
  base: Date
}

function DayTabs({ dayIndex, onSelect, base }: DayTabsProps) {
  return (
    <div style={{
      display: 'flex',
      flexShrink: 0,
      background: 'var(--c-surface)',
      borderBottom: '1px solid var(--c-border)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {DAY_LABELS.map((label, i) => {
        const date = addDays(base, i)
        const dateShort = format(date, 'dd MMM', { locale: nl })
        const active = dayIndex === i
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              flex: '0 0 auto',
              minWidth: 80,
              padding: '12px 16px 10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--c-accent)' : 'var(--c-text-muted)',
              letterSpacing: active ? 0.2 : 0,
              transition: 'color 150ms ease, font-weight 150ms ease',
            }}>
              {label}
            </span>
            <span style={{
              fontSize: 'var(--fs-xs)',
              color: active ? 'var(--c-text-secondary)' : 'var(--c-text-subtle)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {dateShort}
            </span>
            {active && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '20%',
                right: '20%',
                height: 2,
                borderRadius: 1,
                background: 'var(--c-accent)',
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── SlotRow ──────────────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: SlotDef
  item: PlannerItem | undefined
  isActive: boolean
  isSelectedMode: boolean
  registerRef: (key: string, el: HTMLDivElement | null) => void
  onTap: (slotKey: string) => void
  onEditTap: (item: PlannerItem) => void
}

const SlotRow = React.memo(function SlotRow({
  slot,
  item,
  isActive,
  isSelectedMode,
  registerRef,
  onTap,
  onEditTap,
}: SlotRowProps) {
  const icon = item ? ICONS.find((ic) => ic.id === item.iconId) : undefined

  const slotStyle: React.CSSProperties = {
    background: isActive
      ? 'rgba(74,120,168,0.15)'
      : 'rgba(26,39,64,0.6)',
    border: `1px solid ${isActive ? 'var(--c-accent)' : 'var(--c-border)'}`,
    borderRadius: 8,
    minHeight: 52,
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    gap: 8,
    cursor: item ? 'pointer' : isSelectedMode ? 'crosshair' : 'default',
    boxShadow: isActive ? '0 0 0 2px rgba(74,120,168,0.3)' : undefined,
    transition: 'border-color 100ms ease, background 100ms ease, box-shadow 100ms ease',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
    flex: 1,
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '2px 12px',
      gap: 8,
    }}>
      {/* Hour label */}
      <div style={{
        width: 38,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        {slot.isHourStart ? (
          <span style={{
            fontSize: 12,
            color: 'var(--c-text-muted)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
            lineHeight: 1,
          }}>
            {String(slot.hour).padStart(2, '0')}:00
          </span>
        ) : (
          <span style={{
            fontSize: 10,
            color: 'var(--c-text-subtle)',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            :{String(slot.minute).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Slot holder */}
      <div
        ref={(el) => registerRef(slot.key, el)}
        style={slotStyle}
        onClick={() => {
          if (item) {
            onEditTap(item)
          } else {
            onTap(slot.key)
          }
        }}
      >
        {item && icon ? (
          <PlacedItemView item={item} icon={icon} />
        ) : isSelectedMode ? (
          <div style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--c-text-subtle)',
            fontStyle: 'italic',
          }}>
            Tik om hier te plaatsen
          </div>
        ) : null}
      </div>
    </div>
  )
})

// ─── PlacedItemView ───────────────────────────────────────────────────────────

interface PlacedItemViewProps {
  item: PlannerItem
  icon: IconDef
}

function PlacedItemView({ item, icon }: PlacedItemViewProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      opacity: item.completed ? 0.5 : 1,
      transition: 'opacity 200ms ease',
    }}>
      {/* Icon bubble */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'linear-gradient(135deg, var(--c-surface2), var(--c-surface3))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '1px solid var(--c-border2)',
      }}>
        <SvgIcon svg={icon.svg} size={20} />
      </div>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          color: item.completed ? 'var(--c-text-muted)' : 'var(--c-text-primary)',
          textDecoration: item.completed ? 'line-through' : 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.label}
        </div>
      </div>

      {/* Duration badge */}
      <div style={{
        flexShrink: 0,
        background: item.completed
          ? 'rgba(74,153,112,0.15)'
          : 'rgba(74,120,168,0.15)',
        border: `1px solid ${item.completed ? 'rgba(74,153,112,0.3)' : 'rgba(74,120,168,0.3)'}`,
        borderRadius: 6,
        padding: '2px 7px',
        fontSize: 'var(--fs-xs)',
        color: item.completed ? 'var(--c-success)' : 'var(--c-accent)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {item.completed ? '✓' : formatDuration(item.duration)}
      </div>
    </div>
  )
}

// ─── EditItemContent ──────────────────────────────────────────────────────────

interface EditItemContentProps {
  item: PlannerItem
  onToggleComplete: () => void
  onDelete: () => void
  onDuplicate: () => void
  onChangeDuration: () => void
}

function EditItemContent({
  item,
  onToggleComplete,
  onDelete,
  onDuplicate,
  onChangeDuration,
}: EditItemContentProps) {
  const icon = ICONS.find((ic) => ic.id === item.iconId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 0',
      }}>
        {icon && (
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--c-surface2), var(--c-surface3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--c-border2)',
          }}>
            <SvgIcon svg={icon.svg} size={26} />
          </div>
        )}
        <div>
          <div style={{ fontSize: 'var(--fs-base)', fontWeight: 700, color: 'var(--c-text-primary)' }}>
            {item.label}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginTop: 2 }}>
            {item.slotKey} · {formatDuration(item.duration)}
          </div>
        </div>
      </div>

      {/* Duration row */}
      <button
        onClick={onChangeDuration}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
          borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
          Duur
        </span>
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--c-accent)' }}>
          {formatDuration(item.duration)} →
        </span>
      </button>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ActionButton
          label={item.completed ? 'Markeer als ongedaan' : 'Markeer als klaar'}
          icon={<CheckIcon color={item.completed ? 'var(--c-text-muted)' : 'var(--c-success)'} />}
          onClick={onToggleComplete}
          accent={!item.completed}
        />
        <ActionButton
          label="Dupliceer naar volgend slot"
          icon={<CopyIcon color="var(--c-text-secondary)" />}
          onClick={onDuplicate}
        />
        <ActionButton
          label="Verwijder activiteit"
          icon={<TrashIcon color="var(--c-error)" />}
          onClick={onDelete}
          danger
        />
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  icon: React.ReactNode
  onClick: () => void
  accent?: boolean
  danger?: boolean
}

function ActionButton({ label, icon, onClick, accent, danger }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: danger ? 'rgba(160,64,64,0.08)' : accent ? 'rgba(74,153,112,0.08)' : 'var(--c-surface2)',
        border: `1px solid ${danger ? 'rgba(160,64,64,0.2)' : accent ? 'rgba(74,153,112,0.2)' : 'var(--c-border)'}`,
        borderRadius: 10, padding: '13px 16px', cursor: 'pointer', width: '100%',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {icon}
      <span style={{
        fontSize: 'var(--fs-sm)', fontWeight: 500,
        color: danger ? 'var(--c-error)' : accent ? 'var(--c-success)' : 'var(--c-text-primary)',
      }}>
        {label}
      </span>
    </button>
  )
}

// ─── DurationPicker ───────────────────────────────────────────────────────────

interface DurationPickerProps {
  current: number
  onSelect: (minutes: number) => void
}

function DurationPicker({ current, onSelect }: DurationPickerProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
      paddingTop: 8,
    }}>
      {DURATION_OPTIONS.map((opt) => {
        const active = opt.minutes === current
        return (
          <button
            key={opt.minutes}
            onClick={() => onSelect(opt.minutes)}
            style={{
              background: active
                ? 'rgba(74,120,168,0.2)'
                : 'var(--c-surface2)',
              border: `1px solid ${active ? 'var(--c-accent)' : 'var(--c-border)'}`,
              borderRadius: 10,
              padding: '11px 8px',
              cursor: 'pointer',
              fontSize: 'var(--fs-sm)',
              fontWeight: active ? 700 : 500,
              color: active ? 'var(--c-accent)' : 'var(--c-text-secondary)',
              textAlign: 'center',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background 120ms ease, border-color 120ms ease',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── IconDeck ─────────────────────────────────────────────────────────────────

interface IconDeckProps {
  expanded: boolean
  onToggle: () => void
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  categories: string[]
  icons: IconDef[]
  recentIcons: IconDef[]
  selectedIconId: string | null
  onIconPointerDown: (e: React.PointerEvent, icon: IconDef) => void
  onIconTap: (icon: IconDef) => void
}

function IconDeck({
  expanded,
  onToggle,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  icons,
  recentIcons,
  selectedIconId,
  onIconPointerDown,
  onIconTap,
}: IconDeckProps) {
  const deckHeight = expanded ? 340 : 130

  return (
    <div style={{
      flexShrink: 0,
      background: 'var(--c-surface)',
      borderTop: '1px solid var(--c-border)',
      height: deckHeight,
      transition: 'height 250ms cubic-bezier(0.34,1.56,0.64,1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Drag handle / toggle */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 16px 6px',
          cursor: 'pointer',
          flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{
          width: 32, height: 3, borderRadius: 2,
          background: expanded ? 'var(--c-accent)' : 'var(--c-border2)',
          transition: 'background 200ms ease',
        }} />
      </div>

      {/* Search row — only when expanded */}
      {expanded && (
        <div style={{ padding: '0 12px 8px', flexShrink: 0 }}>
          <input
            type="search"
            placeholder="Zoek activiteit…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--c-surface2)',
              border: '1px solid var(--c-border)',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 'var(--fs-sm)',
              color: 'var(--c-text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Category tabs */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        gap: 6,
        padding: '0 12px 8px',
        flexShrink: 0,
        WebkitOverflowScrolling: 'touch',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 20,
              border: `1px solid ${category === cat ? 'var(--c-accent)' : 'var(--c-border)'}`,
              background: category === cat ? 'rgba(74,120,168,0.15)' : 'transparent',
              color: category === cat ? 'var(--c-accent)' : 'var(--c-text-muted)',
              fontSize: 'var(--fs-xs)',
              fontWeight: category === cat ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              WebkitTapHighlightColor: 'transparent',
              transition: 'background 120ms ease, border-color 120ms ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Icon grid */}
      <div style={{
        flex: 1,
        overflowY: expanded ? 'auto' : 'hidden',
        overflowX: 'hidden',
        padding: '0 12px 12px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Recent strip (only when no search and Alle) */}
        {recentIcons.length > 0 && !search && category === 'Alle' && (
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--c-text-muted)',
              marginBottom: 6,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Recent
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {recentIcons.map((icon) => (
                <IconTile
                  key={icon.id}
                  icon={icon}
                  selected={selectedIconId === icon.id}
                  onPointerDown={onIconPointerDown}
                  onTap={onIconTap}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
          gap: 8,
        }}>
          {icons.map((icon) => (
            <IconTile
              key={icon.id}
              icon={icon}
              selected={selectedIconId === icon.id}
              onPointerDown={onIconPointerDown}
              onTap={onIconTap}
            />
          ))}
        </div>

        {icons.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--c-text-muted)',
            fontSize: 'var(--fs-sm)',
            padding: '24px 0',
          }}>
            Geen activiteiten gevonden
          </div>
        )}
      </div>
    </div>
  )
}

// ─── IconTile ─────────────────────────────────────────────────────────────────

interface IconTileProps {
  icon: IconDef
  selected: boolean
  onPointerDown: (e: React.PointerEvent, icon: IconDef) => void
  onTap: (icon: IconDef) => void
}

function IconTile({ icon, selected, onPointerDown, onTap }: IconTileProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didDragRef = useRef(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    didDragRef.current = false
    // Start a timer: if held > 150ms, treat as drag
    pressTimer.current = setTimeout(() => {
      didDragRef.current = true
      onPointerDown(e, icon)
    }, 150)
  }

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    if (!didDragRef.current) {
      onTap(icon)
    }
  }

  const handlePointerCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        width: 64,
        height: 64,
        borderRadius: 10,
        background: selected
          ? 'linear-gradient(135deg, rgba(74,120,168,0.35), rgba(104,150,200,0.35))'
          : 'linear-gradient(135deg, var(--c-surface2), var(--c-surface3))',
        border: `1.5px solid ${selected ? 'var(--c-accent)' : 'var(--c-border)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: selected ? '0 0 0 2px rgba(74,120,168,0.3)' : undefined,
        transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
      }}
    >
      <SvgIcon svg={icon.svg} size={22} />
      <span style={{
        fontSize: 9,
        color: 'var(--c-text-secondary)',
        fontWeight: 500,
        textAlign: 'center',
        lineHeight: 1.2,
        padding: '0 2px',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {icon.label}
      </span>
    </div>
  )
}

export default Planner
