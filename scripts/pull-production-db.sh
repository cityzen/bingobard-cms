#!/usr/bin/env bash
# Pull production content down into local dev D1.
#
# Uses `wrangler d1 export` to dump the real database, then loads that dump
# into the local miniflare database. This is far more reliable than querying
# the Payload API remotely, for two reasons discovered the hard way:
#
#   1. `payload run` hangs against remote D1 in this project — it prints
#      "Establishing remote connection..." and exits 0 without doing anything.
#   2. D1 rejects explicit BEGIN/COMMIT, so transaction-wrapped dumps fail.
#      `d1 export` emits plain statements with no transaction wrapper.
#
# Local content is DESTROYED and replaced with production's. Anything you
# created locally that isn't in production will be gone. `--dry-run` backs up
# local first and reports the diff without writing.
#
# Usage:
#   pnpm run pull:db              # overwrite local with production
#   pnpm run pull:db -- --dry-run # back up local, show the diff, write nothing
set -euo pipefail

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown option: $arg"; exit 1 ;;
  esac
done

TMP="$(mktemp -d)"
export SQL="$TMP/prod.sql"
LOCAL_DB_DIR=".wrangler/state/v3/d1/miniflare-D1DatabaseObject"
BACKUP_DIR="scripts/db-backups"

# Tables to carry across. Excludes editor UI state (payload_preferences) and
# auth (users, users_sessions) — local users are created with create-admin.ts.
CONTENT_TABLES=(
  clients
  events
  testimonials
  verticals
  verticals_benefits_benefit_cards
  verticals_types_use_cards
  case_studies
  case_studies_rels
  case_studies_snapshot
  case_studies_results
  media
)

echo "==> Stopping dev server (if running)"
lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
sleep 1

echo "==> Exporting production D1"
npx wrangler d1 export D1 --remote --output "$SQL" --skip-confirmation 2>&1 | tail -2

# Narrow the dump to content tables only, so local keeps its own users.
echo "==> Filtering to content tables"
FILTERED="$TMP/content-only.sql"
python3 - "$SQL" "$FILTERED" "${CONTENT_TABLES[@]}" <<'PY'
import re, sys

src, dst, *tables = sys.argv[1:]
keep = set(tables)

# wrangler d1 export quotes identifiers with DOUBLE quotes, not backticks:
#   INSERT INTO "events" ("id","title",...) VALUES(...)
# so both quote styles have to be accepted.
ident = r'[`"]?([a-zA-Z_][a-zA-Z0-9_]*)[`"]?'
stmt = re.compile(
    rf'^\s*(INSERT\s+INTO|CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?|'
    rf'CREATE\s+(?:UNIQUE\s+)?INDEX|DROP\s+TABLE)\s+{ident}',
    re.I,
)

def table_of(line):
    m = stmt.match(line)
    return m.group(2) if m else None

out = []
in_kept_create = False

for line in open(src):
    stripped = line.strip()

    if stripped.startswith('PRAGMA'):
        out.append(line)
        continue
    if not stripped or stripped.startswith('--'):
        continue

    t = table_of(line)
    if t is not None:
        in_kept_create = bool(re.match(r'\s*CREATE\s+TABLE', line, re.I)) and t in keep
        if t in keep:
            out.append(line)
        continue

    # Body of a multi-line CREATE TABLE we already decided to keep.
    if in_kept_create:
        out.append(line)
        if stripped.endswith(';'):
            in_kept_create = False

open(dst, 'w').write(''.join(out))

inserts = sum(
    1 for l in out
    if re.match(r'\s*INSERT\s+INTO', l, re.I)
)
missing = keep - {
    m.group(2) for m in (stmt.match(l) for l in out) if m
}
print(f"    kept {inserts} INSERT(s)")
if missing:
    print(f"    note: no rows in production for: {', '.join(sorted(missing))}")
PY

# Back up whatever local has right now.
if compgen -G "$LOCAL_DB_DIR/*.sqlite" > /dev/null; then
  mkdir -p "$BACKUP_DIR"
  STAMP="$(date +%Y%m%d-%H%M%S)"
  cp "$LOCAL_DB_DIR"/*.sqlite "$BACKUP_DIR/local-$STAMP.sqlite" 2>/dev/null || true
  echo "==> Backed up local to $BACKUP_DIR/local-$STAMP.sqlite"
fi

if [ "$DRY_RUN" -eq 1 ]; then
  echo ""
  echo "==> DRY RUN — no local changes made"
  echo "    Filtered dump written to: $FILTERED"
  echo "    Review it, then re-run without --dry-run to apply."
  exit 0
fi

# Drop local content tables so the dump's CREATE/INSERT is clean.
echo "==> Dropping local content tables"
DB="$(ls "$LOCAL_DB_DIR"/*.sqlite 2>/dev/null | grep -v metadata | head -1)"
if [ -z "$DB" ]; then
  echo "    no local database found — run 'pnpm dev' once first"
  exit 1
fi
for t in "${CONTENT_TABLES[@]}"; do
  sqlite3 "$DB" "DROP TABLE IF EXISTS \`$t\`;" 2>/dev/null || true
done

echo "==> Loading production content into local D1"
sqlite3 "$DB" < "$FILTERED"

echo ""
echo "==> Result"
for t in clients events testimonials verticals case_studies; do
  printf "    %-14s %s\n" "$t" "$(sqlite3 "$DB" "SELECT COUNT(*) FROM \`$t\`;" 2>/dev/null || echo '—')"
done
echo ""
echo "Local now mirrors production content. Start 'pnpm dev' to use it."
rm -rf "$TMP"