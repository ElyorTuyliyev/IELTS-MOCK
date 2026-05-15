import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react'
import { formatExamHtmlForPlayer } from '../utils'
import { c } from '../../../theme'
import type { DisplayQuestion } from '../utils'
import type { ModuleName } from '../constants'

function bindBlankInputs(
  container: HTMLElement,
  blankValuesRef: { current: Record<string, string> },
  setBlankValues: Dispatch<SetStateAction<Record<string, string>>>,
): Array<() => void> {
  const inputs = Array.from(
    container.querySelectorAll<HTMLInputElement>('input.ielts-blank-input'),
  )
  return inputs.map((input) => {
    const key = input.dataset.blankKey
    if (!key) return () => {}

    input.disabled = false
    input.readOnly = false
    input.style.pointerEvents = 'auto'
    input.autocomplete = 'off'

    const savedValue = blankValuesRef.current[key] ?? ''
    if (document.activeElement !== input && input.value !== savedValue) {
      input.value = savedValue
    }

    const handleInput = () => {
      const value = input.value
      setBlankValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
    }

    input.addEventListener('input', handleInput)
    input.addEventListener('change', handleInput)
    return () => {
      input.removeEventListener('input', handleInput)
      input.removeEventListener('change', handleInput)
    }
  })
}

function applySavedChoiceValue(
  inputs: HTMLInputElement[],
  savedValue: string,
): void {
  if (inputs.length === 0) return
  const inputType = (inputs[0].getAttribute('type') || inputs[0].type || 'radio').toLowerCase()
  if (inputType === 'radio') {
    inputs.forEach((input) => {
      input.checked = input.value === savedValue
    })
    return
  }
  const checked = new Set(savedValue.split(',').map((item) => item.trim()).filter(Boolean))
  inputs.forEach((input) => {
    input.checked = checked.has(input.value)
  })
}

function readChoiceValue(inputs: HTMLInputElement[]): string {
  if (inputs.length === 0) return ''
  const inputType = (inputs[0].getAttribute('type') || inputs[0].type || 'radio').toLowerCase()
  if (inputType === 'radio') {
    return inputs.find((input) => input.checked)?.value ?? ''
  }
  return inputs
    .filter((input) => input.checked)
    .map((input) => input.value)
    .join(',')
}

function bindChoiceInputs(
  container: HTMLElement,
  choiceValuesRef: { current: Record<string, string> },
  setChoiceValues: Dispatch<SetStateAction<Record<string, string>>>,
): Array<() => void> {
  const cleanups: Array<() => void> = []
  const boundKeys = new Set<string>()

  container
    .querySelectorAll<HTMLElement>(
      '[data-type="radio-group"], .rte-radio-group, [data-type="checkbox-group"], .rte-checkbox-group',
    )
    .forEach((group) => {
      const choiceKey = group.getAttribute('data-choice-key')?.trim()
      if (!choiceKey || boundKeys.has(choiceKey)) return
      boundKeys.add(choiceKey)

      const inputs = Array.from(
        group.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]'),
      )
      inputs.forEach((input) => {
        input.disabled = false
        input.readOnly = false
        input.style.pointerEvents = 'auto'
      })

      const savedValue = choiceValuesRef.current[choiceKey] ?? ''
      if (savedValue) {
        applySavedChoiceValue(inputs, savedValue)
      }

      const handleChange = () => {
        const value = readChoiceValue(inputs)
        setChoiceValues((prev) => (prev[choiceKey] === value ? prev : { ...prev, [choiceKey]: value }))
      }

      inputs.forEach((input) => {
        input.addEventListener('change', handleChange)
        cleanups.push(() => input.removeEventListener('change', handleChange))
      })
    })

  return cleanups
}

type BlankInputInitial = {
  blankValues?: Record<string, string>
  choiceValues?: Record<string, string>
}

export function useBlankInputSync(
  activeModule: ModuleName,
  part: number,
  currentPartQuestions: DisplayQuestion[],
  listeningContentRef: RefObject<HTMLDivElement | null>,
  moduleContentRef: RefObject<HTMLDivElement | null>,
  initial?: BlankInputInitial,
) {
  const [blankValues, setBlankValues] = useState<Record<string, string>>(
    initial?.blankValues ?? {},
  )
  const blankValuesRef = useRef(initial?.blankValues ?? {})
  const [choiceValues, setChoiceValues] = useState<Record<string, string>>(
    initial?.choiceValues ?? {},
  )
  const choiceValuesRef = useRef(initial?.choiceValues ?? {})
  const valuesRestoredRef = useRef(
    Boolean(
      (initial?.blankValues && Object.keys(initial.blankValues).length > 0) ||
        (initial?.choiceValues && Object.keys(initial.choiceValues).length > 0),
    ),
  )

  useEffect(() => {
    if (valuesRestoredRef.current || !initial) return
    const nextBlanks = initial.blankValues ?? {}
    const nextChoices = initial.choiceValues ?? {}
    const hasBlanks = Object.keys(nextBlanks).length > 0
    const hasChoices = Object.keys(nextChoices).length > 0
    if (!hasBlanks && !hasChoices) return
    valuesRestoredRef.current = true
    if (hasBlanks) {
      setBlankValues(nextBlanks)
      blankValuesRef.current = nextBlanks
    }
    if (hasChoices) {
      setChoiceValues(nextChoices)
      choiceValuesRef.current = nextChoices
    }
  }, [initial])

  const updateBlankValuesRef = useCallback(() => {
    blankValuesRef.current = blankValues
  }, [blankValues])
  useEffect(updateBlankValuesRef, [updateBlankValuesRef])

  const updateChoiceValuesRef = useCallback(() => {
    choiceValuesRef.current = choiceValues
  }, [choiceValues])
  useEffect(updateChoiceValuesRef, [updateChoiceValuesRef])

  const listeningHtmlSourceKey = useMemo(() => {
    if (activeModule !== 'listening') return ''
    return `${part}|${currentPartQuestions.map((q) => `${q.id}\u0001${q.html ?? ''}`).join('\u0002')}`
  }, [activeModule, part, currentPartQuestions])

  const listeningHtml = useMemo(() => {
    if (activeModule !== 'listening' || !listeningHtmlSourceKey) return null
    const chunks = currentPartQuestions
      .map((q) => q.html?.trim())
      .filter((v): v is string => Boolean(v))
    if (chunks.length === 0) return null
    return chunks
      .map((chunk, idx) =>
        formatExamHtmlForPlayer(
          chunk,
          `part-${part}-chunk-${idx}`,
          currentPartQuestions[0]?.questionDbId,
        ),
      )
      .join(`<hr style="border:none;border-top:1px solid ${c.examPlayer.border};margin:12px 0;" />`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeningHtmlSourceKey])

  useEffect(() => {
    const container = listeningContentRef.current
    if (!container) return
    const cleanups = [
      ...bindBlankInputs(container, blankValuesRef, setBlankValues),
      ...bindChoiceInputs(container, choiceValuesRef, setChoiceValues),
    ]
    return () => cleanups.forEach((fn) => fn())
  }, [listeningHtml, listeningContentRef])

  const readingHtmlSourceKey = useMemo(() => {
    if (activeModule !== 'reading') return ''
    return `${part}|${currentPartQuestions.map((q) => `${q.id}\u0001${q.html ?? ''}`).join('\u0002')}`
  }, [activeModule, part, currentPartQuestions])

  const readingHtml = useMemo(() => {
    if (activeModule !== 'reading' || !readingHtmlSourceKey) return null
    const chunks = currentPartQuestions
      .map((q) => q.html?.trim())
      .filter((v): v is string => Boolean(v))
    if (chunks.length === 0) return null
    return chunks
      .map((chunk, idx) =>
        formatExamHtmlForPlayer(
          chunk,
          `reading-part-${part}-chunk-${idx}`,
          currentPartQuestions[0]?.questionDbId,
        ),
      )
      .join('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingHtmlSourceKey])

  useEffect(() => {
    if (activeModule !== 'reading') return
    const container = moduleContentRef.current
    if (!container) return
    const cleanups = [
      ...bindBlankInputs(container, blankValuesRef, setBlankValues),
      ...bindChoiceInputs(container, choiceValuesRef, setChoiceValues),
    ]
    return () => cleanups.forEach((fn) => fn())
  }, [activeModule, moduleContentRef, readingHtml])

  useEffect(() => {
    if (activeModule !== 'reading') return
    const container = moduleContentRef.current
    if (!container) return

    container.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
      if (input.closest('.rte-drag-drop-fill, [data-type="drag-drop-fill"]')) {
        return
      }
      const inputType = (input.getAttribute('type') || input.type || 'text').toLowerCase()
      input.disabled = false
      input.readOnly = false
      if (inputType !== 'radio' && inputType !== 'checkbox') {
        input.type = 'text'
      }
      input.style.pointerEvents = 'auto'
    })
  }, [activeModule, readingHtml, moduleContentRef])

  return { blankValues, choiceValues, listeningHtml, readingHtml } as const
}
