# Deployment Handoff

This repo contains the live site source for `https://ArtemisHunts.github.io/sage-agent-demo/`.

## Current State

- This source tree contains the patched analyzer now deployed on the live site.
- Earlier live drift checks on `2026-05-31 18:42 PT`, `2026-05-31 20:12 PT`, and `2026-05-31 21:36 PT` returned `DRIFT` before the pushed source caught up.
- Commit `9504118` shipped the analyzer transparency patch to `main` on `2026-05-31 21:36 PT`.
- Follow-up commit `7ca9fa7` recorded the live analyzer verifier and deployment handoff updates.
- Post-push live verification passed after GitHub Pages caught up: `./scripts/verify-live-analyzer.sh` returned `PASS` for all expected LP/USD and excluded-item markers on `2026-05-31 21:48 PT`.
- Current local branch is `main`.
- Current git remote is the `ArtemisHunts/sage-agent-demo` GitHub repo.
- `demo/analyzer.html` has been patched locally to:
  - separate `LP/ATLAS` from `LP/USD`
  - add a guarded `Refresh ATLAS/USD` control backed by CoinGecko's no-key simple price endpoint for `star-atlas`
  - add dataset-scope warnings
  - track `INK`, `IC3A`, and `IC3B` as excluded entries instead of silently omitting them
  - explain exactly what data still unlocks ranking for those excluded entries
  - surface the source basis for each excluded entry in the UI instead of hiding which note grounds the currently known facts
  - keep the WebMCP LP tool output aligned with the UI model
- Repo docs were also corrected to point at the actual live route structure:
  - `demo/dashboard.html`
  - `demo/analyzer.html`
  - `docs/manifesto.html`
  - `docs/roadmap.html`
- Shipped site HTML was also corrected so public GitHub links point at the real repo:
  - `https://github.com/ArtemisHunts/sage-agent-demo`

## Files Changed

- `demo/analyzer.html`
- `scripts/verify-live-analyzer.sh`
- `notes/sage-excluded-items-gap-map.md`
- `README.md`
- `README-enhanced.md`
- `GETTING-STARTED.md`
- `DEPLOYMENT.md`
- `index.html`
- `docs/manifesto.html`
- `docs/roadmap.html`
- `demo/dashboard.html`

## Git State Before Shipping This Patch

- Modified: `GETTING-STARTED.md`, `README-enhanced.md`, `README.md`, `demo/analyzer.html`, `demo/dashboard.html`, `docs/manifesto.html`, `docs/roadmap.html`, `index.html`
- Added: `DEPLOYMENT.md`, `notes/sage-excluded-items-gap-map.md`, `scripts/verify-live-analyzer.sh`
- Base commit before these changes: `f892b91` — `chore: update GitHub username references (artemis-sage-agent → ArtemisHunts)`

## Safe Handling Note

- Use the sanitized repo slug `ArtemisHunts/sage-agent-demo` in notes, chat, and handoffs.
- Do **not** paste raw `git remote -v` output into public notes or messages from this machine, because the local remote URL may carry auth material.
- As of 2026-05-18, the local `origin` URL for this repo has already been reset to the sanitized public form: `https://github.com/ArtemisHunts/sage-agent-demo.git`.

## What Was Verified

- Inline script in `demo/analyzer.html` compiles cleanly via `node` syntax check.
- New LP strings and excluded-item markers are present in source.
- The LP calculator now has a live ATLAS/USD refresh path that validates a positive CoinGecko spot price before updating the manual price field.
- The excluded-items UI now also includes a plain-language `What unlocks ranking` explainer for `INK`, `IC3A`, and `IC3B`.
- The excluded-items table now also includes `Source Basis` so users can see which note grounds each currently known fact set.
- As of the May 31, 2026 5:59 PM PT heartbeat, a fresh live probe still returned none of the expected analyzer markers (`Tracked But Excluded`, `LP/USD`, `Code`, `Why Excluded`, `Known Data`, `Source Basis`, `Missing Economics`, `Next Required Input`, `Modeled-item scope only`, `What unlocks ranking`), so the public GitHub Pages analyzer was still behind local source at that point.
- As of the May 31, 2026 6:42 PM PT heartbeat, a follow-up live probe still returned `DRIFT`, confirming the public GitHub Pages analyzer remained behind local source after the earlier handoff note.
- As of the May 31, 2026 8:12 PM PT heartbeat, the shared repo verifier still printed every expected marker as `MISSING` and ended on `DRIFT`, so the public GitHub Pages analyzer was still behind local source before the patch was shipped.
- As of the May 31, 2026 9:48 PM PT heartbeat, the shared repo verifier returned `PASS` against the live GitHub Pages analyzer; all expected LP/USD and excluded-item markers are now present.

## What Was Not Verified

- Pixel-level browser rendering after deploy; the live check verified expected HTML markers, not visual spacing.
- GitHub Pages branch/source settings, because they are not stored in this repo and no local workflow/config file was found.

## Pre-Push Check

Run from this repo:

```bash
git status --short
git diff -- demo/analyzer.html demo/dashboard.html index.html docs/manifesto.html docs/roadmap.html README.md README-enhanced.md GETTING-STARTED.md DEPLOYMENT.md notes/sage-excluded-items-gap-map.md scripts/verify-live-analyzer.sh
```

Confirm GitHub Pages source in repo settings before pushing if there is any doubt.

## Post-Push Verification

After the external push/deploy, verify:

- `https://ArtemisHunts.github.io/sage-agent-demo/demo/analyzer.html`
- `https://ArtemisHunts.github.io/sage-agent-demo/demo/dashboard.html`
- `https://ArtemisHunts.github.io/sage-agent-demo/docs/manifesto.html`
- `https://ArtemisHunts.github.io/sage-agent-demo/docs/roadmap.html`

Quick probe:

```bash
./scripts/verify-live-analyzer.sh
```

Interpretation:

- `PASS` means the live analyzer has the patched excluded-item / LP-USD split markers plus the plain-language unlock-condition explainer.
- `DRIFT` means the live page is still serving the older analyzer and no deploy has landed yet.
- `FETCH_ERROR` means the probe could not fetch the target URL and should be treated as infrastructure/network failure, not product drift.
- As of `2026-05-31 21:48 PT`, this probe returned `PASS` against `https://ArtemisHunts.github.io/sage-agent-demo/demo/analyzer.html`.

If you need to point the probe at a different URL:

```bash
./scripts/verify-live-analyzer.sh "https://example.com/demo/analyzer.html"
```

On the analyzer page, confirm the LP tab shows:

- `LP per hour, LP per ATLAS, and LP per USD`
- `Refresh ATLAS/USD`
- `CoinGecko simple price`
- `Current dataset caveat`
- `Modeled-item scope only`
- `What unlocks ranking`
- `<h3>Tracked But Excluded</h3>`
- `<th>Code</th>`
- `<th>Why Excluded</th>`
- `<th>Known Data</th>`
- `<th>Source Basis</th>`
- `<th>Missing Economics</th>`
- `<th>Next Required Input</th>`
- `Total Cost (USD)`
- `<th>LP/USD</th>`

## Remaining Product Work

- Deploy and live-verify the ATLAS/USD refresh control after the next push.
- Add a fallback/source timestamp cache if CoinGecko rate limiting becomes noisy.
- Ground the excluded-item gaps if `INK`, `IC3A`, and `IC3B` should become rankable:
  - `INK`: LP/duration/fee are extracted, but the recipe/input-cost path is not yet modeled, so `LP/ATLAS` and `LP/USD` are not grounded.
  - `IC3A` / `IC3B`: duration and ATLAS price ranges are extracted, but LP output is not grounded in the current notes, so LP-efficiency ranking is still invalid.
- Compact source-of-truth note for those gaps: `notes/sage-excluded-items-gap-map.md`
- The analyzer now exposes those gaps more explicitly in the UI under `Tracked But Excluded` with `Code`, `Why Excluded`, `Known Data`, `Source Basis`, `Missing Economics`, and `Next Required Input` columns, so post-deploy verification should confirm those exact table-header markers are visible too.
- It also now states the exact unlock condition in plain language: `INK` needs grounded recipe/input-cost data, while `IC3A` / `IC3B` need grounded LP output before ranking becomes valid.
- Re-run pixel-level live browser verification if visual spacing or responsive rendering becomes a concern
- Keep the quick probe portable; use `grep`, not `rg`, unless the target environment is known to have ripgrep installed
- Keep fetch failure distinct from analyzer marker drift so network/404 problems do not look like a stale deployment.
