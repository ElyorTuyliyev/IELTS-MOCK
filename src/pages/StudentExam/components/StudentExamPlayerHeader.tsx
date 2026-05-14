import { Box, Typography } from '@mui/material'
import type { ModuleName } from '../constants'
import type { ModuleDataResult } from '../hooks/useExamData'
import { useExamTimer } from '../hooks/useExamTimer'
import { formatRemainingTime } from '../utils'

type StudentExamPlayerHeaderProps = {
  activeModule: ModuleName
  moduleIndex: number
  moduleData: ModuleDataResult
  finishModalOpen: boolean
  listeningStarted: boolean
  onAdvanceModule: (nextIndex: number) => void
  onFinishExam: () => void
}

export function StudentExamPlayerHeader({
  activeModule,
  moduleIndex,
  moduleData,
  finishModalOpen,
  listeningStarted,
  onAdvanceModule,
  onFinishExam,
}: StudentExamPlayerHeaderProps) {
  const { secondsLeft } = useExamTimer({
    activeModule,
    moduleIndex,
    moduleData,
    finishModalOpen,
    listeningStarted,
    onAdvanceModule,
    onFinishExam,
  })

  const moduleLabel = activeModule.charAt(0).toUpperCase() + activeModule.slice(1)
  const timeLeftLabel = formatRemainingTime(secondsLeft)

  return (
    <Box className="student-exam-player__header">
      <Box className="student-exam-player__header-left">
        <Typography className="student-exam-player__brand">IELTS</Typography>
        <Box>
          <Typography className="student-exam-player__header-meta-title">Test taker ID</Typography>
          <Typography className="student-exam-player__header-meta-sub">
            {activeModule === 'listening' && listeningStarted
              ? '🔊 Audio is Playing'
              : `${moduleLabel} module`}
          </Typography>
        </Box>
      </Box>

      <Box className="student-exam-player__header-right">
        <Box className="student-exam-player__timer-box">
          <Typography className="student-exam-player__timer-label">Time Left</Typography>
          <Typography className="student-exam-player__timer-value">{timeLeftLabel}</Typography>
        </Box>
        <Box component="svg" viewBox="0 0 24 24" className="student-exam-player__header-icon" aria-hidden="true">
          <path
            d="M2.5 9a13.5 13.5 0 0 1 19 0M5.5 12a9 9 0 0 1 13 0M9 15.5a4.5 4.5 0 0 1 6 0M12 19h.01"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Box>
        <Box component="svg" viewBox="0 0 24 24" className="student-exam-player__header-icon" aria-hidden="true">
          <path
            d="M12 3a4 4 0 0 0-4 4v1.7c0 .7-.3 1.4-.8 1.9L6 12a2 2 0 0 0 1.4 3.4h9.2A2 2 0 0 0 18 12l-1.2-1.4c-.5-.5-.8-1.2-.8-1.9V7a4 4 0 0 0-4-4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Box>
        <Box component="svg" viewBox="0 0 24 24" className="student-exam-player__header-icon" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </Box>
      </Box>
    </Box>
  )
}
