<template>
  <div id="logo-bug" ref="logoBug" aria-label="360° sekúnd">
    <img :src="logoSrc" alt="" aria-hidden="true" />
    <span aria-hidden="true">sekúnd</span>
  </div>
</template>

<script>
import { fadeIn, fadeOut } from '../../shared/animations'

export default {
  name: 'LogoBugGraphic',
  data () {
    return {
      logoSrc: '../assets/logo-360.svg'
    }
  },
  methods: {
    async play () {
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
