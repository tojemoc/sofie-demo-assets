# SPRÁVY L3D templates (Figma → Caspar)

Colleague HTML sources live under `docs/figma-sources/` (copied from sofie megarepo).
Vue pages under `src/` are the Caspar deployables (`gfx/<name>` after `yarn build`).

| Source (megarepo) | Deploy template | Fields | Notes |
|------------------|-----------------|--------|-------|
| `spravy_360_predstavovak` | `gfx/l3d-predstavovak` | `name`, `title` | Topic / guest nameplate; also drives `gfx/l3d-mod` |
| `spravy_360_jednou_vetou` | `gfx/l3d-sjv` | `kicker` (default `SPRÁVY JEDNOU VETOU`), `headline` | SJV block |
| same shell | `gfx/l3d-sport` | `kicker` (default `ŠPORT`), `headline` | Sport block |
| same shell, no kicker | `gfx/l3d-odporucanie` | `headline` | Recommendation / avízo CTA |

Shared Vue shell: `src/shared/figma-l3d/JednouVetouShell.vue`.

## Fonts

Bauplan + Diform ship as WOFF2 under `deploy/template-path/fonts/` (bundled `@font-face`
in Vue CSS). Install the same families on the Caspar host for `local()` fallback.

Nimaiovica caption fonts live under `docs/fonts/nimaiovica-captions/` (off-air subtitle
presets, not Caspar HTML templates).

## AMCP examples

```text
CG 2 ADD 121 "gfx/l3d-predstavovak" 1 "{\"name\":\"Peter Pellegrini\",\"title\":\"Prezident Slovenskej republiky\"}"
CG 2 ADD 121 "gfx/l3d-sjv" 1 "{\"kicker\":\"SPRÁVY JEDNOU VETOU\",\"headline\":\"Kamenický o konsolidácií Slovenska\"}"
CG 2 ADD 121 "gfx/l3d-sport" 1 "{\"kicker\":\"ŠPORT\",\"headline\":\"Pokračuje boj o Stanley cup\"}"
CG 2 ADD 121 "gfx/l3d-odporucanie" 1 "{\"headline\":\"Sledujte na www.360tka.sk\"}"
```

Dev preview (after `yarn serve`):

- http://localhost:8080/l3d-predstavovak/index.html
- http://localhost:8080/l3d-sjv/index.html
- http://localhost:8080/l3d-sport/index.html
- http://localhost:8080/l3d-odporucanie/index.html
