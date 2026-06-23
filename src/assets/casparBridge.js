/**
 * Parse CasparCG / Sofie template update payloads.
 * Accepts JSON objects or legacy XML-wrapped / URI-encoded strings.
 */
export function parseCasparUpdateData (data) {
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
 * Bind window.play / stop / update / preview / next for a Vue root component.
 *
 * @param {Vue} vm - root Vue instance with $refs.graphic
 * @param {object} options
 * @param {function(object): void} options.applyData - map parsed payload onto vm state
 * @param {string} [options.ref='graphic'] - $refs key for the graphic component
 * @param {function(): void} [options.onDevAutoplay] - localhost:8080 preview hook
 */
export function bindCasparApi (vm, { applyData, ref = 'graphic', onDevAutoplay }) {
  window.play = () => {
    if (vm.$refs[ref] && vm.$refs[ref].play) {
      vm.$refs[ref].play()
    }
  }

  window.stop = () => {
    if (vm.$refs[ref] && vm.$refs[ref].stop) {
      vm.$refs[ref].stop()
    }
  }

  window.preview = () => {
    if (vm.$refs[ref] && vm.$refs[ref].preview) {
      vm.$refs[ref].preview()
    }
  }

  window.update = raw => {
    const data = parseCasparUpdateData(raw)
    if (data) {
      applyData(data)
    }
  }

  window.next = () => {}

  if (onDevAutoplay && document.location.host === 'localhost:8080') {
    onDevAutoplay()
  }
}
