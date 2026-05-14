import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'
import { FIND_ALL_QUESTIONS_QUERY, type FindAllQuestionsResponse, flattenGroupedQuestions } from '../../Questions/api/findAllQuestionsQuery'
import { MODULE_ORDER, MODULE_PART_COUNTS, type ModuleName } from '../constants'
import {
  normalizeModule,
  parsePartNumber,
  resolveAudioUrl,
  resolveQuestionText,
  resolveQuestionContent,
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

  const assignedIdSet = useMemo(() => {
    const ids = assignedQuestionIds?.map(String).filter(Boolean) ?? []
    return ids.length > 0 ? new Set(ids) : null
  }, [assignedQuestionIds])

  const examQuestions = useMemo(() => {
    const all = flattenGroupedQuestions(data?.findAllQuestions ?? []) as BackendQuestion[]
    if (!examId) {
      return []
    }

    return all.filter((item) => {
      if (assignedIdSet?.has(String(item._id))) {
        return true
      }
      const qExam = item.examId?.trim() ?? ''
      return qExam !== '' && String(qExam) === examId
    })
  }, [assignedIdSet, data?.findAllQuestions, examId])

  const moduleData = useMemo((): ModuleDataResult => {
    const grouped: Record<ModuleName, ModulePart[]> = { listening: [], reading: [], writing: [] }
    const audioByModule: Partial<Record<ModuleName, string>> = {}
    const durationByModule: Partial<Record<ModuleName, number>> = {}

    const questionsByModuleAndPart: Record<ModuleName, Record<number, BackendQuestion[]>> = {
      listening: {},
      reading: {},
      writing: {},
    }

    for (const item of examQuestions) {
      const module =
        normalizeModule(item.ieltsModule, item.type) ??
        (item.listeningPart ? 'listening' : null)
      if (!module) continue

      const partNumber = parsePartNumber(item, module)
      ;(questionsByModuleAndPart[module][partNumber] ??= []).push(item)

      if (!audioByModule[module] && item.listeningAudio?.trim()) {
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
          const contentHtml = ordered
            .map((q) => resolveQuestionContent(q))
            .filter(Boolean)
            .join('')
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
            : module === 'writing'
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
    () => MODULE_ORDER.some((m) => moduleData.grouped[m].length > 0),
    [moduleData],
  )

  return { examQuestions, moduleData, hasAnyQuestions, loading, error } as const
}
