Patch the existing RUST app in this current folder.

This is a hard patch request for the current codebase, not a loose redesign.

Required changes from the latest user requests

1. Branding and text
- Replace any visible app logo text "RUS" with "RUST".
- Keep the logo premium and correctly spaced on all screens.
- Replace demo medication examples that say "Ritalin" with "Magnesium, 1 pil".
- Keep Dutch UI copy.

2. Home screen fixes
- Fix the overlap bug where greeting text and task content collide near the top.
- Keep header content notch-safe and safe-area aware on iPhones with camera island / sensor cutout.
- Make greeting time-aware:
  - before 12:00 => Goedemorgen
  - 12:00 to 18:00 => Goedemiddag
  - after 18:00 => Goedenavond
- Keep the main greeting area visually premium and stable.

3. Planner and icon deck
- Make the icon deck open/close affordance obvious.
- Replace the unclear baby-blue bar affordance with a clear centered control:
  - icon-based preferred
  - if needed, compact Dutch helper text
- Support both tap control and swipe interaction to expand/collapse the deck.
- Make deck content stay visible above the bottom nav.
- Reduce icon/card/category sizing slightly if needed so content does not disappear under the bottom nav.
- Keep the bottom nav slightly translucent premium dark blue so deck content can remain perceptible behind it.
- Maintain robust mobile drag and drop with visible holders.
- Keep day switching working.
- Keep quarter-slot holders visible.

4. Mobile portrait feel
- Improve native-like portrait lock feel.
- Prevent pinch-zoom and accidental viewport zooming where appropriate for the web app shell.
- Keep the app fitting fully inside the canvas on mobile portrait devices.
- Avoid overlapping text, clipped cards, or UI outside the viewport.
- Preserve controlled internal scrolling where needed.

5. Bottom nav and safe areas
- Keep the bottom nav premium, translucent, and stable.
- Ensure no essential UI is hidden behind the nav.
- Ensure top tabs and date selectors are shifted down enough to be tappable under iPhone safe areas.

6. Breathing module
- Keep the better breathing engine structure.
- Improve pre-exercise instruction popups for clarity.
- Ensure play starts a proper countdown 3, 2, 1, then the guided sequence.
- Keep line-art play/pause/close controls.
- Improve timing sync between text and animation.
- Keep guidance explicit for nose vs mouth breathing and hand placement for alternate nostril breathing.
- Use smooth, lightweight, premium motion, not stuttery circles.
- Preserve reduced motion options.

7. Supabase cloud-save integration
- Wire the app to use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from env.
- Add a cloud sync adapter for:
  - profiles
  - settings
  - planner items
  - quick notes
  - journal entries
  - medication items
  - medication logs
  - location entries
  - location photos
- Use Supabase auth friendly patterns for user-scoped data.
- Keep local-first behavior as fallback.
- For photos in "Plaatsen", support Supabase storage path handling against a private bucket.
- Keep export/import backup support.

8. Visual polish
- Upgrade the app toward a premium serene dark blue system without copying proprietary assets.
- Keep block-square alignment and stronger spacing discipline.
- Improve typography, icon sizing, card rhythm, and header balance.
- Keep everything visually calm and readable.

9. PWA / deploy
- Keep build working.
- Keep Vercel-compatible output.
- Do not break existing routing or PWA behavior.
- Ensure npm install and npm run build succeed.

10. Deliverable
- Patch the actual code.
- Do not just describe the changes.
- Finish with a coherent codebase ready for git commit, GitHub push, and Vercel production deploy.
