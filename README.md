# Sofie demo assets

Vue 2 / webpack CasparCG HTML templates and a **media scaffold** for the Sofie demo /
SPRÁVY **hypercomposed** playout path.

Forked from [casparcg-vue-boilerplate](https://github.com/mint-dewit/casparcg-vue-boilerplate).

## Templates

After `yarn build`, Caspar loads templates as **`gfx/<name>`** — flat HTML files at
`deploy/template-path/gfx/<name>.html` (not nested `gfx/<name>/<name>.html`).

| Template folder | Caspar clipName | `window.update(data)` keys |
|-----------------|-----------------|----------------------------|
| `headline` | `gfx/headline` | `iluFile`, `source` |
| `l3d-headline` | `gfx/l3d-headline` | `title`, `subtitle` (aliases: `headline`, `subline`) |
| `l3d-tema` | `gfx/l3d-tema` | `headline` |
| `l3d-mod` | `gfx/l3d-mod` | `name` |
| `l3d-syn` | `gfx/l3d-syn` | `name`, `role` |
| `l3d-sjv` | `gfx/l3d-sjv` | `headline` |
| `l3d-sport` | `gfx/l3d-sport` | `headline`, `source` |
| `weather` | `gfx/weather` | `cities` (array) |
| `outro` | `gfx/outro` | _(none)_ |
| `logo-bug` | `gfx/logo-bug` | _(none)_ |

Canonical keys are listed above. Blueprint smoke rundowns may still send
`headline` / `subline` for `l3d-headline`; the template accepts those as
backward-compatible aliases until manifests are updated.

Legacy v1 stubs (`gfx/l3d`, `gfx/mod-l3d`, `gfx/head-spravy`, …) remain under
`public/` and `src/` but are **not** part of the v2 deploy bundle.

## Build & deploy

```bash
yarn install
yarn build
```

Produces:

```text
deploy/
  template-path/          → CasparCG <template-path>
    gfx/<name>.html       ← flat, one HTML per template
    js/ css/ img/ assets/ (shared hashed bundles)
  media-path/             → CasparCG <media-path> scaffold
    loops/ clips/ wipes/ assets/
```

### Windows install

Copy the built trees onto the playout machine:

```text
deploy/template-path/*  →  C:\casparcg\sofie-demo-template\
deploy/media-path/*     →  C:\casparcg\sofie-demo-media\
```

Add per-rundown clips under `sofie-demo-media/spravy/<rundownExternalId>/clips/`
on the machine — see [docs/MEDIA_LAYOUT.md](docs/MEDIA_LAYOUT.md).

CasparCG `casparcg.config`:

```xml
<paths>
  <template-path>sofie-demo-template/</template-path>
  <media-path>sofie-demo-media/</media-path>
</paths>
```

Sofie blueprints reference templates as `gfx/headline`, `gfx/l3d-tema`, etc.

### OpenSSL (Node 17+)

`yarn build` and `yarn serve` set `NODE_OPTIONS=--openssl-legacy-provider` automatically.

## Development

```bash
yarn serve
```

Webpack dev server (port **8080**) serves the same folder names as `vue.config.js`
pages and `scripts/assemble-caspar.mjs`. There is no root `index.html`.

Per-template dev URLs:

- http://localhost:8080/headline/index.html
- http://localhost:8080/l3d-headline/index.html
- http://localhost:8080/l3d-mod/index.html
- http://localhost:8080/l3d-tema/index.html
- http://localhost:8080/l3d-syn/index.html
- http://localhost:8080/l3d-sjv/index.html
- http://localhost:8080/l3d-sport/index.html
- http://localhost:8080/weather/index.html
- http://localhost:8080/outro/index.html
- http://localhost:8080/logo-bug/index.html

When loaded from `localhost:8080`, templates auto-populate sample data and auto-play
their intro animation (see each `src/<tpl>/App.vue` `mounted()`).

Console API:

```js
window.update({ title: '…', subtitle: '…' })
window.play()
window.stop()
```

### Rundown Editor preview

Set Rundown Editor `PREVIEW_BASE_URL` to the dev server, e.g. `http://localhost:8080`.
Preview URLs follow the same paths as dev URLs, with query parameters for gfx fields:

```text
{PREVIEW_BASE_URL}/l3d-tema/index.html?headline=R.+Fico+o+M.+Ficovi
{PREVIEW_BASE_URL}/l3d-headline/index.html?title=Premiér&subtitle=Syn
{PREVIEW_BASE_URL}/headline/index.html?iluFile=clips/premiera.mp4&source=TASR
```

Folder names must match the `pages` list in `vue.config.js` and
`scripts/assemble-caspar.mjs`.

## Media & ILU paths

Production `.mp4` clips are **not** in git. See [docs/MEDIA_LAYOUT.md](docs/MEDIA_LAYOUT.md)
for the `spravy/<rundownExternalId>/clips/` convention, Package Manager ingest mirror,
and how `iluFile` resolves under Caspar `<media-path>`.

## LED vs PGM

See [docs/OUTPUT_TOPOLOGY.md](docs/OUTPUT_TOPOLOGY.md) — **one CasparCG** can feed LED and PGM
on **different channels/consumers**; you do not need two servers.

## CI/CD

GitHub Actions mirrors [sofie-demo-blueprints](https://github.com/SuperFlyTV/sofie-demo-blueprints):

| Trigger | Job | Output |
|---------|-----|--------|
| Pull request / push | `lint`, `build` | Validates `yarn lint` and `yarn build` |
| Push to `main` or `master` | `prerelease-demo-assets` | GitHub **pre-release** tagged `pre-<commit-sha>` with `sofie-demo-assets-pre-<short-sha>.zip` |
| Version tag (`v*` or `0.x`) | `release-demo-assets` | GitHub release with `sofie-demo-assets_v<version>.zip` |
| Push (non-PR) | `build-deploy-image` | Container image on `ghcr.io/<owner>/sofie-demo-assets` |

Each zip contains `sofie-demo-template/` and `sofie-demo-media/` ready for CasparCG
`<template-path>` and `<media-path>`.

To attach assets to an existing tag manually, run the **Node CI** workflow with
`workflow_dispatch` and provide the tag name.
