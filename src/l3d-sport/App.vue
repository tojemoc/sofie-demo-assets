<template>
  <div id="app" class="fullframe">
    <l3d-sport-graphic ref="graphic" :headline="headline" :source="source" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dSportGraphic from './components/L3dSportGraphic.vue'

export default {
  name: 'L3dSportApp',
  components: { L3dSportGraphic },
  data () {
    return { headline: '', source: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.headline !== undefined) this.headline = data.headline
        if (data.source !== undefined) this.source = data.source
      },
      onDevAutoplay: () => {
        this.headline = 'Pokračuje boj o Stanley cup'
        this.source = 'FB/Carolina Hurricanes'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
