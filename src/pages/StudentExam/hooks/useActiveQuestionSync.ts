import { useEffect, useRef, type RefObject } from 'react'
import type { ModuleName } from '../constants'

function questionNumberFromInput(input: HTMLInputElement): string | null {
  const label = input.placeholder || input.getAttribute('aria-label') || ''
  return label.match(/\d+/)?.[0] ?? null
}

function questionNumberFromDropZone(zone: HTMLElement): string | null {
  const gapId = zone.dataset.gapId ?? zone.getAttribute('data-gap-id') ?? ''
  return gapId.match(/\d+/)?.[0] ?? null
}

function getExamContainers(
  listeningContentRef: RefObject<HTMLDivElement | null>,
  moduleContentRef: RefObject<HTMLDivElement | null>,
): HTMLElement[] {
  return [listeningContentRef.current, moduleContentRef.current].filter(
    (node): node is HTMLElement => node !== null,
  )
}

export function useActiveQuestionSync(
  activeQuestion: string,
  activeModule: ModuleName,
  onSelectQuestion: (questionId: string) => void,
  listeningContentRef: RefObject<HTMLDivElement | null>,
  moduleContentRef: RefObject<HTMLDivElement | null>,
  listeningHtml: string | null,
  readingHtml: string | null,
) {
  const activeQuestionRef = useRef(activeQuestion)
  activeQuestionRef.current = activeQuestion

  const contentKey = `${activeModule}|${listeningHtml ?? ''}|${readingHtml ?? ''}`

  useEffect(() => {
    const cleanups: Array<() => void> = []

    const bindContainer = (container: HTMLElement) => {
      container.querySelectorAll<HTMLInputElement>('input.ielts-blank-input').forEach((input) => {
        const activate = () => {
          const num = questionNumberFromInput(input)
          if (num && num !== activeQuestionRef.current) {
            onSelectQuestion(num)
          }
        }
        input.addEventListener('focus', activate)
        input.addEventListener('click', activate)
        cleanups.push(() => {
          input.removeEventListener('focus', activate)
          input.removeEventListener('click', activate)
        })
      })

      container.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop').forEach((zone) => {
        const activate = () => {
          const num = questionNumberFromDropZone(zone)
          if (num && num !== activeQuestionRef.current) {
            onSelectQuestion(num)
          }
        }
        zone.addEventListener('click', activate)
        cleanups.push(() => {
          zone.removeEventListener('click', activate)
        })
      })
    }

    getExamContainers(listeningContentRef, moduleContentRef).forEach(bindContainer)
    return () => cleanups.forEach((fn) => fn())
  }, [contentKey, listeningContentRef, moduleContentRef, onSelectQuestion])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      for (const container of getExamContainers(listeningContentRef, moduleContentRef)) {
        for (const input of container.querySelectorAll<HTMLInputElement>('input.ielts-blank-input')) {
          if (questionNumberFromInput(input) !== activeQuestion) continue
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
          if (document.activeElement !== input) {
            input.focus({ preventScroll: true })
          }
          return
        }

        for (const zone of container.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop')) {
          if (questionNumberFromDropZone(zone) !== activeQuestion) continue
          zone.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [activeQuestion, contentKey, listeningContentRef, moduleContentRef])
}
