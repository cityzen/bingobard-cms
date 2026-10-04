#!/usr/bin/env bash
# Restarts the Next/Payload dev server cleanly.
#
# Payload's admin instance doesn't always pick up collection config changes
# via Turbopack hot-reload (fields can keep rendering stale after an edit).
# Run this after changing a collection file, payload.config.ts, or anytime
# the admin UI looks out of sync with your source.
#
# Usage: pnpm run dev:reset
set -euo pipefail

echo "Stopping any dev server on port 3000..."
lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
sleep 1

echo "Starting a fresh dev server..."
exec pnpm run dev
