<template>
  <div class="sport-root">
    <div v-if="sourceLabel" id="source-pill" ref="sourcePill">{{ sourceLabel }}</div>
    <div id="bar" ref="bar">
      <div id="left-section">
        <div id="badge-row">
          <span id="badge-dot"></span>
          <span id="badge-label">ŠPORT</span>
        </div>
        <span id="headline">{{ headline }}</span>
      </div>
      <div id="right-section">
        <div id="logo-zone">
          <img id="logo-img" ref="logoImg" src="assets/logo-360.svg" alt="" />
          <div id="counter" ref="counter">{{ counterDisplay }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { slideBarIn, slideBarOut, fadeIn, fadeOut } from '../../shared/animations'

const COUNTER_TRIGGERS = [100, 200, 300]
const COUNTER_HOLD_MS = 9000

export default {
  name: 'L3dSportGraphic',
  props: {
    headline: { type: String, default: '' },
    source: { type: String, default: '' }
  },
  data () {
    return {
      elapsedSeconds: 0,
      counterInterval: null,
      counterTimeouts: [],
      showCounter: false
    }
  },
  computed: {
    sourceLabel () {
      if (!this.source || !String(this.source).trim()) return ''
      const s = String(this.source).trim()
      return s.toLowerCase().startsWith('zdroj:') ? s : `zdroj: ${s}`
    },
    counterDisplay () {
      const mins = Math.floor(this.elapsedSeconds / 60)
      const secs = this.elapsedSeconds % 60
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
  },
  methods: {
    clearTimers () {
      if (this.counterInterval) {
        clearInterval(this.counterInterval)
        this.counterInterval = null
      }
      this.counterTimeouts.forEach(id => clearTimeout(id))
      this.counterTimeouts = []
    },
    startSegmentTimer () {
      this.clearTimers()
      this.elapsedSeconds = 0
      this.showCounter = false
      gsap.set(this.$refs.logoImg, { opacity: 1 })
      gsap.set(this.$refs.counter, { opacity: 0, display: 'none' })

      this.counterInterval = setInterval(() => {
        this.elapsedSeconds += 1
      }, 1000)

      COUNTER_TRIGGERS.forEach(seconds => {
        const showId = setTimeout(() => this.swapToCounter(), seconds * 1000)
        const hideId = setTimeout(() => this.swapToLogo(), (seconds * 1000) + COUNTER_HOLD_MS)
        this.counterTimeouts.push(showId, hideId)
      })
    },
    async swapToCounter () {
      this.showCounter = true
      gsap.set(this.$refs.counter, { display: 'block' })
      await Promise.all([
        fadeOut(this.$refs.logoImg, 0.8),
        fadeIn(this.$refs.counter, 0.8)
      ])
    },
    async swapToLogo () {
      if (!this.showCounter) return
      this.showCounter = false
      await Promise.all([
        fadeOut(this.$refs.counter, 0.8),
        fadeIn(this.$refs.logoImg, 0.8)
      ])
      gsap.set(this.$refs.counter, { display: 'none' })
    },
    async play () {
      gsap.set(this.$refs.bar, { x: 0 })
      if (this.$refs.sourcePill) gsap.set(this.$refs.sourcePill, { opacity: 0 })

      this.startSegmentTimer()
      await slideBarIn(this.$refs.bar)

      if (this.$refs.sourcePill) {
        await fadeIn(this.$refs.sourcePill, 0.4)
      }
    },
    async stop () {
      this.clearTimers()

      if (this.$refs.sourcePill) {
        await fadeOut(this.$refs.sourcePill, 0.3)
      }
      await slideBarOut(this.$refs.bar)
    },
    async update (data) {
      await this.stop()
      if (data.headline !== undefined) this.$parent.headline = data.headline
      if (data.source !== undefined) this.$parent.source = data.source
      await this.$nextTick()
      await this.play()
    }
  },
  beforeDestroy () {
    this.clearTimers()
  }
}
</script>

<style scoped>
.sport-root {
  position: absolute;
  inset: 0;
}

#source-pill {
  position: absolute;
  top: 8%;
  right: 4%;
  padding: 6px 14px;
  background: var(--pill-bg);
  color: var(--text-primary);
  font-size: 14px;
  border-radius: var(--pill-radius);
  font-family: var(--font-regular);
}

#bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--bar-height-tall);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: var(--bar-bg);
  border-radius: var(--bar-radius);
}

#left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 3%;
  padding-right: 2%;
  min-width: 0;
}

#badge-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
}

#badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--brand-blue);
  margin-right: 8px;
  flex-shrink: 0;
}

#badge-label {
  font-family: var(--font-regular);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

#headline {
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 48px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#right-section {
  width: 22%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

#logo-zone {
  position: relative;
  width: 180px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#logo-img {
  width: 180px;
  height: auto;
}

#counter {
  position: absolute;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 38px;
  color: var(--text-primary);
  display: none;
  opacity: 0;
}
</style>
