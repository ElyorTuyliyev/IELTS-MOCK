import { useCallback, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Alert, Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { Layout } from '../../../components/layout'
import { formatModuleScore } from '../../../helpers/scores'
import { ROUTES_PATH } from '../../../routes/paths'
import { StudentExamReviewRoot } from '../../StudentExamReview/pages/StudentExamReviewPage.style'
import {
  FIND_MY_STUDENT_EXAM_REVIEW_QUERY,
  type FindMyStudentExamReviewResponse,
} from '../api/findMyStudentExamReviewQuery'
import { StudentReviewModulePanel } from '../components/StudentReviewModulePanel'

export function StudentMyExamReviewPage() {
  const navigate = useNavigate()
  const { studentExamId } = useParams()
  const [tab, setTab] = useState(0)

  const { data, loading, error } = useQuery<FindMyStudentExamReviewResponse>(
    FIND_MY_STUDENT_EXAM_REVIEW_QUERY,
    {
      variables: { _id: studentExamId ?? '' },
      skip: !studentExamId,
      fetchPolicy: 'network-only',
    },
  )

  const review = data?.findMyStudentExamReview
  const modules = review?.modules ?? []
  const activeModule = modules[tab]

  const handleBack = useCallback(() => {
    navigate(ROUTES_PATH.studentMyExams)
  }, [navigate])

  return (
    <Layout>
      <StudentExamReviewRoot>
        <Box className="review__header">
          <Box>
            <Typography className="review__title">
              {review?.examTitle ?? 'Exam results'}
            </Typography>
            <Typography className="review__sub">
              Read-only review · {review?.isCompleted ? 'Completed' : 'In progress'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
            {review ? (
              <Box className="review__scores">
                <span className="review__score-chip">
                  L: {formatModuleScore(review.listeningScore)}
                </span>
                <span className="review__score-chip">
                  R: {formatModuleScore(review.readingScore)}
                </span>
                <span className="review__score-chip">
                  W: {formatModuleScore(review.writingScore)}
                </span>
                <span className="review__score-chip">
                  S: {formatModuleScore(review.speakingScore)}
                </span>
                <span className="review__score-chip">
                  Overall: {formatModuleScore(review.totalScore)}
                </span>
              </Box>
            ) : null}
            <Button variant="secondary" onClick={handleBack}>
              ← Back to my exams
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box className="review__card" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={22} />
            <Typography>Loading your results...</Typography>
          </Box>
        ) : null}

        {error ? <Alert severity="error">{error.message}</Alert> : null}

        {!loading && !error && review ? (
          <Box className="review__card">
            {(review.writingFeedback?.trim() || review.speakingFeedback?.trim()) && (
              <Box sx={{ mb: 2.5 }}>
                {review.writingFeedback?.trim() ? (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography className="review__label">Writing feedback</Typography>
                    <Typography className="review__feedback-readonly">
                      {review.writingFeedback}
                    </Typography>
                  </Box>
                ) : null}
                {review.speakingFeedback?.trim() ? (
                  <Box>
                    <Typography className="review__label">Speaking feedback</Typography>
                    <Typography className="review__feedback-readonly">
                      {review.speakingFeedback}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            )}

            {modules.length === 0 ? (
              <Typography className="review__empty">
                No module data yet. Your answers may still be processing.
              </Typography>
            ) : (
              <>
                <Tabs
                  className="review__tabs"
                  value={tab}
                  onChange={(_event, value) => setTab(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {modules.map((moduleItem) => (
                    <Tab key={moduleItem.module} label={moduleItem.module} />
                  ))}
                </Tabs>

                <Box sx={{ mt: 2.5 }}>
                  {activeModule ? <StudentReviewModulePanel module={activeModule} /> : null}
                </Box>
              </>
            )}
          </Box>
        ) : null}
      </StudentExamReviewRoot>
    </Layout>
  )
}
