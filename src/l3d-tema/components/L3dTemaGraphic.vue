<template>
  <div id="bar" ref="bar">
    <span id="headline">{{ headline }}</span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideBarIn, slideBarOut, initBarOffscreen } from '../../shared/animations'

export default {
  name: 'L3dTemaGraphic',
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
      await this.stop()
      if (data.headline !== undefined) this.$parent.headline = data.headline
      await this.$nextTick()
      await this.play()
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
  height: var(--bar-height);
  display: flex;
  align-items: center;
  background: var(--bar-bg);
  border-radius: var(--bar-radius);
  padding-left: 3%;
  padding-right: 22%;
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
