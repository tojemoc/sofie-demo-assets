<template>
  <div id="app" class="fullframe">
    <l3d-tema-graphic ref="graphic" :headline="headline" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dTemaGraphic from './components/L3dTemaGraphic.vue'

export default {
  name: 'L3dTemaApp',
  components: { L3dTemaGraphic },
  data () {
    return { headline: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.headline !== undefined) this.headline = data.headline
      },
      onDevAutoplay: () => {
        this.headline = 'R. Fico o M. Ficovi'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
