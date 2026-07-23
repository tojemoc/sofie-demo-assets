<template>
  <div id="app" class="fullframe">
    <headline-graphic
      ref="graphic"
      :source="source"
      @source-updated="source = $event"
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
      source: ''
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.source !== undefined) this.source = data.source
      },
      onDevAutoplay: () => {
        this.source = 'Úrad vlády SR'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
