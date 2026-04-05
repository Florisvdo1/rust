# RUST – Dagelijkse Ondersteuning

Een premium, kalme, mobile-first dagelijkse ondersteuningsapp voor neurodiverse gebruikers (ADHD, autisme, AuDHD).

---

## Modules

| Module | Beschrijving |
|---|---|
| **Vandaag** | Dagelijkse dashboard: volgende taak, medicatie, voortgang, snelle notitie |
| **Planner** | Visuele dagplanner met drag-and-drop, 15-minuut slots, 06:00–05:00 |
| **Onthouden** | Ultra-snelle capture van taken, notities, herinneringen |
| **Plaatsen** | Visueel geheugenarchief voor waar objecten zijn opgeborgen |
| **Dagboek** | Vrij schrijven + geleide check-in met stemming/energie/stress |
| **Gezondheid** | Medicatie- en supplemententracker met inname-status |
| **Ademhaling** | Volledig ademhalingsengine: 8 oefeningen, pre-instructie, animaties |
| **Meer** | Instellingen, export/import, privacy, over de app |

---

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **IndexedDB** via `idb` (lokale opslag)
- **PWA** via `vite-plugin-pwa` (service worker, installeerbaar)
- **date-fns** voor datumverwerking
- Geen UI framework – volledig op maat CSS met design tokens
- Drag-and-drop via Pointer Events (mobiel-veilig, geen HTML DnD)

---

## Aan de slag

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:5173
npm run build      # productie build → /dist
npm run preview    # preview van productie build
```

---

## Deployment

### Vercel
Verbind de GitHub repository. Vercel detecteert Vite automatisch.
Build command: `npm run build` | Output: `dist`

### Netlify
Drag & drop de `/dist` map na `npm run build`,
of verbind de repository met: build `npm run build`, publish `dist`.
`netlify.toml` is aanwezig voor automatische configuratie.

### Handmatig (zip)
```bash
npm run build
# zip de /dist map en upload naar elke statische hosting
```

---

## PWA / Lokale opslag

- Alle gegevens worden opgeslagen in IndexedDB op het apparaat
- Geen cloud, geen tracking, geen externe servers
- Export je gegevens via **Meer → Exporteer back-up** (JSON)
- Importeer via **Meer → Importeer back-up**
- De app vraagt persistent storage aan bij eerste gebruik

**Iconen (voor echte PWA installatie):**
Vervang `public/icon-192.svg` en `public/icon-512.svg` door PNG-varianten voor maximale compatibiliteit. Een gegenereerd PNG-icoon via een lokale browser of tool (bijv. `sharp`, Inkscape) is aanbevolen voor productie.

---

## Design systeem

- Kleurpalet: granite blue, muted blue, baby blue, pale mist, off-white
- Typografie: Inter (Google Fonts)
- Donker als primair thema
- Design tokens via CSS custom properties in `src/styles/global.css`
- Alle gebruikerstekst in het **Nederlands**

---

## Structuur

```
src/
├── App.tsx                    # Root, lazy tab routing
├── main.tsx                   # Entry point
├── styles/global.css          # Design tokens + reset
├── db/index.ts                # IndexedDB abstractie (idb)
├── store/AppContext.tsx        # Globale state + settings
├── data/seed.ts               # Demo-inhoud (eerste keer laden)
├── components/
│   ├── icons/IconLibrary.tsx  # 130+ SVG iconen
│   ├── layout/NavBar.tsx      # Onderste navigatiebalk
│   └── ui/                    # BottomSheet, TutorialCard, LoadingScreen
└── screens/
    ├── Vandaag/               # Vandaag dashboard
    ├── Planner/               # Visuele planner + drag-and-drop
    ├── Onthouden/             # Capture module
    ├── Plaatsen/              # Plaatsen geheugenarchief
    ├── Dagboek/               # Journaalmodule
    ├── Gezondheid/            # Medicatietracker
    ├── Ademhaling/            # Ademhalingsengine
    └── Meer/                  # Instellingen + export
```

---

## Notities

- Geen medische claims. RUST is een persoonlijk hulpmiddel.
- Geen nep-AI. Alle functies zijn volledig lokaal.
- Gericht op cognitieve lastverlaging, niet op gamification.
- Ademhalingsoefeningen zijn informatief gelabeld (bewijs-niveau).

---

*Build geslaagd · npm run build · 873 modules · PWA met service worker*
