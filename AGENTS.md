# AGENTS.md

## Cursor Cloud specific instructions

This repo builds **CasparCG HTML templates** (Vue 2 / webpack 4) and a **deploy/** tree for
Caspar `template-path` + `media-path`. No backend or long-running service.

### Commands

| Task | Command |
|------|---------|
| Dev server | `yarn serve` |
| Production build | `yarn build` |
| Lint | `yarn lint` |

`yarn build` = `yarn build:vue` + `node scripts/assemble-caspar.mjs`.

### OpenSSL legacy provider

Webpack 4 needs `NODE_OPTIONS=--openssl-legacy-provider` on Node 17+ — already set in
`package.json` scripts for `serve` and `build`.

### Dev URLs

No root `index.html`. Each v2 template is its own page, e.g.

- `http://localhost:8080/headline/index.html`
- `http://localhost:8080/l3d-headline/index.html`
- `http://localhost:8080/l3d-mod/index.html`
- `http://localhost:8080/l3d-tema/index.html`
- `http://localhost:8080/l3d-syn/index.html`
- `http://localhost:8080/l3d-sjv/index.html`
- `http://localhost:8080/l3d-sport/index.html`
- `http://localhost:8080/weather/index.html`
- `http://localhost:8080/outro/index.html`
- `http://localhost:8080/logo-bug/index.html`

When loaded from `localhost:8080`, templates auto-populate sample data and auto-play
their intro animation (see each `src/<tpl>/App.vue` `mounted()`).

### Caspar API

Templates expose `window.play()`, `window.stop()`, and `window.update(data)`.
Shared parser: `src/shared/caspar-bridge.js` (v2 templates).

Console example: `window.update({ headline: "R. Fico o M. Ficovi" })`

Sofie field names: see root `README.md` table.

### Output layout

After `yarn build`, copy `deploy/template-path` and `deploy/media-path` to Caspar.
See `docs/OUTPUT_TOPOLOGY.md` for LED vs PGM (one Caspar, two channels).

### Adding a template

1. `src/<name>/` (App.vue, main.js, components/)
2. Register in `vue.config.js` `pages`
3. Add `<name>` to `scripts/assemble-caspar.mjs` `pages` array
4. Rebuild
