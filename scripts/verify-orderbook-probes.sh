#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node --check scripts/query-atlas-orderbook.js >/dev/null
node --check scripts/query-ink-orderbook.js >/dev/null

help_output="$(node scripts/query-atlas-orderbook.js --help)"
for marker in "Usage:" "INK" "IC3A" "IC3B" "Default asset: INK"; do
  if ! printf '%s\n' "$help_output" | grep -q "$marker"; then
    echo "DRIFT: help output missing marker: $marker" >&2
    exit 1
  fi
done

if [ "${LIVE_ORDERBOOK:-0}" = "1" ]; then
  for asset in INK IC3A IC3B; do
    output="$(node scripts/query-atlas-orderbook.js "$asset")"
    node -e '
      const payload = JSON.parse(process.argv[1]);
      if (payload.assetCode !== process.argv[2]) {
        throw new Error(`assetCode mismatch: ${payload.assetCode}`);
      }
      if (!Number.isInteger(payload.openOrderCount)) {
        throw new Error("openOrderCount missing");
      }
      if (!payload.currencyMint || payload.currencyDecimals !== 8) {
        throw new Error("ATLAS currency metadata missing");
      }
    ' "$output" "$asset"
  done
fi

echo "PASS"
