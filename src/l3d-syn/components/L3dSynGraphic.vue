<template>
  <div id="bar" ref="bar">
    <span id="dot"></span>
    <div id="text-block">
      <span id="name">{{ name }}</span>
      <span id="role">{{ role }}</span>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideBarIn, slideBarOut } from '../../shared/animations'

export default {
  name: 'L3dSynGraphic',
  props: {
    name: { type: String, default: '' },
    role: { type: String, default: '' }
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
      if (data.name !== undefined) this.$parent.name = data.name
      if (data.role !== undefined) this.$parent.role = data.role
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
  height: 130px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--bar-bg);
  border-radius: var(--bar-radius);
  padding-left: 3%;
  padding-right: 22%;
}

#dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--brand-blue);
  flex-shrink: 0;
  margin-right: 14px;
}

#text-block {
  display: flex;
  flex-direction: column;
}

#name {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 44px;
  color: var(--text-primary);
}

#role {
  font-family: var(--font-regular);
  font-size: 28px;
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
