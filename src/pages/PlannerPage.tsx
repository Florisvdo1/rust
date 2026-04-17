import React, { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { PageHeader } from '@/components/PageHeader'
import { SyncBadge } from '@/components/SyncBadge'
import { haptic } from '@/lib/haptics'
import { supabase } from '@/lib/supabase'
import { syncPlannerItem, deleteCloudPlannerItem } from '@/lib/sync'
import type { PlannerItem } from '@/types'

// ─── Activities ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'alles',       name: 'Alles',         color: '#5c7a99' },
  { id: 'ochtend',     name: 'Ochtend',       color: '#d4a257' },
  { id: 'eten',        name: 'Eten & drinken', color: '#81b29a' },
  { id: 'verzorging',  name: 'Verzorging',    color: '#d4a5a5' },
  { id: 'werk',        name: 'Werk',          color: '#5c7a99' },
  { id: 'focus',       name: 'Focus',         color: '#9cadbc' },
  { id: 'huishouden',  name: 'Huishouden',    color: '#a8c5a0' },
  { id: 'gezondheid',  name: 'Gezondheid',    color: '#e8a87c' },
  { id: 'sport',       name: 'Sport',         color: '#6baa7d' },
  { id: 'rust',        name: 'Rust',          color: '#95b8d1' },
  { id: 'sociaal',     name: 'Sociaal',       color: '#c3a6c9' },
  { id: 'reizen',      name: 'Reizen',        color: '#8b9dbc' },
  { id: 'avond',       name: 'Avond',         color: '#7b8fa8' },
  { id: 'huisdieren',  name: 'Huisdieren',    color: '#c4a882' },
  { id: 'admin',       name: 'Administratie', color: '#a0b4c8' },
  { id: 'creatief',    name: 'Creatief',      color: '#c9a0c3' },
  { id: 'slapen',      name: 'Slapen',        color: '#8da8c4' },
  { id: 'therapie',    name: 'Therapie',      color: '#d4a5a5' },
]

const ACTIVITIES = [
  // Ochtend
  { id: 'ochtendroutine', name: 'Ochtendroutine', cat: 'ochtend', color: '#d4a257', icon: 'sunrise' },
  { id: 'stretchen-ochtend', name: 'Ochtend strekken', cat: 'ochtend', color: '#d4a257', icon: 'stretch' },
  { id: 'dagplanning', name: 'Dagplanning', cat: 'ochtend', color: '#d4a257', icon: 'list' },

  // Eten & drinken
  { id: 'ontbijt', name: 'Ontbijt', cat: 'eten', color: '#81b29a', icon: 'bowl' },
  { id: 'lunch', name: 'Lunch', cat: 'eten', color: '#81b29a', icon: 'bowl' },
  { id: 'avondeten', name: 'Avondeten', cat: 'eten', color: '#81b29a', icon: 'utensils' },
  { id: 'snack', name: 'Snack', cat: 'eten', color: '#81b29a', icon: 'apple' },
  { id: 'koken', name: 'Koken', cat: 'eten', color: '#81b29a', icon: 'utensils' },
  { id: 'water', name: 'Water drinken', cat: 'eten', color: '#81b29a', icon: 'droplet' },
  { id: 'koffie', name: 'Koffie', cat: 'eten', color: '#81b29a', icon: 'coffee' },
  { id: 'thee', name: 'Thee', cat: 'eten', color: '#81b29a', icon: 'coffee' },
  { id: 'boodschappen', name: 'Boodschappen', cat: 'eten', color: '#81b29a', icon: 'bag' },

  // Verzorging
  { id: 'douchen', name: 'Douchen', cat: 'verzorging', color: '#d4a5a5', icon: 'droplet' },
  { id: 'bad', name: 'Bad nemen', cat: 'verzorging', color: '#d4a5a5', icon: 'droplet' },
  { id: 'tanden-poetsen', name: 'Tanden poetsen', cat: 'verzorging', color: '#d4a5a5', icon: 'smile' },
  { id: 'skincare', name: 'Skincare', cat: 'verzorging', color: '#d4a5a5', icon: 'star' },
  { id: 'aankleden', name: 'Aankleden', cat: 'verzorging', color: '#d4a5a5', icon: 'shirt' },
  { id: 'haar', name: 'Haar doen', cat: 'verzorging', color: '#d4a5a5', icon: 'scissors' },

  // Werk
  { id: 'werkblok', name: 'Werkblok', cat: 'werk', color: '#5c7a99', icon: 'briefcase' },
  { id: 'mail', name: 'Mail', cat: 'werk', color: '#5c7a99', icon: 'mail' },
  { id: 'vergadering', name: 'Vergadering', cat: 'werk', color: '#5c7a99', icon: 'users' },
  { id: 'bellen', name: 'Bellen', cat: 'werk', color: '#5c7a99', icon: 'phone' },
  { id: 'presentatie', name: 'Presentatie', cat: 'werk', color: '#5c7a99', icon: 'monitor' },
  { id: 'studie', name: 'Studie', cat: 'werk', color: '#5c7a99', icon: 'book' },
  { id: 'huiswerk', name: 'Huiswerk', cat: 'werk', color: '#5c7a99', icon: 'pencil' },

  // Focus
  { id: 'deep-work', name: 'Deep work', cat: 'focus', color: '#9cadbc', icon: 'zap' },
  { id: 'pauze', name: 'Pauze', cat: 'focus', color: '#9cadbc', icon: 'clock' },
  { id: 'schrijven', name: 'Schrijven', cat: 'focus', color: '#9cadbc', icon: 'pencil' },
  { id: 'lezen', name: 'Lezen', cat: 'focus', color: '#9cadbc', icon: 'book' },
  { id: 'plannen', name: 'Plannen', cat: 'focus', color: '#9cadbc', icon: 'list' },

  // Huishouden
  { id: 'schoonmaken', name: 'Schoonmaken', cat: 'huishouden', color: '#a8c5a0', icon: 'home' },
  { id: 'opruimen', name: 'Opruimen', cat: 'huishouden', color: '#a8c5a0', icon: 'home' },
  { id: 'afwas', name: 'Afwas', cat: 'huishouden', color: '#a8c5a0', icon: 'droplet' },
  { id: 'was', name: 'Was', cat: 'huishouden', color: '#a8c5a0', icon: 'wind' },
  { id: 'stofzuigen', name: 'Stofzuigen', cat: 'huishouden', color: '#a8c5a0', icon: 'wind' },
  { id: 'ramen', name: 'Ramen lappen', cat: 'huishouden', color: '#a8c5a0', icon: 'droplet' },
  { id: 'dwijlen', name: 'Dwijlen', cat: 'huishouden', color: '#a8c5a0', icon: 'mop' },
  { id: 'droger', name: 'Droger', cat: 'huishouden', color: '#a8c5a0', icon: 'dryer' },
  { id: 'bed-verschonen', name: 'Bed verschonen', cat: 'huishouden', color: '#a8c5a0', icon: 'bed' },

  // Gezondheid
  { id: 'medicatie', name: 'Medicatie', cat: 'gezondheid', color: '#e8a87c', icon: 'pill' },
  { id: 'supplement', name: 'Supplement', cat: 'gezondheid', color: '#e8a87c', icon: 'pill' },
  { id: 'ademhaling', name: 'Ademhaling', cat: 'gezondheid', color: '#e8a87c', icon: 'wind' },
  { id: 'meditatie', name: 'Meditatie', cat: 'gezondheid', color: '#e8a87c', icon: 'heart' },
  { id: 'rust-moment', name: 'Rustmoment', cat: 'gezondheid', color: '#e8a87c', icon: 'moon' },
  { id: 'dagboek-schrijven', name: 'Dagboek', cat: 'gezondheid', color: '#e8a87c', icon: 'book' },

  // Sport
  { id: 'wandelen', name: 'Wandelen', cat: 'sport', color: '#6baa7d', icon: 'map-pin' },
  { id: 'hardlopen', name: 'Hardlopen', cat: 'sport', color: '#6baa7d', icon: 'zap' },
  { id: 'fietsen', name: 'Fietsen', cat: 'sport', color: '#6baa7d', icon: 'zap' },
  { id: 'sporten', name: 'Sporten', cat: 'sport', color: '#6baa7d', icon: 'activity' },
  { id: 'yoga', name: 'Yoga', cat: 'sport', color: '#6baa7d', icon: 'heart' },
  { id: 'stretchen', name: 'Stretchen', cat: 'sport', color: '#6baa7d', icon: 'stretch' },
  { id: 'zwemmen', name: 'Zwemmen', cat: 'sport', color: '#6baa7d', icon: 'droplet' },
  { id: 'gym', name: 'Gym', cat: 'sport', color: '#6baa7d', icon: 'activity' },

  // Rust
  { id: 'dutje', name: 'Dutje', cat: 'rust', color: '#95b8d1', icon: 'moon' },
  { id: 'relaxen', name: 'Relaxen', cat: 'rust', color: '#95b8d1', icon: 'moon' },
  { id: 'muziek', name: 'Muziek luisteren', cat: 'rust', color: '#95b8d1', icon: 'music' },
  { id: 'podcast', name: 'Podcast', cat: 'rust', color: '#95b8d1', icon: 'headphones' },
  { id: 'tv', name: 'TV / Film', cat: 'rust', color: '#95b8d1', icon: 'monitor' },
  { id: 'natuur', name: 'In de natuur', cat: 'rust', color: '#95b8d1', icon: 'map-pin' },

  // Sociaal
  { id: 'familie', name: 'Familie', cat: 'sociaal', color: '#c3a6c9', icon: 'users' },
  { id: 'vrienden', name: 'Vrienden', cat: 'sociaal', color: '#c3a6c9', icon: 'users' },
  { id: 'afspraak', name: 'Afspraak', cat: 'sociaal', color: '#c3a6c9', icon: 'calendar' },
  { id: 'bellen-sociaal', name: 'Bellen', cat: 'sociaal', color: '#c3a6c9', icon: 'phone' },
  { id: 'bezoek', name: 'Bezoek', cat: 'sociaal', color: '#c3a6c9', icon: 'home' },
  { id: 'whatsapp-bekijken', name: 'WhatsApp bekijken', cat: 'sociaal', color: '#c3a6c9', icon: 'whatsapp' },

  // Reizen
  { id: 'ov', name: 'OV reizen', cat: 'reizen', color: '#8b9dbc', icon: 'map-pin' },
  { id: 'auto', name: 'Auto rijden', cat: 'reizen', color: '#8b9dbc', icon: 'map-pin' },
  { id: 'fietsen-reizen', name: 'Fietsen', cat: 'reizen', color: '#8b9dbc', icon: 'zap' },
  { id: 'reizen-lang', name: 'Reizen', cat: 'reizen', color: '#8b9dbc', icon: 'map-pin' },

  // Avond
  { id: 'avondroutine', name: 'Avondroutine', cat: 'avond', color: '#7b8fa8', icon: 'moon' },
  { id: 'dagboek-avond', name: 'Dagboek invullen', cat: 'avond', color: '#7b8fa8', icon: 'book' },
  { id: 'voorbereiden', name: 'Dag voorbereiden', cat: 'avond', color: '#7b8fa8', icon: 'list' },

  // Huisdieren
  { id: 'hond-uitlaten', name: 'Hond uitlaten', cat: 'huisdieren', color: '#c4a882', icon: 'heart' },
  { id: 'huisdier-voeren', name: 'Huisdier voeren', cat: 'huisdieren', color: '#c4a882', icon: 'heart' },
  { id: 'kattenbak', name: 'Kattenbak', cat: 'huisdieren', color: '#c4a882', icon: 'home' },

  // Administratie
  { id: 'financien', name: 'Financiën', cat: 'admin', color: '#a0b4c8', icon: 'dollar-sign' },
  { id: 'administratie', name: 'Administratie', cat: 'admin', color: '#a0b4c8', icon: 'folder' },
  { id: 'formulieren', name: 'Formulieren', cat: 'admin', color: '#a0b4c8', icon: 'file' },
  { id: 'belasting', name: 'Belasting', cat: 'admin', color: '#a0b4c8', icon: 'file' },

  // Creatief
  { id: 'tekenen', name: 'Tekenen', cat: 'creatief', color: '#c9a0c3', icon: 'pen' },
  { id: 'muziek-maken', name: 'Muziek maken', cat: 'creatief', color: '#c9a0c3', icon: 'music' },
  { id: 'fotos', name: "Foto's", cat: 'creatief', color: '#c9a0c3', icon: 'camera' },
  { id: 'creatief-project', name: 'Creatief project', cat: 'creatief', color: '#c9a0c3', icon: 'pen' },
  { id: 'knutselen', name: 'Knutselen', cat: 'creatief', color: '#c9a0c3', icon: 'scissors' },

  // Slapen
  { id: 'bedtijd', name: 'Bedtijd', cat: 'slapen', color: '#8da8c4', icon: 'moon' },
  { id: 'opstaan', name: 'Opstaan', cat: 'slapen', color: '#8da8c4', icon: 'sun' },

  // Therapie
  { id: 'therapie', name: 'Therapie', cat: 'therapie', color: '#d4a5a5', icon: 'heart' },
  { id: 'coaching', name: 'Coaching', cat: 'therapie', color: '#d4a5a5', icon: 'users' },
  { id: 'huisarts', name: 'Huisarts', cat: 'therapie', color: '#d4a5a5', icon: 'heart' },
  { id: 'zelfzorg', name: 'Zelfzorg', cat: 'therapie', color: '#d4a5a5', icon: 'heart' },
]

const DURATIONS = [
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 45, label: '45m' },
  { value: 60, label: '1u' },
  { value: 90, label: '1,5u' },
  { value: 120, label: '2u' },
  { value: 180, label: '3u' },
  { value: 240, label: '4u' },
]

// ─── Line-art icon component ───────────────────────────────────────────────────
const ActivityIcon: React.FC<{ id: string; color?: string; size?: number }> = ({ id, color = 'currentColor', size = 18 }) => {
  const s = { width: size, height: size }
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (id) {
    case 'sun': return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    case 'sunrise': return <svg {...props}><path d="M12 2v4M4.93 6.93l2.83 2.83M2 14h4M19.07 6.93l-2.83 2.83M22 14h-4M5 19a7 7 0 0114 0"/></svg>
    case 'moon': return <svg {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    case 'bowl': return <svg {...props}><path d="M4 11h16M4 11c0 4.4 3.6 8 8 8s8-3.6 8-8"/><path d="M12 3v3M8 4l1 2M16 4l-1 2"/></svg>
    case 'utensils': return <svg {...props}><path d="M3 2v7c0 1.7 1.3 3 3 3h1v10"/><path d="M7 2v20M21 2a3 3 0 00-3 3v6h3"/><path d="M21 11v9"/></svg>
    case 'apple': return <svg {...props}><path d="M12 3c-1-1.5-4-2-5 .5"/><path d="M5 8c-2 5 0 10 4 12 1 .5 2 .5 3 0s2 .5 3 0c4-2 6-7 4-12a4 4 0 00-4-2c-1 0-1.5.5-3 .5S8 6 7 6a4 4 0 00-2 2z"/></svg>
    case 'coffee': return <svg {...props}><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><path d="M6 2v3M10 2v3M14 2v3"/></svg>
    case 'droplet': return <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
    case 'bag': return <svg {...props}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
    case 'heart': return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
    case 'smile': return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    case 'star': return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    case 'shirt': return <svg {...props}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
    case 'scissors': return <svg {...props}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>
    case 'briefcase': return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><path d="M12 12v.01"/></svg>
    case 'mail': return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    case 'users': return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    case 'phone': return <svg {...props}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.2.36 2.33.72 3.42a2 2 0 01-.45 2.11L6.09 8.43a16 16 0 006.29 6.29l1.18-1.18a2 2 0 012.11-.45c1.09.36 2.22.6 3.42.72A2 2 0 0122 16.92z"/></svg>
    case 'monitor': return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    case 'book': return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    case 'pencil': return <svg {...props}><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
    case 'zap': return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'list': return <svg {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    case 'home': return <svg {...props}><path d="M3 12l9-9 9 9"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
    case 'wind': return <svg {...props}><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>
    case 'pill': return <svg {...props}><path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7"/><path d="M9 12h6"/><circle cx="17" cy="17" r="3"/><path d="M15.7 18.3l2.6-2.6"/></svg>
    case 'activity': return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    case 'stretch': return <svg {...props}><circle cx="12" cy="5" r="2"/><path d="M5 22l7-10 7 10"/><path d="M5 14c2-2 10-2 14 0"/></svg>
    case 'map-pin': return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
    case 'music': return <svg {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    case 'headphones': return <svg {...props}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
    case 'calendar': return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    case 'dollar-sign': return <svg {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    case 'folder': return <svg {...props}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    case 'file': return <svg {...props}><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg>
    case 'pen': return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    case 'camera': return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
    case 'mop': return <svg {...props}><path d="M12 2v13"/><path d="M8 15h8"/><path d="M9 15l-2 7h10l-2-7"/></svg>
    case 'dryer': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/></svg>
    case 'bed': return <svg {...props}><path d="M2 8h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"/><path d="M2 13h20"/><path d="M5 8V5a1 1 0 011-1h12a1 1 0 011 1v3"/></svg>
    case 'whatsapp': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="4" r="4.5" fill="#ef4444"/>
        <line x1="20" y1="2" x2="20" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="6.5" r="0.7" fill="white"/>
      </svg>
    )
    default: return <svg {...props}><circle cx="12" cy="12" r="4"/></svg>
  }
}

// ─── Collision layout ──────────────────────────────────────────────────────────

function computeLayout(items: PlannerItem[]): Map<string, { col: number; totalCols: number }> {
  if (items.length === 0) return new Map()
  const sorted = [...items].sort((a, b) =>
    (a.hour * 60 + a.quarter * 15) - (b.hour * 60 + b.quarter * 15)
  )
  const result = new Map<string, { col: number; totalCols: number }>()
  // Group by overlap
  const groups: PlannerItem[][] = []
  let group: PlannerItem[] = []
  let groupEnd = -1
  for (const item of sorted) {
    const start = item.hour * 60 + item.quarter * 15
    const end = start + item.duration
    if (group.length === 0 || start < groupEnd) {
      group.push(item)
      groupEnd = Math.max(groupEnd, end)
    } else {
      groups.push(group)
      group = [item]
      groupEnd = end
    }
  }
  if (group.length > 0) groups.push(group)

  for (const g of groups) {
    const colEnds: number[] = []
    const cols: number[] = []
    for (const item of g) {
      const start = item.hour * 60 + item.quarter * 15
      const end = start + item.duration
      let col = 0
      while (colEnds[col] !== undefined && colEnds[col] > start) col++
      cols.push(col)
      colEnds[col] = end
    }
    const total = Math.max(...cols) + 1
    g.forEach((item, i) => result.set(item.id, { col: cols[i], totalCols: total }))
  }
  return result
}

// ─── Timeline constants ────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 06:00–23:00
const QUARTER_HEIGHT = 20
const HOUR_HEIGHT = QUARTER_HEIGHT * 4

function dayOffset(offset: number) {
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}
function dayLabel(offset: number) {
  if (offset === 0) return 'Vandaag'
  if (offset === 1) return 'Morgen'
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Component ─────────────────────────────────────────────────────────────────
export const PlannerPage: React.FC = () => {
  const { plannerItems, addPlannerItem, removePlannerItem, updatePlannerItem, user } = useStore()
  const [selectedDay, setSelectedDay] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)
  const [traySearch, setTraySearch] = useState('')
  const [trayCategory, setTrayCategory] = useState<string>('alles')
  const [selectedActivity, setSelectedActivity] = useState<typeof ACTIVITIES[0] | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [placingMode, setPlacingMode] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const timelineRef = useRef<HTMLDivElement>(null)

  const currentDate = dayOffset(selectedDay)
  const dayItems = useMemo(
    () => plannerItems.filter(i => i.date === currentDate),
    [plannerItems, currentDate]
  )

  const layout = useMemo(() => computeLayout(dayItems), [dayItems])

  const filteredActivities = useMemo(() => {
    let list = trayCategory === 'alles' ? ACTIVITIES : ACTIVITIES.filter(a => a.cat === trayCategory)
    if (traySearch) {
      const q = traySearch.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q))
    }
    return list
  }, [trayCategory, traySearch])

  const handleSlotTap = useCallback((hour: number, quarter: number) => {
    if (!selectedActivity || !placingMode) return
    haptic('medium')
    addPlannerItem({
      date: currentDate,
      hour,
      quarter,
      duration: selectedDuration,
      activityId: selectedActivity.id,
      activityName: selectedActivity.name,
      category: selectedActivity.cat,
      color: selectedActivity.color,
      iconId: selectedActivity.icon,
    })
    if (user?.id && supabase) {
      const items = useStore.getState().plannerItems
      const newItem = items[items.length - 1]
      if (newItem) void syncPlannerItem(user.id, newItem)
    }
    setPlacingMode(false)
    setSelectedActivity(null)
    setTrayOpen(false)
  }, [selectedActivity, placingMode, currentDate, selectedDuration, addPlannerItem, user])

  const startPlacing = (activity: typeof ACTIVITIES[0]) => {
    haptic('light')
    setSelectedActivity(activity)
    setPlacingMode(true)
    setTrayOpen(false)
  }

  const cancelPlacing = () => {
    setPlacingMode(false)
    setSelectedActivity(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <PageHeader
        title="Planner"
        subtitle={new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
        right={<SyncBadge synced={!!user && !!supabase} />}
      />

      {/* Day tabs */}
      <div style={{
        display: 'flex', gap: 6,
        padding: '0 var(--space-lg)',
        overflowX: 'auto', flexShrink: 0, paddingBottom: 12,
      }}>
        {Array.from({ length: 7 }, (_, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{
            padding: '7px 14px', borderRadius: 'var(--radius-full)',
            fontSize: 13, fontWeight: selectedDay === i ? 700 : 500,
            whiteSpace: 'nowrap',
            background: selectedDay === i ? 'var(--granite-blue)' : 'var(--white)',
            color: selectedDay === i ? 'var(--white)' : 'var(--text-secondary)',
            border: selectedDay === i ? 'none' : '1px solid var(--border)',
            minHeight: 36, transition: 'all 0.2s',
          }}>
            {dayLabel(i)}
          </button>
        ))}
      </div>

      {/* Placing mode bar */}
      <AnimatePresence>
        {placingMode && selectedActivity && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: 'var(--granite-blue)', color: 'var(--white)',
              padding: '10px var(--space-lg)', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Tik op een tijdslot — {selectedActivity.name} ({selectedDuration}m)
            </span>
            <button onClick={cancelPlacing} style={{ color: 'var(--baby-blue)', fontSize: 13, fontWeight: 600 }}>
              Annuleer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div ref={timelineRef} className="page-scroll" style={{ padding: '0 var(--space-lg)', flex: 1 }}>
        <div style={{ position: 'relative', paddingLeft: 52 }}>
          {HOURS.map(hour => (
            <div key={hour} style={{ position: 'relative', height: HOUR_HEIGHT }}>
              {/* Hour label */}
              <div style={{
                position: 'absolute', left: -52, top: -8, width: 44,
                textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 500,
              }}>
                {String(hour).padStart(2, '0')}:00
              </div>
              {/* Hour line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 1, background: 'var(--border)',
              }} />
              {/* Quarter tap slots */}
              {[0, 1, 2, 3].map(q => {
                const hasItem = dayItems.some(it => it.hour === hour && it.quarter === q)
                return (
                  <button key={q} onClick={() => handleSlotTap(hour, q)} style={{
                    position: 'absolute', top: q * QUARTER_HEIGHT, left: 0, right: 0,
                    height: QUARTER_HEIGHT,
                    background: placingMode && !hasItem ? 'rgba(149,184,209,0.07)' : 'transparent',
                    borderBottom: q < 3 ? '1px dotted var(--border)' : 'none',
                    cursor: placingMode ? 'pointer' : 'default',
                  }} />
                )
              })}
              {/* Placed items with collision layout */}
              {dayItems.filter(it => it.hour === hour).map(item => {
                const itemLayout = layout.get(item.id) || { col: 0, totalCols: 1 }
                const topPx = item.quarter * QUARTER_HEIGHT
                const heightPx = Math.max((item.duration / 15) * QUARTER_HEIGHT, QUARTER_HEIGHT)
                const widthPct = 100 / itemLayout.totalCols
                const leftPct = widthPct * itemLayout.col
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: topPx + 1,
                      left: `${leftPct}%`,
                      width: `calc(${widthPct}% - 2px)`,
                      height: heightPx - 2,
                      background: item.color + '20',
                      borderLeft: `3px solid ${item.color}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '3px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      overflow: editingNoteId === item.id ? 'visible' : 'hidden',
                      zIndex: editingNoteId === item.id ? 10 : 5,
                      marginLeft: itemLayout.col > 0 ? 2 : 0,
                    }}
                  >
                    <ActivityIcon id={item.iconId || 'dot'} color={item.color} size={12} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 10, fontWeight: 700, color: 'var(--granite-blue)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                      }}>{item.activityName}</p>
                      {heightPx >= 34 && (
                        <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                          {item.duration}m
                        </p>
                      )}
                      {item.notes && heightPx >= 34 && (
                        <p style={{ fontSize: 9, color: item.color, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.notes.slice(0, 22)}
                        </p>
                      )}
                    </div>
                    <button
                      onPointerDown={e => e.stopPropagation()}
                      onClick={e => { e.stopPropagation(); setEditingNoteId(item.id); setNoteText(item.notes || '') }}
                      style={{
                        flexShrink: 0, width: 18, height: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.7)', borderRadius: '50%',
                        padding: 0,
                      }}
                      aria-label="Notitie bewerken"
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                      </svg>
                    </button>
                    <button
                      onPointerDown={e => { e.stopPropagation(); haptic('light') }}
                      onClick={e => { e.stopPropagation(); if (user?.id && supabase) void deleteCloudPlannerItem(item.id); removePlannerItem(item.id) }}
                      style={{
                        flexShrink: 0, width: 18, height: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.7)', borderRadius: '50%',
                        padding: 0,
                      }}
                      aria-label="Verwijder"
                    >×</button>
                    {editingNoteId === item.id && (
                      <input
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        onBlur={() => {
                          updatePlannerItem(item.id, { notes: noteText })
                          if (user?.id && supabase) {
                            const updated = useStore.getState().plannerItems.find(p => p.id === item.id)
                            if (updated) void syncPlannerItem(user.id, updated)
                          }
                          setEditingNoteId(null)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updatePlannerItem(item.id, { notes: noteText })
                            if (user?.id && supabase) {
                              const updated = useStore.getState().plannerItems.find(p => p.id === item.id)
                              if (updated) void syncPlannerItem(user.id, updated)
                            }
                            setEditingNoteId(null)
                          }
                          if (e.key === 'Escape') setEditingNoteId(null)
                        }}
                        onClick={e => e.stopPropagation()}
                        autoFocus
                        placeholder="Notitie..."
                        style={{
                          position: 'absolute',
                          top: '100%', left: 0, right: 0,
                          background: 'var(--white)',
                          border: `1.5px solid ${item.color}`,
                          borderRadius: 6,
                          padding: '5px 8px',
                          fontSize: 11,
                          zIndex: 20,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          marginTop: 2,
                        }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      {!trayOpen && !placingMode && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { haptic('light'); setTrayOpen(true) }}
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)',
            right: 20, width: 56, height: 56, borderRadius: '50%',
            background: 'var(--granite-blue)', color: 'var(--white)',
            fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)', zIndex: 50,
          }}
          aria-label="Activiteit toevoegen"
        >+</motion.button>
      )}

      {/* Activity Tray */}
      <AnimatePresence>
        {trayOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTrayOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 90 }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                height: '78vh',
                background: 'var(--white)', borderRadius: '20px 20px 0 0',
                zIndex: 91, display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Drag handle — tappable to close */}
              <button
                onClick={() => setTrayOpen(false)}
                style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px', flexShrink: 0, width: '100%' }}
                aria-label="Sluiten"
              >
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </button>

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-lg)', marginBottom: 10, flexShrink: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--granite-blue)' }}>Activiteit kiezen</p>
                <button onClick={() => setTrayOpen(false)}
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--cloud)', fontSize: 17, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Sluiten"
                >×</button>
              </div>

              {/* Search */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 8, flexShrink: 0 }}>
                <input
                  type="text" placeholder="Zoek activiteit..."
                  value={traySearch} onChange={e => setTraySearch(e.target.value)}
                  className="input-field" style={{ fontSize: 15 }}
                />
              </div>

              {/* Duration picker */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 8, flexShrink: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Duur</p>
                <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
                  {DURATIONS.map(d => (
                    <button key={d.value} onClick={() => setSelectedDuration(d.value)} style={{
                      padding: '5px 10px', borderRadius: 'var(--radius-full)', fontSize: 12,
                      fontWeight: selectedDuration === d.value ? 700 : 500,
                      background: selectedDuration === d.value ? 'var(--granite-blue)' : 'var(--cloud)',
                      color: selectedDuration === d.value ? 'var(--white)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap', minHeight: 30, flexShrink: 0,
                    }}>{d.label}</button>
                  ))}
                </div>
              </div>

              {/* Category pills */}
              <div style={{ padding: '0 var(--space-lg)', marginBottom: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setTrayCategory(c.id)} style={{
                      padding: '5px 10px', borderRadius: 'var(--radius-full)', fontSize: 11,
                      fontWeight: trayCategory === c.id ? 700 : 500,
                      background: trayCategory === c.id ? c.color + '30' : 'var(--cloud)',
                      color: trayCategory === c.id ? c.color : 'var(--text-secondary)',
                      border: trayCategory === c.id ? `1.5px solid ${c.color}55` : '1.5px solid transparent',
                      whiteSpace: 'nowrap', minHeight: 28, flexShrink: 0,
                    }}>{c.name}</button>
                  ))}
                </div>
              </div>

              {/* Activity grid — scrolls fully, padded to avoid nav */}
              <div className="sheet-scroll" style={{ padding: '0 var(--space-lg)' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 7,
                  paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)',
                }}>
                  {filteredActivities.map(a => (
                    <button key={a.id} onClick={() => startPlacing(a)} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 5, padding: '10px 4px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--cloud)', border: '1px solid var(--border)',
                      minHeight: 70,
                    }}>
                      <ActivityIcon id={a.icon} color={a.color} size={20} />
                      <span style={{
                        fontSize: 9, fontWeight: 600, color: 'var(--text-secondary)',
                        textAlign: 'center', lineHeight: 1.2,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{a.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
