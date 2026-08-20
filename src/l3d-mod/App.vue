<template>
  <div id="app" class="fullframe">
    <l3d-predstavovak-graphic ref="graphic" :name="name" :title="title" />
  </div>
</template>

<script>
/**
 * Moderátor L3D — same Figma predstavovak shell (name + title).
 * Prefer piece type `l3d-predstavovak` for new rundowns; `l3d-mod` kept for ingest compat.
 */
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import L3dPredstavovakGraphic from '../l3d-predstavovak/components/L3dPredstavovakGraphic.vue'

export default {
  name: 'L3dModApp',
  components: { L3dPredstavovakGraphic },
  data () {
    return { name: '', title: '' }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        const nextName = [data.name, data.Name, data.meno, data.f0].find((v) => v !== undefined)
        const nextTitle = [data.title, data.Title, data.titulok, data.f1].find((v) => v !== undefined)
        if (nextName !== undefined) this.name = nextName
        if (nextTitle !== undefined) this.title = nextTitle
      },
      onDevAutoplay: () => {
        this.name = 'Michal Kovačič'
        this.title = 'moderátor'
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
