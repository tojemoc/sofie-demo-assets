/**
 * Parse CasparCG / Sofie template update payloads.
 */
import { mergePendingData } from './caspar-bridge-pending.mjs'

export function parseCasparUpdate (data) {
  if (typeof data === 'string') {
    data = data.replace(
      /^(<templateData>|<componentData>|<data>)|(<\/templateData>|<\/componentData>|<\/data>)$/gi,
      ''
    )
    try {
      data = JSON.parse(decodeURIComponent(data))
    } catch (e) {
      try {
        data = JSON.parse(data)
      } catch (e2) {
        return null
      }
    }
  }

  if (!data || typeof data !== 'object') {
    return null
  }

  return data
}

/**
 * Bind window.play / stop / update for a Vue root with a graphic component ref.
 *
 * Caspar may invoke PLAY before UPDATE (or only send data once on UPDATE after ADD).
 * Cache the last payload and re-apply it on play() after Vue has flushed bindings.
 */
export function bindCasparApi (vm, { applyData, ref = 'graphic', onDevAutoplay }) {
  let pendingData = null

  const mergePending = data => {
    pendingData = mergePendingData(pendingData, data)
  }

  window.play = async () => {
    if (pendingData) {
      applyData(pendingData)
    }
    await vm.$nextTick()

    const graphic = vm.$refs[ref]
    if (graphic && graphic.play) {
      return graphic.play()
    }
    return Promise.resolve()
  }

  window.stop = () => {
    const graphic = vm.$refs[ref]
    if (graphic && graphic.stop) {
      return graphic.stop()
    }
    return Promise.resolve()
  }

  window.update = raw => {
    const data = parseCasparUpdate(raw)
    if (!data) return Promise.resolve()

    mergePending(data)

    const graphic = vm.$refs[ref]
    if (graphic && graphic.update) {
      return graphic.update(pendingData)
    }

    applyData(pendingData)
    return Promise.resolve()
  }

  window.next = () => {}

  if (onDevAutoplay && document.location.host === 'localhost:8080') {
    onDevAutoplay()
  }
}
