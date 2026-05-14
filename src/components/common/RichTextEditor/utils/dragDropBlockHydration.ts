import {
  buildMatchingRows,
  buildPool,
  gapIdToDisplayNumber,
  parseDistractors,
  parseGaps,
} from '../extensions/dragDropFillBlankExtension'
import { attachPointerDragEngine } from './dragDropPointerEngine'
import { releaseExamContentFromDragDropElement } from './dragDropExamContentRelease'

export type DragDropValuesRef = { current: Record<string, string> }

function getPoolContainer(block: HTMLElement): HTMLElement | null {
  return block.querySelector<HTMLElement>('.rte-drag-drop-fill__pool-items')
}

function getChipInZone(zone: HTMLElement): HTMLElement | null {
  return zone.querySelector<HTMLElement>(':scope > .rte-drag-drop-fill__chip')
}

function showZoneEmpty(zone: HTMLElement) {
  const num = zone.querySelector<HTMLElement>('.rte-drag-drop-fill__drop-num')
  if (num) num.style.display = ''
  zone.classList.remove('rte-drag-drop-fill__drop--filled', 'rte-drag-drop-fill__drop--populated')
  delete zone.dataset.dropValue
}

function hideZoneNumber(zone: HTMLElement) {
  const num = zone.querySelector<HTMLElement>('.rte-drag-drop-fill__drop-num')
  if (num) num.style.display = 'none'
}

function chipValue(chip: HTMLElement): string {
  return chip.dataset.chipValue ?? chip.textContent?.trim() ?? ''
}

export function captureDragDropValuesFromBlock(
  block: HTMLElement,
  blockKey: string,
): Record<string, string> {
  const values: Record<string, string> = {}
  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone, index) => {
    const gapId =
      zone.dataset.gapId?.trim() ||
      zone.getAttribute('data-gap-id')?.trim() ||
      `Q${index + 1}`
    const chip = getChipInZone(zone)
    if (!chip) return
    const value = chipValue(chip)
    if (value) values[`${blockKey}:${gapId}`] = value
  })
  return values
}

function removePoolDuplicates(block: HTMLElement, poolContainer: HTMLElement | null) {
  if (!poolContainer) return
  const assignedValues = new Set<string>()
  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone) => {
    const chip = getChipInZone(zone)
    if (chip) assignedValues.add(chipValue(chip))
  })
  poolContainer.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__chip').forEach((chip) => {
    if (assignedValues.has(chipValue(chip))) chip.remove()
  })
}

function ensureColumnHeads(block: HTMLElement) {
  const targetsLabel = block.getAttribute('data-targets-label')?.trim() || 'Categories'
  const poolLabel = block.getAttribute('data-pool-label')?.trim() || 'Options'
  const targets = block.querySelector('.rte-drag-drop-fill__targets')
  if (targets && !targets.querySelector('.rte-drag-drop-fill__column-head')) {
    const head = document.createElement('div')
    head.className = 'rte-drag-drop-fill__column-head'
    head.textContent = targetsLabel
    targets.insertBefore(head, targets.firstChild)
  }
  const poolLabelEl = block.querySelector('.rte-drag-drop-fill__pool-label')
  if (poolLabelEl) poolLabelEl.textContent = poolLabel
}

function upgradeLegacyLayout(block: HTMLElement) {
  if (block.querySelector('.rte-drag-drop-fill__layout')) {
    ensureColumnHeads(block)
    return
  }

  const questionText = block.getAttribute('data-question-text') ?? ''
  const gaps = parseGaps(block.getAttribute('data-gaps'))
  const rows = buildMatchingRows(questionText, gaps)

  const pool = block.querySelector('.rte-drag-drop-fill__pool')
  block.querySelector('.rte-drag-drop-fill__question')?.remove()

  const layout = document.createElement('div')
  layout.className = 'rte-drag-drop-fill__layout'
  const targets = document.createElement('div')
  targets.className = 'rte-drag-drop-fill__targets'
  const targetsHead = document.createElement('div')
  targetsHead.className = 'rte-drag-drop-fill__column-head'
  targetsHead.textContent = block.getAttribute('data-targets-label')?.trim() || 'Categories'
  targets.appendChild(targetsHead)

  rows.forEach((row) => {
    const rowEl = document.createElement('div')
    rowEl.className = 'rte-drag-drop-fill__row'
    const label = document.createElement('span')
    label.className = 'rte-drag-drop-fill__row-label'
    label.textContent = row.label
    const drop = document.createElement('div')
    drop.className = 'rte-drag-drop-fill__drop'
    drop.dataset.gapId = row.gapId
    drop.setAttribute('data-gap-id', row.gapId)
    drop.dataset.type = 'drop'
    drop.setAttribute('role', 'button')
    drop.tabIndex = 0
    const num = document.createElement('span')
    num.className = 'rte-drag-drop-fill__drop-num'
    num.textContent = gapIdToDisplayNumber(row.gapId)
    drop.appendChild(num)
    rowEl.appendChild(label)
    rowEl.appendChild(drop)
    targets.appendChild(rowEl)
  })

  layout.appendChild(targets)
  if (pool) layout.appendChild(pool)
  block.appendChild(layout)
  block.classList.add('rte-drag-drop-fill--matching')
  ensureColumnHeads(block)
}

function ensurePoolStructure(block: HTMLElement) {
  let poolItems = block.querySelector<HTMLElement>('.rte-drag-drop-fill__pool-items')
  if (poolItems) return poolItems

  const layout = block.querySelector<HTMLElement>('.rte-drag-drop-fill__layout')
  if (!layout) return null

  const poolWrap = document.createElement('div')
  poolWrap.className = 'rte-drag-drop-fill__pool'
  const poolLabelEl = document.createElement('div')
  poolLabelEl.className = 'rte-drag-drop-fill__pool-label'
  poolLabelEl.textContent = block.getAttribute('data-pool-label')?.trim() || 'Options'
  poolItems = document.createElement('div')
  poolItems.className = 'rte-drag-drop-fill__pool-items'
  poolWrap.appendChild(poolLabelEl)
  poolWrap.appendChild(poolItems)
  layout.appendChild(poolWrap)
  return poolItems
}

function ensurePoolChips(block: HTMLElement) {
  const poolItems = ensurePoolStructure(block) ?? block.querySelector<HTMLElement>('.rte-drag-drop-fill__pool-items')
  if (!poolItems) return
  // Skip when chips already exist anywhere (pool or drop zones). Re-hydration
  // leaves assigned chips in zones with an empty pool — recreating chips duplicates them.
  if (block.querySelector('.rte-drag-drop-fill__chip')) return

  const q = block.getAttribute('data-question-text') ?? ''
  const mode = block.getAttribute('data-mode') ?? 'shuffled'
  const gaps = parseGaps(block.getAttribute('data-gaps'))
  const distractors = parseDistractors(block.getAttribute('data-distractors'))
  const pool = buildPool(mode, gaps, distractors, q)

  pool.forEach((value, chipIndex) => {
    const chip = document.createElement('span')
    chip.className = 'rte-drag-drop-fill__chip'
    chip.draggable = false
    chip.dataset.chipValue = value || '—'
    chip.dataset.chipIndex = String(chipIndex)
    chip.textContent = value || '—'
    poolItems.appendChild(chip)
  })
}

export type AttachDragDropBlockOptions = {
  blockKey: string
  examMode?: boolean
  valuesRef?: DragDropValuesRef
  onValueChange?: (key: string, value: string) => void
}

function removeOrphanDragDropSiblings(block: HTMLElement) {
  let sibling = block.nextElementSibling
  while (sibling) {
    const next = sibling.nextElementSibling
    const text = (sibling.textContent ?? '').trim().toLowerCase()
    const isDuplicateInstruction =
      sibling.matches('p') &&
      /drag\s+answers?/.test(text) &&
      /fill/.test(text) &&
      /gap/.test(text)
    const isPoolOnlySibling =
      (sibling.classList.contains('rte-drag-drop-fill__pool') ||
        sibling.classList.contains('rte-drag-drop-fill__pool-items') ||
        Boolean(sibling.querySelector('.rte-drag-drop-fill__pool-items, .rte-drag-drop-fill__chip'))) &&
      !sibling.querySelector('table, [data-type="radio-group"], .rte-radio-group') &&
      !Array.from(sibling.querySelectorAll('p, h1, h2, h3, h4, h5, h6, strong')).some((node) =>
        /Questions\s+\d+/i.test(node.textContent ?? ''),
      )

    if (isPoolOnlySibling || isDuplicateInstruction) {
      sibling.remove()
    }
    sibling = next
  }
}

function releaseForeignDragDropChildren(block: HTMLElement) {
  releaseExamContentFromDragDropElement(block, document)
}

export function attachDragDropBlockBehavior(
  block: HTMLElement,
  { blockKey, examMode = false, valuesRef, onValueChange }: AttachDragDropBlockOptions,
): () => void {
  block.dataset.type = 'drag-drop-fill'
  if (examMode) {
    block.classList.add('rte-drag-drop-fill', 'rte-drag-drop-fill--exam')
    block.querySelector('.rte-drag-drop-fill__close')?.remove()
    if (block.dataset.ddContentReleased !== '1') {
      releaseForeignDragDropChildren(block)
      block.dataset.ddContentReleased = '1'
    }
  }
  upgradeLegacyLayout(block)
  ensurePoolChips(block)
  if (examMode) {
    removeOrphanDragDropSiblings(block)
  }

  const poolContainer = getPoolContainer(block)
  const zoneKey = (gapId: string) => `${blockKey}:${gapId}`
  const notifyChange = onValueChange ?? (() => {})

  const returnChipToPool = (chip: HTMLElement, fromZone: HTMLElement | null, notify = true) => {
    if (!poolContainer) return
    if (fromZone) {
      showZoneEmpty(fromZone)
      const gapId = fromZone.dataset.gapId ?? fromZone.getAttribute('data-gap-id') ?? ''
      if (gapId && notify) notifyChange(zoneKey(gapId), '')
    }
    poolContainer.appendChild(chip)
    chip.style.visibility = 'visible'
    chip.classList.remove('rte-drag-drop-fill__chip--in-zone')
  }

  const moveChipToZone = (
    chip: HTMLElement,
    zone: HTMLElement,
    sourceZone: HTMLElement | null,
    notify = true,
  ) => {
    const gapId = zone.dataset.gapId ?? zone.getAttribute('data-gap-id') ?? ''
    const value = chipValue(chip)
    if (!gapId || !value) return

    const existing = getChipInZone(zone)
    if (existing && existing !== chip) {
      returnChipToPool(existing, zone, notify)
    }

    if (sourceZone && sourceZone !== zone) {
      showZoneEmpty(sourceZone)
      const oldGapId = sourceZone.dataset.gapId ?? sourceZone.getAttribute('data-gap-id') ?? ''
      if (oldGapId && notify) notifyChange(zoneKey(oldGapId), '')
    }

    block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((other) => {
      if (other === zone) return
      const chipInOther = getChipInZone(other)
      if (chipInOther === chip) {
        showZoneEmpty(other)
        const otherGapId = other.dataset.gapId ?? other.getAttribute('data-gap-id') ?? ''
        if (otherGapId && notify) notifyChange(zoneKey(otherGapId), '')
      }
    })

    zone.appendChild(chip)
    chip.style.visibility = 'visible'
    chip.classList.add('rte-drag-drop-fill__chip--in-zone')
    hideZoneNumber(zone)
    zone.classList.add('rte-drag-drop-fill__drop--filled', 'rte-drag-drop-fill__drop--populated')
    zone.dataset.dropValue = value
    if (notify) notifyChange(zoneKey(gapId), value)
  }

  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__chip').forEach((chip, index) => {
    chip.draggable = false
    if (!chip.dataset.chipId) {
      chip.dataset.chipId = `${blockKey}-chip-${index}`
    }
    const value = chipValue(chip)
    chip.dataset.chipValue = value
    chip.dataset.chipIndex = chip.dataset.chipIndex ?? String(index)
  })

  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone, index) => {
    const gapId =
      zone.dataset.gapId?.trim() ||
      zone.getAttribute('data-gap-id')?.trim() ||
      `Q${index + 1}`
    zone.dataset.gapId = gapId
    zone.setAttribute('data-gap-id', gapId)
    zone.dataset.type = 'drop'

    const saved = valuesRef?.current[zoneKey(gapId)] ?? ''
    if (saved) {
      const existingChip = getChipInZone(zone)
      if (existingChip && chipValue(existingChip) === saved) return
      const chip =
        Array.from(block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__chip')).find(
          (c) => chipValue(c) === saved,
        ) ?? null
      if (chip) {
        moveChipToZone(chip, zone, chip.closest<HTMLElement>('.rte-drag-drop-fill__drop'), false)
      }
    }
  })

  removePoolDuplicates(block, poolContainer)

  const cleanups: Array<() => void> = []

  block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone) => {
    const onDblClick = () => {
      const chipInZone = getChipInZone(zone)
      if (chipInZone) returnChipToPool(chipInZone, zone)
    }
    zone.addEventListener('dblclick', onDblClick)
    cleanups.push(() => zone.removeEventListener('dblclick', onDblClick))
  })

  cleanups.push(
    attachPointerDragEngine({
      block,
      poolContainer,
      onDropOnZone: ({ zone, chip, sourceZone }) => moveChipToZone(chip, zone, sourceZone),
      onReturnToPool: (chip, fromZone) => returnChipToPool(chip, fromZone),
    }),
  )

  return () => cleanups.forEach((fn) => fn())
}

export function resolveDragDropQuestionDbId(
  block: HTMLElement,
  fallbackQuestionDbId?: string,
): string {
  return (
    block.getAttribute('data-question-id')?.trim() ||
    block.closest('[data-question-id]')?.getAttribute('data-question-id')?.trim() ||
    fallbackQuestionDbId?.trim() ||
    'unknown'
  )
}
