#!/usr/bin/env bash
# Wipes the local dev D1 database (the Cloudflare/Wrangler miniflare emulation
# under .wrangler/state), leaving it to rebuild automatically from your
# current collection configs the next time `pnpm dev` runs.
#
# Local dev D1 is push-synced, not migration-tracked (payload_migrations only
# ever has a single "dev" row) — that's intentional, not a bug. This is the
# blessed way to get back to a clean slate if local state ever drifts from
# your collection configs (a stuck schema push, hand-edited data during
# debugging, etc.) instead of hand-patching the sqlite file.
#
# This only touches your LOCAL emulated database. It never touches
# production D1 (that's a separate, real Cloudflare resource only reachable
# via `payload migrate` with NODE_ENV=production / `pnpm run deploy:database`).
#
# Usage: pnpm run dev:reset-db
set -euo pipefail

echo "Stopping any dev server on port 3000..."
lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
sleep 1

DB_DIR=".wrangler/state/v3/d1/miniflare-D1DatabaseObject"

if [ -d "$DB_DIR" ]; then
  echo "Removing local D1 state ($DB_DIR)..."
  rm -f "$DB_DIR"/*.sqlite "$DB_DIR"/*.sqlite-shm "$DB_DIR"/*.sqlite-wal
  echo "Done. Local content is gone; schema will rebuild fresh on the next \`pnpm dev\`."
else
  echo "No local D1 state found at $DB_DIR — nothing to do."
fi
