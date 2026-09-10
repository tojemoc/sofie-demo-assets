# Blueprints / megarepo handoff — v2 Caspar graphics (2026-08-31)

Use this prompt when wiring **tojemoc/sofie-demo-blueprints** and **tojemoc/sofie** to the
cleaned **tojemoc/sofie-demo-assets** tree (branch `cursor/cleanup-v2-graphics-bc1a` or later
`main` after merge).

---

## Context

PR [#33](https://github.com/tojemoc/sofie-demo-assets/pull/33) (`ondrove-grafiky`) imported the
final Figma HTML builds and brand fonts. The assets repo was cleaned so **only v2 templates**
remain — legacy v1 stubs (`gfx/l3d`, `gfx/mod-l3d`, `gfx/head-spravy`, `gfx/ticker`, `gfx/strap`,
`gfx/wipe`) were removed.

Build pipeline is unchanged: `yarn build` → `deploy/template-path/` + `deploy/media-path/`.
Copy `deploy/template-path/*` to Caspar `<template-path>` (e.g. `C:\casparcg\sofie-demo-template\`).

Fonts ship inside the template bundle under `fonts/` (Bauplan + Diform WOFF2, 360 Logo OTF).
Templates also fall back to system-installed fonts when present.

---

## Deployed templates (`gfx/<name>`)

| clipName | RE piece / object type | JSON fields (canonical) | RE aliases accepted by template |
|----------|------------------------|-------------------------|----------------------------------|
| `gfx/headline` | ILU chrome (LED) | `source`, `iluFile` *(blueprints → Caspar MEDIA, not HTML)* | — |
| `gfx/headline-fallback` | ILU chrome overlay (LED 121) | `source` | — |
| `gfx/source` | Standalone source pill (PGM) | `source` | `Source` |
| `gfx/l3d-headline` | Headline L3D (PGM) | `title`, `subtitle` | `headline`, `subline` |
| `gfx/l3d-predstavovak` | Guest / topic nameplate (PGM) | `name`, `title` | `headline`→`name`, `subline`→`title`, `meno`, `titulok`, `pozicia` |
| `gfx/l3d-mod` | Presenter MOD (PGM) | `name`, `title` | same as predstavovak |
| `gfx/l3d-tema` | Story headline bar (PGM) | `headline` | `title` |
| `gfx/l3d-syn` | SYN name strap (PGM) | `name`, `role` | — |
| `gfx/l3d-sjv` | Správy jednou vetou (PGM) | `kicker`, `headline` | `title`→`headline`, `rubrika`→`kicker` |
| `gfx/l3d-sport` | Sport block (PGM) | `kicker` *(default `ŠPORT`)*, `headline` | same as sjv |
| `gfx/l3d-odporucanie` | Avízo / CTA (PGM) | `headline` | `title` |
| `gfx/weather` | Fullscreen weather (PGM) | `cities` *(array)*, `bypass` *(default true)* | — |
| `gfx/outro` | Closing sting (PGM) | _(none)_ | — |
| `gfx/logo-bug` | 360° sekúnd bug (PGM) | _(none)_ | — |
| `gfx/logo-bug-kubo` | Alias → same HTML as `logo-bug` | _(none)_ | — |

**Removed (do not reference):** `gfx/l3d`, `gfx/mod-l3d`, `gfx/head-spravy`, `gfx/ticker`,
`gfx/strap`, `gfx/wipe`, `gfx/head`, `gfx/fullscreen`.

---

## Caspar layer / channel mapping (hypercomposed)

From `sofie-demo-blueprints` `casparcg.ts` + megarepo `SPRAVY-V2-INTEGRATION.md`:

| Sofie mapping id | Channel | Layer | Templates / media |
|------------------|---------|-------|-------------------|
| `casparcg_clip_player1` | LED (ch1) | 110 | Background loop only |
| `casparcg_ilu_player` | LED (ch1) | 115 | ILU `.mp4` / `.mov` (never HTML video) |
| `casparcg_graphics_l3d` | LED (ch1) | 121 | `gfx/headline-fallback` only |
| `casparcg_graphics_pgm_l3d` | PGM (ch2) | 121 | All L3Ds, `gfx/source`, tema, syn, sjv, sport, odporucanie |
| `casparcg_graphics_logo` | PGM (ch2) | logo layer | `gfx/logo-bug` / `gfx/logo-bug-kubo`, `OutOnRundownEnd` |
| `casparcg_graphics_pgm_intro` | PGM (ch2) | 210 | Intro `.mov` (video, not HTML) |
| `casparcg_pgm_effects` | PGM (ch2) | 200 | Wipes (video) |

**LED allow-list:** headline ILU (115) + `bg_loop` (110) only. All L3Ds and logo-bug are **PGM**.

ILU prerendered/bypass (`iluPrerendered`, legacy `iluFallback`):
- **OFF:** PLAY cropped `.mp4` on 115 + FILL `0.08/0.15/0.62/0.73` + `gfx/headline-fallback` on 121
- **ON:** PLAY alpha `.mov` FILL `0 0 1 1`, no HTML chrome

---

## Blueprint tasks

1. **Remove legacy clipName routes** for v1 object types (`l3d`, `mod-l3d`, `head`, `strap`, `ticker`, `fullscreen` stub).
2. **Ensure `parseGraphicsFromObjects` maps RE fields** per table above (`getTemplateAttributes` already handles most — verify `gfx/source` passes `source` only).
3. **Register RE piece types** in megarepo `assets/sofie-rundown-editor-piece-types.json`:
   - Add `source` GFX type if standalone source pill is used outside ILU.
   - Ensure `l3d-predstavovak`, `l3d-sjv`, `l3d-sport`, `l3d-odporucanie` manifests match canonical keys.
4. **Update smoke rundown** `assets/spravy-v3-smoke-rundown.json`:
   - Replace any `gfx/l3d` / `gfx/mod-l3d` references with `gfx/l3d-predstavovak` / `gfx/l3d-mod`.
   - Intro MOD: `gfx/l3d-mod` with `name` + `title`.
   - Logo: `gfx/logo-bug` on PGM mapping.
5. **Preview URLs** (Rundown Editor `PREVIEW_BASE_URL` = demo-assets dev server):
   `{BASE}/l3d-tema/index.html?headline=…`
   `{BASE}/source/index.html` is **not** a dev page — use built `gfx/source.html` or add static preview later.
6. **Deploy assets:** ingest pre-release zip from demo-assets CI (`sofie-demo-assets-pre-<sha>.zip`) or Docker `ghcr.io/tojemoc/sofie-demo-assets`.

---

## Verification AMCP (Caspar Client)

```text
CG 2 ADD 121 "gfx/l3d-tema" 1 "{\"headline\":\"R. Fico o M. Ficovi\"}"
CG 2 ADD 121 "gfx/l3d-predstavovak" 1 "{\"name\":\"Peter Pellegrini\",\"title\":\"Prezident SR\"}"
CG 2 ADD 121 "gfx/l3d-sjv" 1 "{\"kicker\":\"SPRÁVY JEDNOU VETOU\",\"headline\":\"Kamenický o konsolidácii\"}"
CG 2 ADD 121 "gfx/source" 1 "{\"source\":\"TASR\"}"
CG 2 ADD 121 "gfx/logo-bug" 1
PLAY 1-115 "clips/headline1"
CG 1 ADD 121 "gfx/headline-fallback" 1 "{\"source\":\"TASR\"}"
```

---

## Megarepo doc updates

- Refresh `docs/integration/SPRAVY-V2-INTEGRATION.md` repo snapshot + template table.
- Move `spravy_360_*` Figma reference HTML only under `docs/figma-sources/` (not repo root).
- Link to demo-assets `docs/BLUEPRINTS_HANDOFF.md` (this file) from integration handoffs table.

---

## Related blueprints FILL / route handoffs

- DoubleBox Cam1 raise (~30px) + LED `bg_loop` 120% right zoom + `route://3`↔`route://4`
  look-kind notes: [`docs/handoffs/blueprints-cam1-led-bg-zoom.md`](./handoffs/blueprints-cam1-led-bg-zoom.md)
  (patch for `sofie-demo-blueprints`; this assets agent cannot push that repo).
