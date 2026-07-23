<template>
  <div class="headline-fallback-root">
    <div id="ilu-slide" ref="iluSlide">
      <div id="ilu-window" />
      <div v-if="sourceLabel" id="source-pill" ref="sourcePill">{{ sourceLabel }}</div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { fadeIn, fadeOut, killAnimations } from '../../shared/animations'

export default {
  name: 'HeadlineFallbackGraphic',
  props: {
    source: { type: String, default: '' }
  },
  computed: {
    sourceLabel () {
      if (!this.source || !String(this.source).trim()) return ''
      const s = String(this.source).trim()
      return s.toLowerCase().startsWith('zdroj:') ? s : `zdroj: ${s}`
    }
  },
  methods: {
    async play () {
      killAnimations([this.$refs.iluSlide, this.$refs.sourcePill].filter(Boolean))
      gsap.set(this.$refs.iluSlide, { x: 0 })
      if (this.$refs.sourcePill) gsap.set(this.$refs.sourcePill, { opacity: 0 })

      await new Promise(resolve => {
        gsap.from(this.$refs.iluSlide, {
          x: -900,
          duration: 0.55,
          ease: 'power3.out',
          onComplete: resolve
        })
      })

      if (this.$refs.sourcePill) {
        await fadeIn(this.$refs.sourcePill, 0.3, 0.5)
      }
    },
    async stop () {
      killAnimations([this.$refs.iluSlide, this.$refs.sourcePill].filter(Boolean))
      if (this.$refs.sourcePill) {
        await fadeOut(this.$refs.sourcePill, 0.2)
      }

      await new Promise(resolve => {
        gsap.to(this.$refs.iluSlide, {
          x: -900,
          duration: 0.45,
          ease: 'power3.in',
          onComplete: resolve
        })
      })
    },
    async update (data) {
      await this.stop()
      if (data.source !== undefined) this.$emit('source-updated', data.source)
      await this.$nextTick()
      await this.play()
    }
  }
}
</script>

<style scoped>
.headline-fallback-root {
  position: absolute;
  inset: 0;
}

#ilu-slide {
  position: absolute;
  left: 8%;
  top: 15%;
  width: 62%;
  bottom: 12%;
  pointer-events: none;
}

/* Keep this transparent so a Caspar MEDIA clip on layer 110 can show through. */
#ilu-window {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background: transparent;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
}

#source-pill {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  background: var(--pill-bg);
  color: var(--text-primary);
  font-size: 14px;
  border-radius: var(--pill-radius);
  font-family: var(--font-regular);
  pointer-events: auto;
}
</style>
