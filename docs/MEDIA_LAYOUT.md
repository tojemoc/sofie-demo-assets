# Media layout (Caspar `<media-path>`)

Production video clips are **never committed to git**. Only the scaffold under
`deploy/media-path/` ships with this repo. Operators copy that scaffold to the playout
machine and add clips locally (or via Package Manager ingest).

## Windows install paths

```text
C:\casparcg\sofie-demo-template\   ← contents of deploy/template-path/
C:\casparcg\sofie-demo-media\      ← deploy/media-path/ + clips
```

CasparCG `casparcg.config`:

```xml
<paths>
  <template-path>sofie-demo-template/</template-path>
  <media-path>sofie-demo-media/</media-path>
</paths>
```

## Top-level tree (two levels only)

```text
sofie-demo-media/
  clips/<file>.mp4    ← VT / ILU / SYN / headline masters
  loops/              ← shared scaffold from deploy (e.g. 360_loop)
  wipes/              ← alpha wipes + intro overlays
  assets/             ← stills / misc
```

No per-rundown nesting (`spravy/<id>/…` is retired). Shared folders come from
`deploy/media-path/` after `yarn build`. Drop media files straight into `clips/`,
`loops/`, or `wipes/`.

## Path helpers

Blueprints resolve clip basenames with `getDemoClipPath()` /
`getSpravyClipPath()` → `clips/<basename>`:

```text
clips/headline1.mp4
clips/syn-1.mp4
```

Smoke fixture `assets/spravy-v3-smoke-rundown.json` (sofie megarepo) uses the same
`clips/…` paths.

## Package Manager ingest mirror

Package Manager stages files under an **ingest** folder, then copies them into the
Caspar media tree. Default studio config (blueprints):

| Container | Role | Default folder |
|-----------|------|----------------|
| `ingest0` | Staging / source | `c:/casparcg/media-ingest` |
| `casparcg0` | Playout target | `c:/casparcg/sofie-demo-media` |

Ingest paths mirror the Caspar layout. A clip that plays as `clips/headline1.mp4`
on Caspar should appear at the same relative path under the ingest root:

```text
c:/casparcg/media-ingest/clips/headline1.mp4
  → copy →
c:/casparcg/sofie-demo-media/clips/headline1.mp4
```

## Caspar PLAY and file extensions

Caspar `PLAY` commands omit the extension (`PLAY 1-10 clips/headline1`), but
the file **on disk must include `.mp4`**. Blueprints and templates always use the
full media-path-relative path including extension in JSON payloads.

## ILU headline video (`gfx/headline` / `gfx/headline-fallback`)

ILU video is **always played by CasparCG MEDIA** on layer **115** (`casparcg_ilu_player`).
HTML templates never load `.webm` / `<video>` for ILU — they only draw the chrome frame
and source pill (when used).

Toggle on the headline piece: **ILU prerendered/bypass** (`iluPrerendered`):

| Mode | Payload | Caspar behaviour |
|------|---------|------------------|
| OFF (default) | `iluPrerendered: false` | PLAY full-frame 16:9 `.mp4`, MIXER CROP (cover) + FILL into `#ilu-slide`, plus `gfx/headline-fallback` overlay |
| ON | `iluPrerendered: true` | PLAY pre-rendered alpha `.mov` with baked headline motion, FILL `0 0 1 1` (fullscreen); **no** HTML chrome |

Legacy `iluFallback: true` is treated as prerendered/bypass ON.

```text
clips/headline1.mp4   ← cropped ILU master (bypass OFF)
clips/headline1.mov   ← optional prerendered alpha (bypass ON)
```

```text
iluFile: 'clips/headline1.mp4'
PLAY 1-115 "clips/headline1"
```
