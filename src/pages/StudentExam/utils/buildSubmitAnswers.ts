import type { ModuleDataResult } from '../hooks/useExamData'
import type { SubmitExamAnswerItem } from './collectExamAnswers'

function slotKeyFromDigits(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? `Q${digits}` : raw.trim()
}

function listeningQuestionIdForPart(
  moduleData: ModuleDataResult,
  partNumber: number,
): string | undefined {
  const part = moduleData.grouped.listening.find((item) => item.partNumber === partNumber)
  return part?.questions[0]?.questionDbId
}

export function buildSubmitAnswersFromStores(
  blankValues: Record<string, string>,
  dragDropValues: Record<string, string>,
  choiceValues: Record<string, string>,
  moduleData: ModuleDataResult,
): SubmitExamAnswerItem[] {
  const answers: SubmitExamAnswerItem[] = []
  const seen = new Set<string>()

  const push = (questionId: string, slotKey: string, studentAnswer: string) => {
    const qid = questionId.trim()
    const slot = slotKey.trim()
    const value = studentAnswer.trim()
    if (!qid || !slot || !value) return
    const dedupe = `${qid}\u0000${slot}`
    if (seen.has(dedupe)) return
    seen.add(dedupe)
    answers.push({ questionId: qid, slotKey: slot, studentAnswer: value })
  }

  for (const [key, value] of Object.entries(blankValues)) {
    const partMatch = key.match(/^part-(\d+)-/)
    if (partMatch) {
      const partNumber = Number(partMatch[1])
      const slotMatch = key.match(/:slot:(\d+)/)
      const slotKey = slotMatch ? slotKeyFromDigits(slotMatch[1]) : 'Q1'
      const questionId = listeningQuestionIdForPart(moduleData, partNumber)
      if (questionId) push(questionId, slotKey, value)
      continue
    }
    const qidSep = key.indexOf('|')
    if (qidSep > 0) {
      push(key.slice(0, qidSep), key.slice(qidSep + 1), value)
    }
  }

  for (const [key, value] of Object.entries(choiceValues)) {
    const listeningPartMatch = key.match(/^part-(\d+)-/)
    const readingPartMatch = key.match(/^reading-part-(\d+)-/)
    const partNumber = Number(listeningPartMatch?.[1] ?? readingPartMatch?.[1] ?? NaN)
    if (!Number.isFinite(partNumber) || partNumber <= 0) continue

    const questionId =
      listeningPartMatch
        ? listeningQuestionIdForPart(moduleData, partNumber)
        : moduleData.grouped.reading.find((item) => item.partNumber === partNumber)?.questions[0]
            ?.questionDbId
    if (!questionId) continue

    const choiceSlotMatch = key.match(/:choice:(\d+)$/)
    const slotKey = choiceSlotMatch ? slotKeyFromDigits(choiceSlotMatch[1]) : 'Q1'
    push(questionId, slotKey, value)
  }

  for (const [key, value] of Object.entries(dragDropValues)) {
    const colonIdx = key.lastIndexOf(':')
    if (colonIdx <= 0) continue
    const gapPart = key.slice(colonIdx + 1)
    const blockKey = key.slice(0, colonIdx)
    const questionId = blockKey.replace(/^dd-/, '').replace(/-\d+$/, '')
    if (questionId) push(questionId, slotKeyFromDigits(gapPart), value)
  }

  return answers
}

export function mergeSubmitAnswers(
  ...groups: SubmitExamAnswerItem[][]
): SubmitExamAnswerItem[] {
  const map = new Map<string, SubmitExamAnswerItem>()
  for (const group of groups) {
    for (const item of group) {
      map.set(`${item.questionId}\u0000${item.slotKey}`, item)
    }
  }
  return [...map.values()]
}
