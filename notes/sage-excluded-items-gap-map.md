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
- Source basis: `sage-mechanics-confirmed.md` + `sage-data-extraction.md` + SAGE Editor Suite C4 exports:
  - `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/resources.json`
  - `https://ses.staratlas.com/SAGE%20Editor%20Suite/C4%20Tools/data/recipes.json`
- Why excluded: LP and duration are extracted, but the source-cost denominator is not yet modeled
- Missing economics: grounded raw-resource acquisition/opportunity cost
- Next required input: decide whether raw/no-ingredient C4 resources should be ranked via market acquisition cost, production opportunity cost, or kept excluded
- Why it matters: until the recipe basket is grounded, any `LP/ATLAS` or `LP/USD` result would look precise while still being fake

### IC3A

- Code: `IC3A`
- Entry: `Contract - Quantum Nodes`
- Known data: `60h`, ATLAS price range `1.8-2.2`
- Source basis: `sage-data-extraction.md`
- Why excluded: market price and duration are extracted, but LP output is not grounded in the current notes
- Missing economics: verified LP output
- Next required input: add grounded LP reward/output data before ranking on LP efficiency
- Why it matters: without verified LP output, duration + price alone cannot support `LP/hour`, `LP/ATLAS`, or `LP/USD`

### IC3B

- Code: `IC3B`
- Entry: `Contract - Starpath Cells`
- Known data: `60h`, ATLAS price range `1.3-1.7`
- Source basis: `sage-data-extraction.md`
- Why excluded: market price and duration are extracted, but LP output is not grounded in the current notes
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
- No grounded `INK` source-cost path.
- No grounded `IC3A` / `IC3B` LP output.

Conclusion: keep all three excluded from ranked LP-efficiency output until a source outside the current indexed notes provides the missing economics. The next step is source acquisition, not a calculator/modeling change.

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
- ATLAS-denominated acquisition or opportunity cost for `Ink`, with timestamp/source
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
