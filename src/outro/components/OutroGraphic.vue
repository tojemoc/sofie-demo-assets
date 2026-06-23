<template>
  <div id="bar" ref="bar">
    <span id="callout">{{ callout }}</span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideBarIn, slideBarOut } from '../../shared/animations'

export default {
  name: 'OutroGraphic',
  data () {
    return {
      callout: 'Sledujte na www.360tka.sk'
    }
  },
  methods: {
    async play () {
      gsap.set(this.$refs.bar, { x: 0 })
      await slideBarIn(this.$refs.bar)
    },
    async stop () {
      await slideBarOut(this.$refs.bar)
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

#callout {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 56px;
  color: var(--text-primary);
}
</style>
