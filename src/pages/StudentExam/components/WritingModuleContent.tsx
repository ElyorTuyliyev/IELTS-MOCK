import { Box, Typography } from '@mui/material'
import type { RefObject } from 'react'

type WritingModuleContentProps = {
  splitContainerRef: RefObject<HTMLDivElement | null>
  splitLeftWidth: number
  currentPartPassage?: string
  currentWritingWordCount: number
  currentWritingAnswer: string
  onStartResize: () => void
  onChangeWritingAnswer: (value: string) => void
}

export function WritingModuleContent({
  splitContainerRef,
  splitLeftWidth,
  currentPartPassage,
  currentWritingWordCount,
  currentWritingAnswer,
  onStartResize,
  onChangeWritingAnswer,
}: WritingModuleContentProps) {
  return (
    <Box ref={splitContainerRef} className="student-exam-player__split">
      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
        style={{ width: `${splitLeftWidth}%` }}
      >
        {currentPartPassage ? (
          <Box dangerouslySetInnerHTML={{ __html: currentPartPassage }} />
        ) : (
          <Typography className="student-exam-player__passage-muted">No passage content available.</Typography>
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

      <Box className="student-exam-player__split-pane student-exam-player__split-pane--side" style={{ width: `${100 - splitLeftWidth}%` }}>
        <Box className="student-exam-player__writing-head">
          <Typography className="student-exam-player__writing-title">Your answer</Typography>
          <Typography className="student-exam-player__writing-count">Words: {currentWritingWordCount}</Typography>
        </Box>
        <Box
          component="textarea"
          className="student-exam-player__writing-textarea"
          value={currentWritingAnswer}
          onChange={(event) => onChangeWritingAnswer(event.target.value)}
          placeholder="Yozing..."
        />
      </Box>
    </Box>
  )
}
