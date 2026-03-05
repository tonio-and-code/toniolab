#!/bin/bash
# ============================================================
# sync-from-iwasaki.sh
# iwasaki-naisou-website → toniolab 英語機能同期スクリプト
#
# Usage: bash scripts/sync-from-iwasaki.sh
# ============================================================

SRC="C:/Users/thaat/Desktop/iwasaki-naisou-website"
DST="C:/Users/thaat/Desktop/toniolab"

if [ ! -d "$SRC" ]; then
  echo "ERROR: Source not found: $SRC"
  exit 1
fi

echo "=== Syncing English features from iwasaki-naisou-website ==="
echo ""

# ── Pages ────────────────────────────────────────
echo "[1/6] Pages (src/app/english/) - sync ALL"
for p in $(ls "$SRC/src/app/english/"); do
  if [ -d "$SRC/src/app/english/$p" ]; then
    rm -rf "$DST/src/app/english/$p"
    cp -r "$SRC/src/app/english/$p" "$DST/src/app/english/$p"
  fi
done
echo "  Done: $(ls "$DST/src/app/english/" | wc -l) pages"

# ── API Routes ───────────────────────────────────
echo "[2/6] API routes (src/app/api/)"
API_DIRS="goroku phrase-mastery phrases phrase-videos extract-phrases english-diary user-phrases"
for d in $API_DIRS; do
  if [ -d "$SRC/src/app/api/$d" ]; then
    rm -rf "$DST/src/app/api/$d"
    cp -r "$SRC/src/app/api/$d" "$DST/src/app/api/$d"
  fi
done
echo "  Done: $(ls -d "$DST/src/app/api"/*/ 2>/dev/null | wc -l) routes"

# ── Data ─────────────────────────────────────────
echo "[3/6] Data (src/data/)"
# English data
mkdir -p "$DST/src/data/english"
cp -f "$SRC/src/data/english"/*.ts "$DST/src/data/english/" 2>/dev/null
cp -f "$SRC/src/data/daily-english.ts" "$DST/src/data/" 2>/dev/null
cp -f "$SRC/src/data/state-vibes.ts" "$DST/src/data/" 2>/dev/null

# Journal
cp -f "$SRC/src/data/journal.ts" "$DST/src/data/"
mkdir -p "$DST/src/data/journal/2026"
cp -f "$SRC/src/data/journal/types.ts" "$DST/src/data/journal/" 2>/dev/null
cp -f "$SRC/src/data/journal/index.ts" "$DST/src/data/journal/" 2>/dev/null
cp -f "$SRC/src/data/journal/2026"/*.ts "$DST/src/data/journal/2026/"
echo "  Done: $(ls "$DST/src/data/english/" | wc -l) data files, $(ls "$DST/src/data/journal/2026/" | wc -l) journal entries"

# ── Components ───────────────────────────────────
echo "[4/6] Components"
mkdir -p "$DST/src/components/english"
cp -f "$SRC/src/components/english"/*.tsx "$DST/src/components/english/" 2>/dev/null
cp -f "$SRC/src/components/EnglishSidebar.tsx" "$DST/src/components/" 2>/dev/null
cp -f "$SRC/src/components/VoiceRecorder.tsx" "$DST/src/components/" 2>/dev/null
echo "  Done"

# ── Lib ──────────────────────────────────────────
echo "[5/6] Lib"
for f in d1.ts saved-phrases.ts settings.ts srs-engine.ts training-sounds.ts api-limiter.ts; do
  cp -f "$SRC/src/lib/$f" "$DST/src/lib/$f" 2>/dev/null
done
mkdir -p "$DST/src/lib/server"
cp -f "$SRC/src/lib/server/memoria.ts" "$DST/src/lib/server/" 2>/dev/null
echo "  Done"

# ── Types ────────────────────────────────────────
echo "[6/6] Types"
mkdir -p "$DST/src/types"
for f in memoria.ts review.ts fitness-report.ts; do
  cp -f "$SRC/src/types/$f" "$DST/src/types/$f" 2>/dev/null
done
echo "  Done"

echo ""
echo "=== Sync complete ==="
echo "Next: cd $DST && npm install && npm run dev"
