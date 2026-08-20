<template>
  <main id="template" class="stage" :class="stageClass" ref="stage">
    <div class="panel"></div>
    <template v-if="showKicker">
      <div class="kicker-box"></div>
      <div class="kicker-dot"></div>
      <p id="kicker" class="kicker" ref="kickerEl">{{ kicker }}</p>
    </template>
    <p id="headline" class="headline" ref="headlineEl">{{ headline }}</p>
  </main>
</template>

<script>
/**
 * Shared shell from sofie/spravy_360_jednou_vetou (Figma 613:1216).
 * Used by l3d-sjv (kicker on), l3d-sport (kicker=ŠPORT), l3d-odporucanie (kicker off).
 */
export default {
  name: 'JednouVetouShell',
  props: {
    kicker: { type: String, default: 'SPRÁVY JEDNOU VETOU' },
    headline: { type: String, default: '' },
    showKicker: { type: Boolean, default: true }
  },
  data () {
    return { stageClass: '' }
  },
  watch: {
    kicker () { this.$nextTick(() => this.fitAll()) },
    headline () { this.$nextTick(() => this.fitAll()) },
    showKicker () { this.$nextTick(() => this.fitAll()) }
  },
  mounted () {
    this.fitAll()
  },
  methods: {
    fitText (element, maxSize, minSize) {
      if (!element) return
      element.style.fontSize = maxSize + 'px'
      let size = maxSize
      while (element.scrollWidth > element.clientWidth && size > minSize) {
        size -= 1
        element.style.fontSize = size + 'px'
      }
    },
    fitAll () {
      if (this.showKicker) this.fitText(this.$refs.kickerEl, 28, 18)
      this.fitText(this.$refs.headlineEl, 86, 48)
    },
    play () {
      this.stageClass = ''
      this.$nextTick(() => {
        void this.$refs.stage.offsetWidth
        this.stageClass = 'is-playing'
        this.fitAll()
      })
      return Promise.resolve()
    },
    stop () {
      this.stageClass = 'is-stopping'
      return Promise.resolve()
    },
    async update (data) {
      const nextKicker = [data.kicker, data.Kicker, data.rubrika, data.label, data.f0].find((v) => v !== undefined)
      const nextHeadline = [data.headline, data.Headline, data.title, data.titulok, data.f1].find((v) => v !== undefined)
      if (nextKicker !== undefined && this.$parent.kicker !== undefined) {
        this.$parent.kicker = nextKicker
      }
      if (nextHeadline !== undefined) {
        this.$parent.headline = nextHeadline
      }
      if (data.source !== undefined && this.$parent.source !== undefined) {
        this.$parent.source = data.source
      }
      await this.$nextTick()
      this.fitAll()
    }
  }
}
</script>

<style>
.stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.stage.is-playing {
  animation: jednou-vetou-in 420ms cubic-bezier(.16, 1, .3, 1) both;
}
.stage.is-stopping {
  animation: jednou-vetou-out 280ms cubic-bezier(.7, 0, .84, 0) both;
}
.panel {
  position: absolute;
  left: 40px;
  top: 847px;
  width: 1626px;
  height: 160px;
  border-radius: 20px;
  overflow: hidden;
  background: transparent;
  filter: blur(.5px);
  box-shadow:
    inset 0 0 0 1000px rgba(0, 0, 0, .4),
    0 4px 10px rgba(0, 0, 0, .8),
    0 0 26px rgba(0, 0, 0, .35),
    inset 0 2px 1px rgba(255, 255, 255, .5),
    inset 0 0 32px rgba(255, 255, 255, .03);
  pointer-events: none;
  user-select: none;
}
.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .055), rgba(255, 255, 255, 0) 30%),
    radial-gradient(ellipse at 16% 0%, rgba(255, 255, 255, .1), transparent 42%),
    radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, .34), transparent 58%);
  pointer-events: none;
}
.panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: .16;
  background-image:
    radial-gradient(circle at 17% 32%, rgba(255, 255, 255, .12) 0 .8px, transparent .9px),
    radial-gradient(circle at 71% 64%, rgba(0, 0, 0, .3) 0 .9px, transparent 1px);
  background-size: 4px 4px, 5px 5px;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.kicker-box {
  position: absolute;
  left: 80px;
  top: 803px;
  width: 395px;
  height: 44px;
  border-radius: 0 0 10px 10px;
  background: rgba(255, 255, 255, .8);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, .5);
  pointer-events: none;
  user-select: none;
}
.kicker-dot {
  position: absolute;
  left: 100px;
  top: 825px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, .2), transparent 34%),
    #2c7dff;
  box-shadow: 0 0 8px rgba(44, 125, 255, .22);
  transform: translateY(-50%);
  pointer-events: none;
  user-select: none;
}
.kicker,
.headline {
  position: absolute;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  font-kerning: normal;
  font-feature-settings: "kern" 1;
}
.kicker {
  left: 129px;
  top: 808px;
  width: 330px;
  height: 34px;
  color: #000;
  font-family: "Diform", Arial, Helvetica, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  text-transform: uppercase;
}
.headline {
  left: 80px;
  top: 883px;
  width: 1566px;
  height: 104px;
  color: #fff;
  font-family: "Bauplan", "Arial Black", Arial, Helvetica, sans-serif;
  font-size: 86px;
  font-weight: 900;
  line-height: 104px;
}
@keyframes jednou-vetou-in {
  from { opacity: 0; transform: translate3d(-40px, 18px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes jednou-vetou-out {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to { opacity: 0; transform: translate3d(-40px, 18px, 0); }
}
</style>
