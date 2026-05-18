import { compositeAnswerStorageKey } from './answerStorageKeys'

export type SubmitExamAnswerItem = {
  questionId: string
  slotKey: string
  studentAnswer: string
}

function slotKeyFromLabel(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  if (digits) return `Q${digits}`
  return raw.trim() || 'Q1'
}

export function flushBlankValuesFromDom(
  roots: Array<HTMLElement | null | undefined>,
  stored: Record<string, string>,
): Record<string, string> {
  const next = { ...stored }
  for (const root of roots) {
    if (!root) continue
    root.querySelectorAll<HTMLInputElement>('input.ielts-blank-input').forEach((input) => {
      const key = input.dataset.blankKey?.trim()
      if (!key) return
      next[key] = input.value

      const questionId =
        input.getAttribute('data-question-id')?.trim() ||
        input.closest('[data-question-id]')?.getAttribute('data-question-id')?.trim() ||
        ''
      const slotKey = input.getAttribute('data-slot-key')?.trim() || ''
      const compositeKey =
        questionId && slotKey ? compositeAnswerStorageKey(questionId, slotKey) : ''
      if (compositeKey) {
        next[compositeKey] = input.value
      }
    })
  }
  return next
}

export function flushChoiceValuesFromDom(
  roots: Array<HTMLElement | null | undefined>,
  stored: Record<string, string>,
): Record<string, string> {
  const next = { ...stored }
  for (const root of roots) {
    if (!root) continue
    root
      .querySelectorAll<HTMLElement>(
        '[data-type="radio-group"][data-choice-key], .rte-radio-group[data-choice-key]',
      )
      .forEach((group) => {
        const choiceKey = group.getAttribute('data-choice-key')?.trim()
        if (!choiceKey) return
        const inputs = Array.from(
          group.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        )
        const checked = inputs.find((input) => input.checked)
        if (!checked) return
        const label =
          checked.closest('label')?.querySelector('.rte-radio-label')?.textContent?.trim() ||
          checked.closest('label')?.textContent?.trim() ||
          checked.value
        next[choiceKey] = label

        const questionId =
          group.getAttribute('data-question-id')?.trim() ||
          group.closest('[data-question-id]')?.getAttribute('data-question-id')?.trim() ||
          ''
        const slotKey = group.getAttribute('data-slot-key')?.trim() || ''
        const compositeKey =
          questionId && slotKey ? compositeAnswerStorageKey(questionId, slotKey) : ''
        if (compositeKey) {
          next[compositeKey] = label
        }
      })
  }
  return next
}

export function collectExamAnswersFromDom(root: HTMLElement | null): SubmitExamAnswerItem[] {
  if (!root) return []

  const answers: SubmitExamAnswerItem[] = []
  const seen = new Set<string>()

  const push = (questionId: string, slotKey: string, studentAnswer: string) => {
    const qid = questionId.trim()
    const slot = slotKey.trim()
    const value = studentAnswer.trim()
    if (!qid || !slot || !value) return
    const dedupe = `${qid}\u0000${slot}\u0000${value}`
    if (seen.has(dedupe)) return
    seen.add(dedupe)
    answers.push({ questionId: qid, slotKey: slot, studentAnswer: value })
  }

  root.querySelectorAll<HTMLInputElement>('input.ielts-blank-input').forEach((input) => {
    const questionId =
      input.getAttribute('data-question-id') ??
      input.closest('[data-question-id]')?.getAttribute('data-question-id') ??
      ''
    const blankKey = input.getAttribute('data-blank-key') ?? input.dataset.blankKey ?? ''
    const slotFromAttr = input.getAttribute('data-slot-key')?.trim()
    const blankIdMatch = blankKey.match(/:blank:\d+:([^:]+)/)
    const slotMatch = blankKey.match(/:slot:(\d+)/)
    const lineMatch = blankKey.match(/:line:(\d+)/)
    const slotKey = slotFromAttr
      ? slotKeyFromLabel(slotFromAttr)
      : blankIdMatch
        ? slotKeyFromLabel(blankIdMatch[1])
        : slotMatch
          ? slotKeyFromLabel(slotMatch[1])
          : lineMatch
            ? slotKeyFromLabel(lineMatch[1])
            : slotKeyFromLabel(
                input.getAttribute('placeholder') ?? input.getAttribute('aria-label') ?? '',
              )
    push(questionId, slotKey, input.value)
  })

  root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]').forEach((block) => {
    const questionId =
      block.getAttribute('data-question-id') ??
      block.closest('[data-question-id]')?.getAttribute('data-question-id') ??
      ''
    block.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone, zoneIndex) => {
      const gapId = zone.dataset.gapId ?? zone.getAttribute('data-gap-id') ?? `Q${zoneIndex + 1}`
      const chip = zone.querySelector<HTMLElement>('.rte-drag-drop-fill__chip')
      const value = chip?.dataset.chipValue ?? chip?.textContent?.trim() ?? zone.dataset.dropValue ?? ''
      push(questionId, slotKeyFromLabel(gapId), value)
    })
  })

  root.querySelectorAll<HTMLElement>('[data-question-id]').forEach((container) => {
    const questionId = container.getAttribute('data-question-id') ?? ''
    if (!questionId) return

    container.querySelectorAll<HTMLElement>('div[data-type="radio-group"]').forEach((group, groupIndex) => {
      const slotKey = `radio-${groupIndex + 1}`
      const optionsJson = group.getAttribute('data-options') ?? '[]'
      let selectedValue = ''
      group.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio) => {
        if (radio.checked) selectedValue = radio.value
      })
      if (!selectedValue) return
      try {
        const parsed = JSON.parse(optionsJson) as unknown
        if (Array.isArray(parsed)) {
          const match = parsed.find((item, index) => {
            if (item && typeof item === 'object' && 'value' in item) {
              return String((item as { value?: unknown }).value ?? index) === selectedValue
            }
            return String(index) === selectedValue
          })
          const label =
            match && typeof match === 'object' && 'label' in match
              ? String((match as { label?: unknown }).label ?? '')
              : selectedValue
          push(questionId, slotKey, label)
          return
        }
      } catch {
        /* ignore */
      }
      push(questionId, slotKey, selectedValue)
    })

    container.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked').forEach((radio) => {
      if (radio.closest('div[data-type="radio-group"]')) return
      const name = radio.getAttribute('name') ?? ''
      const slotKey = slotKeyFromLabel(name)
      const label =
        radio.closest('label')?.textContent?.trim() ||
        radio.parentElement?.textContent?.trim() ||
        radio.value
      push(questionId, slotKey, label)
    })
  })

  return answers.filter((item) => item.questionId && item.studentAnswer)
}

export function collectExamAnswersFromRoots(
  roots: Array<HTMLElement | null | undefined>,
): SubmitExamAnswerItem[] {
  const map = new Map<string, SubmitExamAnswerItem>()
  for (const root of roots) {
    for (const item of collectExamAnswersFromDom(root)) {
      map.set(`${item.questionId}\u0000${item.slotKey}`, item)
    }
  }
  return [...map.values()]
}
