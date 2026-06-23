<template>
  <div class="weather-root">
    <video
      id="bg-loop"
      ref="bgLoop"
      src="media/360_loop.mp4"
      muted
      loop
      playsinline
      autoplay
    />
    <video
      id="map-mov"
      ref="mapMov"
      src="media/mapa.mov"
      muted
      playsinline
    />
    <video
      id="highlight-mov"
      ref="highlightMov"
      src="media/krajove-highlights.mov"
      muted
      playsinline
    />
    <div id="city-icons">
      <div
        v-for="city in orderedCities"
        :key="city.name"
        class="city-group"
        :style="cityPosition(city.name)"
      >
        <div class="icon-bg">
          <img :src="`icons/${city.condition}.svg`" :alt="city.condition" />
        </div>
        <div class="city-text">
          <div class="temp">{{ city.temp }}°C</div>
          <div class="city-name">{{ city.name }}</div>
        </div>
      </div>
    </div>
    <div id="source-pill" ref="sourcePill">zdroj: iMeteo.sk</div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { fadeIn, fadeOut } from '../../shared/animations'

const CITY_POSITIONS = {
  Bratislava: { left: '18%', top: '68%' },
  Trnava: { left: '22%', top: '62%' },
  Trenčín: { left: '28%', top: '50%' },
  Nitra: { left: '30%', top: '66%' },
  'B. Bystrica': { left: '42%', top: '56%' },
  Žilina: { left: '38%', top: '40%' },
  Prešov: { left: '72%', top: '46%' },
  Košice: { left: '78%', top: '60%' }
}

const STAGGER_ORDER = [
  'Bratislava',
  'Trnava',
  'Trenčín',
  'Nitra',
  'B. Bystrica',
  'Žilina',
  'Prešov',
  'Košice'
]

export default {
  name: 'WeatherGraphic',
  props: {
    cities: { type: Array, default: () => [] }
  },
  computed: {
    orderedCities () {
      const byName = {}
      this.cities.forEach(city => {
        byName[city.name] = city
      })
      return STAGGER_ORDER
        .map(name => byName[name])
        .filter(Boolean)
    }
  },
  methods: {
    cityPosition (name) {
      return CITY_POSITIONS[name] || { left: '50%', top: '50%' }
    },
    resetVideos () {
      const { mapMov, highlightMov } = this.$refs
      if (mapMov) {
        mapMov.pause()
        mapMov.currentTime = 0
      }
      if (highlightMov) {
        highlightMov.pause()
        highlightMov.currentTime = 0
      }
    },
    async play () {
      this.resetVideos()
      gsap.set('.city-group', { scale: 0, opacity: 0 })
      gsap.set(this.$refs.sourcePill, { opacity: 0 })

      const mapMov = this.$refs.mapMov
      const highlightMov = this.$refs.highlightMov

      if (mapMov) {
        mapMov.currentTime = 0
        await mapMov.play()
      }

      await new Promise(resolve => setTimeout(resolve, 1200))

      if (highlightMov) {
        highlightMov.currentTime = 0
        highlightMov.play()
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      await new Promise(resolve => {
        gsap.from('.city-group', {
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'back.out(1.7)',
          stagger: 0.12,
          transformOrigin: 'center center',
          onComplete: resolve
        })
      })

      await new Promise(resolve => setTimeout(resolve, 200))
      await fadeIn(this.$refs.sourcePill, 0.4)
    },
    async stop () {
      await new Promise(resolve => {
        gsap.to('.city-group', {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'back.in(1.7)',
          stagger: {
            each: 0.12,
            from: 'end'
          },
          transformOrigin: 'center center',
          onComplete: resolve
        })
      })

      await fadeOut(this.$refs.sourcePill, 0.3)
    },
    async update (data) {
      if (data.cities) {
        this.$parent.cities = data.cities.map(city => ({ ...city }))
      }
    }
  }
}
</script>

<style scoped>
.weather-root {
  position: absolute;
  inset: 0;
  background: #081028;
}

#bg-loop,
#map-mov,
#highlight-mov {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#map-mov {
  z-index: 1;
}

#highlight-mov {
  z-index: 2;
}

#city-icons {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.city-group {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  transform-origin: center center;
}

.icon-bg {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  background: var(--brand-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-bg img {
  width: 56px;
  height: 56px;
}

.city-text {
  display: flex;
  flex-direction: column;
}

.temp {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 52px;
  color: var(--text-primary);
  line-height: 1;
}

.city-name {
  font-family: var(--font-regular);
  font-size: 20px;
  color: var(--text-primary);
  margin-top: 4px;
}

#source-pill {
  position: absolute;
  top: 8%;
  right: 4%;
  z-index: 4;
  padding: 6px 14px;
  background: var(--pill-bg);
  color: var(--text-primary);
  font-size: 14px;
  border-radius: var(--pill-radius);
  opacity: 0;
}
</style>
