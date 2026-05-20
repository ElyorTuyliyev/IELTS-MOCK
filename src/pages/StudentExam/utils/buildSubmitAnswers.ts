import type { ModuleDataResult } from '../hooks/useExamData'
import type { SubmitExamAnswerItem } from './collectExamAnswers'
import {
  slotKeyFromChoiceStorageKey,
  tryParseCompositeAnswerStorageKey,
} from './answerStorageKeys'

function slotKeyFromDigits(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? `Q${digits}` : raw.trim()
}

function slotKeyFromBlankStorageKey(key: string): string | null {
  const blankMatch = key.match(/:blank:\d+:([^:]+)/)
  if (blankMatch) {
    const id = blankMatch[1].trim()
    return /^Q\d+/i.test(id) ? id.toUpperCase().replace(/^q/, 'Q') : slotKeyFromDigits(id)
  }
  const slotMatch = key.match(/:slot:(\d+)/)
  if (slotMatch) return slotKeyFromDigits(slotMatch[1])
  const lineMatch = key.match(/:line:(\d+)/)
  if (lineMatch) return slotKeyFromDigits(lineMatch[1])
  const domMatch = key.match(/:dom:(\d+)/)
  if (domMatch) return slotKeyFromDigits(domMatch[1])
  return null
}

function readingQuestionIdForPart(
  moduleData: ModuleDataResult,
  partNumber: number,
): string | undefined {
  return moduleData.grouped.reading.find((item) => item.partNumber === partNumber)?.questions[0]
    ?.questionDbId
}

function questionIdForPartKey(
  moduleData: ModuleDataResult,
  key: string,
): string | undefined {
  const listeningMatch = key.match(/^part-(\d+)-/)
  if (listeningMatch) {
    return listeningQuestionIdForPart(moduleData, Number(listeningMatch[1]))
  }
  const readingMatch = key.match(/^reading-part-(\d+)-/)
  if (readingMatch) {
    return readingQuestionIdForPart(moduleData, Number(readingMatch[1]))
  }
  return undefined
}

function questionIdFromBlankStorageKey(
  key: string,
  moduleData: ModuleDataResult,
): string | undefined {
  const mongoMatch = key.match(/^q-([a-fA-F0-9]{24})-c\d+:(?:blank|choice|slot|line|dom):/)
  if (mongoMatch?.[1]) return mongoMatch[1]

  const qChunkMatch = key.match(/^q-(.+?)-c\d+:(?:blank|choice|slot|line|dom):/)
  if (qChunkMatch?.[1]) return qChunkMatch[1]

  const qLegacyMatch = key.match(/^q-([a-fA-F0-9]{24}):/)
  if (qLegacyMatch?.[1]) return qLegacyMatch[1]

  return questionIdForPartKey(moduleData, key)
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
    const composite = tryParseCompositeAnswerStorageKey(key)
    if (composite) {
      push(composite.questionId, composite.slotKey, value)
      continue
    }

    const questionId = questionIdFromBlankStorageKey(key, moduleData)
    const slotKey = slotKeyFromBlankStorageKey(key)
    if (questionId && slotKey) {
      push(questionId, slotKey, value)
    }
  }

  for (const [key, value] of Object.entries(choiceValues)) {
    const composite = tryParseCompositeAnswerStorageKey(key)
    if (composite) {
      push(composite.questionId, composite.slotKey, value)
      continue
    }

    // Legacy :choice:radio:N keys map to radio-N; prefer composite keys from flushChoiceValuesFromDom.
    if (/:choice:radio:\d+$/.test(key)) continue

    const questionId = questionIdFromBlankStorageKey(key, moduleData)
    if (!questionId) continue

    const slotKey = slotKeyFromChoiceStorageKey(key)
    if (slotKey) push(questionId, slotKey, value)
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

function buildModuleTextAnswers(
  answersByPartKey: Record<string, string>,
  moduleData: ModuleDataResult,
  module: 'writing' | 'speaking',
  slotKey: string,
): SubmitExamAnswerItem[] {
  const answers: SubmitExamAnswerItem[] = []
  const prefix = module === 'writing' ? 'writing-part-' : 'speaking-part-'
  for (const part of moduleData.grouped[module]) {
    const text = answersByPartKey[`${prefix}${part.partNumber}`]?.trim()
    const questionId = part.questions[0]?.questionDbId?.trim()
    if (!questionId || !text) continue
    answers.push({ questionId, slotKey, studentAnswer: text })
  }
  return answers
}

export function buildWritingSubmitAnswers(
  writingAnswers: Record<string, string>,
  moduleData: ModuleDataResult,
): SubmitExamAnswerItem[] {
  return buildModuleTextAnswers(writingAnswers, moduleData, 'writing', 'ESSAY')
}

export function buildSpeakingSubmitAnswers(
  speakingAnswers: Record<string, string>,
  moduleData: ModuleDataResult,
): SubmitExamAnswerItem[] {
  return buildModuleTextAnswers(speakingAnswers, moduleData, 'speaking', 'SPEAKING')
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
