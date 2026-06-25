# Sofie demo assets

Vue 2 / webpack CasparCG HTML templates and a **media scaffold** for the Sofie demo /
SPRÁVY **hypercomposed** playout path.

Forked from [casparcg-vue-boilerplate](https://github.com/mint-dewit/casparcg-vue-boilerplate).

## Templates

| Caspar name | Source | Sofie `update()` fields |
|-------------|--------|-------------------------|
| `gfx/l3d` | `src/l3d/` | `name`, `description` (+ legacy `f0`/`f1`) |
| `gfx/mod-l3d` | `src/mod-l3d/` | `name` |
| `gfx/head-spravy` | `src/head-spravy/` | `title`, `subtitle`, `source`, `iluFile` |
| `gfx/strap` | `src/strap/` | (stock demo) |
| `gfx/ticker` | `src/ticker/` | (stock demo) |
| `gfx/wipe` | `src/wipe/` | (stock demo HTML wipe) |

`head-spravy` and `mod-l3d` are **layout stubs** — replace with annotated screenshot specs.

## Build & deploy

```bash
yarn install
yarn build
```

Produces:

```text
deploy/
  template-path/          → CasparCG <template-path>
    gfx/<name>.html
    js/ css/ img/         (shared hashed bundles)
  media-path/             → CasparCG <media-path>
    loops/ clips/ wipes/ assets/
```

Copy onto your playout machine:

```text
deploy/template-path/*  →  C:\path\to\caspar\template\
deploy/media-path/*     →  C:\path\to\caspar\media\
```

Sofie blueprints reference templates as `gfx/l3d`, `gfx/head-spravy`, etc.

### OpenSSL (Node 17+)

`yarn build` and `yarn serve` set `NODE_OPTIONS=--openssl-legacy-provider` automatically.

## Development

```bash
yarn serve
```

Per-template dev URLs (no root index):

- http://localhost:8080/l3d.html
- http://localhost:8080/mod-l3d.html
- http://localhost:8080/head-spravy.html

Each auto-plays sample data on `localhost:8080`. Console API:

```js
window.update({ name: '…', description: '…' })
window.play()
window.stop()
```

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
