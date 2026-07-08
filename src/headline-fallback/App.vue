<template>
  <div id="app" class="fullframe">
    <headline-fallback-graphic
      ref="graphic"
      :source="source"
      @source-updated="handleSourceUpdated"
    />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import HeadlineFallbackGraphic from './components/HeadlineFallbackGraphic.vue'

export default {
  name: 'HeadlineFallbackApp',
  components: { HeadlineFallbackGraphic },
  data () {
    return {
      source: ''
    }
  },
  methods: {
    handleSourceUpdated (nextSource) {
      this.source = nextSource
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.source !== undefined) this.source = data.source
      },
      onDevAutoplay: () => {
        this.source = 'TASR'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
