<template>
  <div id="app" class="fullframe">
    <outro-graphic ref="graphic" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import OutroGraphic from './components/OutroGraphic.vue'

export default {
  name: 'OutroApp',
  components: { OutroGraphic },
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
