<template>
  <div id="app" class="fullframe">
    <head-spravy
      ref="graphic"
      :title="title"
      :subtitle="subtitle"
      :source="source"
      :ilu-file="iluFile"
      :missing-fields="missingFields"
    />
  </div>
</template>

<script>
import '../assets/casparcg.css'
import '../assets/spravy.css'
import { bindCasparApi } from '../assets/casparBridge.js'
import headSpravy from './components/headSpravy.vue'

export default {
  name: 'app',
  components: { headSpravy },
  data () {
    return {
      title: '',
      subtitle: '',
      source: '',
      iluFile: ''
    }
  },
  computed: {
    missingFields () {
      const missing = []
      if (!this.title || !String(this.title).trim()) missing.push('title')
      if (!this.subtitle || !String(this.subtitle).trim()) missing.push('subtitle')
      return missing
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        this.title = data.title != null ? data.title : (data.f0 || '')
        this.subtitle = data.subtitle != null ? data.subtitle : (data.f1 || '')
        this.source = data.source != null ? data.source : (data.f2 || '')
        this.iluFile = data.iluFile != null ? data.iluFile : (data.fileName || '')
      },
      onDevAutoplay: () => {
        this.title = 'Prorastové opatrenia'
        this.subtitle = 'opäť meškajú'
        this.source = 'Úrad vlády'
        this.iluFile = ''
        this.$refs.graphic.play()
      }
    })
  }
}
</script>
