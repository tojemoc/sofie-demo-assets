# LED vs PGM — one Caspar or two?

## Short answer

**You do not need two CasparCG servers** for LED ≠ PGM.

Use **one CasparCG instance** with **two channels** (or one channel + a non-Caspar PGM source).

## Common SPRÁVY scenarios

### A) LED = Caspar, PGM = studio camera (no second Caspar)

```text
Caspar ch1 ──► LED wall     (360_loop + ILU + headlines + MOD gfx)
Cam 1      ──► PGM / TX     (presenter + LED visible in frame)
```

Sofie hypercomposed mode drives **only the LED stack**. PGM is whatever shoots the studio.
This is the usual physical setup when the presenter stands in front of the LED.

### B) LED ≠ PGM, both composed — **one Caspar, two channels**

```text
Caspar channel 1 ──consumer──► LED SDI/NDI   (full gfx stack, no wide camera)
Caspar channel 2 ──consumer──► PGM SDI/NDI   (e.g. MOD cam + other layers)
```

Each channel has its **own layer stack** and **own consumer(s)** in `casparcg.config`.
Sofie blueprints map timeline objects to `channel` + `layer` (already how demo blueprints
use ch1/ch2/ch3 today — hypercomposed PR 2 will formalise LED vs PGM mappings).

### C) Two Caspar servers

Only needed for **hardware isolation** (two machines, two operators) or **splitting load**.
Not required for different content on LED vs PGM.

## Blueprint implication (PR 2+, not implemented yet)

Studio config will support something like:

```ts
hypercomposed: {
  ledChannel: 1,
  pgmChannel: 2,   // optional; omit if PGM is a physical camera
  cameraProducer: { ... },
}
```

Until PR 2 lands, treat **deploy/template-path** as the LED graphics tree.

## Deploy layout (template-path)

`yarn build` writes **flat** Caspar HTML — one file per template:

```text
deploy/template-path/
  gfx/headline.html
  gfx/l3d-headline.html
  gfx/l3d-tema.html
  …
  js/ css/ img/ assets/    ← shared bundles at template-path root
```

Sofie blueprints load these as `gfx/headline`, `gfx/l3d-tema`, etc. Paths are **not**
nested as `gfx/<name>/<name>.html`.

### Windows copy targets

```text
deploy/template-path/*  →  C:\casparcg\sofie-demo-template\
deploy/media-path/*     →  C:\casparcg\sofie-demo-media\
```

```xml
<template-path>sofie-demo-template/</template-path>
<media-path>sofie-demo-media/</media-path>
```

Per-rundown clips (`spravy/<rundownExternalId>/clips/*.mp4`) are added on the playout
machine and stay out of git — see [MEDIA_LAYOUT.md](MEDIA_LAYOUT.md).
