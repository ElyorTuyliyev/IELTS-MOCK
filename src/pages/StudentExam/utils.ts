import { graphqlUrl } from '../../graphql/client'
import {
  parseDragDropGapQuestionNumbers,
  releaseCapturedContentFromDragDropBlocks,
  stripOrphanDragDropExamArtifacts,
} from '../../components/common/RichTextEditor/utils/dragDropExamContentRelease'
import type { ModuleName } from './constants'
import { tryParseCompositeAnswerStorageKey } from './utils/answerStorageKeys'

export type BackendQuestion = {
  _id: string
  examId?: string | null
  question?: string | null
  title?: string | null
  type?: string | null
  instruction?: string | null
  sourceMaterial?: string | null
  explanation?: string | null
  ieltsModule?: string | null
  listeningPart?: string | number | null
  partId?: string | null
  placementNumber?: number | null
  listeningAudio?: string | null
  speakingAudio?: string | null
  passageHtml?: string | null
  questionsHtml?: string | null
  options?: Array<{ title?: string | null; isCorrectAnswer?: boolean | null }> | null
}

export type DisplayQuestion = {
  id: string
  text: string
  html?: string
  questionDbId?: string
}

export type ModulePart = {
  partNumber: number
  passageHtml?: string
  questions: DisplayQuestion[]
}

export function normalizeModule(
  rawValue?: string | null,
  fallbackRawValue?: string | null,
): ModuleName | null {
  const value = `${rawValue ?? ''} ${fallbackRawValue ?? ''}`.toLowerCase().trim()
  if (value.includes('listening') || value.includes('course material') || value.includes('course-material')) {
    return 'listening'
  }
  if (value.includes('reading')) return 'reading'
  if (value.includes('writing')) return 'writing'
  if (value.includes('speaking')) return 'speaking'
  return null
}

export function resolveStudentExamModule(
  question: BackendQuestion,
): ModuleName | null {
  const fromFields = normalizeModule(question.ieltsModule, question.type)
  if (fromFields) return fromFields
  if (question.listeningPart) return 'listening'
  const hasSpeakingAudio = Boolean(question.speakingAudio?.trim())
  const hasListeningAudio = Boolean(question.listeningAudio?.trim())
  if (hasSpeakingAudio && !hasListeningAudio) return 'speaking'
  return null
}

export function parsePartNumber(question: BackendQuestion, module: ModuleName): number {
  if (module === 'listening') {
    const fromListeningPart = Number(question.listeningPart ?? 1)
    if (Number.isFinite(fromListeningPart) && fromListeningPart > 0) {
      return fromListeningPart
    }
  }
  const fromPartId = Number((question.partId ?? '').replace(/[^\d]/g, ''))
  if (Number.isFinite(fromPartId) && fromPartId > 0) return fromPartId

  const fromText = `${question.sourceMaterial ?? ''} ${question.title ?? ''} ${question.question ?? ''}`
    .match(/\bpart\s*(\d{1,2})\b/i)
  if (fromText) {
    const parsed = Number(fromText[1])
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return 1
}

export function resolveAudioUrl(raw?: string): string | undefined {
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw)) return raw
  const base = graphqlUrl.replace(/\/graphql$/, '')
  return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function normalizeText(value?: string | null): string {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function resolveQuestionText(item: BackendQuestion, fallbackIndex: number): string {
  const candidates = [
    normalizeText(item.sourceMaterial),
    normalizeText(item.question),
    normalizeText(item.title),
    normalizeText(item.instruction),
    normalizeText(item.explanation),
  ]
  return candidates.find((text) => text.length > 0) ?? `Question ${fallbackIndex}`
}

export function resolveQuestionContent(item: BackendQuestion): string {
  return String(item.sourceMaterial ?? item.passageHtml ?? item.questionsHtml ?? '').trim()
}

export function listeningPartQuestionStart(partNumber: number): number {
  return (partNumber - 1) * 10 + 1
}

function countAnswerSlotsInHtml(html: string, partNumber: number): number {
  let count = 0

  if (typeof window !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
      const root = doc.body.firstElementChild
      if (root) {
        count += root.querySelectorAll('span[data-type="blank-answer"]').length
        root.querySelectorAll('[data-type="drag-drop-fill"]').forEach((node) => {
          const gapsJson = node.getAttribute('data-gaps') ?? '[]'
          try {
            const parsed = JSON.parse(gapsJson) as unknown
            if (Array.isArray(parsed)) count += parsed.length
          } catch {
            /* malformed drag-drop data */
          }
        })
        count += root.querySelectorAll('[data-type="radio-group"]').length
      }
    } catch {
      /* DOM parse failed */
    }
  }

  if (count > 0) return count

  count = (html.match(/data-type="blank-answer"/g) ?? []).length
  if (count > 0) return count

  for (const gapsMatch of html.matchAll(/data-gaps=['"](\[[\s\S]*?\])['"]/g)) {
    try {
      const parsed = JSON.parse(gapsMatch[1]) as unknown
      if (Array.isArray(parsed)) count += parsed.length
    } catch {
      /* malformed drag-drop data */
    }
  }
  if (count > 0) return count

  count = (html.match(/data-type="radio-group"/g) ?? []).length
  if (count > 0) return count

  count = (html.match(/_{4,}/g) ?? []).length
  if (count > 0) return count

  const rangeStart = listeningPartQuestionStart(partNumber)
  const rangeEnd = partNumber * 10
  const bracketCount = [...html.matchAll(/\[(\d{1,3})\]/g)].filter((match) => {
    const n = Number(match[1])
    return Number.isFinite(n) && n >= rangeStart && n <= rangeEnd
  }).length
  if (bracketCount > 0) return bracketCount

  return 0
}

function normalizeListeningContentForSlotCount(html: string): string {
  return releaseCapturedContentFromDragDropBlocks(repairDragDropHtml(html))
}

function countQuestionRangeFromHeadings(
  html: string,
  partNumber?: number,
): number {
  const rangeStart = partNumber ? listeningPartQuestionStart(partNumber) : null
  const rangeEnd = partNumber ? partNumber * 10 : null

  if (rangeStart === null || rangeEnd === null) {
    const intervals: Array<{ start: number; end: number }> = []
    for (const match of html.matchAll(/Questions\s+(\d+)\s*[–-]\s*(\d+)/gi)) {
      const start = Number(match[1])
      const end = Number(match[2])
      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) continue
      intervals.push({ start, end })
    }
    if (intervals.length === 0) return 0
    intervals.sort((a, b) => a.start - b.start || a.end - b.end)
    let sum = 0
    let cur = intervals[0]!
    for (let i = 1; i < intervals.length; i += 1) {
      const next = intervals[i]!
      if (next.start <= cur.end + 1) {
        cur = { start: cur.start, end: Math.max(cur.end, next.end) }
      } else {
        sum += cur.end - cur.start + 1
        cur = next
      }
    }
    sum += cur.end - cur.start + 1
    return sum
  }

  let headingMin = Infinity
  let headingMax = -Infinity

  for (const match of html.matchAll(/Questions\s+(\d+)\s*[–-]\s*(\d+)/gi)) {
    const start = Number(match[1])
    const end = Number(match[2])
    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) continue
    if (end < rangeStart || start > rangeEnd) continue
    headingMin = Math.min(headingMin, Math.max(start, rangeStart))
    headingMax = Math.max(headingMax, Math.min(end, rangeEnd))
  }

  if (!Number.isFinite(headingMin) || headingMax < headingMin) return 0
  return headingMax - headingMin + 1
}

function countReadingAnswerSlotsInHtml(html: string): number {
  let count = 0

  if (typeof window !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
      const root = doc.body.firstElementChild
      if (root) {
        count += root.querySelectorAll('span[data-type="blank-answer"]').length
        root.querySelectorAll('[data-type="drag-drop-fill"]').forEach((node) => {
          const gapsJson = node.getAttribute('data-gaps') ?? '[]'
          try {
            const parsed = JSON.parse(gapsJson) as unknown
            if (Array.isArray(parsed)) count += parsed.length
          } catch {
            /* malformed drag-drop data */
          }
        })
        count += root.querySelectorAll(
          '[data-type="radio-group"], .rte-radio-group, [data-type="checkbox-group"], .rte-checkbox-group',
        ).length
      }
    } catch {
      /* DOM parse failed */
    }
  }

  if (count > 0) return count

  count = (html.match(/data-type="blank-answer"/g) ?? []).length
  if (count > 0) return count

  for (const gapsMatch of html.matchAll(/data-gaps=['"](\[[\s\S]*?\])['"]/g)) {
    try {
      const parsed = JSON.parse(gapsMatch[1]) as unknown
      if (Array.isArray(parsed)) count += parsed.length
    } catch {
      /* malformed drag-drop data */
    }
  }
  if (count > 0) return count

  count =
    (html.match(/data-type="radio-group"/g) ?? []).length +
    (html.match(/data-type="checkbox-group"/g) ?? []).length
  if (count > 0) return count

  count = (html.match(/_{4,}/g) ?? []).length
  if (count > 0) return count

  count = [...html.matchAll(/\[(\d{1,3})\]/g)].length
  return count > 0 ? count : 0
}

export function stripLeadingPartHeading(html: string): string {
  const trimmed = html.trim()
  const match = trimmed.match(/^<h3[^>]*>[\s\S]*?<\/h3>\s*/i)
  if (!match) return html
  return trimmed.slice(match[0].length)
}

export function resolveReadingQuestionsHtml(item: BackendQuestion): string {
  const questionsOnly = (item.questionsHtml ?? '').trim()
  if (questionsOnly) return questionsOnly

  const combined = (item.sourceMaterial ?? '').trim()
  const passage = (item.passageHtml ?? '').trim()
  if (combined && passage && combined.startsWith(passage)) {
    const rest = combined.slice(passage.length).trim()
    if (rest) return rest
  }

  if (combined && combined !== passage) return combined
  return ''
}

/** Prefer questionsHtml for listening sheets (sourceMaterial may be a short preview). */
export function resolveListeningQuestionsHtml(item: BackendQuestion): string {
  const questionsOnly = (item.questionsHtml ?? '').trim()
  if (questionsOnly) return questionsOnly

  const combined = (item.sourceMaterial ?? '').trim()
  const passage = (item.passageHtml ?? '').trim()
  if (combined && passage && combined.startsWith(passage)) {
    const rest = combined.slice(passage.length).trim()
    if (rest) return rest
  }

  if (combined && combined !== passage) return combined
  return (item.passageHtml ?? '').trim()
}

/** Number of answer slots in a listening part (not from Q ids in HTML). */
export function countListeningAnswerSlots(item: BackendQuestion, partNumber: number): number {
  const html = resolveListeningQuestionsHtml(item) || resolveQuestionContent(item)
  if (!html) return Math.max(1, item.options?.length ?? 0)
  const normalized = normalizeListeningContentForSlotCount(html)
  const fromSlots = countAnswerSlotsInHtml(normalized, partNumber)
  const fromHeadings = countQuestionRangeFromHeadings(normalized, partNumber)
  const best = Math.max(fromSlots, fromHeadings)
  return best > 0 ? best : Math.max(1, item.options?.length ?? 0)
}

/** Slot count from all backend records in one listening part. */
export function countListeningPartAnswerSlots(
  ordered: BackendQuestion[],
  partNumber: number,
): number {
  const combinedRaw = ordered
    .map((q) => resolveListeningQuestionsHtml(q) || resolveQuestionContent(q))
    .filter(Boolean)
    .join('')
  const fallback = Math.max(1, ...ordered.map((q) => Math.max(1, q.options?.length ?? 0)))
  if (!combinedRaw) return fallback

  const normalized = normalizeListeningContentForSlotCount(combinedRaw)
  const fromSlots = countAnswerSlotsInHtml(normalized, partNumber)
  const fromHeadings = countQuestionRangeFromHeadings(normalized, partNumber)
  const best = Math.max(fromSlots, fromHeadings)
  return best > 0 ? best : fallback
}

/** Number of answer slots in a reading part (for footer and navigation). */
export function countReadingPartAnswerSlots(ordered: BackendQuestion[]): number {
  const combinedRaw = ordered.map((q) => resolveReadingQuestionsHtml(q)).filter(Boolean).join('')
  const fallback = Math.max(1, ordered.length)
  if (!combinedRaw) return fallback

  const normalized = normalizeListeningContentForSlotCount(combinedRaw)
  const fromSlots = countReadingAnswerSlotsInHtml(normalized)
  const fromHeadings = countQuestionRangeFromHeadings(normalized)
  if (fromSlots > 0) return fromSlots
  return fromHeadings > 0 ? fromHeadings : fallback
}

export function countListeningQuestions(item: BackendQuestion, partNumber = 1): number {
  return countListeningAnswerSlots(item, partNumber)
}

export function formatRemainingTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(minutes)}:${pad(seconds)}`
}

const DRAG_DROP_ORPHAN_ATTRS =
  /(?:^|[\s>])(?!<div\s)((?:data-question-text="[^"]*"\s+)?data-mode="(?:shuffled|ordered)"\s+data-gaps='(\[[\s\S]*?\])'\s+data-distractors="(\[[\s\S]*?\])"\s+data-type="drag-drop-fill"\s+class="rte-drag-drop-fill")/g

const DRAG_DROP_ORPHAN_ATTRS_ESCAPED =
  /(?:^|[\s>])(?!<div\s)((?:data-question-text="[^"]*"\s+)?data-mode="(?:shuffled|ordered)"\s+data-gaps="(\[[\s\S]*?\])"\s+data-distractors="(\[[\s\S]*?\])"\s+data-type="drag-drop-fill"\s+class="rte-drag-drop-fill")/g

/** Repair broken drag-drop HTML where attributes became plain text */
export function repairDragDropHtml(html: string): string {
  if (!html.includes('drag-drop-fill') && !html.includes('rte-drag-drop-fill')) {
    return html
  }

  let fixed = html
  fixed = fixed.replace(DRAG_DROP_ORPHAN_ATTRS, (_match, attrs: string) => `<div ${attrs}>`)
  fixed = fixed.replace(DRAG_DROP_ORPHAN_ATTRS_ESCAPED, (_match, attrs: string) => `<div ${attrs}>`)

  // Yopilmagan drag-drop wrapper
  if (
    fixed.includes('class="rte-drag-drop-fill__pool"') &&
    !fixed.includes('data-type="drag-drop-fill"')
  ) {
    fixed = fixed.replace(
      /(<div class="rte-drag-drop-fill__question")/,
      '<div data-type="drag-drop-fill" class="rte-drag-drop-fill" data-gaps="[]" data-distractors="[]" data-mode="shuffled">$1',
    )
  }

  return fixed
}

function radioQuestionLineBeforeGroup(group: HTMLElement): HTMLElement | null {
  let prev: Element | null = group.previousElementSibling
  while (prev && (prev.tagName === 'BR' || (prev.tagName === 'P' && !prev.textContent?.trim()))) {
    prev = prev.previousElementSibling
  }
  if (prev?.matches('p, h1, h2, h3, h4, h5, h6')) {
    return prev as HTMLElement
  }
  return null
}

function extractRadioGroupQuestionNumber(group: HTMLElement): string | null {
  const line = radioQuestionLineBeforeGroup(group)
  if (!line) return null
  const match = (line.textContent ?? '').trim().match(/^Q(\d+)\b/i)
  return match?.[1] ?? null
}

function markRadioQuestionLine(element: HTMLElement): void {
  if (!/^Q\d+/i.test((element.textContent ?? '').trim())) return
  element.classList.add('rte-radio-question')
}

function boldRadioQuestionPrefixes(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-type="radio-group"], .rte-radio-group').forEach((group) => {
    const line = radioQuestionLineBeforeGroup(group)
    if (line) {
      markRadioQuestionLine(line)
    }
  })
}

function sanitizeExamChoiceGroups(root: HTMLElement): void {
  root
    .querySelectorAll<HTMLElement>(
      '[data-type="radio-group"], .rte-radio-group, [data-type="checkbox-group"], .rte-checkbox-group',
    )
    .forEach((group) => {
      group.removeAttribute('data-checked-value')
      group.removeAttribute('data-checked-values')
      group
        .querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')
        .forEach((input) => {
          input.checked = false
          input.removeAttribute('checked')
          input.disabled = false
          input.readOnly = false
        })
    })
}

function assignChoiceGroupKeys(root: HTMLElement, keyPrefix: string, questionDbId?: string): void {
  let radioSeq = 0
  const qid = questionDbId?.trim() ?? ''
  root
    .querySelectorAll<HTMLElement>(
      '[data-type="radio-group"], .rte-radio-group, [data-type="checkbox-group"], .rte-checkbox-group',
    )
    .forEach((group) => {
      const storageKey = `${keyPrefix}:choice:radio:${radioSeq}`
      const questionNumber = extractRadioGroupQuestionNumber(group)
      const slotKey = questionNumber ? `Q${questionNumber}` : `radio-${radioSeq + 1}`
      radioSeq += 1
      group.setAttribute('data-choice-key', storageKey)
      group.setAttribute('data-slot-key', slotKey)
      if (questionNumber) {
        group.setAttribute('data-question-number', questionNumber)
      }
      if (qid) {
        group.setAttribute('data-question-id', qid)
      }
      group
        .querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')
        .forEach((input) => {
          input.setAttribute('data-choice-key', storageKey)
          if (qid) {
            input.setAttribute('data-question-id', qid)
          }
          input.setAttribute('data-slot-key', slotKey)
        })
    })
}

/** Strip editor answer markers (for passage and other static HTML). */
export function stripEditorAnswerMarksFromHtml(html: string): string {
  if (!html.trim() || typeof window === 'undefined') return html
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html
  sanitizeExamChoiceGroups(root)
  return root.innerHTML
}

export function examPlayerBlankKeyPrefix(
  questionDbId: string | undefined,
  part: number,
  chunkIndex: number,
  module: 'listening' | 'reading',
): string {
  const dbId = questionDbId?.trim()
  if (dbId) return `q-${dbId}-c${chunkIndex}`
  return module === 'reading'
    ? `reading-part-${part}-chunk-${chunkIndex}`
    : `part-${part}-chunk-${chunkIndex}`
}

export function prepareExamQuestionHtml(html: string, questionDbId?: string): string {
  const keyPrefix = questionDbId?.trim() ? `q-${questionDbId.trim()}-c0` : 'exam'
  return formatExamHtmlForPlayer(html, keyPrefix, questionDbId)
}

function dragDropSlotMarkup(index: number): string {
  return `<span class="ielts-drag-drop-slot" data-drag-drop-index="${index}" hidden="hidden"></span>`
}

function dragDropSlotPattern(index: number): RegExp {
  return new RegExp(
    `<span[^>]*\\bdata-drag-drop-index="${index}"[^>]*>\\s*</span>`,
    'i',
  )
}

function findLaterQuestionSectionElement(
  root: HTMLElement,
  block: HTMLElement,
  fromQ: number,
): HTMLElement | null {
  const candidates = root.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6, strong, li')

  for (const el of Array.from(candidates)) {
    if (el === block || block.contains(el) || el.contains(block)) continue
    const text = (el.textContent ?? '').trim()
    if (!text) continue

    const rangeMatch = text.match(/Questions\s+(\d+)\s*[–-]\s*(\d+)/i)
    if (rangeMatch) {
      const start = Number(rangeMatch[1])
      const end = Number(rangeMatch[2])
      if (fromQ >= start && fromQ <= end) return el
      if (start >= fromQ) return el
      continue
    }

    if (new RegExp(`Questions\\s+${fromQ}\\b`, 'i').test(text)) return el
  }

  return null
}

/** If a drag-drop block is misplaced, insert it before the next question section. */
export function repositionListeningDragDropBlocks(html: string): string {
  if (typeof window === 'undefined' || !html.includes('data-type="drag-drop-fill')) {
    return html
  }

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html

  const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]'))
  for (const block of blocks) {
    const gapNumbers = parseDragDropGapQuestionNumbers(block)
    if (gapNumbers.length === 0) continue

    const maxQ = Math.max(...gapNumbers)
    const laterSection = findLaterQuestionSectionElement(root, block, maxQ + 1)
    if (!laterSection) continue

    const blockFollowsLaterSection =
      (laterSection.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
    if (!blockFollowsLaterSection) continue

    laterSection.insertAdjacentElement('beforebegin', block)
  }

  return root.innerHTML
}

/** Split drag-drop blocks while accounting for inner divs. */
function extractDragDropBlocksFromHtml(html: string): { html: string; blocks: string[] } {
  const blocks: string[] = []

  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
    const root = doc.body.firstElementChild as HTMLElement | null
    if (root) {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]'))
      nodes.forEach((el, index) => {
        blocks.push(el.outerHTML)
        const slot = doc.createElement('span')
        slot.className = 'ielts-drag-drop-slot'
        slot.setAttribute('data-drag-drop-index', String(index))
        slot.hidden = true
        el.replaceWith(slot)
      })
      return { html: root.innerHTML, blocks }
    }
  }

  const openRe = /<div[^>]*\bdata-type=["']drag-drop-fill["'][^>]*>/gi
  let result = ''
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = openRe.exec(html)) !== null) {
    const start = match.index
    result += html.slice(lastIndex, start)

    let depth = 0
    let cursor = start
    while (cursor < html.length) {
      const slice = html.slice(cursor)
      const openDiv = slice.match(/^<div(?:\s[^>]*)?>/i)
      const closeDiv = slice.match(/^<\/div>/i)
      if (openDiv) {
        depth += 1
        cursor += openDiv[0].length
        continue
      }
      if (closeDiv) {
        depth -= 1
        cursor += closeDiv[0].length
        if (depth === 0) break
        continue
      }
      cursor += 1
    }

    const block = html.slice(start, cursor)
    blocks.push(block)
    result += dragDropSlotMarkup(blocks.length - 1)
    lastIndex = cursor
    openRe.lastIndex = cursor
  }

  result += html.slice(lastIndex)
  return { html: result, blocks }
}

export function formatExamHtmlForPlayer(
  rawHtml: string,
  keyPrefix: string,
  questionDbId?: string,
): string {
  const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  const questionAttr = questionDbId?.trim()
    ? ` data-question-id="${escapeAttr(questionDbId.trim())}"`
    : ''
  const identityPrefix = keyPrefix.replace(/[^a-zA-Z0-9_-]+/g, '_')
  const toFieldIdentity = (storageKey: string) => {
    return `${identityPrefix}_${storageKey.replace(/[^a-zA-Z0-9_-]+/g, '_')}`
  }
  const normalizeSlotKey = (raw: string): string => {
    const trimmed = (raw || '').trim() || 'Q1'
    if (/^Q\d+/i.test(trimmed)) {
      return trimmed.toUpperCase().replace(/^q/, 'Q')
    }
    const digits = trimmed.replace(/[^\d]/g, '')
    return digits ? `Q${digits}` : trimmed
  }
  const toBlankInput = (label: string, storageKey: string, slotKey: string) => {
    const cleanLabel = (label || '').trim() || 'Answer'
    const questionNumber = cleanLabel.match(/\d+/)?.[0] ?? cleanLabel
    const safeLabel = escapeAttr(questionNumber)
    const safeKey = escapeAttr(storageKey)
    const safeSlotKey = escapeAttr(normalizeSlotKey(slotKey))
    const identity = escapeAttr(toFieldIdentity(storageKey))
    return `<span class="ielts-blank-inline"><input class="ielts-blank-input" data-blank-key="${safeKey}" data-slot-key="${safeSlotKey}"${questionAttr} id="${identity}" name="${identity}" type="text" placeholder="${safeLabel}" aria-label="Question ${safeLabel} answer" /></span>`
  }

  let html = repairDragDropHtml(rawHtml)
  html = releaseCapturedContentFromDragDropBlocks(html)

  const extracted = extractDragDropBlocksFromHtml(html)
  html = extracted.html
  const dragDropPlaceholders = extracted.blocks

  if (typeof window !== 'undefined') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
    const root = doc.body.firstElementChild as HTMLElement | null
    if (root) {
      root.querySelectorAll('span[data-type="blank-answer"]').forEach((node, spanIndex) => {
        const id = (node.getAttribute('data-id') || 'Q1').trim() || 'Q1'
        const idSlug = id.replace(/[^a-zA-Z0-9_-]+/g, '_')
        const storageKey = `${keyPrefix}:blank:${spanIndex}:${idSlug}`
        const wrapper = doc.createElement('span')
        wrapper.innerHTML = toBlankInput(id, storageKey, id)
        node.replaceWith(wrapper)
      })
      root.querySelectorAll('input').forEach((node, index) => {
        if (node.closest('.rte-drag-drop-fill, [data-type="drag-drop-fill"]')) {
          return
        }
        const asInput = node as HTMLInputElement
        const originalType = (asInput.getAttribute('type') || asInput.type || 'text').toLowerCase()
        const isChoiceInput = originalType === 'radio' || originalType === 'checkbox'
        if (!isChoiceInput) {
          asInput.type = 'text'
          asInput.classList.add('ielts-blank-input')
        }
        asInput.disabled = false
        asInput.readOnly = false

        const rawLabel =
          asInput.getAttribute('placeholder') ||
          asInput.getAttribute('aria-label') ||
          `${index + 1}`
        const onlyNumber = rawLabel.match(/\d+/)?.[0] ?? `${index + 1}`

        const existingKey = asInput.getAttribute('data-blank-key')?.trim()
        if (!isChoiceInput && !existingKey) {
          const idSlug = onlyNumber.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'Q1'
          asInput.setAttribute('data-blank-key', `${keyPrefix}:blank:${index}:${idSlug}`)
        }
        const fieldKey = asInput.getAttribute('data-blank-key')?.trim()
        if (!isChoiceInput && fieldKey) {
          const identity = toFieldIdentity(fieldKey)
          if (!asInput.id) asInput.id = identity
          if (!asInput.name) asInput.name = identity
        }
        if (!isChoiceInput && !asInput.getAttribute('data-slot-key')?.trim()) {
          asInput.setAttribute('data-slot-key', normalizeSlotKey(onlyNumber))
        }
        if (!isChoiceInput) {
          asInput.setAttribute('placeholder', onlyNumber)
          asInput.setAttribute('aria-label', `Question ${onlyNumber} answer`)
        }
      })
      boldRadioQuestionPrefixes(root)
      sanitizeExamChoiceGroups(root)
      assignChoiceGroupKeys(root, keyPrefix, questionDbId)
      html = root.innerHTML
    }
  }

  const bracketOccurrence: Record<string, number> = {}
  html = html.replace(/\[(\d+)\]/g, (_match, n: string) => {
    const nextOcc = (bracketOccurrence[n] ?? 0) + 1
    bracketOccurrence[n] = nextOcc
    const storageKey =
      nextOcc === 1 ? `${keyPrefix}:slot:${n}` : `${keyPrefix}:slot:${n}:x${nextOcc}`
    return toBlankInput(n, storageKey, `Q${n}`)
  })
  let underlineSeq = 0
  html = html.replace(/_{4,}/g, () => {
    underlineSeq += 1
    return toBlankInput(String(underlineSeq), `${keyPrefix}:line:${underlineSeq}`, `Q${underlineSeq}`)
  })

  dragDropPlaceholders.forEach((block, index) => {
    const tagged =
      questionDbId?.trim() && !block.includes('data-question-id=')
        ? block.replace(
            /data-type="drag-drop-fill"/,
            `data-type="drag-drop-fill" data-question-id="${escapeAttr(questionDbId.trim())}"`,
          )
        : block
    const slotPattern = dragDropSlotPattern(index)
    if (slotPattern.test(html)) {
      html = html.replace(slotPattern, tagged)
    } else {
      html += tagged
    }
  })

  return stripOrphanDragDropExamArtifacts(
    releaseCapturedContentFromDragDropBlocks(repositionListeningDragDropBlocks(html)),
  )
}

/** @deprecated Use formatExamHtmlForPlayer */
export function formatListeningHtmlForExam(
  rawHtml: string,
  keyPrefix: string,
  questionDbId?: string,
): string {
  return formatExamHtmlForPlayer(rawHtml, keyPrefix, questionDbId)
}

function digitsFromAnswerKeyTail(raw: string): string | null {
  return raw.match(/\d+/)?.[0] ?? null
}

function footerQuestionIdFromChoiceStorageKey(key: string): string | null {
  const radioChoiceMatch = key.match(/:choice:radio:(\d+)$/)
  if (!radioChoiceMatch) return null
  const radioIndex = Number(radioChoiceMatch[1])
  if (!Number.isFinite(radioIndex) || radioIndex < 0) return null

  const listeningPartMatch = key.match(/^part-(\d+)-chunk-\d+:/)
  if (listeningPartMatch) {
    const part = Number(listeningPartMatch[1])
    if (Number.isFinite(part) && part > 0) {
      return String(listeningPartQuestionStart(part) + radioIndex)
    }
  }

  return String(radioIndex + 1)
}

/** Question numbers with answers for footer chip colors. */
export function collectAnsweredQuestionIds(
  blankValues: Record<string, string>,
  dragDropValues: Record<string, string>,
  writingAnswers: Record<string, string>,
  writingParts?: ModulePart[],
  choiceValues?: Record<string, string>,
): Set<string> {
  const answered = new Set<string>()

  for (const [key, value] of Object.entries(blankValues)) {
    if (!value.trim()) continue
    const slotMatch = key.match(/:slot:(\d+)/)
    if (slotMatch) {
      answered.add(slotMatch[1])
      continue
    }
    const blankMatch = key.match(/:blank:\d+:([^:]+)/)
    if (blankMatch) {
      const num = digitsFromAnswerKeyTail(blankMatch[1])
      if (num) answered.add(num)
      continue
    }
    const lineMatch = key.match(/:line:(\d+)/)
    if (lineMatch) {
      answered.add(lineMatch[1])
      continue
    }
    const domMatch = key.match(/:dom:(\d+)/)
    if (domMatch) {
      answered.add(String(Number(domMatch[1]) + 1))
    }
  }

  for (const [key, value] of Object.entries(choiceValues ?? {})) {
    if (!value.trim()) continue

    const composite = tryParseCompositeAnswerStorageKey(key)
    if (composite) {
      const qSlotMatch = composite.slotKey.match(/^Q(\d+)$/i)
      if (qSlotMatch) {
        answered.add(qSlotMatch[1])
        continue
      }
    }

    const fromChoiceKey = footerQuestionIdFromChoiceStorageKey(key)
    if (fromChoiceKey) {
      answered.add(fromChoiceKey)
      continue
    }

    const choiceMatch = key.match(/:choice:(\d+)$/)
    if (choiceMatch) {
      answered.add(choiceMatch[1])
    }
  }

  for (const [key, value] of Object.entries(dragDropValues)) {
    if (!value.trim()) continue
    const num = digitsFromAnswerKeyTail(key.slice(key.lastIndexOf(':') + 1))
    if (num) answered.add(num)
  }

  for (const part of writingParts ?? []) {
    const draft = writingAnswers[`writing-part-${part.partNumber}`]?.trim() ?? ''
    if (!draft) continue
    part.questions.forEach((question) => answered.add(question.id))
  }

  return answered
}
