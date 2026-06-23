<template>
  <div id="bar" ref="bar">
    <span id="dot"></span>
    <span id="name">{{ name }}</span>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'L3dModGraphic',
  props: {
    name: { type: String, default: '' }
  },
  methods: {
    barOffset () {
      const bar = this.$refs.bar
      return bar ? -(bar.offsetWidth + 40) : -700
    },
    play () {
      gsap.set(this.$refs.bar, { x: 0 })
      return new Promise(resolve => {
        gsap.from(this.$refs.bar, {
          x: this.barOffset(),
          duration: 0.5,
          ease: 'power2.out',
          onComplete: resolve
        })
      })
    },
    stop () {
      return new Promise(resolve => {
        gsap.to(this.$refs.bar, {
          x: this.barOffset(),
          duration: 0.4,
          ease: 'power2.in',
          onComplete: resolve
        })
      })
    }
  }
}
</script>

<style scoped>
#bar {
  position: absolute;
  left: 6%;
  bottom: 12%;
  width: 38%;
  height: auto;
  min-height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--bar-bg);
  border-radius: 10px;
  padding: 16px 24px;
}

#dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--brand-blue);
  flex-shrink: 0;
  margin-right: 14px;
}

#name {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 42px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
