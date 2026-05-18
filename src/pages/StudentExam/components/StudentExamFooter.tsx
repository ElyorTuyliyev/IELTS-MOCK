import { Box, IconButton, Typography } from '@mui/material'
import type { ModuleName } from '../constants'

type FooterQuestion = {
  id: string
}

type FooterPart = {
  partNumber: number
  questions: FooterQuestion[]
}

export type StudentExamFooterProps = {
  visibleParts: FooterPart[]
  activeModule: ModuleName
  activePart: number
  activeQuestion: string
  answeredQuestionIds: ReadonlySet<string>
  canGoToNextModule: boolean
  onSelectPart: (partNumber: number, firstQuestionId: string) => void
  onSelectQuestion: (questionId: string) => void
  onCompleteModule: () => void
}

export function StudentExamFooter({
  visibleParts,
  activeModule,
  activePart,
  activeQuestion,
  answeredQuestionIds,
  canGoToNextModule,
  onSelectPart,
  onSelectQuestion,
  onCompleteModule,
}: StudentExamFooterProps) {
  return (
    <Box className="student-exam-player__footer">
      {visibleParts.map((partItem) => {
        const isCurrent = partItem.partNumber === activePart
        const hasQuestions = partItem.questions.length > 0
        const lastSpeakingPart = visibleParts
          .filter((p) => p.questions.length > 0)
          .map((p) => p.partNumber)
          .sort((a, b) => b - a)[0]

        const isCompletionPart =
          (activeModule === 'listening' && partItem.partNumber === 4) ||
          (activeModule === 'reading' && partItem.partNumber === 3) ||
          (activeModule === 'writing' && partItem.partNumber === 2) ||
          (activeModule === 'speaking' &&
            partItem.partNumber === (lastSpeakingPart ?? 3))

        const showQuestionChips = hasQuestions && isCurrent

        return (
          <Box
            key={partItem.partNumber}
            className={`student-exam-player__part-tab${isCurrent ? ' student-exam-player__part-tab--current' : ''}${
              showQuestionChips ? '' : ' student-exam-player__part-tab--collapsed'
            }${!hasQuestions ? ' student-exam-player__part-tab--empty' : ''}`}
            onClick={() => {
              if (isCurrent || !hasQuestions) return
              onSelectPart(partItem.partNumber, partItem.questions[0]?.id ?? '1')
            }}
          >
            {showQuestionChips ? (
              <>
                <Typography className="student-exam-player__part-tab-title">
                  Part {partItem.partNumber}
                </Typography>
                <Box className="student-exam-player__part-tab-row">
                  <Box className="student-exam-player__part-tab-chips">
                    {partItem.questions.map((question) => (
                      <Box
                        key={`${partItem.partNumber}-${question.id}`}
                        className={`student-exam-player__q-chip${
                          question.id === activeQuestion ? ' student-exam-player__q-chip--active' : ''
                        }${
                          answeredQuestionIds.has(question.id)
                            ? ' student-exam-player__q-chip--answered'
                            : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectQuestion(question.id)
                        }}
                      >
                        {question.id}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            ) : hasQuestions ? (
              <Typography className="student-exam-player__part-tab-idle">
                Part {partItem.partNumber}
              </Typography>
            ) : (
              <Typography className="student-exam-player__part-tab-idle">
                Part {partItem.partNumber}
                &nbsp;&nbsp;—
              </Typography>
            )}

            {isCompletionPart ? (
              <Box className="student-exam-player__complete-cell">
                <IconButton
                  size="small"
                  className="student-exam-player__complete-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    onCompleteModule()
                  }}
                  disabled={
                    (activeModule === 'writing' && partItem.partNumber === 2) ||
                    (activeModule === 'speaking' &&
                      partItem.partNumber === (lastSpeakingPart ?? 3))
                      ? false
                      : !canGoToNextModule
                  }
                >
                  <Typography className="student-exam-player__complete-check">✓</Typography>
                </IconButton>
              </Box>
            ) : null}
          </Box>
        )
      })}
    </Box>
  )
}
