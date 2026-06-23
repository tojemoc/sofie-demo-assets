<template>
  <div id="app" class="fullframe">
    <l3d-two-name
      v-if="f2 || f3"
      ref="graphic"
      :f0="f0"
      :f1="f1"
      :f2="f2"
      :f3="f3"
    />
    <l3d v-else ref="graphic" :f0="f0" :f1="f1" />
  </div>
</template>

<script>
import '../assets/casparcg.css'
import { bindCasparApi } from '../assets/casparBridge.js'
import l3d from './components/l3d.vue'
import l3dTwoName from './components/l3dTwoName.vue'

export default {
  name: 'app',
  components: {
    l3d,
    l3dTwoName
  },
  data () {
    return {
      f0: '',
      f1: '',
      f2: undefined,
      f3: undefined
    }
  },
  mounted () {
    bindCasparApi(this, {
      ref: 'graphic',
      applyData: data => {
        // Sofie demo blueprints send name + description; keep f0/f1 for manual testing.
        this.f0 = data.name != null ? data.name : (data.f0 || '')
        this.f1 = data.description != null ? data.description : (data.f1 || '')
        this.f2 = data.f2
        this.f3 = data.f3
      },
      onDevAutoplay: () => {
        this.f0 = 'Gabriela Kajtárová'
        this.f1 = 'Moderátorka'
        this.$refs.graphic.play()
      }
    })
  }
}
</script>
