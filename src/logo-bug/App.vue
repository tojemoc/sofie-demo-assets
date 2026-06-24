<template>
  <div id="app" class="fullframe">
    <logo-bug-graphic ref="graphic" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import LogoBugGraphic from './components/LogoBugGraphic.vue'

export default {
  name: 'LogoBugApp',
  components: { LogoBugGraphic },
  mounted () {
    bindCasparApi(this, {
      applyData: () => {},
      onDevAutoplay: () => {
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
