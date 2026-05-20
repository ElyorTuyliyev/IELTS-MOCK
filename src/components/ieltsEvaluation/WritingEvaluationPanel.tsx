import { useCallback, useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'

import { Button } from '@/components/common/Button'
import { WRITING_TASK_1_CONFIG, WRITING_TASK_2_CONFIG } from '@/config/ielts'
import type { ReviewQuestion } from '@/pages/StudentExamReview/api/queries'
import type {
  ModuleEvaluationFormState,
  WritingEvaluationPayload,
  WritingTaskEvaluationData,
} from '@/types/ieltsEvaluation'

import { IeltsEvaluationRoot } from './ieltsEvaluation.style'
import {
  getModuleOverallBand,
  isModuleEvaluationComplete,
  ModuleEvaluationSection,
} from './ModuleEvaluationSection'
import {
  buildCombinedWritingFeedback,
  computeModuleWritingScore,
  createEmptyTaskFormState,
  inferWritingTaskType,
  parseWritingEvaluation,
  taskDataToFormState,
} from './writingEvaluationUtils'

type TaskSlot = {
  taskType: 'writing-task-1' | 'writing-task-2'
  question: ReviewQuestion
}

type WritingEvaluationPanelProps = {
  questions: ReviewQuestion[]
  initialEvaluation?: string | null
  saving?: boolean
  onSave: (payload: {
    writingEvaluation: WritingEvaluationPayload
    writingScore: number
    writingFeedback: string | null
  }) => Promise<void>
}

function buildTaskEvaluationData(
  taskType: 'writing-task-1' | 'writing-task-2',
  formState: ModuleEvaluationFormState,
  config: typeof WRITING_TASK_1_CONFIG | typeof WRITING_TASK_2_CONFIG,
): WritingTaskEvaluationData {
  const categoryScores = Object.fromEntries(
    config.categories.map((category) => [
      category.key,
      formState.categoryScores[category.key] as number,
    ]),
  )

  return {
    taskType,
    categoryScores,
    overallBand: getModuleOverallBand(config, formState) as number,
    tutorFeedback: formState.feedback.trim(),
    evaluatedAt: new Date().toISOString(),
  }
}

export function WritingEvaluationPanel({
  questions,
  initialEvaluation,
  saving = false,
  onSave,
}: WritingEvaluationPanelProps) {
  const taskSlots = useMemo<TaskSlot[]>(() => {
    const writingQuestions = questions.slice(0, 2)
    if (writingQuestions.length === 0) {
      return [
        { taskType: 'writing-task-1', question: { questionId: 'task1', slots: [] } },
        { taskType: 'writing-task-2', question: { questionId: 'task2', slots: [] } },
      ]
    }

    return writingQuestions.map((question, index) => ({
      taskType: inferWritingTaskType(question, index),
      question,
    }))
  }, [questions])

  const hasTask1 = taskSlots.some((slot) => slot.taskType === 'writing-task-1')
  const hasTask2 = taskSlots.some((slot) => slot.taskType === 'writing-task-2')

  const [task1State, setTask1State] = useState<ModuleEvaluationFormState>(
    createEmptyTaskFormState(),
  )
  const [task2State, setTask2State] = useState<ModuleEvaluationFormState>(
    createEmptyTaskFormState(),
  )
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    const parsed = parseWritingEvaluation(initialEvaluation)
    if (!parsed) {
      setTask1State(createEmptyTaskFormState())
      setTask2State(createEmptyTaskFormState())
      return
    }
    setTask1State(taskDataToFormState(parsed.task1))
    setTask2State(taskDataToFormState(parsed.task2))
  }, [initialEvaluation])

  const task1Question = taskSlots.find((slot) => slot.taskType === 'writing-task-1')?.question
  const task2Question = taskSlots.find((slot) => slot.taskType === 'writing-task-2')?.question

  const task1Complete = isModuleEvaluationComplete(WRITING_TASK_1_CONFIG, task1State)
  const task2Complete = isModuleEvaluationComplete(WRITING_TASK_2_CONFIG, task2State)

  const moduleWritingScore = useMemo(
    () =>
      computeModuleWritingScore(
        getModuleOverallBand(WRITING_TASK_1_CONFIG, task1State),
        getModuleOverallBand(WRITING_TASK_2_CONFIG, task2State),
      ),
    [task1State, task2State],
  )

  const handleSave = useCallback(async () => {
    const task1Required = hasTask1
    const task2Required = hasTask2

    if (
      (task1Required && !task1Complete) ||
      (task2Required && !task2Complete)
    ) {
      setShowValidation(true)
      return
    }

    const payload: WritingEvaluationPayload = {
      savedAt: new Date().toISOString(),
    }

    if (task1Required) {
      payload.task1 = buildTaskEvaluationData(
        'writing-task-1',
        task1State,
        WRITING_TASK_1_CONFIG,
      )
    }

    if (task2Required) {
      payload.task2 = buildTaskEvaluationData(
        'writing-task-2',
        task2State,
        WRITING_TASK_2_CONFIG,
      )
    }

    const writingScore = moduleWritingScore
    if (writingScore == null) return

    await onSave({
      writingEvaluation: payload,
      writingScore,
      writingFeedback: buildCombinedWritingFeedback(
        task1State.feedback,
        task2State.feedback,
      ),
    })
    setShowValidation(false)
  }, [
    hasTask1,
    hasTask2,
    moduleWritingScore,
    onSave,
    task1Complete,
    task1State,
    task2Complete,
    task2State,
  ])

  if (questions.length === 0) {
    return (
      <Typography className="review__empty">
        No writing tasks assigned for this student.
      </Typography>
    )
  }

  return (
    <IeltsEvaluationRoot>
      {hasTask1 ? (
        <ModuleEvaluationSection
          config={WRITING_TASK_1_CONFIG}
          responseTitle={task1Question?.title ?? 'Writing Task 1'}
          responsePromptHtml={task1Question?.passageHtml}
          studentResponse={task1Question?.slots[0]?.studentAnswer}
          emptyResponseLabel="No essay submitted yet."
          formState={task1State}
          onChange={setTask1State}
          showValidation={showValidation}
        />
      ) : null}

      {hasTask2 ? (
        <ModuleEvaluationSection
          config={WRITING_TASK_2_CONFIG}
          responseTitle={task2Question?.title ?? 'Writing Task 2'}
          responsePromptHtml={task2Question?.passageHtml}
          studentResponse={task2Question?.slots[0]?.studentAnswer}
          emptyResponseLabel="No essay submitted yet."
          formState={task2State}
          onChange={setTask2State}
          showValidation={showValidation}
        />
      ) : null}

      <div className="ielts-eval__actions">
        <Button
          variant="primary"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving...' : 'Save Evaluation'}
        </Button>
      </div>
    </IeltsEvaluationRoot>
  )
}
