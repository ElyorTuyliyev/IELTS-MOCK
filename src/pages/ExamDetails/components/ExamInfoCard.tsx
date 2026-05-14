import { Box, Chip, Typography } from '@mui/material'
import type { Exam } from '../api'
import { formatShortDate } from '../../../helpers/dateFormat'
import { formatPriceInSom } from '../../../utils/priceFormat'

type ExamInfoCardProps = {
  exam: Exam
}

const INFO_FIELDS = (exam: Exam) => [
  { label: 'Type', value: exam.examType ?? 'IELTS' },
  { label: 'Examiner', value: exam.examiner },
  { label: 'Date', value: formatShortDate(exam.examDate) },
  { label: 'Time', value: `${exam.startTime} – ${exam.endTime}` },
  { label: 'Price', value: formatPriceInSom(exam.price) },
]

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
  return (
    <Box className="exam-details__card">
      <Box className="exam-details__info-header">
        <Typography className="exam-details__card-title">{exam.title}</Typography>
        <Chip
          className="exam-details__status-chip"
          label={exam.isCompleted ? 'Archived' : exam.isActive ? 'Active' : 'Draft'}
          color={exam.isCompleted ? 'default' : exam.isActive ? 'success' : 'warning'}
          size="small"
        />
      </Box>

      <Box className="exam-details__info-grid">
        {INFO_FIELDS(exam).map((item) => (
          <Box key={item.label} className="exam-details__info-cell">
            <Typography className="exam-details__info-label">{item.label}</Typography>
            <Typography className="exam-details__info-value">{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
