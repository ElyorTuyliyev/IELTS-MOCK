import { Box, Typography } from '@mui/material'
import type { ReviewModule } from '../../StudentExamReview/api/queries'
import { ProtectedExamAudioPlayer } from '../../StudentExam/components/ProtectedExamAudioPlayer'
import { resolveAudioUrl } from '../../StudentExam/utils'

function SlotBadge({ isCorrect }: { isCorrect?: boolean | null }) {
  if (isCorrect === true) {
    return <span className="review__badge review__badge--correct">Correct</span>
  }
  if (isCorrect === false) {
    return <span className="review__badge review__badge--wrong">Incorrect</span>
  }
  return <span className="review__badge review__badge--neutral">—</span>
}

function formatSlotLabel(slotKey: string): string {
  const key = slotKey.trim()
  const qMatch = key.match(/^Q(\d+)$/i)
  if (qMatch) return `Question ${qMatch[1]}`
  const radioMatch = key.match(/^radio-(\d+)$/i)
  if (radioMatch) return `Choice ${radioMatch[1]}`
  return key
}

type StudentReviewModulePanelProps = {
  module: ReviewModule
}

export function StudentReviewModulePanel({ module }: StudentReviewModulePanelProps) {
  const isReading = module.module === 'Reading'
  const isWriting = module.module === 'Writing'
  const isSpeaking = module.module === 'Speaking'
  const audioUrl = module.audioUrl ? resolveAudioUrl(module.audioUrl) : undefined

  if (isWriting || isSpeaking) {
    return (
      <>
        {audioUrl ? (
          <ProtectedExamAudioPlayer
            audioUrl={audioUrl}
            label={isSpeaking ? 'Play examiner audio' : 'Play listening audio'}
          />
        ) : null}
        {module.questions.length === 0 ? (
          <Typography className="review__empty">No answers for this module.</Typography>
        ) : (
          module.questions.map((q) => (
            <Box key={q.questionId} className="review__question-block">
              <Typography className="review__question-title">
                {q.title ?? (isWriting ? 'Writing task' : 'Speaking task')}
              </Typography>
              {q.passageHtml?.trim() ? (
                <Box
                  className="review__html review__html--passage"
                  sx={{ mb: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: q.passageHtml }}
                />
              ) : null}
              {q.questionsHtml?.trim() ? (
                <Box
                  className="review__html review__html--questions"
                  sx={{ mb: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: q.questionsHtml }}
                />
              ) : null}
              <Typography className="review__content-label">Your answer</Typography>
              <Box className="review__essay review__essay--readonly">
                {q.slots
                  .map((slot) => slot.studentAnswer?.trim())
                  .filter(Boolean)
                  .join('\n\n') || 'No answer submitted.'}
              </Box>
            </Box>
          ))
        )}
      </>
    )
  }

  return (
    <>
      {audioUrl ? (
        <ProtectedExamAudioPlayer audioUrl={audioUrl} label="Play exam audio (playback only)" />
      ) : null}
      <Box className="review__module-summary">
        <Typography>
          Score: <strong>{module.score != null ? module.score : '—'}</strong>
        </Typography>
        <Typography>
          Auto score: <strong>{module.correctCount}</strong> / {module.totalCount} correct
        </Typography>
      </Box>
      {module.questions.length === 0 ? (
        <Typography className="review__empty">No answers for this module.</Typography>
      ) : (
        module.questions.map((q) => (
          <Box key={q.questionId} className="review__question-block">
            <Typography className="review__question-title">
              {q.title ?? 'Question'}
              {q.listeningPart ? ` · Part ${q.listeningPart}` : ''}
            </Typography>

            {isReading && q.passageHtml?.trim() && (
              <Box className="review__passage">
                <Typography className="review__content-label">Passage</Typography>
                <Box
                  className="review__html review__html--passage"
                  dangerouslySetInnerHTML={{ __html: q.passageHtml }}
                />
              </Box>
            )}

            {q.questionsHtml?.trim() && (
              <Box className="review__questions-preview">
                <Typography className="review__content-label">Questions</Typography>
                <Box
                  className="review__html review__html--questions"
                  dangerouslySetInnerHTML={{ __html: q.questionsHtml }}
                />
              </Box>
            )}

            {q.slots.length === 0 ? (
              <Typography className="review__empty review__empty--inline">
                No answers found.
              </Typography>
            ) : (
              <Box className="review__answers-table">
                <Box className="review__slot-row review__slot-row--header">
                  <Typography sx={{ fontWeight: 700 }}>№</Typography>
                  <Typography sx={{ fontWeight: 700 }}>Your answer</Typography>
                  <Typography sx={{ fontWeight: 700 }}>Correct answer</Typography>
                  <Typography sx={{ fontWeight: 700 }}>Result</Typography>
                </Box>
                {q.slots.map((slot) => {
                  const unanswered = !slot.studentAnswer?.trim()
                  return (
                    <Box
                      key={`${q.questionId}-${slot.slotKey}`}
                      className={`review__slot-row${
                        slot.isCorrect === true
                          ? ' review__slot-row--correct'
                          : slot.isCorrect === false
                            ? ' review__slot-row--wrong'
                            : ''
                      }`}
                    >
                      <Typography sx={{ fontWeight: 700 }}>{formatSlotLabel(slot.slotKey)}</Typography>
                      <Box>
                        <Typography
                          className={
                            unanswered
                              ? 'review__answer review__answer--missing'
                              : 'review__answer'
                          }
                        >
                          {unanswered ? 'No answer given' : slot.studentAnswer}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className="review__answer">
                          {slot.correctAnswer?.trim() || '—'}
                        </Typography>
                      </Box>
                      <SlotBadge isCorrect={slot.isCorrect} />
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        ))
      )}
    </>
  )
}
