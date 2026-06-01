# SAGE Excluded Items Gap Map

Purpose: compact source-of-truth note for the analyzer entries that are intentionally tracked but excluded from LP-efficiency rankings until their economics are grounded.

Source of truth right now:
- local analyzer source: `demo/analyzer.html`
- UI section: `Tracked But Excluded`
- live site status: public GitHub Pages analyzer returned `PASS` from `./scripts/verify-live-analyzer.sh` on May 31, 2026 at 21:48 PT, so the live UI now exposes the same tracked-but-excluded gap read

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
- Source basis: `sage-mechanics-confirmed.md` + `sage-data-extraction.md`
- Why excluded: LP and duration are extracted, but the recipe input-cost path is not yet modeled
- Missing economics: grounded recipe inputs and source costs
- Next required input: add the verified input recipe plus an ATLAS-denominated cost model
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

Latest narrow search: May 31, 2026 heartbeat.

Queries checked with QMD:
- `INK recipe input cost LP 100000 60h`
- `100000 LP 60h INK`
- `INK 0.000035`
- `Contract Quantum Nodes Starpath Cells LP`

What surfaced:
- `notes/sage-mechanics-confirmed.md` confirms only `INK: 100000 LP, 60h`.
- `notes/sage-data-extraction.md` confirms only `INK` duration/points/fee and `IC3A` / `IC3B` ATLAS price ranges.
- `memory/2026-05-17.md` records the earlier conclusion that the optimizer did not model these entries and that the issue was a data-coverage gap.

What did not surface:
- No grounded `INK` recipe/input basket.
- No grounded `INK` source-cost path.
- No grounded `IC3A` / `IC3B` LP output.

Conclusion: keep all three excluded from ranked LP-efficiency output until a source outside the current indexed notes provides the missing economics.

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
- verified recipe component codes and quantities
- source basis for each component quantity
- ATLAS-denominated unit cost for each component, with timestamp/source
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
