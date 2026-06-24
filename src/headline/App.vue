<template>
  <div id="app" class="fullframe">
    <headline-graphic
      ref="graphic"
      :ilu-file="iluFile"
      :source="source"
    />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import HeadlineGraphic from './components/HeadlineGraphic.vue'

export default {
  name: 'HeadlineApp',
  components: { HeadlineGraphic },
  data () {
    return {
      iluFile: '',
      source: ''
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.iluFile !== undefined) this.iluFile = data.iluFile
        if (data.source !== undefined) this.source = data.source
      },
      onDevAutoplay: () => {
        this.iluFile = 'clips/premiera.mp4'
        this.source = 'Úrad vlády SR'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
