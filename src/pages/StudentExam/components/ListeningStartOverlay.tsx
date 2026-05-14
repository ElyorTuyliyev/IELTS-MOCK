import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

type ListeningStartOverlayProps = {
  onPlay: () => void
}

export function ListeningStartOverlay({ onPlay }: ListeningStartOverlayProps) {
  return (
    <Box className="student-exam-player__listening-overlay">
      <Box className="student-exam-player__listening-overlay-inner">
        <Typography className="student-exam-player__listening-emoji">🎧</Typography>
        <Typography className="student-exam-player__listening-text">
          You will be hearing to an audio clip during this test. You will not be permitted to pause or rewind the audio
          while answering the questions.
        </Typography>
        <Typography className="student-exam-player__listening-text student-exam-player__listening-text--spaced">
          To continue, click Play.
        </Typography>
        <Button variant="primary" className="student-exam-player__listening-play" onClick={() => void onPlay()}>
          ▶ Play
        </Button>
      </Box>
    </Box>
  )
}
