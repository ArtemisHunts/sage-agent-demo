# SAGE Excluded Items Gap Map

Purpose: compact source-of-truth note for the analyzer entries that are intentionally tracked but excluded from LP-efficiency rankings until their economics are grounded.

Source of truth right now:
- local analyzer source: `demo/analyzer.html`
- UI section: `Tracked But Excluded`
- live site status: public GitHub Pages analyzer is still behind local source as of May 31, 2026, so use local source for the current gap read

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
