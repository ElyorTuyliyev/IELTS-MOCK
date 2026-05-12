import { Box, Typography } from '@mui/material'
import type { RefObject } from 'react'

type ReadingQuestion = {
  id: string
  text: string
  html?: string
}

type ReadingModuleContentProps = {
  splitContainerRef: RefObject<HTMLDivElement | null>
  moduleContentRef: RefObject<HTMLDivElement | null>
  splitLeftWidth: number
  currentPartPassage?: string
  currentPartQuestions: ReadingQuestion[]
  onStartResize: () => void
}

export function ReadingModuleContent({
  splitContainerRef,
  moduleContentRef,
  splitLeftWidth,
  currentPartPassage,
  currentPartQuestions,
  onStartResize,
}: ReadingModuleContentProps) {
  return (
    <Box ref={splitContainerRef} className="student-exam-player__split">
      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
        style={{ width: `${splitLeftWidth}%` }}
      >
        {currentPartPassage ? (
          <Box dangerouslySetInnerHTML={{ __html: currentPartPassage }} />
        ) : (
          <Typography className="student-exam-player__passage-muted">Passage content mavjud emas.</Typography>
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
        ref={moduleContentRef}
        className="student-exam-player__split-pane student-exam-player__split-pane--side"
        style={{ width: `${100 - splitLeftWidth}%` }}
      >
        {currentPartQuestions.map((question) => (
          <Box key={question.id} className="student-exam-player__question-row">
            <Typography className="student-exam-player__question-num">{question.id}.</Typography>
            <Box className="student-exam-player__question-body">
              {question.html ? (
                <Box className="student-exam-player__prose student-exam-player__prose--question" dangerouslySetInnerHTML={{ __html: question.html }} />
              ) : (
                <Typography className="student-exam-player__question-text">{question.text}</Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
