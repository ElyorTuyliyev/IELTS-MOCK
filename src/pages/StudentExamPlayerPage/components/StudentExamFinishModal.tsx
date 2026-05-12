import { Box, Button } from '@mui/material'
import {
  FinishModalActions,
  FinishModalBadge,
  FinishModalCell,
  FinishModalCellLast,
  FinishModalDivider,
  FinishModalGrid,
  FinishModalHint,
  FinishModalIcon,
  FinishModalLabel,
  FinishModalLead,
  FinishModalLeft,
  FinishModalNotice,
  FinishModalSummaryHead,
  FinishModalSummaryIcon,
  FinishModalSummaryTitle,
  FinishModalTitle,
  FinishModalTop,
  FinishModalValue,
  StudentExamPlayerFinishDialog,
} from '../StudentExamPlayerPage.style'

export type StudentExamFinishModalProps = {
  open: boolean
  onClose: () => void
  summaryCandidateName: string
  summaryTestName: string
  summaryDuration: string
  submittedAtLabel: string
  onContinue: () => void
}

export function StudentExamFinishModal({
  open,
  onClose,
  summaryCandidateName,
  summaryTestName,
  summaryDuration,
  submittedAtLabel,
  onContinue,
}: StudentExamFinishModalProps) {
  return (
    <StudentExamPlayerFinishDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FinishModalTop>
        <FinishModalLeft>
          <FinishModalIcon>✓</FinishModalIcon>
          <Box>
            <FinishModalTitle>Test Completed</FinishModalTitle>
            <FinishModalLead>Your exam has been successfully submitted.</FinishModalLead>
            <FinishModalHint>Click Continue to return to your dashboard.</FinishModalHint>
          </Box>
        </FinishModalLeft>
        <FinishModalBadge>Submission Successful</FinishModalBadge>
      </FinishModalTop>

      <FinishModalDivider />

      <FinishModalSummaryHead>
        <FinishModalSummaryIcon>i</FinishModalSummaryIcon>
        <FinishModalSummaryTitle>Submission Summary</FinishModalSummaryTitle>
      </FinishModalSummaryHead>

      <FinishModalGrid>
        <FinishModalCell>
          <FinishModalLabel>Candidate</FinishModalLabel>
          <FinishModalValue>{summaryCandidateName}</FinishModalValue>
        </FinishModalCell>
        <FinishModalCell>
          <FinishModalLabel>Test</FinishModalLabel>
          <FinishModalValue>{summaryTestName}</FinishModalValue>
        </FinishModalCell>
        <FinishModalCell>
          <FinishModalLabel>Duration</FinishModalLabel>
          <FinishModalValue>{summaryDuration}</FinishModalValue>
        </FinishModalCell>
        <FinishModalCellLast>
          <FinishModalLabel>Submitted At</FinishModalLabel>
          <FinishModalValue>{submittedAtLabel || '-'}</FinishModalValue>
        </FinishModalCellLast>
      </FinishModalGrid>

      <FinishModalNotice>
        Your responses have been securely saved. Results will be available after evaluation.
      </FinishModalNotice>

      <FinishModalActions>
        <Button variant="contained" className="finish-modal__continue" onClick={onContinue}>
          CONTINUE →
        </Button>
      </FinishModalActions>
    </StudentExamPlayerFinishDialog>
  )
}
