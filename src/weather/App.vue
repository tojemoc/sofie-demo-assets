<template>
  <div id="app" class="fullframe">
    <weather-graphic ref="graphic" :cities="cities" />
  </div>
</template>

<script>
import '../shared/base.css'
import { bindCasparApi } from '../shared/caspar-bridge'
import WeatherGraphic from './components/WeatherGraphic.vue'

const SAMPLE_CITIES = [
  { name: 'Bratislava', temp: '21', condition: 'partly-cloudy' },
  { name: 'Trnava', temp: '20', condition: 'partly-cloudy' },
  { name: 'Trenčín', temp: '18', condition: 'partly-cloudy' },
  { name: 'Nitra', temp: '19', condition: 'partly-cloudy' },
  { name: 'B. Bystrica', temp: '18', condition: 'cloudy' },
  { name: 'Žilina', temp: '17', condition: 'rain' },
  { name: 'Prešov', temp: '19', condition: 'partly-cloudy' },
  { name: 'Košice', temp: '19', condition: 'partly-cloudy' }
]

export default {
  name: 'WeatherApp',
  components: { WeatherGraphic },
  data () {
    return { cities: [] }
  },
  mounted () {
    bindCasparApi(this, {
      applyData: data => {
        if (data.cities) this.cities = data.cities
      },
      onDevAutoplay: () => {
        this.cities = SAMPLE_CITIES
        this.$nextTick(() => this.$refs.graphic.play())
      }
    })
  }
}
</script>
