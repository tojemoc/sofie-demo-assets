<template>
  <div id="app" class="fullframe">
    <jednou-vetou-shell
      ref="graphic"
      :headline="headline"
      :show-kicker="false"
    />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import JednouVetouShell from '../shared/figma-l3d/JednouVetouShell.vue'

export default {
  name: 'L3dOdporucanieApp',
  components: { JednouVetouShell },
  data () {
    return { headline: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        const next = [data.headline, data.Headline, data.title, data.titulok, data.f1].find((v) => v !== undefined)
        if (next !== undefined) this.headline = next
      },
      onDevAutoplay: () => {
        this.headline = 'Sledujte na www.360tka.sk'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
