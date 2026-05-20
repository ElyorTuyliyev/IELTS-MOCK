/** Drop targets: inline blanks (new) and legacy matching rows. */
export const DRAG_DROP_ZONE_SELECTOR =
  '.rte-drag-drop-fill__blank, .rte-drag-drop-fill__drop'

export const DRAG_DROP_ZONE_NUM_SELECTOR =
  '.rte-drag-drop-fill__blank-num, .rte-drag-drop-fill__drop-num'

export function queryDropZones(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(DRAG_DROP_ZONE_SELECTOR))
}

export function isDropZone(el: Element | null): el is HTMLElement {
  return Boolean(
    el?.matches('.rte-drag-drop-fill__blank, .rte-drag-drop-fill__drop'),
  )
}

export function closestDropZone(el: Element | null): HTMLElement | null {
  return el?.closest<HTMLElement>(DRAG_DROP_ZONE_SELECTOR) ?? null
}
