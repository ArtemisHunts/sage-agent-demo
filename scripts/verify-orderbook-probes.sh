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
  read -r -a rpc_endpoints <<< "${ORDERBOOK_RPC_ENDPOINTS:-}"
  live_attempts="${LIVE_ORDERBOOK_ATTEMPTS:-3}"

  if ! [[ "$live_attempts" =~ ^[1-9][0-9]*$ ]]; then
    echo "DRIFT: LIVE_ORDERBOOK_ATTEMPTS must be a positive integer" >&2
    exit 1
  fi

  for asset in INK IC3A IC3B; do
    output=""
    attempt=1
    success=0
    while [ "$attempt" -le "$live_attempts" ]; do
      if output="$(node scripts/query-atlas-orderbook.js "$asset" "${rpc_endpoints[@]}" 2>&1)"; then
        success=1
        break
      fi

      if [ "$attempt" -eq "$live_attempts" ]; then
        break
      fi

      sleep "$((attempt * 2))"
      attempt="$((attempt + 1))"
    done

    if [ "$success" -ne 1 ]; then
      echo "DRIFT: live orderbook probe failed for $asset" >&2
      printf '%s\n' "$output" >&2
      exit 1
    fi

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
      const bestAsk = payload.bestAsk ? `${payload.bestAsk.priceAtlas} ATLAS` : "none";
      const bestBid = payload.bestBid ? `${payload.bestBid.priceAtlas} ATLAS` : "none";
      console.log(`LIVE OK: ${payload.assetCode} orders=${payload.openOrderCount} bestAsk=${bestAsk} bestBid=${bestBid}`);
    ' "$output" "$asset"
  done
fi

echo "PASS"
