import { c, tokens } from '../../../../theme'
import { closestDropZone } from './dragDropZoneUtils'

const GHOST_CLASS = 'ielts-drag-ghost'

export type PointerDropHandler = (args: {
  zone: HTMLElement
  chip: HTMLElement
  sourceZone: HTMLElement | null
}) => void

export type PointerDragEngineOptions = {
  block: HTMLElement
  poolContainer: HTMLElement | null
  onDropOnZone: PointerDropHandler
  onReturnToPool: (chip: HTMLElement, fromZone: HTMLElement | null) => void
}

function createGhost(label: string, width: number): HTMLElement {
  const ghost = document.createElement('div')
  ghost.className = GHOST_CLASS
  ghost.textContent = label
  Object.assign(ghost.style, {
    position: 'fixed',
    zIndex: '10000',
    pointerEvents: 'none',
    maxWidth: '320px',
    width: `${Math.max(width, 140)}px`,
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${c.info.light}`,
    background: c.info.bg,
    boxShadow: tokens.shadows.dragDrop,
    fontSize: '14px',
    lineHeight: '1.4',
    color: c.text.primary,
    fontWeight: '500',
  })
  document.body.appendChild(ghost)
  return ghost
}

function moveGhost(ghost: HTMLElement, x: number, y: number) {
  ghost.style.left = `${x + 10}px`
  ghost.style.top = `${y + 10}px`
}

function getPoolHitArea(poolContainer: HTMLElement | null): HTMLElement | null {
  if (!poolContainer) return null
  return poolContainer.closest<HTMLElement>('.rte-drag-drop-fill__pool') ?? poolContainer
}

function hitTest(
  block: HTMLElement,
  poolContainer: HTMLElement | null,
  x: number,
  y: number,
  ignore: HTMLElement[] = [],
): { zone: HTMLElement | null; pool: boolean } {
  const ghost = document.querySelector(`.${GHOST_CLASS}`)
  const hidden: HTMLElement[] = []
  if (ghost instanceof HTMLElement) {
    ghost.style.visibility = 'hidden'
    hidden.push(ghost)
  }
  for (const node of ignore) {
    if (node.style.pointerEvents !== 'none') {
      node.dataset._ieltsPrevPointerEvents = node.style.pointerEvents
    }
    node.style.pointerEvents = 'none'
    hidden.push(node)
  }

  const el = document.elementFromPoint(x, y)

  for (const node of hidden) {
    if (node === ghost) {
      node.style.visibility = ''
      continue
    }
    const prev = node.dataset._ieltsPrevPointerEvents ?? ''
    node.style.pointerEvents = prev
    delete node.dataset._ieltsPrevPointerEvents
  }

  const zone = closestDropZone(el)
  if (zone && block.contains(zone)) {
    return { zone, pool: false }
  }

  if (poolContainer) {
    const poolHitArea = getPoolHitArea(poolContainer)
    const rect = (poolHitArea ?? poolContainer).getBoundingClientRect()
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return { zone: null, pool: true }
    }
  }

  return { zone: null, pool: false }
}

export function attachPointerDragEngine({
  block,
  poolContainer,
  onDropOnZone,
  onReturnToPool,
}: PointerDragEngineOptions): () => void {
  const cleanups: Array<() => void> = []
  let active = false

  const bindDraggable = (chip: HTMLElement) => {
    chip.draggable = false
    chip.style.touchAction = 'none'
    chip.style.cursor = 'grab'

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (active) return
      const value = chip.dataset.chipValue ?? chip.textContent?.trim() ?? ''
      if (!value) return
      event.preventDefault()
      event.stopPropagation()
      active = true
      chip.setPointerCapture(event.pointerId)

      const ghost = createGhost(value, chip.getBoundingClientRect().width)
      moveGhost(ghost, event.clientX, event.clientY)
      chip.classList.add('rte-drag-drop-fill__chip--dragging')
      chip.style.pointerEvents = 'none'

      const sourceZone = closestDropZone(chip)
      let hoverZone: HTMLElement | null = null

      const setHover = (zone: HTMLElement | null, overPool = false) => {
        if (hoverZone !== zone) {
          hoverZone?.classList.remove(
            'rte-drag-drop-fill__drop--drag-over',
            'rte-drag-drop-fill__blank--drag-over',
          )
          hoverZone = zone
          hoverZone?.classList.add(
            zone.classList.contains('rte-drag-drop-fill__blank')
              ? 'rte-drag-drop-fill__blank--drag-over'
              : 'rte-drag-drop-fill__drop--drag-over',
          )
        }
        poolContainer?.classList.toggle('rte-drag-drop-fill__pool-items--drag-over', overPool)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== event.pointerId) return
        e.preventDefault()
        moveGhost(ghost, e.clientX, e.clientY)
        const hit = hitTest(block, poolContainer, e.clientX, e.clientY, [chip])
        setHover(hit.zone, hit.pool)
      }

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== event.pointerId) return
        document.removeEventListener('pointermove', onMove, true)
        document.removeEventListener('pointerup', onUp, true)
        document.removeEventListener('pointercancel', onUp, true)
        if (chip.hasPointerCapture(e.pointerId)) {
          chip.releasePointerCapture(e.pointerId)
        }
        ghost.remove()
        chip.classList.remove('rte-drag-drop-fill__chip--dragging')
        chip.style.pointerEvents = ''
        poolContainer?.classList.remove('rte-drag-drop-fill__pool-items--drag-over')
        setHover(null, false)
        active = false

        const hit = hitTest(block, poolContainer, e.clientX, e.clientY, [chip])
        if (hit.zone) {
          onDropOnZone({ zone: hit.zone, chip, sourceZone })
          return
        }
        if (hit.pool || sourceZone) {
          onReturnToPool(chip, sourceZone)
        }
      }

      document.addEventListener('pointermove', onMove, true)
      document.addEventListener('pointerup', onUp, true)
      document.addEventListener('pointercancel', onUp, true)
    }

    chip.addEventListener('pointerdown', onPointerDown, true)
    cleanups.push(() => {
      chip.removeEventListener('pointerdown', onPointerDown, true)
    })
  }

  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__chip').forEach(bindDraggable)

  return () => {
    cleanups.forEach((fn) => fn())
    document.querySelectorAll(`.${GHOST_CLASS}`).forEach((node) => node.remove())
  }
}
