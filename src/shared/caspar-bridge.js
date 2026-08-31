/**
 * Parse CasparCG / Sofie template update payloads.
 */
import { mergePendingData } from './caspar-bridge-pending.mjs'

function decodeCodePoint (value, radix) {
  const codePoint = Number.parseInt(value, radix)
  if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF) {
    return null
  }
  try {
    return String.fromCodePoint(codePoint)
  } catch (e) {
    return null
  }
}

function orEntityFallback (decoded, fallback) {
  return decoded != null ? decoded : fallback
}

function decodeXmlEntities (value) {
  return String(value)
    .replace(/&amp;#x([0-9a-fA-F]+);/g, (_, hex) => orEntityFallback(decodeCodePoint(hex, 16), `&#x${hex};`))
    .replace(/&amp;#(\d+);/g, (_, dec) => orEntityFallback(decodeCodePoint(dec, 10), `&#${dec};`))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => orEntityFallback(decodeCodePoint(hex, 16), `&#x${hex};`))
    .replace(/&#(\d+);/g, (_, dec) => orEntityFallback(decodeCodePoint(dec, 10), `&#${dec};`))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function parseXmlComponentData (value) {
  if (!/<componentData[\s>]/i.test(value)) return null

  const result = {}
  const componentPattern = /<componentData\b([^>]*)>([\s\S]*?)<\/componentData>/gi
  let match

  while ((match = componentPattern.exec(value)) !== null) {
    const [, attrs, content] = match
    const idMatch = attrs.match(/\bid=(["'])(.*?)\1/i)
    if (!idMatch) continue

    const dataTagMatch = content.match(/<data\b([^>]*)\/?>/i)
    const dataContentMatch = content.match(/<data\b[^>]*>([\s\S]*?)<\/data>/i)
    if (!dataTagMatch && !dataContentMatch) continue

    const dataAttrs = dataTagMatch ? dataTagMatch[1] : ''
    const valueMatch = dataAttrs.match(/\bvalue=(["'])(.*?)\1/i)
    const rawComponentValue = valueMatch
      ? valueMatch[2]
      : (dataContentMatch ? dataContentMatch[1] : '')

    result[decodeXmlEntities(idMatch[2])] = decodeXmlEntities(rawComponentValue)
  }

  return Object.keys(result).length ? result : null
}

export function parseCasparUpdate (data) {
  if (typeof data === 'string') {
    const raw = data.trim()
    const stripped = raw.replace(
      /^(<templateData>|<componentData>|<data>)|(<\/templateData>|<\/componentData>|<\/data>)$/gi,
      ''
    ).trim()

    try {
      data = JSON.parse(decodeURIComponent(stripped))
    } catch (e) {
      try {
        data = JSON.parse(stripped)
      } catch (e2) {
        data = parseXmlComponentData(raw)
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
export function bindCasparApi (vm, { applyData, ref = 'graphic', onDevAutoplay, titleAlias = true }) {
  let pendingData = null

  const mergePending = data => {
    pendingData = mergePendingData(pendingData, data, { titleAlias })
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
