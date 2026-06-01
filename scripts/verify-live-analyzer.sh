#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://ArtemisHunts.github.io/sage-agent-demo/demo/analyzer.html}"

tmp="$(mktemp)"
cleanup() {
  rm -f "$tmp"
}
trap cleanup EXIT

if ! curl -L -sS --fail --connect-timeout 10 --max-time 30 "$URL" -o "$tmp"; then
  echo "FETCH_ERROR"
  exit 2
fi

patterns=(
  "<h3>Tracked But Excluded</h3>"
  "<th>Code</th>"
  "<th>Why Excluded</th>"
  "<th>Known Data</th>"
  "<th>Source Basis</th>"
  "<th>Missing Economics</th>"
  "<th>Next Required Input</th>"
  "<th>LP/USD</th>"
  "Modeled-item scope only"
  "What unlocks ranking"
  "best-ask snapshot 14.75 ATLAS"
  "market-cost estimate lane"
  "best-bid snapshot 1 ATLAS"
  "best-ask snapshot 2.2 ATLAS"
  "Refresh ATLAS/USD"
  "CoinGecko simple price"
  "Cached fallback"
  "sageAnalyzerAtlasUsdPrice"
)

missing=0
for pattern in "${patterns[@]}"; do
  if grep -F -q "$pattern" "$tmp"; then
    printf 'OK: %s\n' "$pattern"
  else
    printf 'MISSING: %s\n' "$pattern"
    missing=1
  fi
done

if [[ "$missing" -eq 0 ]]; then
  echo "PASS"
else
  echo "DRIFT"
  exit 1
fi
