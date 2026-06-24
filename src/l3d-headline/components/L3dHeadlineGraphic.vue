<template>
  <div id="headline-stack">
    <div v-if="title" class="headline-bar" id="bar-title" ref="barTitle">{{ title }}</div>
    <div v-if="subtitle" class="headline-bar" id="bar-subtitle" ref="barSubtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideElementIn, slideElementOut } from '../../shared/animations'

export default {
  name: 'L3dHeadlineGraphic',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  methods: {
    async play () {
      gsap.set([this.$refs.barTitle, this.$refs.barSubtitle].filter(Boolean), { x: 0 })

      if (this.$refs.barTitle) {
        await slideElementIn(this.$refs.barTitle, -700, 0.4, 0.3)
      }
      if (this.$refs.barSubtitle) {
        await slideElementIn(this.$refs.barSubtitle, -700, 0.4, 0.45)
      }
    },
    async stop () {
      const bars = [this.$refs.barTitle, this.$refs.barSubtitle].filter(Boolean)
      await Promise.all(bars.map(bar => slideElementOut(bar, -700, 0.35)))
    },
    async update (data) {
      await this.stop()
      if (data.title !== undefined) this.$parent.title = data.title
      if (data.subtitle !== undefined) this.$parent.subtitle = data.subtitle
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
