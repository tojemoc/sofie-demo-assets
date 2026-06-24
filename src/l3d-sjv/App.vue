<template>
  <div id="app" class="fullframe">
    <l3d-sjv-graphic ref="graphic" :headline="headline" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dSjvGraphic from './components/L3dSjvGraphic.vue'

export default {
  name: 'L3dSjvApp',
  components: { L3dSjvGraphic },
  data () {
    return { headline: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.headline !== undefined) this.headline = data.headline
      },
      onDevAutoplay: () => {
        this.headline = 'Výzva prezidentovi'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
