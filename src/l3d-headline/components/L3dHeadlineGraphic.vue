<template>
  <div id="headline-stack">
    <div class="headline-bar" id="bar-title" ref="barTitle" :class="{ 'is-empty': !title }">{{ title }}</div>
    <div class="headline-bar" id="bar-subtitle" ref="barSubtitle" :class="{ 'is-empty': !subtitle }">{{ subtitle }}</div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { killAnimations, slideElementIn, slideElementOut } from '../../shared/animations'

const OFFSCREEN_X = -1200

export default {
  name: 'L3dHeadlineGraphic',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  mounted () {
    // Start fully off-screen so a partial/interrupted stop never leaves a sliver on the left.
    gsap.set([this.$refs.barTitle, this.$refs.barSubtitle], { x: OFFSCREEN_X })
  },
  methods: {
    activeBars () {
      const bars = []
      if (this.title && this.$refs.barTitle) bars.push(this.$refs.barTitle)
      if (this.subtitle && this.$refs.barSubtitle) bars.push(this.$refs.barSubtitle)
      return bars
    },
    async play () {
      const allBars = [this.$refs.barTitle, this.$refs.barSubtitle].filter(Boolean)
      const bars = this.activeBars()
      killAnimations(allBars)
      gsap.set(allBars, { x: OFFSCREEN_X })
      if (!bars.length) return

      // Match l3d-tema / l3d-mod: set destination before gsap.from so bars slide in.
      for (let i = 0; i < bars.length; i++) {
        gsap.set(bars[i], { x: 0 })
        await slideElementIn(bars[i], OFFSCREEN_X, 0.4, i === 0 ? 0.05 : 0.12)
      }
    },
    async stop () {
      const bars = [this.$refs.barTitle, this.$refs.barSubtitle].filter(Boolean)
      killAnimations(bars)
      await Promise.all(bars.map(bar => slideElementOut(bar, OFFSCREEN_X, 0.35)))
      // Hard-park off-screen so unload / interrupted stop cannot leave a stuck sliver.
      gsap.set(bars, { x: OFFSCREEN_X })
    },
    async update (data) {
      await this.stop()
      if (data.title !== undefined) this.$parent.title = data.title
      if (data.subtitle !== undefined) this.$parent.subtitle = data.subtitle
      if (data.headline !== undefined) this.$parent.title = data.headline
      if (data.subline !== undefined) this.$parent.subtitle = data.subline
      await this.$nextTick()
      await this.play()
    }
  }
}
</script>

<style scoped>
#headline-stack {
  position: absolute;
  left: 6%;
  bottom: 18%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.headline-bar {
  display: inline-block;
  background: var(--bar-bg);
  color: var(--text-primary);
  font-family: var(--font-bold);
  font-weight: 700;
  border-radius: 8px;
  padding: 12px 20px;
  white-space: nowrap;
  will-change: transform;
}

.headline-bar.is-empty {
  visibility: hidden;
  padding: 0;
  min-height: 0;
  pointer-events: none;
}

#bar-title {
  font-size: 52px;
  line-height: 1.1;
}

#bar-subtitle {
  font-size: 44px;
  line-height: 1.1;
}
</style>
