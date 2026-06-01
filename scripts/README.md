# S.T.R.I.K.E. Scripts

Small verification and source-acquisition helpers for the live analyzer.

## Live Analyzer Verification

```bash
./scripts/verify-live-analyzer.sh
```

Checks the GitHub Pages analyzer for the current LP/USD, tracked-but-excluded, market-cost, and ATLAS/USD refresh markers. It exits non-zero on drift.

Pass a custom analyzer URL when checking a preview:

```bash
./scripts/verify-live-analyzer.sh "https://example.com/demo/analyzer.html"
```

## ATLAS Orderbook Probe

```bash
node scripts/query-atlas-orderbook.js INK
node scripts/query-atlas-orderbook.js IC3A
node scripts/query-atlas-orderbook.js IC3B
```

Queries Galactic Marketplace open orders for known SAGE assets against ATLAS and prints timestamped JSON with best ask, best bid, and top five asks/bids.

Known assets:
- `INK` — Ink
- `IC3A` — Contract - Quantum Nodes
- `IC3B` — Contract - Starpath Cells

You can also pass a custom asset mint:

```bash
node scripts/query-atlas-orderbook.js <assetMint>
```

Optional RPC endpoints can be appended after the asset. The script tries endpoints in order and falls back on failure:

```bash
node scripts/query-atlas-orderbook.js INK https://api.mainnet-beta.solana.com
```

Public RPCs can rate-limit `getProgramAccounts`; append a private or paid endpoint when taking a publishable snapshot.

## Modeling Guardrail

Orderbook data is market context, not LP efficiency by itself.

- `INK` has LP output and a market denominator, but stays out of recipe-cost rankings until the market-cost lane and fee-unit policy are explicit.
- `IC3A` and `IC3B` have market context, but stay excluded until LP output is grounded.
- Refresh the orderbook probe and run `verify-live-analyzer.sh` before publishing or shipping content that cites these snapshots.
