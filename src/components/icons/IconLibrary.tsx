import React from 'react'

export interface IconDef {
  id: string
  label: string
  category: string
  svg: string
}

export const ICONS: IconDef[] = [
  // ── Eten & Drinken ───────────────────────────────────────────────────────────
  {
    id: 'ontbijt',
    label: 'Ontbijt',
    category: 'Eten & Drinken',
    svg: '<path d="M3 11h18M3 11a9 9 0 0 1 18 0M12 2v2M8 3.5l1 1.7M16 3.5l-1 1.7"/><path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><circle cx="12" cy="15" r="2"/>',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    category: 'Eten & Drinken',
    svg: '<path d="M3 6h18M3 6a9 9 0 0 0 18 0"/><path d="M12 6v12"/><path d="M8 12h8"/>',
  },
  {
    id: 'diner',
    label: 'Diner',
    category: 'Eten & Drinken',
    svg: '<path d="M3 11h18"/><path d="M12 2v4M8 2v4M16 2v4"/><path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><circle cx="12" cy="15.5" r="2.5"/>',
  },
  {
    id: 'thee',
    label: 'Thee',
    category: 'Eten & Drinken',
    svg: '<path d="M17 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><path d="M5 8h12v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"/><path d="M9 3v3M12 2v4M15 3v3"/>',
  },
  {
    id: 'koffie',
    label: 'Koffie',
    category: 'Eten & Drinken',
    svg: '<path d="M17 8h2a2 2 0 0 1 0 4h-2"/><path d="M5 8h12v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8z"/><path d="M3 20h18"/>',
  },
  {
    id: 'water',
    label: 'Water',
    category: 'Eten & Drinken',
    svg: '<path d="M12 2L6 12a6 6 0 1 0 12 0L12 2z"/>',
  },
  {
    id: 'smoothie',
    label: 'Smoothie',
    category: 'Eten & Drinken',
    svg: '<path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1 13h8l1-13"/><path d="M10 12a2 2 0 0 0 4 0"/><path d="M5 5h2M17 5h2"/>',
  },
  {
    id: 'snack',
    label: 'Snack',
    category: 'Eten & Drinken',
    svg: '<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><path d="M12 12v2M9 12v2M15 12v2"/>',
  },
  {
    id: 'pizza',
    label: 'Pizza',
    category: 'Eten & Drinken',
    svg: '<path d="M12 2L2 20h20L12 2z"/><path d="M12 2v18"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><circle cx="12" cy="8" r="1"/>',
  },
  {
    id: 'soep',
    label: 'Soep',
    category: 'Eten & Drinken',
    svg: '<path d="M4 11h16a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a1 1 0 0 1 1-1z"/><path d="M12 11V3"/><path d="M8 7l4-4 4 4"/>',
  },
  {
    id: 'fruit',
    label: 'Fruit',
    category: 'Eten & Drinken',
    svg: '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 4c0-2 2-3 2-3s0 2-2 3"/><path d="M8 8a4 4 0 0 1 8 0"/>',
  },
  {
    id: 'groente',
    label: 'Groente',
    category: 'Eten & Drinken',
    svg: '<path d="M12 22V12"/><path d="M12 12C12 12 7 10 5 6c3 0 5 1 7 6z"/><path d="M12 12C12 12 17 10 19 6c-3 0-5 1-7 6z"/><path d="M12 12C12 12 10 7 12 4c2 3 0 8 0 8z"/>',
  },
  {
    id: 'wijn',
    label: 'Wijn',
    category: 'Eten & Drinken',
    svg: '<path d="M8 2h8l2 8a6 6 0 0 1-6 6 6 6 0 0 1-6-6L8 2z"/><path d="M12 16v4"/><path d="M8 20h8"/>',
  },
  {
    id: 'bier',
    label: 'Bier',
    category: 'Eten & Drinken',
    svg: '<path d="M5 8h11l-1 12H6L5 8z"/><path d="M16 10h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3"/><path d="M5 8V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2"/><path d="M8 12h5"/>',
  },
  {
    id: 'cocktail',
    label: 'Cocktail',
    category: 'Eten & Drinken',
    svg: '<path d="M3 3l9 9-7 9h16l-7-9 9-9H3z"/><path d="M12 12v8"/><path d="M15 17l-3 3-3-3"/>',
  },

  // ── Lichaam & Hygiëne ────────────────────────────────────────────────────────
  {
    id: 'douchen',
    label: 'Douchen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M4 12h8"/><path d="M4 12V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M12 12l3-3"/><path d="M15 9a3 3 0 0 1 3 3"/><path d="M10 16l1 1M13 16l1 1M7 16l1 1M10 19l1 1M13 19l1 1"/>',
  },
  {
    id: 'tandenpoetsen',
    label: 'Tandenpoetsen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M12 2a3 3 0 0 1 3 3v10a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M9 7h6"/><path d="M9 10h6"/>',
  },
  {
    id: 'scheren',
    label: 'Scheren',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M6 3h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V3z"/><path d="M12 12v9"/><path d="M8 18h8"/>',
  },
  {
    id: 'aankleden',
    label: 'Aankleden',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>',
  },
  {
    id: 'handen_wassen',
    label: 'Handen wassen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M8 14v-4a2 2 0 0 1 4 0v4"/><path d="M12 10V6a2 2 0 0 1 4 0v4"/><path d="M4 18v-4a2 2 0 0 1 4 0"/><path d="M20 14a2 2 0 0 0-4 0v4H4v2h16v-6z"/>',
  },
  {
    id: 'haren',
    label: 'Haren',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M5 3c0 9 4 15 7 15s7-6 7-15"/><path d="M9 3c0 5 1 9 3 9s3-4 3-9"/><path d="M8 21l8-18"/><path d="M5 21h14"/>',
  },
  {
    id: 'medicatie',
    label: 'Medicatie',
    category: 'Lichaam & Hygiëne',
    svg: '<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M12 8V4"/><path d="M9 4h6"/><path d="M9 14h6M12 11v6"/>',
  },
  {
    id: 'supplementen',
    label: 'Supplementen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M4 10c0-3.3 3.6-6 8-6s8 2.7 8 6v4c0 3.3-3.6 6-8 6s-8-2.7-8-6v-4z"/><path d="M4 12h16"/>',
  },
  {
    id: 'arts',
    label: 'Arts',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4"/><path d="M9 3a3 3 0 0 0 6 0H9z"/><path d="M12 11v6M9 14h6"/>',
  },
  {
    id: 'yoga',
    label: 'Yoga',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="12" cy="4" r="2"/><path d="M12 6v5l-3 3M12 11l3 3"/><path d="M9 9H6M15 9h3"/><path d="M9 19l3-5 3 5"/>',
  },
  {
    id: 'sporten',
    label: 'Sporten',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="12" cy="5" r="2"/><path d="M12 7v5l-4 4M12 12l4 4"/><path d="M6 11l2-2M16 11l2-2"/>',
  },
  {
    id: 'wandelen',
    label: 'Wandelen',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="12" cy="4" r="2"/><path d="M15 8l-3 2-3-2"/><path d="M9 10l-2 6h10l-2-6"/><path d="M7 22l2-6M17 22l-2-6"/>',
  },
  {
    id: 'fietsen',
    label: 'Fietsen',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l6-10 6 10"/><path d="M12 6l2 4H10"/>',
  },
  {
    id: 'zwemmen',
    label: 'Zwemmen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/><path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0"/><circle cx="12" cy="5" r="2"/><path d="M12 7l5 5"/>',
  },
  {
    id: 'hardlopen',
    label: 'Hardlopen',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="13" cy="4" r="2"/><path d="M7 22l5-8 3 3 2-5"/><path d="M17 22l-2-4"/><path d="M6 12l4-4 2 2 4-2"/>',
  },
  {
    id: 'stretching',
    label: 'Stretching',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="12" cy="4" r="2"/><path d="M4 14l4-4 4 4 4-4 4 4"/><path d="M8 20l4-6 4 6"/>',
  },
  {
    id: 'slapen',
    label: 'Slapen',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M12 8a4 4 0 0 0 4 4A4 4 0 0 1 12 20a8 8 0 0 1 0-16 4 4 0 0 0-4 4 4 4 0 0 0 4 0z"/>',
  },
  {
    id: 'rust',
    label: 'Rust',
    category: 'Lichaam & Hygiëne',
    svg: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v3M10 14h4"/>',
  },
  {
    id: 'ademhaling',
    label: 'Ademhaling',
    category: 'Lichaam & Hygiëne',
    svg: '<path d="M12 4a8 8 0 0 1 0 16"/><path d="M12 4a8 8 0 0 0 0 16"/><path d="M12 8v8M8 12h8"/>',
  },
  {
    id: 'meditatie',
    label: 'Meditatie',
    category: 'Lichaam & Hygiëne',
    svg: '<circle cx="12" cy="5" r="2"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/><path d="M3 21h18"/><path d="M9 17h6"/>',
  },

  // ── Huis & Taken ─────────────────────────────────────────────────────────────
  {
    id: 'koken',
    label: 'Koken',
    category: 'Huis & Taken',
    svg: '<path d="M3 11h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z"/><path d="M3 11V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4"/><path d="M9 7V4M15 7V4"/>',
  },
  {
    id: 'boodschappen',
    label: 'Boodschappen',
    category: 'Huis & Taken',
    svg: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  },
  {
    id: 'schoonmaken',
    label: 'Schoonmaken',
    category: 'Huis & Taken',
    svg: '<path d="M3 22l8-8"/><path d="M10 10l4-4 7 7-4 4z"/><path d="M10 10L8 8a2 2 0 0 1 0-3l2-2a2 2 0 0 1 3 0l2 2"/>',
  },
  {
    id: 'stofzuigen',
    label: 'Stofzuigen',
    category: 'Huis & Taken',
    svg: '<circle cx="8" cy="18" r="3"/><path d="M11 18h9a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2l-2-8H9l1 8H8"/><path d="M18 10V6"/>',
  },
  {
    id: 'wasmachine',
    label: 'Wasmachine',
    category: 'Huis & Taken',
    svg: '<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 5h2M11 5h2M15 7l-3 3"/>',
  },
  {
    id: 'was',
    label: 'Was',
    category: 'Huis & Taken',
    svg: '<path d="M3 6h18"/><path d="M3 6c0 8 4 14 9 14s9-6 9-14"/><path d="M8 9s1 3 4 3 4-3 4-3"/>',
  },
  {
    id: 'afwassen',
    label: 'Afwassen',
    category: 'Huis & Taken',
    svg: '<path d="M3 18h18"/><path d="M3 18V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10"/><path d="M8 18v2M12 18v2M16 18v2"/><path d="M7 11h10"/>',
  },
  {
    id: 'ramen_lappen',
    label: 'Ramen lappen',
    category: 'Huis & Taken',
    svg: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/><path d="M14 6l3 3-3 3"/>',
  },
  {
    id: 'vuilnis',
    label: 'Vuilnis',
    category: 'Huis & Taken',
    svg: '<path d="M3 6h18M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  },
  {
    id: 'planten_water',
    label: 'Planten water',
    category: 'Huis & Taken',
    svg: '<path d="M7 20a5 5 0 0 1 5-5c2.76 0 5 2.24 5 5"/><path d="M12 15V8"/><path d="M12 8c0-3 2-5 4-5-1 2-1 4 0 6"/><path d="M12 8c0-3-2-5-4-5 1 2 1 4 0 6"/>',
  },
  {
    id: 'tuin',
    label: 'Tuin',
    category: 'Huis & Taken',
    svg: '<path d="M12 22v-8"/><path d="M12 14c0 0-4-2-6-6 3-1 5 0 6 2"/><path d="M12 14c0 0 4-2 6-6-3-1-5 0-6 2"/><path d="M5 22h14"/>',
  },
  {
    id: 'boodschappenlijst',
    label: 'Boodschappenlijst',
    category: 'Huis & Taken',
    svg: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2H9z"/><path d="M9 12h6M9 16h4"/>',
  },
  {
    id: 'administratie',
    label: 'Administratie',
    category: 'Huis & Taken',
    svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  },
  {
    id: 'rekeningen',
    label: 'Rekeningen',
    category: 'Huis & Taken',
    svg: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4M14 15h4"/>',
  },
  {
    id: 'belastingen',
    label: 'Belastingen',
    category: 'Huis & Taken',
    svg: '<path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/><path d="M9 4v5M15 4v5M9 15v5M15 15v5M4 9h5M15 9h5M4 15h5M15 15h5"/>',
  },

  // ── Werk & Focus ─────────────────────────────────────────────────────────────
  {
    id: 'werk',
    label: 'Werk',
    category: 'Werk & Focus',
    svg: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  },
  {
    id: 'laptop',
    label: 'Laptop',
    category: 'Werk & Focus',
    svg: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M2 17h20v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z"/><path d="M8 4v13"/>',
  },
  {
    id: 'computer',
    label: 'Computer',
    category: 'Werk & Focus',
    svg: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 12h6"/>',
  },
  {
    id: 'telefoon',
    label: 'Telefoon',
    category: 'Werk & Focus',
    svg: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 17h.01"/>',
  },
  {
    id: 'mail',
    label: 'Mail',
    category: 'Werk & Focus',
    svg: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4l10 9 10-9"/>',
  },
  {
    id: 'bellen',
    label: 'Bellen',
    category: 'Werk & Focus',
    svg: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/>',
  },
  {
    id: 'vergadering',
    label: 'Vergadering',
    category: 'Werk & Focus',
    svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: 'project',
    label: 'Project',
    category: 'Werk & Focus',
    svg: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M13 13h4M13 17h4"/>',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    category: 'Werk & Focus',
    svg: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7 7 7 0 0 1-3.5 6.06V18H8.5v-2.94A7 7 0 0 1 5 9a7 7 0 0 1 7-7z"/>',
  },
  {
    id: 'lezen',
    label: 'Lezen',
    category: 'Werk & Focus',
    svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  },
  {
    id: 'schrijven',
    label: 'Schrijven',
    category: 'Werk & Focus',
    svg: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  },
  {
    id: 'creatief',
    label: 'Creatief',
    category: 'Werk & Focus',
    svg: '<circle cx="13.5" cy="6.5" r="2.5"/><path d="M20 11L8.5 22.5l-5-5L15 6"/><path d="M15 11l-4 4"/>',
  },
  {
    id: 'muziek',
    label: 'Muziek',
    category: 'Werk & Focus',
    svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  },
  {
    id: 'podcast',
    label: 'Podcast',
    category: 'Werk & Focus',
    svg: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3M8 22h8"/>',
  },
  {
    id: 'tekenen',
    label: 'Tekenen',
    category: 'Werk & Focus',
    svg: '<path d="M2 21l6-6 12-12-1-1L7 14 2 21z"/><circle cx="7" cy="7" r="3"/>',
  },
  {
    id: 'planning',
    label: 'Planning',
    category: 'Werk & Focus',
    svg: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  },
  {
    id: 'deadline',
    label: 'Deadline',
    category: 'Werk & Focus',
    svg: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  },
  {
    id: 'presentatie',
    label: 'Presentatie',
    category: 'Werk & Focus',
    svg: '<path d="M2 3h20v14H2z"/><path d="M8 21l4-4 4 4"/><path d="M12 17V3"/><path d="M7 8l3 3-3 3"/>',
  },
  {
    id: 'studie',
    label: 'Studie',
    category: 'Werk & Focus',
    svg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  },

  // ── Sociaal ──────────────────────────────────────────────────────────────────
  {
    id: 'sociale_afspraak',
    label: 'Sociale afspraak',
    category: 'Sociaal',
    svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: 'verjaardag',
    label: 'Verjaardag',
    category: 'Sociaal',
    svg: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 5a1 1 0 0 0 0-2 2 2 0 0 1 4 0 1 1 0 0 0 0 2M17 5a1 1 0 0 0 0-2 2 2 0 0 1-4 0 1 1 0 0 0 0 2"/>',
  },
  {
    id: 'uitje',
    label: 'Uitje',
    category: 'Sociaal',
    svg: '<circle cx="12" cy="8" r="6"/><path d="M15.48 3c.86 2 1.52 4.5 1.52 7a18.47 18.47 0 0 1-1.52 7"/><path d="M8.52 3C7.66 5 7 7.5 7 10a18.47 18.47 0 0 0 1.52 7"/><path d="M6 10h12"/>',
  },
  {
    id: 'familie',
    label: 'Familie',
    category: 'Sociaal',
    svg: '<path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M6 11a4 4 0 0 0-4 4v2M18 11a4 4 0 0 1 4 4v2"/>',
  },
  {
    id: 'vrienden',
    label: 'Vrienden',
    category: 'Sociaal',
    svg: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
  },
  {
    id: 'afspreken',
    label: 'Afspreken',
    category: 'Sociaal',
    svg: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="2"/>',
  },
  {
    id: 'date',
    label: 'Date',
    category: 'Sociaal',
    svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  },
  {
    id: 'feest',
    label: 'Feest',
    category: 'Sociaal',
    svg: '<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24 2.24"/><path d="m20 6-8 8"/><path d="m15 7 3-3"/><path d="M9 12 2 19v1h1l7-7"/>',
  },
  {
    id: 'sport_team',
    label: 'Sport team',
    category: 'Sociaal',
    svg: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>',
  },
  {
    id: 'vrijwilligerswerk',
    label: 'Vrijwilligerswerk',
    category: 'Sociaal',
    svg: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
  },

  // ── Zorg & Welzijn ───────────────────────────────────────────────────────────
  {
    id: 'psychiater',
    label: 'Psychiater',
    category: 'Zorg & Welzijn',
    svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 8v4M10 10h4"/>',
  },
  {
    id: 'psycholoog',
    label: 'Psycholoog',
    category: 'Zorg & Welzijn',
    svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M9 13s1 2 3 2 3-2 3-2"/>',
  },
  {
    id: 'begeleider',
    label: 'Begeleider',
    category: 'Zorg & Welzijn',
    svg: '<circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/><path d="M19 10l2 2-2 2"/>',
  },
  {
    id: 'huisarts',
    label: 'Huisarts',
    category: 'Zorg & Welzijn',
    svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  },
  {
    id: 'tandarts',
    label: 'Tandarts',
    category: 'Zorg & Welzijn',
    svg: '<path d="M12 2c-3 0-5 2-5 5 0 1.5.5 3 1 4l2 9h4l2-9c.5-1 1-2.5 1-4 0-3-2-5-5-5z"/><path d="M9 7h6"/>',
  },
  {
    id: 'fysiotherapeut',
    label: 'Fysiotherapeut',
    category: 'Zorg & Welzijn',
    svg: '<circle cx="12" cy="5" r="3"/><path d="M6 9l-2 7h16l-2-7"/><path d="M9 9l3 7 3-7"/><path d="M6 16l6 4 6-4"/>',
  },
  {
    id: 'apotheker',
    label: 'Apotheker',
    category: 'Zorg & Welzijn',
    svg: '<path d="M3 2h18v4H3z"/><path d="M5 6v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6"/><path d="M10 11h4M12 9v6"/>',
  },
  {
    id: 'ziekenhuis',
    label: 'Ziekenhuis',
    category: 'Zorg & Welzijn',
    svg: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  },
  {
    id: 'therapie',
    label: 'Therapie',
    category: 'Zorg & Welzijn',
    svg: '<path d="M3 21l9-9 9 9"/><path d="M12 3v9"/><circle cx="12" cy="12" r="9"/>',
  },
  {
    id: 'coaching',
    label: 'Coaching',
    category: 'Zorg & Welzijn',
    svg: '<path d="M12 20h9"/><circle cx="12" cy="8" r="4"/><path d="M8 20v-4a4 4 0 0 1 8 0v4"/><path d="M18 14l2-2 2 2"/>',
  },

  // ── Locaties/Ruimtes ─────────────────────────────────────────────────────────
  {
    id: 'woonkamer',
    label: 'Woonkamer',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M5 20v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8"/>',
  },
  {
    id: 'badkamer',
    label: 'Badkamer',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z"/><path d="M4 12V5a2 2 0 0 1 2-2h2v4"/><path d="M8 20v2M16 20v2"/>',
  },
  {
    id: 'slaapkamer',
    label: 'Slaapkamer',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/><path d="M8 8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/>',
  },
  {
    id: 'keuken',
    label: 'Keuken',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 3v18"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="15" r="2"/>',
  },
  {
    id: 'hal',
    label: 'Hal',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16"/><path d="M3 21h18"/><path d="M9 21V9h6v12"/><circle cx="12" cy="14" r="1"/>',
  },
  {
    id: 'werkplek',
    label: 'Werkplek',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M2 20h20"/><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20v-4h8v4"/>',
  },
  {
    id: 'balkon',
    label: 'Balkon',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 9h18v11H3z"/><path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3"/><path d="M7 9v11M12 9v11M17 9v11"/>',
  },
  {
    id: 'garage',
    label: 'Garage',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 21V9l9-6 9 6v12"/><path d="M3 21h18"/><path d="M9 21v-6h6v6"/><path d="M9 12h6"/>',
  },
  {
    id: 'kelder',
    label: 'Kelder',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 9h18v12H3z"/><path d="M3 9l9-6 9 6"/><path d="M12 9v12"/><path d="M3 15h18"/>',
  },
  {
    id: 'zolder',
    label: 'Zolder',
    category: 'Locaties/Ruimtes',
    svg: '<path d="M3 12l9-8 9 8"/><path d="M5 12v8h14v-8"/><path d="M10 20v-6h4v6"/>',
  },

  // ── Objecten ─────────────────────────────────────────────────────────────────
  {
    id: 'sleutel',
    label: 'Sleutel',
    category: 'Objecten',
    svg: '<circle cx="7.5" cy="7.5" r="4.5"/><path d="M10.5 10.5L21 21"/><path d="M16 19l2 2M19 16l2 2"/>',
  },
  {
    id: 'portemonnee',
    label: 'Portemonnee',
    category: 'Objecten',
    svg: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  },
  {
    id: 'tas',
    label: 'Tas',
    category: 'Objecten',
    svg: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  },
  {
    id: 'rugzak',
    label: 'Rugzak',
    category: 'Objecten',
    svg: '<path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10"/><path d="M4 20h16"/><path d="M10 6V4a2 2 0 0 1 4 0v2"/><path d="M8 14h8"/>',
  },
  {
    id: 'paraplu',
    label: 'Paraplu',
    category: 'Objecten',
    svg: '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>',
  },
  {
    id: 'bril',
    label: 'Bril',
    category: 'Objecten',
    svg: '<circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><path d="M10 12h4"/><path d="M2 12h0M22 12h0"/>',
  },
  {
    id: 'horloge',
    label: 'Horloge',
    category: 'Objecten',
    svg: '<circle cx="12" cy="12" r="7"/><path d="M12 9v3l2 2"/><path d="M9 2h6M9 22h6"/>',
  },
  {
    id: 'boek',
    label: 'Boek',
    category: 'Objecten',
    svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  },
  {
    id: 'krant',
    label: 'Krant',
    category: 'Objecten',
    svg: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>',
  },
  {
    id: 'tijdschrift',
    label: 'Tijdschrift',
    category: 'Objecten',
    svg: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  },
  {
    id: 'kaart',
    label: 'Kaart',
    category: 'Objecten',
    svg: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/>',
  },
  {
    id: 'document',
    label: 'Document',
    category: 'Objecten',
    svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  },
  {
    id: 'pakket',
    label: 'Pakket',
    category: 'Objecten',
    svg: '<path d="M12 2l10 6v8l-10 6L2 16V8z"/><path d="M12 2v20"/><path d="M2 8l10 6 10-6"/>',
  },

  // ── Vervoer ──────────────────────────────────────────────────────────────────
  {
    id: 'auto',
    label: 'Auto',
    category: 'Vervoer',
    svg: '<path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
  },
  {
    id: 'fiets',
    label: 'Fiets',
    category: 'Vervoer',
    svg: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 3"/><path d="M18.5 17.5H9L5.5 11l6-4.5 1.5 2.5h5"/>',
  },
  {
    id: 'bus',
    label: 'Bus',
    category: 'Vervoer',
    svg: '<path d="M8 6v6M3 6h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/><path d="M3 10h18"/><path d="M16 6v6"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/>',
  },
  {
    id: 'trein',
    label: 'Trein',
    category: 'Vervoer',
    svg: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><circle cx="8.5" cy="19.5" r="1.5"/><circle cx="15.5" cy="19.5" r="1.5"/><path d="M8 19l-2 3M16 19l2 3"/>',
  },
  {
    id: 'tram',
    label: 'Tram',
    category: 'Vervoer',
    svg: '<rect x="4" y="4" width="16" height="14" rx="1"/><path d="M8 4V2M16 4V2"/><path d="M4 9h16"/><circle cx="8.5" cy="18.5" r="1.5"/><circle cx="15.5" cy="18.5" r="1.5"/><path d="M4 18h16"/>',
  },
  {
    id: 'lopen',
    label: 'Lopen',
    category: 'Vervoer',
    svg: '<circle cx="12" cy="4" r="2"/><path d="M8 12l2-5 2 2 3-3 2 4"/><path d="M8 22l3-7 3 3 2-5"/>',
  },
  {
    id: 'taxi',
    label: 'Taxi',
    category: 'Vervoer',
    svg: '<path d="M5 17H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2l3-5h8l3 5h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/><path d="M8 5h8"/>',
  },
  {
    id: 'vlucht',
    label: 'Vlucht',
    category: 'Vervoer',
    svg: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  },

  // ── Vrije tijd ───────────────────────────────────────────────────────────────
  {
    id: 'film',
    label: 'Film',
    category: 'Vrije tijd',
    svg: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>',
  },
  {
    id: 'serie',
    label: 'Serie',
    category: 'Vrije tijd',
    svg: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><path d="M10 9l5 3-5 3V9z"/>',
  },
  {
    id: 'spel',
    label: 'Spel',
    category: 'Vrije tijd',
    svg: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/>',
  },
  {
    id: 'spelletje',
    label: 'Spelletje',
    category: 'Vrije tijd',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/><circle cx="12" cy="12" r="1"/>',
  },
  {
    id: 'wandeling',
    label: 'Wandeling',
    category: 'Vrije tijd',
    svg: '<path d="M3 17c3-3 6-3 9 0s6 3 9 0"/><path d="M3 7c3-3 6-3 9 0s6 3 9 0"/><path d="M3 12c3-3 6-3 9 0s6 3 9 0"/>',
  },
  {
    id: 'museum',
    label: 'Museum',
    category: 'Vrije tijd',
    svg: '<path d="M2 10l10-8 10 8"/><path d="M4 10v10h16V10"/><path d="M2 21h20"/><path d="M9 21V13h6v8"/>',
  },
  {
    id: 'concert',
    label: 'Concert',
    category: 'Vrije tijd',
    svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M15 4l3 8"/>',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    category: 'Vrije tijd',
    svg: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
  },
  {
    id: 'sport_kijken',
    label: 'Sport kijken',
    category: 'Vrije tijd',
    svg: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/><circle cx="12" cy="11" r="3"/>',
  },
  {
    id: 'hobby',
    label: 'Hobby',
    category: 'Vrije tijd',
    svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  },
  {
    id: 'foto',
    label: 'Foto',
    category: 'Vrije tijd',
    svg: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  },
  {
    id: 'kunst',
    label: 'Kunst',
    category: 'Vrije tijd',
    svg: '<circle cx="13.5" cy="6.5" r="2.5"/><path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/><path d="M3 12c3-4 5-7 9-7s6 3 9 7c-3 4-5 7-9 7s-6-3-9-7z"/>',
  },
]

export function Icon({
  id,
  size = 24,
  color = 'white',
}: {
  id: string
  size?: number
  color?: string
}) {
  const icon = ICONS.find((i) => i.id === id)
  if (!icon) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill="none" />
      </svg>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

export function getIcon(id: string): IconDef | undefined {
  return ICONS.find((i) => i.id === id)
}

export const ICON_CATEGORIES = [...new Set(ICONS.map((i) => i.category))]
