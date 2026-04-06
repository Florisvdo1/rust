#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/c/Users/${USERNAME:-username}/Downloads/RUST_Claude_GitHub_Project"
MODEL="${MODEL:-sonnet}"
MAX_TURNS="${MAX_TURNS:-200}"
LOG_DIR="/c/Users/${USERNAME:-username}/Downloads/RUST_Master_Logs"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
LOG_FILE="$LOG_DIR/strict_patch_${STAMP}.log"

mkdir -p "$LOG_DIR"

log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" | tee -a "$LOG_FILE"; }

for cmd in claude git npm node; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Missing: $cmd"; exit 1; }
done

cd "$WORKSPACE"

cat > CLAUDE.md <<'EOF'
Patch the existing production app directly.
Do not return prose.
Do not leave placeholder text.
You must modify the existing codebase.
You must leave the repo buildable and ready for git push.
EOF

cat > .rust_patch_prompt_v12.md <<'EOF'
PATCH THE EXISTING RUST APP IN THIS CURRENT FOLDER.

Required visible fixes:
1. Replace visible "RUS" branding with "RUST".
2. Replace seeded "Ritalin" with "Magnesium, 1 pil".
3. Fix mobile top layout overlap.
4. Add clear planner tray open/close affordance.
5. Keep planner tray content visible above bottom nav.
6. Improve mobile portrait stability and viewport behavior.
7. Add time-based greeting: Goedemorgen / Goedemiddag / Goedenavond.
8. Improve planner visible slot holders and tray UI.
9. Improve breathing settings close affordance, pre-instruction modal, 3-2-1 countdown, clearer phase copy.
10. Improve premium visual polish, spacing rhythm, block-square alignment, and remove stale old seeded UI.
11. Use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from env files if present.
12. Write README_PATCH.md summarizing what changed.

Acceptance:
- npm run build must pass
- RUS must not remain as visible brand
- Ritalin must not remain
- Magnesium must exist
- README_PATCH.md must exist
- real file edits under src/ or public/
- do not ask questions
EOF

cat > .env.local <<EOF
VITE_SUPABASE_URL=${VITE_SUPABASE_URL:-}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY:-}
EOF

cat > .env.production.local <<EOF
VITE_SUPABASE_URL=${VITE_SUPABASE_URL:-}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY:-}
EOF

PRE_HASH="$( (find src public -type f 2>/dev/null | sort | xargs cat 2>/dev/null || true) | sha256sum | awk '{print $1}')"

log "Running Claude patch..."
claude -p "$(cat .rust_patch_prompt_v12.md)" --model "$MODEL" --max-turns "$MAX_TURNS" --append-system-prompt-file CLAUDE.md >>"$LOG_FILE" 2>&1

POST_HASH="$( (find src public -type f 2>/dev/null | sort | xargs cat 2>/dev/null || true) | sha256sum | awk '{print $1}')"

if [ "$PRE_HASH" = "$POST_HASH" ]; then
  log "ERROR: No meaningful code changes detected."
  exit 1
fi

if grep -Rqs "RUS" src public 2>/dev/null; then
  log "ERROR: RUS still present."
  exit 1
fi

if grep -Rqs "Ritalin" src public 2>/dev/null; then
  log "ERROR: Ritalin still present."
  exit 1
fi

if ! grep -Rqs "Magnesium" src public 2>/dev/null; then
  log "ERROR: Magnesium not found."
  exit 1
fi

if [ ! -f README_PATCH.md ]; then
  log "ERROR: README_PATCH.md missing."
  exit 1
fi

log "Running npm install..."
npm install >>"$LOG_FILE" 2>&1

log "Running npm run build..."
npm run build >>"$LOG_FILE" 2>&1

log "Committing..."
git add -A
git commit -m "RUST strict patch v12" >>"$LOG_FILE" 2>&1 || true

log "Pushing to GitHub..."
git push origin main >>"$LOG_FILE" 2>&1

log "Done. Check Vercel auto-deploy now."
log "Log: $LOG_FILE"