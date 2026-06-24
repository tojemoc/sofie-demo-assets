<template>
  <div id="bar" ref="bar">
    <div id="badge-row">
      <span id="badge-dot"></span>
      <span id="badge-label">SPRÁVY JEDNOU VETOU</span>
    </div>
    <span id="headline">{{ headline }}</span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideBarIn, slideBarOut, initBarOffscreen } from '../../shared/animations'

export default {
  name: 'L3dSjvGraphic',
  props: {
    headline: { type: String, default: '' }
  },
  mounted () {
    initBarOffscreen(this.$refs.bar)
  },
  methods: {
    async play () {
      gsap.set(this.$refs.bar, { x: 0 })
      await slideBarIn(this.$refs.bar)
    },
    async stop () {
      await slideBarOut(this.$refs.bar)
    },
    async update (data) {
      await slideBarOut(this.$refs.bar, 0.35)
      if (data.headline !== undefined) this.$parent.headline = data.headline
      await this.$nextTick()
      gsap.set(this.$refs.bar, { x: -window.innerWidth })
      await slideBarIn(this.$refs.bar, 0.4)
    }
  }
}
</script>

<style scoped>
#bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--bar-height-tall);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bar-bg);
  border-radius: var(--bar-radius);
  padding-left: 3%;
  padding-right: 22%;
}

#badge-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
}

#badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--brand-blue);
  margin-right: 8px;
  flex-shrink: 0;
}

#badge-label {
  font-family: var(--font-regular);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

#headline {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 48px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
