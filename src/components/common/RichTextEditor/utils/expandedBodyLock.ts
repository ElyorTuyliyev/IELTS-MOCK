/** Reference-counted body scroll lock for multiple simultaneous rich editors. */
let expandLockCount = 0

export function lockExpandedEditorBody(): void {
  expandLockCount += 1
  if (expandLockCount === 1) {
    document.body.style.overflow = 'hidden'
  }
}

export function unlockExpandedEditorBody(): void {
  expandLockCount = Math.max(0, expandLockCount - 1)
  if (expandLockCount === 0) {
    document.body.style.overflow = ''
  }
}
