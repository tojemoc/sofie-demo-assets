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

No root `index.html`. Use `/l3d.html`, `/mod-l3d.html`, `/head-spravy.html`, etc.

### Caspar API

Templates expose `window.play()`, `window.stop()`, `window.update(data)`, `window.preview()`.
Shared parser: `src/assets/casparBridge.js`.

Sofie field names: see root `README.md` table.

### Output layout

After `yarn build`, copy `deploy/template-path` and `deploy/media-path` to Caspar.
See `docs/OUTPUT_TOPOLOGY.md` for LED vs PGM (one Caspar, two channels).

### Adding a template

1. `public/<name>.html`
2. `src/<name>/` (App.vue, main.js, components/)
3. Register in `vue.config.js` `pages`
4. Add `<name>` to `scripts/assemble-caspar.mjs` `pages` array
