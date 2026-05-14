import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { ROUTES_PATH } from '../../../routes/paths'
import { StudentExamPlayerRoot } from '../pages/StudentExamPlayerPage.style'

export type StudentExamUnavailableReason = 'ended' | 'no_exam'

const COPY: Record<
  StudentExamUnavailableReason,
  { title: string; description: string }
> = {
  ended: {
    title: 'Exam ended',
    description: 'This exam has finished or its time has passed. Retakes are not allowed.',
  },
  no_exam: {
    title: 'No exam assigned',
    description: 'No active exam is currently assigned to you.',
  },
}

type StudentExamUnavailableProps = {
  reason: StudentExamUnavailableReason
  description?: string
}

export function StudentExamUnavailable({ reason, description }: StudentExamUnavailableProps) {
  const navigate = useNavigate()
  const copy = COPY[reason]

  return (
    <StudentExamPlayerRoot>
      <Box className="student-exam-player__main">
        <Box className="student-exam-player__empty-state">
          <Typography className="student-exam-player__empty-title">{copy.title}</Typography>
          <Typography className="student-exam-player__empty-sub">
            {description ?? copy.description}
          </Typography>
          <Button
            variant="primary"
            className="student-exam-player__listening-play"
            sx={{ mt: 2 }}
            onClick={() => navigate(ROUTES_PATH.studentMyExams)}
          >
            Back to my exams
          </Button>
        </Box>
      </Box>
    </StudentExamPlayerRoot>
  )
}
