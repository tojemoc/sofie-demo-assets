<template>
  <div class="titlesafe left head-spravy-root" ref="root">
    <div v-if="missingFields.length" class="data-warning">
      Missing: {{ missingFields.join(', ') }}
    </div>

    <div class="ilu-frame" ref="iluFrame">
      <div class="ilu-placeholder">
        <span v-if="iluFile">{{ iluFile }}</span>
        <span v-else>ILU video</span>
      </div>
      <div v-if="sourceLabel" class="source-pill">{{ sourceLabel }}</div>
    </div>

    <div class="headlines" ref="headlines">
      <div v-if="title" class="headline title">{{ title }}</div>
      <div v-if="subtitle" class="headline subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script>
import { TimelineLite, Power2, Power4 } from 'gsap'

export default {
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    source: { type: String, default: '' },
    iluFile: { type: String, default: '' },
    missingFields: { type: Array, default: () => [] }
  },
  computed: {
    sourceLabel () {
      if (!this.source || !String(this.source).trim()) return ''
      const s = String(this.source).trim()
      return s.toLowerCase().startsWith('zdroj:') ? s : `zdroj: ${s}`
    }
  },
  data () {
    return {
      timelineIntro: null,
      timelineOutro: null
    }
  },
  methods: {
    play () {
      this.timelineIntro.seek(0)
      this.timelineIntro.play()
    },
    stop () {
      this.timelineOutro.seek(0)
      this.timelineOutro.play()
    },
    preview () {
      this.timelineIntro.progress(1)
    }
  },
  mounted () {
    const { iluFrame, headlines } = this.$refs

    this.timelineIntro = new TimelineLite({ paused: true })
    this.timelineIntro.fromTo(iluFrame, 0.7, {
      x: '-8vw',
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      ease: Power2.easeOut
    })
    this.timelineIntro.fromTo(headlines, 0.5, {
      y: '3vw',
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      ease: Power2.easeOut
    }, '-=0.3')

    this.timelineOutro = new TimelineLite({ paused: true })
    this.timelineOutro.to(headlines, 0.35, { opacity: 0, ease: Power2.easeIn })
    this.timelineOutro.to(iluFrame, 0.5, { x: '-8vw', opacity: 0, ease: Power4.easeIn }, '-=0.15')
  }
}
</script>

<style scoped>
.head-spravy-root {
  /* Stub layout — replace with annotated screenshot measurements */
}

.ilu-frame {
  position: fixed;
  left: 5vw;
  top: 14vh;
  width: 62vw;
  height: 52vh;
  border-radius: 1.2vw;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.35);
}

.ilu-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 1.6vw;
}

.source-pill {
  position: absolute;
  top: 1vh;
  right: 1vw;
  padding: 0.35em 0.7em;
  background: var(--spravy-source-bg);
  color: #fff;
  font-size: 1.1vw;
  border-radius: 0.35vw;
}

.headlines {
  position: fixed;
  left: 5vw;
  bottom: 10vh;
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  max-width: 58vw;
}

.headline {
  display: inline-block;
  padding: 0.45em 0.9em;
  background: var(--spravy-headline-bg);
  color: var(--spravy-text);
  font-weight: 700;
  border-radius: 0.4vw;
  font-size: 2.2vw;
}

.headline.subtitle {
  font-size: 2vw;
  align-self: flex-start;
}
</style>
