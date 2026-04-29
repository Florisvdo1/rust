# RUST Changelog

## v1.4.0 — Auth Hardening & Email Verification (2026-04-29)

### Auth Flows
- `/verify` route: email verification callback with Dutch states (checking, success, expired, error, no_code)
- `/reset-password` route: password reset form with show/hide password toggles
- `AuthPage`: forgot-password mode, resend verification after unconfirmed login, `emailRedirectTo` on signup
- `supabase.ts`: `detectSessionInUrl` changed from `false` → `true` — was silently breaking all auth callbacks
- `MeerPage`: `resetPasswordForEmail` now includes `redirectTo: origin + '/reset-password'`
- Email regex tightened to require ≥2 alpha chars in TLD (`/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/`)

### Modal
- `ConfirmDialog`: flex-centering wrapper replaces CSS transform approach; fixes Framer Motion transform conflict causing off-center positioning on mobile

### Supabase SQL (idempotent)
- `profiles`: `email TEXT` and `updated_at TIMESTAMPTZ` columns added
- `handle_new_user` trigger: stores `new.email` in INSERT

### Docs
- `README_DEPLOY.md`: Auth Email Configuration section (URL config, Dutch templates, Resend/SMTP, DNS)

## v1.3.0 — Cloud Sync & Portal Dialogs (2026-04-20)

### Cloud Sync
- All modules (Planner, Onthouden, Plaatsen, Dagboek, Gezondheid, Ademhaling) sync to Supabase when logged in
- Sync status badges: uploading / cloud saved / local only
- Row Level Security on all tables

### Supabase
- `schema.sql`: RLS enabled on all tables, policies added
- `rls.sql`: full per-user policy set

## v1.2.0 — Health Planner Integration (2026-04-18)

### Health → Planner
- Supplements and medication schedulable from Gezondheid into Planner
- New planner fields: `source`, `health_type`, `health_dosage`, `health_quantity`, `health_note`

## v1.1.0 — V5/V6 Mobile UX Repair (2026-04-15)

### Navigation
- Added Onthouden tab; new order: Vandaag → Onthouden → Planner → Adem → Dagboek → Meer
- Collapsible nav with centered "Verbergen" pill straddling nav top edge
- Collapsed state shows "Menu openen" pill 4px above safe area
- Collapse persisted in localStorage; all pages adjust via `--bottom-nav-height` + `body.nav-collapsed`

### Global CSS
- Font stack updated: `ui-rounded`, `SF Pro Rounded`, `Aptos`, `Inter`, `DM Sans`
- Added `--bottom-nav-height` CSS variable, updated by nav JS
- Added `.sheet-scroll`, `.sticky-save-bar`, `.sheet-keyboard-safe` utilities
- Replaced `position: fixed` body pattern with `overflow: hidden` on `#root` for iOS rubber-band
- `.page-scroll` now uses `--bottom-nav-height` + responds to `body.nav-collapsed`

### Sheets & Overlays
- Every drag handle is now a button that closes the sheet on tap
- X close button always visible top-right on all overlays
- All sheet bodies use `.sheet-scroll` (vertical scroll, overscroll-behavior: contain)
- Sticky save bars use `.sticky-save-bar` class (safe-bottom padding, above keyboard)

### Planner
- Activity tray height set to 78vh with proper `sheet-scroll`; last row padded above nav
- Collision layout: overlapping time slots render side-by-side, delete stays tappable
- 80+ activities across 18 Dutch categories with full line-art SVG icons
- FAB position updated to `--bottom-nav-height`
- Haptic feedback on activity select and slot placement

### Plaatsen
- Expanded ROOMS: added Toilet, Meterkast, Bank, Kapstok, Sleutels (30 total)
- FAB prefills active category filter into form room selector
- Save button always visible via `.sticky-save-bar` (never hidden behind nav/keyboard)
- Cloud save status badges: uploading / cloud saved / local only
- `capture="environment"` for mobile camera; HEIC/GIF support

### Ademhaling
- Start button moved to sticky footer bar — always visible after duration selection
- Button disabled (with Dutch label) until duration is chosen
- Haptic on breathing phase transitions (`breathingVibration` setting)
- Web Audio chime on phase change (`breathingChime` setting) and start (`startTone`)

### Vandaag
- Premium module shortcut grid: 6 cards (Onthouden, Planner, Ademhaling, Dagboek, Gezondheid, Plaatsen)
- Each card has colour-tinted icon, label, and short Dutch helper text

### Haptics & Sounds (`src/lib/haptics.ts`)
- `haptic(strength)` — `navigator.vibrate` with silent fail on unsupported browsers
- `playChime(freq, dur)` — Web Audio API sine tone, no autoplay violation
- `playBreathingPhaseChime()`, `playBreathingStartChime()` — used by AdemhalingPage

### Supabase SQL (all idempotent)
- `rls.sql`: `DROP POLICY IF EXISTS` before all policies; `handle_new_user` trigger wrapped in `EXCEPTION WHEN OTHERS` so signup never fails; duplicate username resolved with random suffix
- `schema.sql`: `ALTER TABLE ADD COLUMN IF NOT EXISTS` for avatar_url, place fields, settings columns
- `storage.sql`: `DROP POLICY IF EXISTS` before all storage policies

## v1.0.0 — Antigravity Build (2026-04-14)

### Auth
- Premium welcome screen with login/register/guest flow
- Dutch-language registration with username, email, password
- Password confirmation with warning to save password safely
- Supabase auth integration with graceful fallback (local mode)
- Logout in Meer/Settings
- Guest mode with clear messaging about local data

### App Shell
- Settings icon visible in top-left of every page header
- BottomNav with 5 tabs: Vandaag, Planner, Adem, Dagboek, Meer

### Planner
- 100+ selectable activities across 18 categories
- Category filter chips in activity tray
- Duration options: 10–55 min, 1–10 hours
- Timeline with tap-to-place flow
- Inline SVG icon map with fallback dot

### Plaatsen (Fixes)
- Plus button respects active category filter — opens form with correct category pre-selected
- 29 expanded categories (Woonkamer → Scooter → Anders)
- New fields: Waar precies, Subplek, Container/lade/plank, Positie chips
- iPhone photo upload: camera + picker, preview, Supabase storage, upload state indicator, error feedback
- Sticky save button — never hidden behind nav
- Close X always visible

### Onthouden
- Sticky save button above keyboard/nav
- Category filter with 8 categories
- Pin/unpin inline action
- Better empty state

### Dagboek
- 1–5 mood scale with emoji (😔 → 😊)
- Energy level (1–5)
- Stress level (1–5) with color-coded labels
- Guided prompts: Wat ging goed / moeilijk / onthouden / vrij schrijven
- Recent entries overview with mood + energy badges
- Persistent per date — edit today's entry

### Gezondheid
- Plus/minus hydration buttons (save immediately)
- Sleep +/- 0.5h, quality 1–5
- Summary card showing water/sleep/quality at top
- Supplements/medication with checkbox — persists per date
- No seed Ritalin policy (only Magnesium default)

### Ademhaling
- 6 exercises with Dutch names:
  Rustig ademen, Langer uitademen, Rust na spanning,
  Om en om door je neus ademen, In een vast ritme ademen, Rustig focussen
- Explanation overlay before start
- Duration 1–5 min selection
- 3-2-1 countdown
- Session counts to zero, completion state
- Phase text in Dutch, seconds remaining
- Pause/stop/replay controls
- Alternate nostril nose graphic with hand cue text

### Meer / Settings
- Account section: profile name, logout
- New toggles: ademhaling chime, start tone
- Guest mode messaging
- Version footer

### Design
- DM Sans font throughout
- Granite blue palette: #2d3a4a / #1e293b / #5c7a99 / #95b8d1
- Premium gradient header cards
- Sheet modals with sticky save buttons
- Safe-area support throughout
- No horizontal scroll, no hidden CTAs

### Supabase
- schema.sql: all tables with user_id FK and indexes
- rls.sql: per-user RLS policies + auto-create profile trigger
- storage.sql: user-photos + places buckets with RLS

### Infrastructure
- vercel.json: SPA rewrite configured
- netlify.toml: redirect configured
- .env.example with safe placeholders only
