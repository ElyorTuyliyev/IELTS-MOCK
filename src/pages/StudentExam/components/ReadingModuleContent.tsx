import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import type { RefObject } from 'react'
import { PassageHtmlPane } from './PassageHtmlPane'

type ReadingModuleContentProps = {
  splitContainerRef: RefObject<HTMLDivElement | null>
  moduleContentRef: RefObject<HTMLDivElement | null>
  splitLeftWidth: number
  currentPartPassage?: string
  readingHtml: string | null
  questionDbId?: string
  onStartResize: () => void
}

export function ReadingModuleContent({
  splitContainerRef,
  moduleContentRef,
  splitLeftWidth,
  currentPartPassage,
  readingHtml,
  questionDbId,
  onStartResize,
}: ReadingModuleContentProps) {
  useEffect(() => {
    const container = moduleContentRef.current
    if (!container) return
    if (!readingHtml) {
      container.replaceChildren()
      delete container.dataset.readingHtmlKey
      return
    }
    if (container.dataset.readingHtmlKey === readingHtml) return
    container.innerHTML = readingHtml
    container.dataset.readingHtmlKey = readingHtml
  }, [readingHtml, moduleContentRef])

  return (
    <Box ref={splitContainerRef} className="student-exam-player__split">
      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
        style={{ width: `${splitLeftWidth}%` }}
      >
        {currentPartPassage ? (
          <PassageHtmlPane html={currentPartPassage} />
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
      <Box
        className="student-exam-player__split-pane student-exam-player__split-pane--side"
        style={{ width: `${100 - splitLeftWidth}%` }}
      >
        {readingHtml ? (
          <Box
            ref={moduleContentRef}
            className="student-exam-player__prose student-exam-player__prose--question"
            data-question-id={questionDbId ?? undefined}
          />
        ) : (
          <Typography className="student-exam-player__passage-muted">No questions available.</Typography>
        )}
      </Box>
    </Box>
  )
}
