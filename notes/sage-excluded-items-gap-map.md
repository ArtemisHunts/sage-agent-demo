# SAGE Excluded Items Gap Map

Purpose: compact source-of-truth note for the analyzer entries that are intentionally tracked but excluded from LP-efficiency rankings until their economics are grounded.

Source of truth right now:
- local analyzer source: `demo/analyzer.html`
- UI section: `Tracked But Excluded`
- live site status: public GitHub Pages analyzer returned `PASS` from `./scripts/verify-live-analyzer.sh` on June 1, 2026 after the ATLAS/USD live refresh and cached-fallback markers shipped, so the live UI exposes the same tracked-but-excluded gap read plus the current LP calculator fallback path

## Why This Note Exists

The analyzer now surfaces `INK`, `IC3A`, and `IC3B` explicitly instead of silently omitting them, but the next modeling pass still needs one compact note that says:
- what is already known
- which note currently grounds that known data
- why each entry is excluded
- what exact data unlocks ranking

## Current Excluded Entries

### INK

- Code: `INK`
- Entry: `Ink`
- Known data: `100000 LP`, `60h`, fee `0.000035`
- Marketplace slug / mint handle: `inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh`
- On-chain INK/ATLAS orderbook snapshot, June 1 09:43 PT:
  - ATLAS token decimals: `8`
  - open order count: `34`
  - best ask: `14.75 ATLAS` for `192` remaining INK, order `HcWeAA8ZDLffTCnKPMJfFHfJUfQsaNpaqrPtPyjBUPng`
  - best bid: `11.99 ATLAS` for `100` remaining INK, order `2BmwwmK1VpTqrPdkegYihkLY732tAWJPHbzVXkpq4WzA`
- Source basis: `sage-mechanics-confirmed.md` + `sage-data-extraction.md` + SAGE Editor Suite C4 exports:
  - `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/resources.json`
  - `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/recipes.json`
  - `https://play.staratlas.com/market/inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh/`
  - Solana mainnet Galactic Marketplace query:
    - program: `traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg`
    - currency mint: `ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx`
    - asset mint: `inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh`
    - successful RPC: `https://api.mainnet-beta.solana.com`
- Why excluded: LP, duration, and a first market denominator are grounded, but the analyzer still needs an explicit raw-resource ranking policy plus fee-unit reconciliation
- Missing economics: policy decision for best-ask acquisition cost vs midpoint opportunity cost vs production opportunity cost, plus confirmation of what the `0.000035` fee applies to
- Next required input: choose the raw/no-ingredient resource policy before moving `INK` into ranked LP-efficiency output
- Why it matters: the orderbook now gives a denominator, but ranking would still be misleading if the policy and fee unit are implicit

### IC3A

- Code: `IC3A`
- Entry: `Contract - Quantum Nodes`
- Known data: `60h`, ATLAS price range `1.8-2.2`, mint `ic3AfsMFGKjkftEkpZLLdCGHmSQX5RwH92zhXUZVNCW`, June 1 10:44 PT orderbook had `1` open order, no ask, and best bid `1 ATLAS` for `998` remaining
- Source basis: `sage-data-extraction.md` + Colibri catalog JSON + Galactic Marketplace orderbook query
- Why excluded: market identity/price context and duration are extracted, but LP output is not grounded in the current notes or external source pass
- Missing economics: verified LP output
- Next required input: add grounded LP reward/output data before ranking on LP efficiency
- Why it matters: without verified LP output, duration + price alone cannot support `LP/hour`, `LP/ATLAS`, or `LP/USD`

### IC3B

- Code: `IC3B`
- Entry: `Contract - Starpath Cells`
- Known data: `60h`, ATLAS price range `1.3-1.7`, mint `ic3BNHDBzoW8suW4q9a9qt5PkK7D38T4raGDc1gyuRh`, June 1 10:44 PT orderbook had `7` open orders, best ask `2.2 ATLAS` for `100` remaining, and best bid `1.8 ATLAS` for `70` remaining
- Source basis: `sage-data-extraction.md` + Colibri catalog JSON + MJ Informatics Resource Depot + Star Atlas marketplace route + Galactic Marketplace orderbook query
- Why excluded: market identity/price context and duration are extracted, but LP output is not grounded in the current notes or external source pass
- Missing economics: verified LP output
- Next required input: add grounded LP reward/output data before ranking on LP efficiency
- Why it matters: same problem as `IC3A` — the price side exists, but the output side does not

## Local Search Trail

Latest narrow search: June 1, 2026 heartbeat.

Queries checked with QMD:
- `INK recipe input cost LP 100000 60h`
- `100000 LP 60h INK`
- `INK 0.000035`
- `Contract Quantum Nodes Starpath Cells LP`
- `INK recipe input cost 100000 LP 60h fee 0.000035`
- `IC3A IC3B Contract Quantum Nodes Starpath Cells LP output`

Direct workspace grep scope:
- `notes`
- `drafts`
- `memory/2026-06-01.md`
- `sage-agent-demo/notes`
- `sage-agent-demo/demo/analyzer.html`

What surfaced:
- `notes/sage-mechanics-confirmed.md` confirms only `INK: 100000 LP, 60h`.
- `notes/sage-data-extraction.md` confirms only `INK` duration/points/fee and `IC3A` / `IC3B` ATLAS price ranges.
- `memory/2026-05-17.md` records the earlier conclusion that the optimizer did not model these entries and that the issue was a data-coverage gap.
- `sage-agent-demo/demo/analyzer.html` already tracks all three as excluded with the correct missing-economics copy.

What did not surface:
- No grounded `INK` recipe/input basket.
- No grounded `INK` production-cost path.
- No grounded `IC3A` / `IC3B` LP output.

Conclusion: keep all three excluded from ranked LP-efficiency output. `INK` now has a sourced market-acquisition denominator but still needs policy and fee-unit handling before ranking; `IC3A` / `IC3B` still need source acquisition for LP output. The next step is source/policy tightening, not a calculator ranking change.

## External Source Trail

Latest external source pass: June 1, 2026 09:10 PT heartbeat.

Sources checked:
- Star Atlas SAGE Editor Suite: `https://ses.staratlas.com/`
- C4 Tools recipe export: `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/recipes.json`
- C4 Tools resource export: `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/resources.json`

What surfaced:
- `resources.json` has `id: ink`, `name: Ink`, `category: raw`, `tier: 1`, `baseValue: 10`, `c4_status: v1`.
- `recipes.json` has `outputId: ink`, `outputName: Ink`, `outputType: BASIC RESOURCE`, `outputTier: 1`, `constructionTime: 30`, `productionSteps: 1`, `ingredients: []`, `c4_status: v1-add`, `c4_numerical_id: 5290`.
- Searches across the C4 Tools resources/recipes/mock/building data for `IC3A`, `IC3B`, `Quantum Nodes`, `Starpath Cells`, and `Contract -` did not surface a matching LP output source.

Interpretation:
- The C4 export narrows the `INK` gap: this is not a missing nested recipe in that export; it is a raw/no-ingredient resource in the current C4 data.
- The analyzer still cannot safely rank `INK` because the LP facts need a denominator. Use a market-cost or production-cost policy only after that basis is explicitly chosen and sourced.
- `IC3A` / `IC3B` remain unresolved; no LP output was found in the checked C4 exports.

Follow-up marketplace source pass: June 1, 2026 09:37 PT heartbeat.

Sources checked:
- Web search result for official Star Atlas marketplace `Ink` page.
- Direct fetch of `https://play.staratlas.com/market/inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh/`.
- Headed `openclaw` browser load of the same official marketplace page.
- Third-party `sa-data-api` source code for a possible on-chain market-price query pattern.

What surfaced:
- Official marketplace route for `Ink`: `https://play.staratlas.com/market/inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh/`.
- The slug itself gives the likely marketplace mint handle: `inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh`.
- A headed browser load reached title `Star Atlas - Ink`, but the snapshot/screenshot path timed out, matching the existing browser-timeout pattern; no visible price was captured.
- `222TheMaster222/sa-data-api` demonstrates a plausible on-chain denominator path using `@staratlas/factory` `GmClientService.getOpenOrdersForCurrency(...)`, `ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx`, and marketplace program `traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg`.

Interpretation:
- The next non-UI path should query Galactic Marketplace open orders for mint `inkTd6G5fWSLhmTgY7tTkCR2a75ACrgM86e7HF6DkHh` in ATLAS and use best ask / best bid / midpoint as a timestamped acquisition-cost denominator.
- Do not use the marketplace page title alone as price evidence; it only grounds identity/mint routing.

Follow-up on-chain orderbook pass: June 1, 2026 09:43 PT heartbeat.

Sources checked:
- `@staratlas/factory@0.7.1` package metadata and type/source files from npm, without adding it to this repo.
- Solana RPC `getProgramAccounts` against Galactic Marketplace program `traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg`.
- Factory-confirmed account filters: `dataSize: 201`, currency mint memcmp at offset `40`, asset mint memcmp at offset `72`.
- Reusable repo-local probe: `scripts/query-ink-orderbook.js`.

What surfaced:
- `@staratlas/factory` is not installed in this workspace, but the published package confirms the open-order account filter offsets.
- Publicnode RPC failed with `fetch failed`; `https://api.mainnet-beta.solana.com` succeeded.
- ATLAS token supply reports `8` decimals.
- The INK/ATLAS query returned `34` open orders.
- Best ask snapshot: `14.75 ATLAS`, `192` remaining, order `HcWeAA8ZDLffTCnKPMJfFHfJUfQsaNpaqrPtPyjBUPng`.
- Best bid snapshot: `11.99 ATLAS`, `100` remaining, order `2BmwwmK1VpTqrPdkegYihkLY732tAWJPHbzVXkpq4WzA`.
- Re-running the dependency-free repo-local probe at June 1 10:36 PT returned the same best ask / best bid / order count.

Interpretation:
- The first sourced market-acquisition denominator for `INK` is now `14.75 ATLAS` best ask at the 09:43 PT snapshot.
- Derived bounds before fee reconciliation: `100000 LP / 60h = 1666.67 LP/hour`; best-ask efficiency would be about `6779.66 LP/ATLAS`; midpoint of best bid/ask (`13.37 ATLAS`) would be about `7479.43 LP/ATLAS`.
- Do not move `INK` into ranked analyzer output yet. The remaining blocker is the modeling policy and fee-unit confirmation, not discovery of the orderbook source.

Follow-up contract marketplace pass: June 1, 2026 10:44 PT heartbeat.

Sources checked:
- Colibri catalog JSON: `https://colibriespacial.es/json`
- MJ Informatics Star Atlas Resource Depot: `https://mjinformatics.com/star-atlas/resource-depot`
- Official Star Atlas marketplace route for IC3B: `https://play.staratlas.com/market/ic3BNHDBzoW8suW4q9a9qt5PkK7D38T4raGDc1gyuRh/`
- Generalized repo probe: `scripts/query-atlas-orderbook.js`

What surfaced:
- Colibri catalog JSON identifies `IC3A` / `Contract - Quantum Nodes` with mint `ic3AfsMFGKjkftEkpZLLdCGHmSQX5RwH92zhXUZVNCW`, collection `Infrastructure Contract - Quantum Nodes`, exclusive currency `ATLAS`, and no embedded markets or LP output.
- Colibri catalog JSON identifies `IC3B` / `Contract - Starpath Cells` with mint `ic3BNHDBzoW8suW4q9a9qt5PkK7D38T4raGDc1gyuRh`, collection `Infrastructure Contract - Starpath Cells`, exclusive currency `ATLAS`, and no embedded markets or LP output.
- MJ Informatics currently shows IC3B with `100` remaining and `2.20 ATLAS`, matching the on-chain best ask.
- The official IC3B marketplace route loads but only exposes the JS loading shell through direct fetch, not LP output.
- On-chain IC3A/ATLAS orderbook snapshot: `1` open order, no ask, best bid `1 ATLAS` for `998` remaining.
- On-chain IC3B/ATLAS orderbook snapshot: `7` open orders, best ask `2.2 ATLAS` for `100` remaining, best bid `1.8 ATLAS` for `70` remaining.

Interpretation:
- `IC3A` and `IC3B` now have grounded mints and market-denominator context, but the ranking blocker remains LP output.
- Do not infer LP from quantity, price, contract description, or marketplace presence. The contracts stay `Tracked But Excluded` until a trustworthy source states the reward/output side.

## Recommended INK Modeling Policy

- Keep `INK` excluded from the current public ranked table until the analyzer can label it as a raw-resource market-cost estimate instead of a normal craft recipe.
- If/when `INK` is added to a ranked view, use **best ask** as the default denominator because it reflects immediate acquisition cost and is conservative for LP efficiency.
- Show best bid and midpoint only as context or secondary sensitivity values; do not use midpoint as the default rank basis because it can overstate executable efficiency.
- Treat the `0.000035` fee as unresolved. Do not include it in the ranked denominator until the unit is confirmed as per craft, per unit, or something else.
- Every market-derived `INK` value needs a timestamp and orderbook source note. Do not bake the June 1 09:43 PT snapshot into static analyzer math as if it were evergreen.
- Product wording should say `Market-cost estimate` or `Best-ask basis`, not `recipe cost`, because the C4 export shows `Ink` as a raw/no-ingredient resource.

## Fee Unit Boundary

- Current analyzer implementation treats modeled-item `fee` values as a resource-level additive ATLAS fee for the craft/job and compounds nested crafted inputs by `1.05` inside `calculateResourceSupplyChain(...)`.
- That implementation detail does not prove the source semantics of `INK`'s extracted `0.000035` fee.
- For `INK`, do not fold the fee into the `14.75 ATLAS` market-cost denominator until an official/source note confirms whether it is per craft, per produced unit, or another fee unit.
- If the analyzer later surfaces `INK` as a market-cost estimate, show any confirmed fee as a separate labeled component rather than silently blending it into the best-ask price.

## Safe Modeling Rule

Do not move any of these entries into ranked analyzer output until the missing economics are sourced and verified.

That means:
- no placeholder recipe assumptions for `INK`
- no inferred LP rewards for `IC3A` / `IC3B`
- no backfilling just to make the table feel complete

## Recommended Next Pass

1. Ground `INK` first, because it already has LP, duration, and fee.
2. Then ground `IC3A` / `IC3B` LP output if trustworthy reward/output notes exist.
3. After any one item is grounded, update both:
   - the data object in `demo/analyzer.html`
   - this note, so the handoff stays truthful

## Extraction Checklist For Next Modeling Pass

For `INK`, capture these fields before any ranked output change:
- source-cost policy for a raw/no-ingredient C4 resource
- ATLAS-denominated acquisition or opportunity cost for `Ink`; first snapshot captured June 1 09:43 PT from Galactic Marketplace open orders with best ask `14.75 ATLAS`, best bid `11.99 ATLAS`, and midpoint `13.37 ATLAS`
- whether the `0.000035` fee is per craft, per unit, or another fee unit
- computed total input cost and resulting `LP/ATLAS`
- optional USD conversion only after the ATLAS denominator is grounded

For `IC3A` and `IC3B`, capture these fields before ranking:
- verified LP reward/output per contract
- source basis for the LP output
- confirmation that the `60h` duration applies to the same output unit
- ATLAS price basis and whether the range is market ask, floor, or modeled cost
- computed `LP/hour`, `LP/ATLAS`, and only then `LP/USD`

If any field is missing, keep the item in `Tracked But Excluded` and update the missing-economics copy instead of inventing a denominator.
