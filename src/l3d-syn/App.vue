<template>
  <div id="app" class="fullframe">
    <l3d-syn-graphic ref="graphic" :name="name" :role="role" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dSynGraphic from './components/L3dSynGraphic.vue'

export default {
  name: 'L3dSynApp',
  components: { L3dSynGraphic },
  data () {
    return { name: '', role: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.name !== undefined) this.name = data.name
        if (data.role !== undefined) this.role = data.role
      },
      onDevAutoplay: () => {
        this.name = 'Barbora Šišoláková'
        this.role = 'reportérka 360tky'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
