<template>
  <div id="app" class="fullframe">
    <mod-l3d
      ref="graphic"
      :name="name"
      :missing-name="missingName"
    />
  </div>
</template>

<script>
import '../assets/casparcg.css'
import '../assets/spravy.css'
import { bindCasparApi } from '../assets/casparBridge.js'
import modL3d from './components/modL3d.vue'

export default {
  name: 'app',
  components: { modL3d },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    missingName () {
      return !this.name || !String(this.name).trim()
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        this.name = data.name != null ? data.name : (data.f0 || '')
      },
      onDevAutoplay: () => {
        this.name = 'Gabriela Kajtárová'
        this.$refs.graphic.play()
      }
    })
  }
}
</script>
