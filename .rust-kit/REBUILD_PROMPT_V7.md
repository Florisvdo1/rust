
You are patching an existing React + TypeScript + Vite mobile web app called RUST.

Do not redesign in abstract.
Do not describe work.
Modify the actual codebase in this workspace until the app matches the acceptance criteria and builds cleanly.

Current live symptoms that prove the old build is still wrong:
- The logo still shows "RUS" instead of "RUST"
- The medication example still shows "Ritalin"
- The visual quality still looks like the first rough version
- The planner/icon deck affordance is still unclear
- The old mobile issues still exist

Your job:
Perform a hard, production-sane rebuild patch of the existing app. Replace weak or wrong implementation where needed. Keep the app name RUST and preserve the core product modules.

Core modules to preserve and improve:
- Vandaag
- Planner
- Onthouden
- Plaatsen
- Dagboek
- Gezondheid
- Ademhaling
- Meer

Critical acceptance criteria. Do not stop until these are implemented:

1. BRAND / HEADER
- Replace every visible "RUS" brand instance with "RUST"
- Upgrade the logo so it feels premium, centered, SVG-based, readable on all mobile widths
- Keep header compact and safe-area aware

2. SAFE AREA / NOTCH / DYNAMIC ISLAND
- The day chips or date selector in Planner must not sit under iPhone hardware cutouts
- Shift top content down with proper safe-area handling
- Use CSS env(safe-area-inset-top) and robust header padding
- All tappable top controls must remain reachable on iPhone 15 Pro class devices

3. TODAY PAGE
- "Goedemorgen" / "Goedemiddag" / "Goedeavond" must switch by local time:
  * before 12:00 -> Goedemorgen
  * 12:00 through 18:00 -> Goedemiddag
  * after 18:00 -> Goedeavond
- Keep this header section visually stable and premium

4. HEALTH EXAMPLE CONTENT
- Replace the seed/example item "Ritalin" with "Magnesium"
- Dosage/example should read like a neutral supplement example, e.g. "1 pil"
- Remove stimulant-specific seed content from the default first impression

5. ICON DECK OPEN/CLOSE AFFORDANCE
- The current thin line handle is unclear
- Replace it with a clear, centered, icon-first open/close control positioned between the search area and the deck outline
- Use premium white line-art icons for expand/collapse, e.g. chevrons / arrows up-down
- Add short Dutch helper text only if needed, but prefer icon-first clarity
- It must be obvious how to open and close the deck

6. ICON DECK SWIPE GESTURE
- Add a stable swipe interaction:
  * swipe up on the deck area to expand
  * swipe down on the deck area to collapse
- Must work on touch devices
- Must not interfere with planner drag-and-drop
- Must feel native and robust, not jittery

7. ICON DECK VISIBILITY ABOVE BOTTOM NAV
- When collapsed, the icon deck contents must remain visible above the bottom nav
- When expanded, icons must not disappear awkwardly behind the nav
- If content reaches the lower area, the bottom nav should be visually translucent enough to preserve context
- Adjust icon/card sizing and spacing so the deck fits elegantly above the nav on iPhone portrait
- Bottom nav target look:
  * dark navy / deep blue
  * approx 60% solid feel, 40% transparency feel
  * premium blur/glass if performant
  * still readable and accessible

8. MOBILE / PWA LOCKED FEEL
- Strengthen the app’s native installed-app feeling
- Add or correct viewport / meta / touch handling so the app does not feel zoomable like a normal page
- Reduce pinch-zoom / accidental zooming where possible for a PWA-style UI
- Keep the app portrait-first and visually locked/stable on mobile
- Do not break accessibility unnecessarily

9. PLANNER MOBILE QUALITY
- Keep the quarter-slot holder system
- Keep mobile drag-and-drop stable
- Ensure visible holders and clean block-square alignment
- Improve exact x/y spacing, symmetry, and alignment across holders, cards, labels and pictograms
- No overlap, no canvas spill, no clipped text
- The app must feel calculated and refined

10. PREMIUM VISUAL REBUILD
- The current design is too plain
- Upgrade the whole template to a premium serene aesthetic inspired by calm high-end wellness apps, but not copying proprietary trade dress
- Use:
  * deep navy / granite blue gradient family
  * baby blue / mist accents
  * refined typography
  * white line-art icons
  * better cards, buttons, tab bar, sheets, modals
  * more premium spacing rhythm
- Keep everything lightweight and smooth

11. BREATHING SETTINGS OVERLAY CLOSE CONTROL
- The settings overlay on the breathing page currently uses an unclear bar handle
- Replace with a clearer premium icon-based close/minimize control
- Keep the gear button in the top-right
- Tapping the close control should clearly return to the breathing page

12. BREATHING MODULE UPGRADE
- Keep the stronger breathing architecture already requested:
  * exercise library
  * pre-instruction popup
  * 3-2-1 countdown
  * active player
  * synced text above/below
  * clear nose/mouth guidance
  * alternate nostril hand/finger explanation
- Improve visual quality and smoothness further
- Replace weak/simple circles with richer scene logic where still present
- Animation must be smooth, readable, premium, and first-time-user proof
- No stuttering, no flicker

13. CLOUD SAVE INTEGRATION
- Integrate Supabase properly using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.local
- Use a realistic architecture:
  * local-first immediate UX
  * authenticated cloud sync for durable cross-browser/device restore
  * do not pretend uninstall survives without cloud
- Implement:
  * auth-aware data model
  * sync helpers / repository layer
  * graceful offline fallback
  * photo persistence using Supabase Storage for the private rust-photos bucket
- The app should prefer cloud-backed persistence when signed in, but continue to function locally when signed out
- Keep this production-sane and minimal; do not explode complexity

14. PAGES TO IMPROVE
Apply careful quality improvements across:
- Vandaag
- Planner
- Onthouden
- Plaatsen
- Dagboek
- Gezondheid
- Ademhaling
- Meer

Upgrade:
- design polish
- spacing
- typography
- mobile fit
- safe area handling
- visual hierarchy
- icons
- buttons
- cards
- animation smoothness
- cloud save integration
- persistence handling
- bottom nav
- portrait fit

15. HARD VALIDATION BEFORE FINISHING
Before finishing:
- ensure visible brand text is RUST, not RUS
- ensure seed content no longer shows Ritalin
- ensure planner top controls are safe-area/notch safe
- ensure icon deck open/close affordance is obvious
- ensure bottom nav no longer obscures deck awkwardly
- ensure Supabase env usage exists in code
- ensure build succeeds with npm run build

Implementation constraints:
- React + TypeScript + Vite
- production-sane code only
- keep dependencies minimal
- do not leave TODO placeholders
- do not answer with prose only
- actually edit the project

Now patch the codebase completely and make it build.
