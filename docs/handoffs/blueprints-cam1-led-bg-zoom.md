# Handoff: DoubleBox Cam1 FILL up + LED `bg_loop` 120% right zoom

**Target repo:** [tojemoc/sofie-demo-blueprints](https://github.com/tojemoc/sofie-demo-blueprints)  
**Apply against:** `develop`  
**Patch file:** [`blueprints-cam1-led-bg-zoom.patch`](./blueprints-cam1-led-bg-zoom.patch)

> This cloud agent runs in **sofie-demo-assets** and cannot push to blueprints
> (`Permission denied` / no write token). Apply the patch (or the constants below)
> in blueprints, then rebuild + upload blueprints to Sofie and Take a tema DoubleBox.

## Cam1 black band (~30px) in DoubleBox

Cam1 is **not** HTML — it is Caspar MIXER FILL on BG look layer **115**:

`packages/blueprints/src/base/studio/applyConfig/mappings/casparcgLayers.ts`

| Constant | Before | After |
|----------|--------|-------|
| `PGM_DOUBLEBOX_CAMERA_FILL.y` | `0.1` (~108px) | `0.072` (~78px, **~30px up** @1080p) |

`x` / `xScale` / `yScale` stay `0.2` / `0.8` / `0.8` (right-stuck ~80% box).

AMCP check after upload:

```text
MIXER 3-115 FILL 0.2 0.072 0.8 0.8
```

## LED `bg_loop` zoom (channel 1)

Tema / SJV / ŠPORT / Počasie already re-PLAY `loops/bg_loop` with FILL+CROP via
`createLedBgLoopZoomPiece` when the **segment** name/id matches
(`segmentUsesLedBgLoopZoom`). Headlines / tip / outro stay fullscreen baseline.

| Constant | Before | After |
|----------|--------|-------|
| `LED_BG_LOOP_TEMA_FILL` | `-0.075 -0.075 1.15 1.15` (center ~15%) | `-0.2 -0.1 1.2 1.2` (**120%**, right edge) |

`x: -0.2` = full right pan of the 20% overflow (“+50% to the right” from left origin).
Crop align switched to `from-left` (keeps right portion if aspect ever differs).

AMCP during a tema part:

```text
PLAY 1-110 "loops/bg_loop" ...
MIXER 1-110 FILL -0.2 -0.1 1.2 1.2
```

If LED still looks unzoomed, the active segment is not matching the tema/SJV/sport/weather
allow-list (or blueprints were not re-uploaded).

## `route://3` vs `route://4` (not hardcoded to a rundown order)

Blueprints pick the PGM underlay from **look kind per part**, not from “ILU then SYN”
as a special switcher, and not from fixed part indices.

| Look | Slot | Default Caspar ch | PGM MEDIA |
|------|------|-------------------|-----------|
| DoubleBox (`rawType` matches `doublebox` **or** piece `gfx/doublebox-ilu`) | A | **3** | `route://3` |
| Everything else look-bearing (headlines, SYN/VT, weather, fullscreen cam) | B | **4** | `route://4` |

So **Tema ILU (DoubleBox) → `route://3`**, **Tema SYN (Full) → `route://4`**. If you
reorder the rundown, each part is classified again on the next blueprint generation /
ingest — moving a DoubleBox part still routes to ch3; moving a SYN still routes to ch4.
Remote / Titles / DVE **peek** the last look slot; Intro forces Full underlay (`route://4`).

Canonical table: blueprints `packages/docs/docs/pgm_route_contract.md`.

## Apply

```bash
cd sofie-demo-blueprints
git checkout develop && git pull
git apply path/to/blueprints-cam1-led-bg-zoom.patch
# or cherry-pick local commit f03d8eb if you have the agent worktree
yarn test:blueprints
yarn build:blueprints   # then upload to Sofie + Apply config
```
