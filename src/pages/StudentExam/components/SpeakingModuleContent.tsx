import { useCallback, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import type { RefObject } from 'react'

type SpeakingModuleContentProps = {
  splitContainerRef: RefObject<HTMLDivElement | null>
  splitLeftWidth: number
  currentPartPassage?: string
  speakingAudioUrl?: string
  currentSpeakingAnswer: string
  onStartResize: () => void
  onChangeSpeakingAnswer: (value: string) => void
}

export function SpeakingModuleContent({
  splitContainerRef,
  splitLeftWidth,
  currentPartPassage,
  speakingAudioUrl,
  currentSpeakingAnswer,
  onStartResize,
  onChangeSpeakingAnswer,
}: SpeakingModuleContentProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [played, setPlayed] = useState(false)

  const handlePlayPrompt = useCallback(async () => {
    if (!speakingAudioUrl || !audioRef.current) return
    try {
      audioRef.current.src = speakingAudioUrl
      await audioRef.current.play()
      setPlayed(true)
    } catch {
      // Ignore playback errors
    }
  }, [speakingAudioUrl])

  return (
    <Box ref={splitContainerRef} className="student-exam-player__split">
      <audio ref={audioRef} preload="auto" />
      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
        style={{ width: `${splitLeftWidth}%` }}
      >
        {currentPartPassage ? (
          <Box dangerouslySetInnerHTML={{ __html: currentPartPassage }} />
        ) : (
          <Typography className="student-exam-player__passage-muted">
            Read the speaking prompt and respond aloud. You may add brief notes on the right.
          </Typography>
        )}
        {speakingAudioUrl && (
          <Box sx={{ mt: 2 }}>
            <Button variant="primary" size="sm" onClick={() => void handlePlayPrompt()}>
              {played ? 'Replay examiner audio' : 'Play examiner audio'}
            </Button>
          </Box>
        )}
      </Box>
      <Box
        role="separator"
        aria-orientation="vertical"
        className="student-exam-player__resize-handle"
        onPointerDown={(event) => {
          event.preventDefault()
          onStartResize()
        }}
      >
        <Box className="student-exam-player__resize-knob">↔</Box>
      </Box>

      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--side"
        style={{ width: `${100 - splitLeftWidth}%` }}
      >
        <Box className="student-exam-player__writing-head">
          <Typography className="student-exam-player__writing-title">Your notes (optional)</Typography>
          <Typography className="student-exam-player__writing-count">
            For examiner review — speaking is graded manually
          </Typography>
        </Box>
        <Box
          component="textarea"
          className="student-exam-player__writing-textarea"
          value={currentSpeakingAnswer}
          onChange={(event) => onChangeSpeakingAnswer(event.target.value)}
          placeholder="Key points from your spoken answer (optional)..."
        />
      </Box>
    </Box>
  )
}
