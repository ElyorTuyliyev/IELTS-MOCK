import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'
import { FIND_ALL_QUESTIONS_QUERY, type FindAllQuestionsResponse, flattenGroupedQuestions } from '../../Questions/api/findAllQuestionsQuery'
import { MODULE_ORDER, MODULE_PART_COUNTS, type ModuleName } from '../constants'
import { expandAssignedQuestionIds } from '../../ExamDetails/utils/examQuestionGroups'
import {
  parsePartNumber,
  resolveStudentExamModule,
  resolveAudioUrl,
  resolveQuestionText,
  resolveQuestionContent,
  resolveListeningQuestionsHtml,
  resolveReadingQuestionsHtml,
  stripLeadingPartHeading,
  stripEditorAnswerMarksFromHtml,
  countListeningPartAnswerSlots,
  countReadingPartAnswerSlots,
  listeningPartQuestionStart,
  type BackendQuestion,
  type ModulePart,
} from '../utils'

export type ModuleDataResult = {
  grouped: Record<ModuleName, ModulePart[]>
  audioByModule: Partial<Record<ModuleName, string>>
  durationByModule: Partial<Record<ModuleName, number>>
}

export function useExamData(assignedQuestionIds?: string[] | null) {
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('examId')?.trim() ?? ''
  const { data, loading, error } = useQuery<FindAllQuestionsResponse>(
    FIND_ALL_QUESTIONS_QUERY,
    { fetchPolicy: 'network-only' },
  )

  const examQuestions = useMemo(() => {
    const all = flattenGroupedQuestions(data?.findAllQuestions ?? []) as BackendQuestion[]
    if (!examId) {
      return []
    }

    const forExam = all.filter(
      (item) => !item.examId?.trim() || String(item.examId) === examId,
    )

    const assignedIds = assignedQuestionIds?.map(String).filter(Boolean) ?? []
    if (assignedIds.length === 0) {
      return forExam.filter((item) => String(item.examId ?? '').trim() === examId)
    }

    const expandedIds = new Set(
      expandAssignedQuestionIds(examId, forExam, assignedIds),
    )
    return forExam.filter((item) => expandedIds.has(String(item._id)))
  }, [assignedQuestionIds, data?.findAllQuestions, examId])

  const moduleData = useMemo((): ModuleDataResult => {
    const grouped: Record<ModuleName, ModulePart[]> = {
      listening: [],
      reading: [],
      writing: [],
      speaking: [],
    }
    const audioByModule: Partial<Record<ModuleName, string>> = {}
    const durationByModule: Partial<Record<ModuleName, number>> = {}

    const questionsByModuleAndPart: Record<ModuleName, Record<number, BackendQuestion[]>> = {
      listening: {},
      reading: {},
      writing: {},
      speaking: {},
    }

    for (const item of examQuestions) {
      const module = resolveStudentExamModule(item)
      if (!module) continue

      const partNumber = parsePartNumber(item, module)
      ;(questionsByModuleAndPart[module][partNumber] ??= []).push(item)

      if (module === 'speaking') {
        if (!audioByModule.speaking && item.speakingAudio?.trim()) {
          audioByModule.speaking = resolveAudioUrl(item.speakingAudio.trim())
        }
      } else if (!audioByModule[module] && item.listeningAudio?.trim()) {
        audioByModule[module] = resolveAudioUrl(item.listeningAudio.trim())
      }
      const placementMinutes = Number(item.placementNumber)
      if (!durationByModule[module] && Number.isFinite(placementMinutes) && placementMinutes > 0) {
        durationByModule[module] = Math.floor(placementMinutes * 60)
      }
    }

    for (const module of MODULE_ORDER) {
      const moduleParts = Object.keys(questionsByModuleAndPart[module])
        .map(Number)
        .filter((num) => Number.isFinite(num) && num > 0)
      const maxPartNumber = Math.max(
        MODULE_PART_COUNTS[module] ?? 0,
        moduleParts.length > 0 ? Math.max(...moduleParts) : 0,
      )

      if (maxPartNumber <= 0) continue

      let globalQuestionNumber = 1
      const builtParts: ModulePart[] = []

      for (let partNumber = 1; partNumber <= maxPartNumber; partNumber += 1) {
        const questions = questionsByModuleAndPart[module][partNumber] ?? []
        if (questions.length === 0) {
          builtParts.push({ partNumber, questions: [] })
          continue
        }

        const ordered = [...questions].sort((a, b) => {
          const aP = Number(a.placementNumber ?? Number.MAX_SAFE_INTEGER)
          const bP = Number(b.placementNumber ?? Number.MAX_SAFE_INTEGER)
          return aP !== bP ? aP - bP : a._id.localeCompare(b._id)
        })

        let partQuestions: ModulePart['questions']

        if (module === 'listening') {
          const source = ordered[0]
          const contentHtml = stripLeadingPartHeading(
            ordered
              .map((q) => resolveListeningQuestionsHtml(q) || resolveQuestionContent(q))
              .filter(Boolean)
              .join(''),
          )
          const partStart = listeningPartQuestionStart(partNumber)
          const count = countListeningPartAnswerSlots(ordered, partNumber)
          partQuestions = Array.from({ length: count }, (_, idx) => ({
            id: String(partStart + idx),
            text: resolveQuestionText(source, idx + 1),
            html: idx === 0 ? contentHtml || undefined : undefined,
            questionDbId: source._id,
          }))
          globalQuestionNumber = partStart + count
        } else if (module === 'reading') {
          const source = ordered[0]
          const contentHtml = ordered
            .map((q) => resolveReadingQuestionsHtml(q))
            .filter(Boolean)
            .join('')
          const partStart = globalQuestionNumber
          const count = countReadingPartAnswerSlots(ordered)
          partQuestions = Array.from({ length: count }, (_, idx) => ({
            id: String(partStart + idx),
            text: resolveQuestionText(source, idx + 1),
            html: idx === 0 ? contentHtml || undefined : undefined,
            questionDbId: source._id,
          }))
          globalQuestionNumber = partStart + count
        } else if (module === 'writing' || module === 'speaking') {
          partQuestions = ordered.map((q, idx) => ({
            id: String(globalQuestionNumber + idx),
            text: resolveQuestionText(q, idx + 1),
            html: resolveQuestionContent(q) || undefined,
            questionDbId: q._id,
          }))
          globalQuestionNumber += ordered.length
        } else {
          partQuestions = ordered.map((q, idx) => ({
            id: String(globalQuestionNumber + idx),
            text: resolveQuestionText(q, idx + 1),
            html: resolveQuestionContent(q) || undefined,
            questionDbId: q._id,
          }))
          globalQuestionNumber += ordered.length
        }

        const partPassage =
          module === 'reading'
            ? (() => {
                const raw = ordered.find((q) => (q.passageHtml ?? '').trim())?.passageHtml?.trim()
                return raw
                  ? stripEditorAnswerMarksFromHtml(stripLeadingPartHeading(raw))
                  : undefined
              })()
            : module === 'writing' || module === 'speaking'
              ? ordered.find((q) => (q.passageHtml ?? '').trim())?.passageHtml?.trim() ||
                ordered.find((q) => (q.sourceMaterial ?? '').trim())?.sourceMaterial?.trim() ||
                undefined
              : undefined

        builtParts.push({
          partNumber,
          passageHtml: partPassage,
          questions: partQuestions,
        })
      }

      grouped[module] = builtParts
    }

    return { grouped, audioByModule, durationByModule }
  }, [examQuestions])

  const hasAnyQuestions = useMemo(
    () =>
      MODULE_ORDER.some((m) =>
        moduleData.grouped[m].some((part) => part.questions.length > 0),
      ),
    [moduleData],
  )

  return { examQuestions, moduleData, hasAnyQuestions, loading, error } as const
}
