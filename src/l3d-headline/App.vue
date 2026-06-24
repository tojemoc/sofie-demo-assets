<template>
  <div id="app" class="fullframe">
    <l3d-headline-graphic
      ref="graphic"
      :title="title"
      :subtitle="subtitle"
    />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dHeadlineGraphic from './components/L3dHeadlineGraphic.vue'

export default {
  name: 'L3dHeadlineApp',
  components: { L3dHeadlineGraphic },
  data () {
    return {
      title: '',
      subtitle: ''
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.title !== undefined) this.title = data.title
        if (data.subtitle !== undefined) this.subtitle = data.subtitle
      },
      onDevAutoplay: () => {
        this.title = 'Premiér vysvetľoval'
        this.subtitle = 'zárobky syna'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
