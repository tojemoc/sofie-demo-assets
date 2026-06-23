/**
 * Parse CasparCG / Sofie template update payloads.
 */
export function parseCasparUpdate (data) {
  if (typeof data === 'string') {
    data = data.replace(
      /^(<templateData>|<componentData>|<data>)|(<\/templateData>|<\/componentData>|<\/data>)$/gi,
      ''
    )
    try {
      data = JSON.parse(decodeURI(data))
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
 */
export function bindCasparApi (vm, { applyData, ref = 'graphic', onDevAutoplay }) {
  window.play = () => {
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

    const graphic = vm.$refs[ref]
    if (graphic && graphic.update) {
      return graphic.update(data)
    }

    applyData(data)
    return Promise.resolve()
  }

  window.next = () => {}

  if (onDevAutoplay && document.location.host === 'localhost:8080') {
    onDevAutoplay()
  }
}
