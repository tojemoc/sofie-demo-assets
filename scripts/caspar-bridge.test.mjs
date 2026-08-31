import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergePendingData } from '../src/shared/caspar-bridge-pending.mjs'
import { bindCasparApi, parseCasparUpdate } from '../src/shared/caspar-bridge.js'

test('mergePendingData: title-only maps to headline', () => {
  const pending = mergePendingData(null, { title: 'Téma' })
  assert.equal(pending.headline, 'Téma')
  assert.equal(pending.title, undefined)
})

test('mergePendingData: headline then title — title wins', () => {
  let pending = mergePendingData(null, { headline: 'First' })
  pending = mergePendingData(pending, { title: 'Second' })
  assert.equal(pending.headline, 'Second')
  assert.equal(pending.title, undefined)
})

test('mergePendingData: preserves unrelated fields', () => {
  let pending = mergePendingData(null, { headline: 'A', foo: 'bar' })
  pending = mergePendingData(pending, { title: 'B' })
  assert.equal(pending.headline, 'B')
  assert.equal(pending.foo, 'bar')
})

test('mergePendingData: can preserve title for nameplate templates', () => {
  const pending = mergePendingData(null, { meno: 'Meno', title: 'Pozicia' }, { titleAlias: false })
  assert.equal(pending.meno, 'Meno')
  assert.equal(pending.title, 'Pozicia')
  assert.equal(pending.headline, undefined)
})

test('mergePendingData: headline wins when both aliases appear in one payload', () => {
  const pending = mergePendingData(null, { headline: 'Headline', title: 'Title' })
  assert.equal(pending.headline, 'Headline')
  assert.equal(pending.title, undefined)
})

test('mergePendingData: l3d-headline title+subtitle', () => {
  const pending = mergePendingData(null, { title: 'Headline', subtitle: 'Subline' })
  assert.equal(pending.headline, 'Headline')
  assert.equal(pending.subtitle, 'Subline')
  assert.equal(pending.title, undefined)
})

test('bindCasparApi: update with graphic.update skips applyData until play', async () => {
  const order = []
  let playing = false

  const graphic = {
    async play () {
      playing = true
      order.push('graphic.play')
    },
    async stop () {
      playing = false
      order.push('graphic.stop')
    },
    async update (data) {
      order.push('graphic.update:start')
      assert.equal(playing, true, 'expected active playback before update')
      await this.stop()
      order.push('graphic.update:after-stop')
      if (data.headline !== undefined) vm.headline = data.headline
      await vm.$nextTick()
      await this.play()
      order.push('graphic.update:done')
    }
  }

  const vm = {
    headline: 'initial',
    $refs: { graphic },
    $nextTick: () => Promise.resolve()
  }

  global.window = {}
  bindCasparApi(vm, {
    applyData: () => {
      order.push('applyData')
    }
  })

  await graphic.play()
  assert.deepEqual(order, ['graphic.play'])

  await window.update({ headline: 'Live' })

  assert.deepEqual(order, [
    'graphic.play',
    'graphic.update:start',
    'graphic.stop',
    'graphic.update:after-stop',
    'graphic.play',
    'graphic.update:done'
  ])
  assert.ok(!order.includes('applyData'), 'applyData must not run during graphic.update')

  order.length = 0
  await window.play()
  assert.deepEqual(order, ['applyData', 'graphic.play'])
  assert.equal(vm.headline, 'Live')
})

test('bindCasparApi: headline then title then play replays canonical headline', async () => {
  const updatePayloads = []
  const graphic = {
    play: async () => {},
    stop: async () => {},
    async update (data) {
      updatePayloads.push({ ...data })
    }
  }

  const vm = {
    headline: '',
    $refs: { graphic },
    $nextTick: () => Promise.resolve()
  }

  global.window = {}
  bindCasparApi(vm, {
    applyData: data => {
      if (data.headline !== undefined) vm.headline = data.headline
    }
  })

  await window.update({ headline: 'First', guest: 'A' })
  assert.equal(vm.headline, '', 'parent unchanged before play when graphic.update exists')
  assert.deepEqual(updatePayloads[0], { headline: 'First', guest: 'A' })

  await window.update({ title: 'Second' })
  assert.equal(vm.headline, '')
  assert.deepEqual(
    updatePayloads[1],
    { headline: 'Second', guest: 'A' },
    'graphic.update receives the full cached payload, not only the newest field'
  )

  await window.play()
  assert.equal(vm.headline, 'Second')
})

test('parseCasparUpdate: parses CasparCG XML componentData', () => {
  const payload = '<templateData><componentData id="meno"><data value="Jana Novakova" /></componentData><componentData id="pozicia"><data value="Ministerka" /></componentData></templateData>'
  assert.deepEqual(parseCasparUpdate(payload), {
    meno: 'Jana Novakova',
    pozicia: 'Ministerka'
  })
})

test('bindCasparApi: titleAlias false keeps title as position', async () => {
  const vm = {
    name: '',
    title: '',
    $refs: {},
    $nextTick: () => Promise.resolve()
  }

  global.window = {}
  bindCasparApi(vm, {
    titleAlias: false,
    applyData: data => {
      if (data.meno !== undefined) vm.name = data.meno
      if (data.title !== undefined) vm.title = data.title
    }
  })

  await window.update({ meno: 'Jana Novakova', title: 'Hovorkyna' })
  await window.play()

  assert.equal(vm.name, 'Jana Novakova')
  assert.equal(vm.title, 'Hovorkyna')
})
