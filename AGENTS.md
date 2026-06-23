# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Vue 2 / Vue CLI 3 (webpack 4) project that builds multiple
CasparCG HTML graphics templates (`l3d`, `wipe`, `ticker`, `strap`). There is no
backend, database, or other service — the only thing to run is the Vue dev server.

Standard commands live in `package.json` (`yarn serve`, `yarn build`, `yarn lint`)
and `README.md`. Notes below cover only the non-obvious caveats.

### OpenSSL legacy provider is required for build/serve (not lint)
The toolchain (webpack 4) is incompatible with the OpenSSL 3 default in modern
Node. `yarn build` and `yarn serve` fail with `ERR_OSSL_EVP_UNSUPPORTED`
(`error:0308010C:digital envelope routines::unsupported`) unless you set:

```
NODE_OPTIONS=--openssl-legacy-provider yarn serve
NODE_OPTIONS=--openssl-legacy-provider yarn build
```

`yarn lint` does NOT need this flag (it does not invoke webpack hashing).

### Running / verifying templates
- Dev server runs at `http://localhost:8080`. Each v2 template is its own page, e.g.
 `http://localhost:8080/headline/index.html`, `/l3d-headline/index.html`,
 `/l3d-mod/index.html`, `/l3d-tema/index.html`, `/l3d-syn/index.html`,
 `/l3d-sjv/index.html`, `/l3d-sport/index.html`, `/weather/index.html`,
 `/outro/index.html`, `/logo-bug/index.html`.
- When loaded from `localhost:8080`, templates auto-populate sample data and
 auto-play their intro animation (see each `src/<tpl>/App.vue` `mounted()`).
- Each template exposes the CasparCG control API on `window`: `window.play()`,
 `window.stop()`, and `window.update({ ... })`. You can call these from
 the DevTools console to drive/update graphics without a reload, e.g.
 `window.update({ headline: "R. Fico o M. Ficovi" })`.
- To add a template: create `src/<name>/`, register it in the `pages` object
 of `vue.config.js`, and rebuild.
