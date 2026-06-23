<template>
  <div id="logo-bug" ref="logoBug">
    <img src="assets/logo-360.svg" alt="360° sekúnd" />
    <span>sekúnd</span>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { fadeIn, fadeOut } from '../../shared/animations'

export default {
  name: 'LogoBugGraphic',
  methods: {
    async play () {
      gsap.set(this.$refs.logoBug, { opacity: 1 })
      await fadeIn(this.$refs.logoBug, 0.5)
    },
    async stop () {
      await fadeOut(this.$refs.logoBug, 0.5)
    }
  }
}
</script>

<style scoped>
#logo-bug {
  position: absolute;
  right: 3%;
  bottom: 3%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  opacity: 0;
}

#logo-bug img {
  width: 180px;
  height: auto;
}

#logo-bug span {
  font-family: var(--font-regular);
  font-size: 28px;
  color: var(--text-primary);
}
</style>
