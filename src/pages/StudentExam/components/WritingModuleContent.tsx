import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { RefObject } from 'react'
import { PassageHtmlPane } from './PassageHtmlPane'

type WritingModuleContentProps = {
  splitContainerRef: RefObject<HTMLDivElement | null>
  splitLeftWidth: number
  currentPartPassage?: string
  writingTaskHtml?: string
  currentWritingWordCount: number
  currentWritingAnswer: string
  onStartResize: () => void
  onChangeWritingAnswer: (value: string) => void
  onPrintWriting?: () => void
}

export function WritingModuleContent({
  splitContainerRef,
  splitLeftWidth,
  currentPartPassage,
  writingTaskHtml,
  currentWritingWordCount,
  currentWritingAnswer,
  onStartResize,
  onChangeWritingAnswer,
  onPrintWriting,
}: WritingModuleContentProps) {
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
        className="student-exam-player__split-pane student-exam-player__split-pane--side student-exam-player__split-pane--writing"
        style={{ width: `${100 - splitLeftWidth}%` }}
      >
        {writingTaskHtml ? (
          <Box className="student-exam-player__writing-task">
            <PassageHtmlPane
              html={writingTaskHtml}
              className="student-exam-player__prose student-exam-player__prose--writing-task"
            />
          </Box>
        ) : null}

        <Box className="student-exam-player__writing-answer">
          <Box className="student-exam-player__writing-head">
            <Typography className="student-exam-player__writing-title">Your answer</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography className="student-exam-player__writing-count">
                Words: {currentWritingWordCount}
              </Typography>
              {onPrintWriting ? (
                <Tooltip title="Print task and your answer">
                  <IconButton
                    size="small"
                    aria-label="Print writing task and answer"
                    onClick={onPrintWriting}
                    className="student-exam-player__writing-print"
                  >
                    <PrintOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
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
    </Box>
  )
}
