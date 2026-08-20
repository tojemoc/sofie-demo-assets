<template>
  <div id="app" class="fullframe">
    <jednou-vetou-shell
      ref="graphic"
      :kicker="kicker"
      :headline="headline"
      :show-kicker="true"
    />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import JednouVetouShell from '../shared/figma-l3d/JednouVetouShell.vue'

export default {
  name: 'L3dSjvApp',
  components: { JednouVetouShell },
  data () {
    return {
      kicker: 'SPRÁVY JEDNOU VETOU',
      headline: ''
    }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        const nextKicker = [data.kicker, data.Kicker, data.rubrika, data.label, data.f0].find((v) => v !== undefined)
        const nextHeadline = [data.headline, data.Headline, data.title, data.titulok, data.f1].find((v) => v !== undefined)
        if (nextKicker !== undefined) this.kicker = nextKicker
        if (nextHeadline !== undefined) this.headline = nextHeadline
      },
      onDevAutoplay: () => {
        this.kicker = 'SPRÁVY JEDNOU VETOU'
        this.headline = 'Kamenický o konsolidácií Slovenska'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
