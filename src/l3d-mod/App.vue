<template>
  <div id="app" class="fullframe">
    <l3d-mod-graphic ref="graphic" :name="name" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dModGraphic from './components/L3dModGraphic.vue'

export default {
  name: 'L3dModApp',
  components: { L3dModGraphic },
  data () {
    return { name: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.name !== undefined) this.name = data.name
      },
      onDevAutoplay: () => {
        this.name = 'Michal Kovačič'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
