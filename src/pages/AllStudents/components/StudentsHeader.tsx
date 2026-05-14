import { memo, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

function HeadActionIcon({ children }: { children: ReactNode }) {
  return (
    <Box component="span" className="students-page__button-icon">
      {children}
    </Box>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type StudentsHeaderProps = {
  onAddStudent: () => void
}

export const StudentsHeader = memo(function StudentsHeader({ onAddStudent }: StudentsHeaderProps) {
  return (
    <Box className="students-page__head">
      <Typography component="h1" className="students-page__title">
        All Students
      </Typography>

      <Box className="students-page__head-actions">
        <Button
          className="students-page__primary-button"
          variant="primary"
          onClick={onAddStudent}
        >
          <HeadActionIcon>
            <PlusIcon />
          </HeadActionIcon>
          Add New Student
        </Button>
      </Box>
    </Box>
  )
})
