/**
 * Merge an incoming Caspar update into cached pending data.
 * Title/headline aliases collapse to `headline`; the alias present in the
 * latest update wins (headline wins when both appear in one payload).
 */
export function mergePendingData (pendingData, data) {
  const merged = { ...(pendingData || {}), ...data }

  if (data.headline !== undefined && data.title !== undefined) {
    merged.headline = data.headline
  } else if (data.title !== undefined) {
    merged.headline = data.title
  } else if (data.headline !== undefined) {
    merged.headline = data.headline
  }

  delete merged.title
  return merged
}
