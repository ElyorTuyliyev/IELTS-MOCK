import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Alert,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { WritingEvaluationPanel, SpeakingEvaluationPanel } from '../../../components/ieltsEvaluation'
import { Button } from '../../../components/common/Button'
import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import { ROUTES_PATH } from '../../../routes/paths'
import type {
  SpeakingEvaluationPayload,
  WritingEvaluationPayload,
} from '../../../types/ieltsEvaluation'
import {
  FIND_STUDENT_EXAM_REVIEW_QUERY,
  UPDATE_STUDENT_EXAM_REVIEW_MUTATION,
  type FindStudentExamReviewResponse,
  type ReviewModule,
} from '../api/queries'
import { computeOverallModuleScore, formatModuleScore } from '../../../helpers/scores'
import { StudentExamReviewRoot } from './StudentExamReviewPage.style'

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

function GradedModulePanel({ module }: { module: ReviewModule }) {
  const isReading = module.module === 'Reading'

  return (
    <>
      <Box className="review__module-summary">
        <Typography>
          Score: <strong>{formatModuleScore(module.score)}</strong>
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
                  <Typography sx={{ fontWeight: 700 }}>Student answer</Typography>
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

export function StudentExamReviewPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const { examId, studentExamId } = useParams()
  const [tab, setTab] = useState(0)

  const { data, loading, error, refetch } = useQuery<FindStudentExamReviewResponse>(
    FIND_STUDENT_EXAM_REVIEW_QUERY,
    {
      variables: { _id: studentExamId ?? '' },
      skip: !studentExamId,
      fetchPolicy: 'network-only',
    },
  )

  const review = data?.findStudentExamReview

  const [writingScore, setWritingScore] = useState('')
  const [speakingScore, setSpeakingScore] = useState('')

  useEffect(() => {
    if (!review) return
    setWritingScore(review.writingScore != null ? String(review.writingScore) : '')
    setSpeakingScore(review.speakingScore != null ? String(review.speakingScore) : '')
  }, [review])

  const [updateReview, { loading: saving }] = useMutation(UPDATE_STUDENT_EXAM_REVIEW_MUTATION)

  const modules = review?.modules ?? []
  const activeModule = modules[tab]

  const writingModule = useMemo(
    () => modules.find((m) => m.module === 'Writing'),
    [modules],
  )
  const speakingModule = useMemo(
    () => modules.find((m) => m.module === 'Speaking'),
    [modules],
  )

  const displayOverall = useMemo(() => {
    if (!review) return null
    const w = writingScore === '' ? review.writingScore : Number(writingScore)
    const s = speakingScore === '' ? review.speakingScore : Number(speakingScore)
    return computeOverallModuleScore(
      review.listeningScore,
      review.readingScore,
      Number.isFinite(w) ? w : 0,
      Number.isFinite(s) ? s : 0,
    )
  }, [review, speakingScore, writingScore])

  const handleSaveSpeakingEvaluation = useCallback(
    async (payload: {
      speakingEvaluation: SpeakingEvaluationPayload
      speakingScore: number
      speakingFeedback: string | null
    }) => {
      if (!studentExamId) return
      try {
        const res = await updateReview({
          variables: {
            input: {
              studentExamId,
              speakingScore: payload.speakingScore,
              speakingFeedback: payload.speakingFeedback,
              speakingEvaluation: JSON.stringify(payload.speakingEvaluation),
            },
          },
        })
        if (res.error) {
          toast.error(res.error.message ?? 'Save failed.')
          return
        }
        setSpeakingScore(String(payload.speakingScore))
        toast.success('Speaking evaluation saved.')
        void refetch()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Save failed.')
      }
    },
    [refetch, studentExamId, toast, updateReview],
  )

  const handleSaveWritingEvaluation = useCallback(
    async (payload: {
      writingEvaluation: WritingEvaluationPayload
      writingScore: number
      writingFeedback: string | null
    }) => {
      if (!studentExamId) return
      try {
        const res = await updateReview({
          variables: {
            input: {
              studentExamId,
              writingScore: payload.writingScore,
              writingFeedback: payload.writingFeedback,
              writingEvaluation: JSON.stringify(payload.writingEvaluation),
            },
          },
        })
        if (res.error) {
          toast.error(res.error.message ?? 'Save failed.')
          return
        }
        setWritingScore(String(payload.writingScore))
        toast.success('Writing evaluation saved.')
        void refetch()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Save failed.')
      }
    },
    [refetch, studentExamId, toast, updateReview],
  )

  const handleBack = useCallback(() => {
    if (examId) {
      navigate(ROUTES_PATH.examDetails.replace(':examId', examId), { replace: true })
      return
    }
    navigate(ROUTES_PATH.allExams)
  }, [examId, navigate])

  return (
    <Layout>
      <StudentExamReviewRoot>
        <Box className="review__header">
          <Box>
            <Typography className="review__title">
              {review?.studentName ?? 'Student review'}
            </Typography>
            <Typography className="review__sub">
              {review?.examTitle ?? 'Exam'} ·{' '}
              {review?.isCompleted ? 'Completed' : 'In progress'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
            {review && (
              <Box className="review__scores">
                <span className="review__score-chip">
                  L: {formatModuleScore(review.listeningScore)}
                </span>
                <span className="review__score-chip">
                  R: {formatModuleScore(review.readingScore)}
                </span>
                <span className="review__score-chip">
                  W: {formatModuleScore(
                    writingScore === '' ? review.writingScore : Number(writingScore),
                  )}
                </span>
                <span className="review__score-chip">
                  S: {formatModuleScore(
                    speakingScore === '' ? review.speakingScore : Number(speakingScore),
                  )}
                </span>
                <span className="review__score-chip">
                  Overall: {formatModuleScore(displayOverall)}
                </span>
              </Box>
            )}
            <Button variant="secondary" onClick={handleBack}>
              ← Back to exam
            </Button>
          </Box>
        </Box>

        {loading && (
          <Box className="review__card" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={22} />
            <Typography>Loading review...</Typography>
          </Box>
        )}

        {error && <Alert severity="error">{error.message}</Alert>}

        {!loading && !error && review && (
          <Box className="review__card">
            {modules.length === 0 ? (
              <Typography className="review__empty">
                No module data yet. The student may not have submitted answers.
              </Typography>
            ) : (
              <>
                <Tabs
                  className="review__tabs"
                  value={tab}
                  onChange={(_e, v) => setTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {modules.map((m) => (
                    <Tab key={m.module} label={m.module} />
                  ))}
                </Tabs>

                <Box sx={{ mt: 2.5 }}>
                  {activeModule &&
                    (activeModule.module === 'Writing' ? (
                      <WritingEvaluationPanel
                        questions={writingModule?.questions ?? []}
                        initialEvaluation={review.writingEvaluation}
                        saving={saving}
                        onSave={handleSaveWritingEvaluation}
                      />
                    ) : activeModule.module === 'Speaking' ? (
                      <SpeakingEvaluationPanel
                        questions={speakingModule?.questions ?? []}
                        initialEvaluation={review.speakingEvaluation}
                        saving={saving}
                        onSave={handleSaveSpeakingEvaluation}
                      />
                    ) : (
                      <GradedModulePanel module={activeModule} />
                    ))}

                </Box>
              </>
            )}
          </Box>
        )}
      </StudentExamReviewRoot>
    </Layout>
  )
}
