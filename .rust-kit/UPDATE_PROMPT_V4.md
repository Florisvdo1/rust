Patch the existing RUST app in the current folder.

This is a version 4 refinement pass. Do not start from zero. Update the actual codebase.

Apply all of the following:

1. BRAND
- Replace every incorrect brand rendering of "RUS" with "RUST"
- Ensure the logo, wordmark, manifest name, header label, and any seeded copy consistently use RUST

2. PLANNER DECK OPEN/CLOSE AFFORDANCE
- The current deck expander is not obvious
- Replace the ambiguous baby-blue line handle with a clear, elegant, centered open/close affordance
- Prefer icon-based UI over text-only if you can make it obvious
- Use premium white line-art icons matching the app style
- Suggested semantics:
  - collapsed state: an icon cue meaning "show all icons"
  - expanded state: an icon cue meaning "minimize"
- Place the control centered between the search area and the deck outline
- Keep it notch-safe, visually balanced, and easy to tap
- Also support swipe up to expand and swipe down to collapse, but keep the button/icon control too
- Swipe must be stable and not conflict with planner dragging

3. PLANNER DECK VISIBILITY ABOVE BOTTOM NAV
- On iPhone 15 Pro and similar devices, collapsed and expanded deck content can disappear behind the bottom navigation
- Reduce icon tile size, category chip size, spacing, and text sizing just enough so visible content sits above the bottom nav
- Make bottom nav approximately 60 percent solid dark navy-blue and 40 percent transparent, so underlying content is slightly visible but controls remain legible
- Keep everything premium and readable

4. PORTRAIT APP FEEL / ZOOM LOCK
- Improve native app feel for mobile portrait use
- Prevent accidental browser zooming and layout scaling as much as is realistically possible in a web app
- Configure viewport and relevant CSS for a locked-feel portrait PWA
- Do not break normal scrolling or accessibility unnecessarily
- Keep the app optimized for portrait phones

5. NOTCH / DYNAMIC ISLAND SAFE HEADER
- On iPhone devices with sensor housing / dynamic island, the date pills or day tabs in Planner are too high and hard to tap
- Move them down and rebalance nearby layout so date tabs like 4 april, 5 april, 6 april are fully tappable
- Make the whole planner header safe-area aware
- Do the same for other top-level headers if needed

6. TODAY HEADER
- Keep the greeting section sticky in Vandaag if that improves usability
- Make greeting time-aware:
  - before 12:00: Goedemorgen
  - from 12:01 to 18:00: Goedemiddag
  - from 18:01 onward: Goedenavond
- Ensure it updates correctly based on local device time

7. HEALTH SEED CONTENT
- Replace example "Ritalin" entry with "Magnesium"
- Example dosage copy should become calm and neutral, for example "1 pil"

8. BREATHING SETTINGS CLOSE AFFORDANCE
- In the breathing settings overlay, replace any ambiguous line handle with a clearer, premium icon affordance for dismiss/close/back to breathing screen
- Keep the gear icon behavior
- Make close/back obvious and aligned to the visual language

9. SAVE / CLOUD UPGRADE
Implement Supabase cloud persistence support in addition to the existing local-first architecture.

Requirements:
- Use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.local
- Add a Supabase client wrapper
- Support authenticated sync-ready storage for:
  - planner items
  - quick notes
  - journal entries
  - medication items
  - medication logs
  - location entries
  - location photos metadata
  - user settings / preferences
- Preserve local-first behavior, then sync when configured
- Do not break offline use
- If no Supabase env vars are present, app must still run locally
- If env vars are present, enable cloud save path
- Use browser-safe auth only
- Keep client-side use limited to publishable/anon key and RLS-protected tables
- Do not expose service_role
- Add a lightweight auth screen or account/settings flow suitable for magic link email login
- Keep the auth flow minimal and elegant
- Add clear copy for backup/sync in Dutch
- Explain in-app that cloud backup helps across reinstall/browser reset, while local-only does not

10. PHOTOS / STORAGE
- Integrate Supabase Storage support for Plaatsen photos when Supabase is configured
- Keep full-image visibility behavior, no destructive crop
- Keep local fallback if cloud is unavailable
- Upload to private bucket rust-photos
- Store paths/metadata safely
- Make retrieval user-specific via RLS and storage policies

11. UX / VISUAL POLISH
- Preserve the premium calm blue visual direction
- Improve any plain or awkward areas to match the current app better
- Keep the app fast, smooth, and mobile-safe
- No heavy animated background
- Keep the layout symmetrical and consistent
- Preserve block-square rhythm

12. SAFE IMPLEMENTATION
- Keep npm install and npm run build working
- Keep Vite + PWA setup healthy
- Add any needed env/type helpers
- Update README briefly to mention Supabase setup if helpful
- Keep the project GitHub-ready

After patching:
- ensure build passes
- do not output a concept note
- write the real code changes into the existing project
