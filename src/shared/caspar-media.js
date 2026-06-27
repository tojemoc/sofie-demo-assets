/**
 * Resolve a Sofie/Caspar media path for use in HTML template <video>/<img> src.
 *
 * PLAY commands use paths like `spravy/rundown/clips/foo.mp4` relative to
 * <media-path>. CEF cannot load those directly — Caspar serves them via the
 * internal media URL scheme (`media/...`).
 */
export function resolveCasparMediaSrc (filePath) {
  if (!filePath || typeof filePath !== 'string') return ''

  const trimmed = filePath.trim()
  if (!trimmed) return ''

  if (/^(https?:|media:|media\/|file:)/i.test(trimmed)) {
    return trimmed
  }

  return `media/${trimmed.replace(/^\/+/, '')}`
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
