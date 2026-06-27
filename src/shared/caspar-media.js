/** H.264 containers CEF cannot decode in HTML <video>; map to WebM sibling on disk. */
const CEF_UNSUPPORTED_VIDEO = /\.(mp4|mov|m4v|mxf)$/i

function toCefVideoPath (filePath) {
  if (CEF_UNSUPPORTED_VIDEO.test(filePath)) {
    return filePath.replace(CEF_UNSUPPORTED_VIDEO, '.webm')
  }
  return filePath
}

/**
 * Resolve a Sofie/Caspar media path for use in HTML template <video>/<img> src.
 *
 * Rundown payloads use paths like `spravy/rundown/clips/foo.mp4` relative to
 * <media-path>. CEF cannot decode H.264 MP4/MOV in <video> — ILU clips must
 * also exist as `.webm` at the same path. Caspar serves files via `media/...`.
 */
export function resolveCasparMediaSrc (filePath) {
  if (!filePath || typeof filePath !== 'string') return ''

  let trimmed = filePath.trim()
  if (!trimmed) return ''

  if (/^https?:/i.test(trimmed) || /^file:/i.test(trimmed)) {
    return trimmed
  }

  if (/^media:\/?/i.test(trimmed)) {
    trimmed = trimmed.replace(/^media:\/?/i, '')
  } else if (/^media\//i.test(trimmed)) {
    trimmed = trimmed.replace(/^media\//i, '')
  }

  trimmed = trimmed.replace(/^\/+/, '')
  trimmed = toCefVideoPath(trimmed)

  return `media/${trimmed}`
}

/**
 * Start playback on a muted HTML video element (handles load + play promise).
 */
export async function playCasparVideo (videoEl) {
  if (!videoEl) return

  videoEl.muted = true
  videoEl.playsInline = true

  if (videoEl.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    await new Promise((resolve, reject) => {
      const onReady = () => {
        videoEl.removeEventListener('loadeddata', onReady)
        videoEl.removeEventListener('error', onError)
        resolve()
      }
      const onError = () => {
        videoEl.removeEventListener('loadeddata', onReady)
        videoEl.removeEventListener('error', onError)
        reject(new Error(`Failed to load video: ${videoEl.src}`))
      }
      videoEl.addEventListener('loadeddata', onReady)
      videoEl.addEventListener('error', onError)
      videoEl.load()
    })
  }

  videoEl.currentTime = 0
  await videoEl.play()
}
