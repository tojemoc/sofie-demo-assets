<template>
  <div id="logo-bug" ref="logoBug" aria-label="360° sekúnd">
    <img :src="markSrc" alt="" aria-hidden="true" class="logo-bug__mark" />
    <img :src="wordSrc" alt="" aria-hidden="true" class="logo-bug__word" />
  </div>
</template>

<script>
import { fadeIn, fadeOut } from '../../shared/animations'

export default {
  name: 'LogoBugGraphic',
  data () {
    return {
      markSrc: '../assets/logo-bug-360-mark.svg',
      wordSrc: '../assets/logo-bug-sekund.svg'
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
  gap: 10px;
  opacity: 0;
}

.logo-bug__mark {
  width: 120px;
  height: auto;
}

.logo-bug__word {
  width: 139px;
  height: auto;
}
</style>
