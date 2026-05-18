import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Alert,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import { ROUTES_PATH } from '../../../routes/paths'
import {
  FIND_STUDENT_EXAM_REVIEW_QUERY,
  UPDATE_STUDENT_EXAM_REVIEW_MUTATION,
  type FindStudentExamReviewResponse,
  type ReviewModule,
} from '../api/queries'
import { formatModuleScore } from '../../../helpers/scores'
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
          Score: <strong>{module.score ?? 0}</strong>
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
                  <Typography fontWeight={700}>№</Typography>
                  <Typography fontWeight={700}>Student answer</Typography>
                  <Typography fontWeight={700}>Correct answer</Typography>
                  <Typography fontWeight={700}>Result</Typography>
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
                      <Typography fontWeight={700}>{formatSlotLabel(slot.slotKey)}</Typography>
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
  const [writingFeedback, setWritingFeedback] = useState('')
  const [speakingFeedback, setSpeakingFeedback] = useState('')

  useEffect(() => {
    if (!review) return
    setWritingScore(review.writingScore != null ? String(review.writingScore) : '')
    setSpeakingScore(review.speakingScore != null ? String(review.speakingScore) : '')
    setWritingFeedback(review.writingFeedback ?? '')
    setSpeakingFeedback(review.speakingFeedback ?? '')
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

  const handleSaveScores = useCallback(async () => {
    if (!studentExamId) return
    try {
      const res = await updateReview({
        variables: {
          input: {
            studentExamId,
            writingScore: writingScore === '' ? undefined : Number(writingScore),
            speakingScore: speakingScore === '' ? undefined : Number(speakingScore),
            writingFeedback: writingFeedback.trim() || null,
            speakingFeedback: speakingFeedback.trim() || null,
          },
        },
      })
      if (res.error) {
        toast.error(res.error.message ?? 'Save failed.')
        return
      }
      toast.success('Scores saved.')
      void refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed.')
    }
  }, [
    refetch,
    speakingFeedback,
    speakingScore,
    studentExamId,
    toast,
    updateReview,
    writingFeedback,
    writingScore,
  ])

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
                <span className="review__score-chip">L: {review.listeningScore ?? 0}</span>
                <span className="review__score-chip">R: {review.readingScore ?? 0}</span>
                <span className="review__score-chip">W: {review.writingScore ?? 0}</span>
                <span className="review__score-chip">S: {review.speakingScore ?? 0}</span>
                <span className="review__score-chip">
                  Overall: {formatModuleScore(review.totalScore)}
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
                      <>
                        {writingModule?.questions.map((q) => (
                          <Box key={q.questionId} className="review__question-block">
                            <Typography className="review__question-title">
                              {q.title ?? 'Writing task'}
                            </Typography>
                            {q.passageHtml && (
                              <Box
                                sx={{ mb: 1.5, fontSize: 14 }}
                                dangerouslySetInnerHTML={{ __html: q.passageHtml }}
                              />
                            )}
                            <Box className="review__essay">
                              {q.slots[0]?.studentAnswer?.trim() ||
                                'No essay submitted yet.'}
                            </Box>
                          </Box>
                        ))}
                        <Box className="review__form-grid">
                          <Box>
                            <Typography className="review__label">Writing score</Typography>
                            <TextField
                              className="review__input"
                              type="number"
                              size="small"
                              value={writingScore}
                              onChange={(e) => setWritingScore(e.target.value)}
                              inputProps={{ min: 0, step: 0.5 }}
                            />
                          </Box>
                          <Box>
                            <Typography className="review__label">Feedback</Typography>
                            <TextField
                              className="review__textarea"
                              multiline
                              minRows={4}
                              fullWidth
                              value={writingFeedback}
                              onChange={(e) => setWritingFeedback(e.target.value)}
                              placeholder="Comments for the student..."
                            />
                          </Box>
                        </Box>
                      </>
                    ) : activeModule.module === 'Speaking' ? (
                      <>
                        {speakingModule?.questions.length ? (
                          speakingModule.questions.map((q) => (
                            <Box key={q.questionId} className="review__question-block">
                              <Typography className="review__question-title">
                                {q.title ?? 'Speaking task'}
                              </Typography>
                              {q.passageHtml && (
                                <Box
                                  sx={{ mb: 1.5, fontSize: 14 }}
                                  dangerouslySetInnerHTML={{ __html: q.passageHtml }}
                                />
                              )}
                              {q.questionsHtml && (
                                <Box
                                  sx={{ fontSize: 14, mb: 1.5 }}
                                  dangerouslySetInnerHTML={{ __html: q.questionsHtml }}
                                />
                              )}
                              <Box className="review__essay">
                                {q.slots.map((s) => s.studentAnswer).filter(Boolean).join('\n\n') ||
                                  'No notes submitted. Grade based on the live speaking performance.'}
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography className="review__empty">
                            No speaking tasks assigned for this student.
                          </Typography>
                        )}
                        <Box className="review__form-grid">
                          <Box>
                            <Typography className="review__label">Speaking score</Typography>
                            <TextField
                              className="review__input"
                              type="number"
                              size="small"
                              value={speakingScore}
                              onChange={(e) => setSpeakingScore(e.target.value)}
                              inputProps={{ min: 0, step: 0.5 }}
                            />
                          </Box>
                          <Box>
                            <Typography className="review__label">Feedback</Typography>
                            <TextField
                              className="review__textarea"
                              multiline
                              minRows={3}
                              fullWidth
                              value={speakingFeedback}
                              onChange={(e) => setSpeakingFeedback(e.target.value)}
                              placeholder="Speaking assessment notes..."
                            />
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <GradedModulePanel module={activeModule} />
                    ))}

                  {(activeModule?.module === 'Writing' ||
                    activeModule?.module === 'Speaking') && (
                    <Box className="review__actions">
                      <Button
                        variant="primary"
                        disabled={saving}
                        onClick={() => void handleSaveScores()}
                      >
                        {saving ? 'Saving...' : 'Save scores'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        )}
      </StudentExamReviewRoot>
    </Layout>
  )
}
