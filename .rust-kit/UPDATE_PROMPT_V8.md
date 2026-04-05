Patch the existing RUST app in this folder in-place.

Read CLAUDE.md first, then inspect the current codebase, then implement the patch.

Hard requirements:
- Update the existing app, do not scaffold a new unrelated app
- Replace visible 'RUS' with 'RUST'
- Replace seeded medication example 'Ritalin' with 'Magnesium, 1 pil'
- Implement safe-area layout fixes
- Make planner deck expand/collapse obvious and touch-friendly
- Ensure deck content and bottom nav coexist cleanly
- Improve premium calm visual language without heavy performance cost
- Add or finish Supabase integration using the env variables already present
- Preserve cloud save architecture and location photo storage support
- Keep Dutch copy
- Keep mobile portrait-first UX
- Keep no horizontal overflow
- Keep build passing

After editing:
1. keep the existing project structure unless a small targeted refactor is clearly better
2. ensure npm run build passes
3. do not stop early
