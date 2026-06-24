<template>
  <div class="headline-root">
    <div id="ilu-block" ref="iluBlock">
      <video
        v-if="iluFile"
        id="ilu-video"
        ref="iluVideo"
        :src="iluFile"
        muted
        autoplay
        loop
        playsinline
      />
      <div v-if="sourceLabel" id="source-pill" ref="sourcePill">{{ sourceLabel }}</div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { fadeIn, fadeOut } from '../../shared/animations'

export default {
  name: 'HeadlineGraphic',
  props: {
    iluFile: { type: String, default: '' },
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
      gsap.set(this.$refs.iluBlock, { x: 0 })
      if (this.$refs.sourcePill) gsap.set(this.$refs.sourcePill, { opacity: 0 })

      await new Promise(resolve => {
        gsap.from(this.$refs.iluBlock, {
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
      if (this.$refs.sourcePill) {
        await fadeOut(this.$refs.sourcePill, 0.2)
      }

      await new Promise(resolve => {
        gsap.to(this.$refs.iluBlock, {
          x: -900,
          duration: 0.45,
          ease: 'power3.in',
          onComplete: resolve
        })
      })
    },
    async update (data) {
      await this.stop()
      if (data.iluFile !== undefined) this.$parent.iluFile = data.iluFile
      if (data.source !== undefined) this.$parent.source = data.source
      await this.$nextTick()
      await this.play()
    }
  }
}
</script>

<style scoped>
.headline-root {
  position: absolute;
  inset: 0;
}

#ilu-block {
  position: absolute;
  left: 8%;
  top: 15%;
  width: 62%;
  bottom: 12%;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.25);
}

#ilu-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}
</style>
