<template>
  <div class="titlesafe left mod-l3d-root">
    <div v-if="missingName" class="data-warning">Missing name</div>
    <div class="mod-bar" ref="bar">
      <span class="mod-dot" />
      <span class="mod-name" ref="name">{{ name }}</span>
    </div>
  </div>
</template>

<script>
import { TimelineLite, Power2, Power4 } from 'gsap'

export default {
  props: {
    name: { type: String, default: '' },
    missingName: { type: Boolean, default: false }
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
    const bar = this.$refs.bar

    this.timelineIntro = new TimelineLite({ paused: true })
    this.timelineIntro.fromTo(bar, 0.5, {
      marginLeft: '-40vw',
      opacity: 0
    }, {
      marginLeft: '0',
      opacity: 1,
      ease: Power2.easeOut
    })

    this.timelineOutro = new TimelineLite({ paused: true })
    this.timelineOutro.to(bar, 0.4, {
      marginLeft: '-40vw',
      opacity: 0,
      ease: Power4.easeIn
    })
  }
}
</script>

<style scoped>
.mod-l3d-root {
  bottom: 8vh;
}

.mod-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.8vw;
  padding: 0.55vw 1.4vw 0.55vw 0.9vw;
  background: var(--spravy-bar-bg);
  border-radius: 0.45vw;
  box-shadow: inset 0 1px 0 var(--spravy-bar-highlight);
  margin-left: 0;
  max-width: 70vw;
}

.mod-dot {
  flex: 0 0 1.1vw;
  width: 1.1vw;
  height: 1.1vw;
  border-radius: 50%;
  background: var(--spravy-dot-blue);
}

.mod-name {
  color: var(--spravy-text);
  font-size: 2vw;
  font-weight: 700;
  line-height: 1.2;
}
</style>
