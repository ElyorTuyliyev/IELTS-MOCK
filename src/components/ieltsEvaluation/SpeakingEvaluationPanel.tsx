import { useCallback, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

import { Button } from '@/components/common/Button'
import { SPEAKING_CONFIG } from '@/config/ielts'
import type { ReviewQuestion } from '@/pages/StudentExamReview/api/queries'
import type {
  ModuleEvaluationFormState,
  SpeakingEvaluationData,
  SpeakingEvaluationPayload,
} from '@/types/ieltsEvaluation'

import { IeltsEvaluationRoot } from './ieltsEvaluation.style'
import {
  getModuleOverallBand,
  isModuleEvaluationComplete,
  ModuleEvaluationSection,
} from './ModuleEvaluationSection'
import {
  createEmptyModuleFormState,
  parseSpeakingEvaluation,
  speakingDataToFormState,
} from './speakingEvaluationUtils'

type SpeakingEvaluationPanelProps = {
  questions: ReviewQuestion[]
  initialEvaluation?: string | null
  saving?: boolean
  onSave: (payload: {
    speakingEvaluation: SpeakingEvaluationPayload
    speakingScore: number
    speakingFeedback: string | null
  }) => Promise<void>
}

function buildSpeakingEvaluationData(
  formState: ModuleEvaluationFormState,
): SpeakingEvaluationData {
  const categoryScores = Object.fromEntries(
    SPEAKING_CONFIG.categories.map((category) => [
      category.key,
      formState.categoryScores[category.key] as number,
    ]),
  )

  return {
    taskType: 'speaking',
    categoryScores,
    overallBand: getModuleOverallBand(SPEAKING_CONFIG, formState) as number,
    tutorFeedback: formState.feedback.trim(),
    evaluatedAt: new Date().toISOString(),
  }
}

function SpeakingQuestionsContext({ questions }: { questions: ReviewQuestion[] }) {
  return (
    <>
      {questions.map((question) => (
        <Box key={question.questionId} sx={{ mb: 2 }}>
          <Typography className="review__question-title">
            {question.title ?? 'Speaking task'}
          </Typography>
          {question.passageHtml ? (
            <Box
              sx={{ mb: 1.5, fontSize: 14 }}
              dangerouslySetInnerHTML={{ __html: question.passageHtml }}
            />
          ) : null}
          {question.questionsHtml ? (
            <Box
              sx={{ fontSize: 14, mb: 1.5 }}
              dangerouslySetInnerHTML={{ __html: question.questionsHtml }}
            />
          ) : null}
          <Box className="review__essay">
            {question.slots
              .map((slot) => slot.studentAnswer)
              .filter(Boolean)
              .join('\n\n') ||
              'No notes submitted. Grade based on the live speaking performance.'}
          </Box>
        </Box>
      ))}
    </>
  )
}

export function SpeakingEvaluationPanel({
  questions,
  initialEvaluation,
  saving = false,
  onSave,
}: SpeakingEvaluationPanelProps) {
  const [formState, setFormState] = useState<ModuleEvaluationFormState>(
    createEmptyModuleFormState(),
  )
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    const parsed = parseSpeakingEvaluation(initialEvaluation)
    if (!parsed?.speaking) {
      setFormState(createEmptyModuleFormState())
      return
    }
    setFormState(speakingDataToFormState(parsed.speaking))
  }, [initialEvaluation])

  const isComplete = isModuleEvaluationComplete(SPEAKING_CONFIG, formState)
  const speakingScore = getModuleOverallBand(SPEAKING_CONFIG, formState)

  const handleSave = useCallback(async () => {
    if (!isComplete) {
      setShowValidation(true)
      return
    }

    if (speakingScore == null) return

    const payload: SpeakingEvaluationPayload = {
      speaking: buildSpeakingEvaluationData(formState),
      savedAt: new Date().toISOString(),
    }

    await onSave({
      speakingEvaluation: payload,
      speakingScore,
      speakingFeedback: formState.feedback.trim() || null,
    })
    setShowValidation(false)
  }, [formState, isComplete, onSave, speakingScore])

  if (questions.length === 0) {
    return (
      <Typography className="review__empty">
        No speaking tasks assigned for this student.
      </Typography>
    )
  }

  return (
    <IeltsEvaluationRoot>
      <ModuleEvaluationSection
        config={SPEAKING_CONFIG}
        formState={formState}
        onChange={setFormState}
        showValidation={showValidation}
        feedbackPlaceholder="Speaking assessment notes and feedback for the student..."
      >
        <SpeakingQuestionsContext questions={questions} />
      </ModuleEvaluationSection>

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
