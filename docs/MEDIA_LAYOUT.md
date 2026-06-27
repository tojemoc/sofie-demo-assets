# Media layout (Caspar `<media-path>`)

Production video clips are **never committed to git**. Only the scaffold under
`deploy/media-path/` ships with this repo. Operators copy that scaffold to the playout
machine and add per-rundown clips locally (or via Package Manager ingest).

## Windows install paths

```text
C:\casparcg\sofie-demo-template\   ← contents of deploy/template-path/
C:\casparcg\sofie-demo-media\      ← deploy/media-path/ + per-rundown clips
```

CasparCG `casparcg.config`:

```xml
<paths>
  <template-path>sofie-demo-template/</template-path>
  <media-path>sofie-demo-media/</media-path>
</paths>
```

## Top-level tree

```text
sofie-demo-media/
  spravy/<rundownExternalId>/clips/<file>.mp4   ← per-rundown (not in git)
  loops/                                         ← shared scaffold from deploy
  clips/
  wipes/
  assets/
```

Shared folders (`loops/`, `clips/`, `wipes/`, `assets/`) come from
`deploy/media-path/` after `yarn build`. Per-rundown `spravy/` trees are created on
the playout machine when media is ingested or copied manually.

## SPRÁVY per-rundown convention

Blueprints resolve clip paths with `getSpravyClipPath()` in
`sofie-demo-blueprints` → `packages/blueprints/src/base/showstyle/helpers/mediaPackages.ts`:

```text
spravy/<rundownExternalId>/clips/<basename>
```

Example for rundown external id `spravy-v3-smoke`:

```text
sofie-demo-media/spravy/spravy-v3-smoke/clips/headline1.mp4
sofie-demo-media/spravy/spravy-v3-smoke/clips/headline2.mp4
sofie-demo-media/spravy/spravy-v3-smoke/clips/headline3.mp4
sofie-demo-media/spravy/spravy-v3-smoke/clips/syn-sot.mp4
sofie-demo-media/spravy/spravy-v3-smoke/clips/vo-package.mp4
```

These filenames match `assets/spravy-v3-smoke-rundown.json` in the blueprints repo.

## Package Manager ingest mirror

Package Manager stages files under an **ingest** folder, then copies them into the
Caspar media tree. Default studio config (blueprints):

| Container | Role | Default folder |
|-----------|------|----------------|
| `ingest0` | Staging / source | `c:/casparcg/media-ingest` |
| `casparcg0` | Playout target | `c:/casparcg/sofie-demo-media` |

Ingest paths mirror the Caspar layout. A clip that plays as
`spravy/spravy-v3-smoke/clips/headline1.mp4` on Caspar should appear at the same
relative path under the ingest root before copy, e.g.:

```text
c:/casparcg/media-ingest/spravy/spravy-v3-smoke/clips/headline1.mp4
  → copy →
c:/casparcg/sofie-demo-media/spravy/spravy-v3-smoke/clips/headline1.mp4
```

## Caspar PLAY and file extensions

Caspar `PLAY` commands omit the extension (`PLAY 1-10 spravy/.../headline1`), but
the file **on disk must include `.mp4`**. Blueprints and templates always use the
full media-path-relative path including extension in JSON payloads.

## ILU headline video (`gfx/headline`)

Caspar HTML templates run in Chromium (CEF), which **does not decode H.264/AAC MP4**
inside `<video>` tags. MP4 ILU clips must play via Caspar **FFmpeg on layer 110**
(`PLAY 1-110 spravy/.../headline1`), wired by blueprints alongside the HTML template.

The **headline** template is an overlay only: rounded frame + source pill on layer 121.
Video shows through the transparent `#ilu-block` from the clip layer below.

```js
window.update({
  iluFile: 'spravy/spravy-v3-smoke/clips/headline1.mp4', // used by blueprints PLAY
  source: 'TASR'
})
```

`iluFile` stays in the template payload for Package Manager / expectedPackages.
Blueprints strip the extension for Caspar PLAY (`headline1` not `headline1.mp4`).

VT pieces use the same path in `fileName`; gfx headline pieces use `iluFile`. Both
must match the on-disk layout above so Package Manager and Caspar agree on the file
location.

## Shared scaffold clips

The repo ships empty scaffold folders with README stubs. Typical shared assets
(not per-rundown) live directly under scaffold roots, for example:

```text
sofie-demo-media/loops/360_loop.mp4
sofie-demo-media/clips/<shared-clip>.mp4
```

Add production files on the playout machine; do not commit them here.
