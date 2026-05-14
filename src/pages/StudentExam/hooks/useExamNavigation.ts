import { useCallback, useEffect, useMemo, useState } from 'react'
import { MODULE_ORDER, MODULE_PART_COUNTS, type ModuleName } from '../constants'
import type { ModuleDataResult } from './useExamData'
import type { DisplayQuestion, ModulePart } from '../utils'

export function useExamNavigation(moduleData: ModuleDataResult) {
  const [moduleIndex, setModuleIndex] = useState(0)
  const [part, setPart] = useState(1)
  const [activeQuestion, setActiveQuestion] = useState('1')

  const activeModule: ModuleName = MODULE_ORDER[moduleIndex] ?? 'writing'

  const activeParts = moduleData.grouped[activeModule]
  const visibleParts: ModulePart[] = useMemo(() => {
    const fromData = activeParts ?? []
    if (fromData.length > 0) {
      return fromData
    }
    const expectedCount = MODULE_PART_COUNTS[activeModule] ?? 0
    return Array.from({ length: expectedCount }, (_, index) => ({
      partNumber: index + 1,
      questions: [] as DisplayQuestion[],
    }))
  }, [activeModule, activeParts])

  const currentPart = useMemo(
    () => visibleParts.find((item) => item.partNumber === part),
    [visibleParts, part],
  )
  const currentPartQuestions = useMemo(
    () => currentPart?.questions ?? [],
    [currentPart?.questions],
  )
  const currentPartPassage = currentPart?.passageHtml

  const currentQuestionIds = useMemo(
    () => currentPartQuestions.map((q) => q.id),
    [currentPartQuestions],
  )

  const moduleQuestions = useMemo(
    () => visibleParts.flatMap((item) => item.questions),
    [visibleParts],
  )

  useEffect(() => {
    const firstWithQuestions = visibleParts.find((item) => item.questions.length > 0)
    if (!firstWithQuestions) return

    const currentPartData = visibleParts.find((item) => item.partNumber === part)
    const questionInCurrentPart = currentPartData?.questions.some((q) => q.id === activeQuestion)

    if (currentPartData?.questions.length && questionInCurrentPart) {
      return
    }

    if (currentPartData?.questions.length) {
      setActiveQuestion(currentPartData.questions[0].id)
      return
    }

    setPart(firstWithQuestions.partNumber)
    setActiveQuestion(firstWithQuestions.questions[0].id)
  }, [visibleParts, part, activeQuestion])

  const activePartIndex = useMemo(
    () => visibleParts.findIndex((item) => item.partNumber === part),
    [visibleParts, part],
  )

  const activeQuestionIndex = useMemo(
    () => moduleQuestions.findIndex((q) => q.id === activeQuestion),
    [moduleQuestions, activeQuestion],
  )

  const canGoToNextModule = moduleIndex < MODULE_ORDER.length - 1

  const goToModuleIndex = useCallback(
    (nextIndex: number) => {
      const nextModule = MODULE_ORDER[nextIndex]
      if (!nextModule) return
      const nextParts = moduleData.grouped[nextModule] ?? []
      const firstPart =
        nextParts.find((item) => item.questions.length > 0) ?? nextParts[0]
      setModuleIndex(nextIndex)
      setPart(firstPart?.partNumber ?? 1)
      setActiveQuestion(firstPart?.questions[0]?.id ?? '1')
    },
    [moduleData.grouped],
  )

  const handleMoveQuestion = useCallback(
    (direction: -1 | 1) => {
      const curIdx = activeQuestionIndex < 0 ? 0 : activeQuestionIndex
      const nextIdx = curIdx + direction
      if (nextIdx < 0 || nextIdx >= moduleQuestions.length) {
        return
      }

      const nextQuestion = moduleQuestions[nextIdx]
      const ownerPart = visibleParts.find((item) =>
        item.questions.some((q) => q.id === nextQuestion.id),
      )
      if (ownerPart) {
        setPart(ownerPart.partNumber)
      }
      setActiveQuestion(nextQuestion.id)
    },
    [activeQuestionIndex, moduleQuestions, visibleParts],
  )

  const handleSelectPart = useCallback((partNumber: number, firstQuestionId: string) => {
    setPart(partNumber)
    setActiveQuestion(firstQuestionId)
  }, [])

  const handleSelectQuestion = useCallback(
    (questionId: string) => {
      const ownerPart = visibleParts.find((item) =>
        item.questions.some((q) => q.id === questionId),
      )
      if (ownerPart) {
        setPart(ownerPart.partNumber)
      }
      setActiveQuestion(questionId)
    },
    [visibleParts],
  )

  return {
    moduleIndex,
    activeModule,
    visibleParts,
    part,
    activeQuestion,
    currentPartQuestions,
    currentPartPassage,
    currentQuestionIds,
    moduleQuestions,
    activePartIndex,
    activeQuestionIndex,
    canGoToNextModule,
    goToModuleIndex,
    handleMoveQuestion,
    handleSelectPart,
    handleSelectQuestion,
  } as const
}
