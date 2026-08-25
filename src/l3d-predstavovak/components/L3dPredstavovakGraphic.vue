<template>
  <main id="template" class="stage" :class="stageClass" ref="stage">
    <div class="panel">
      <span class="panel-fill panel-fill-left"></span>
      <span class="panel-fill panel-fill-right"></span>
    </div>
    <div class="dot"></div>
    <p id="name" class="name" ref="nameEl">{{ name }}</p>
    <p id="title" class="title" ref="titleEl">{{ title }}</p>
  </main>
</template>

<script>
/**
 * Figma 613:1344 — port of sofie/spravy_360_predstavovak.
 * Topic / guest nameplate (name + title) for DoubleBox and MOD moments.
 */
export default {
  name: 'L3dPredstavovakGraphic',
  props: {
    name: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  data () {
    return { stageClass: '' }
  },
  watch: {
    name () { this.$nextTick(() => this.fitAll()) },
    title () { this.$nextTick(() => this.fitAll()) }
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
      this.fitText(this.$refs.nameEl, 64, 34)
      this.fitText(this.$refs.titleEl, 42, 24)
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
      const nextName = [data.meno, data.name, data.Name, data.f0].find((v) => v !== undefined)
      const nextTitle = [
        data.pozicia,
        data.pozícia,
        data.position,
        data.title,
        data.Title,
        data.titulok,
        data.funkcia,
        data.f1
      ].find((v) => v !== undefined)
      if (nextName !== undefined) this.$parent.name = nextName
      if (nextTitle !== undefined) this.$parent.title = nextTitle
      await this.$nextTick()
      this.fitAll()
    }
  }
}
</script>

<style>
@font-face {
  font-family: "Bauplan";
  font-style: normal;
  font-weight: 900;
  src: local("Bauplan Heavy"), local("Bauplan-Heavy"), local("Bauplan");
}
@font-face {
  font-family: "Diform";
  font-style: normal;
  font-weight: 400;
  src: local("Diform Regular"), local("Diform-Regular"), local("Diform");
}
.stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
.stage.is-playing {
  animation: l3d-predstavovak-in 420ms cubic-bezier(.16, 1, .3, 1) both;
}
.stage.is-stopping {
  animation: l3d-predstavovak-out 280ms cubic-bezier(.7, 0, .84, 0) both;
}
.panel {
  position: absolute;
  left: 46px;
  top: 847px;
  width: 1620px;
  height: 160px;
  border-radius: 20px;
  background: transparent;
  box-shadow:
    inset 0 0 0 1000px rgba(0, 0, 0, .4),
    0 4px 10px rgba(0, 0, 0, .8),
    0 0 26px rgba(0, 0, 0, .35),
    inset 0 1px 1px rgba(255, 255, 255, .5),
    inset 0 0 32px rgba(255, 255, 255, .03);
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.panel-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .045), rgba(255, 255, 255, 0) 28%),
    rgba(0, 0, 0, .4);
}
.panel-fill-left {
  left: 0;
  border-radius: 20px 0 0 20px;
}
.panel-fill-right {
  right: 0;
  border-radius: 0 20px 20px 0;
}
.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(ellipse at 15% 0%, rgba(255, 255, 255, .12), transparent 42%),
    radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, .34), transparent 58%);
  pointer-events: none;
}
.panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: .18;
  background-image:
    radial-gradient(circle at 17% 32%, rgba(255, 255, 255, .13) 0 .8px, transparent .9px),
    radial-gradient(circle at 71% 64%, rgba(0, 0, 0, .3) 0 .9px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .035), transparent 28%, rgba(0, 0, 0, .08));
  background-size: 4px 4px, 5px 5px, 100% 100%;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.dot {
  position: absolute;
  left: 80px;
  top: 878px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 28%, rgba(255, 255, 255, .18), transparent 34%),
    #2c7dff;
  box-shadow: 0 0 10px rgba(44, 125, 255, .22);
  pointer-events: none;
  user-select: none;
}
.name,
.title {
  position: absolute;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  letter-spacing: 0;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  font-kerning: normal;
  font-feature-settings: "kern" 1;
}
.name {
  left: 140px;
  top: 872px;
  width: 1440px;
  height: 76px;
  font-family: "Bauplan", "Arial Black", Arial, Helvetica, sans-serif;
  font-size: 64px;
  font-weight: 900;
  line-height: 76px;
}
.title {
  left: 80px;
  top: 930px;
  width: 1450px;
  height: 54px;
  font-family: "Diform", Arial, Helvetica, sans-serif;
  font-size: 42px;
  font-weight: 400;
  line-height: 50px;
}
@keyframes l3d-predstavovak-in {
  from { opacity: 0; transform: translate3d(-36px, 18px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes l3d-predstavovak-out {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to { opacity: 0; transform: translate3d(-36px, 18px, 0); }
}
</style>
