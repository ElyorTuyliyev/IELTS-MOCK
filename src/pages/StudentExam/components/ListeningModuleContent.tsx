import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import type { RefObject } from 'react'

type ListeningModuleContentProps = {
  listeningHtml: string | null
  listeningContentRef: RefObject<HTMLDivElement | null>
  questionDbId?: string
}

export function ListeningModuleContent({
  listeningHtml,
  listeningContentRef,
  questionDbId,
}: ListeningModuleContentProps) {
  useEffect(() => {
    const container = listeningContentRef.current
    if (!container) return
    if (!listeningHtml) {
      container.replaceChildren()
      delete container.dataset.listeningHtmlKey
      return
    }
    if (container.dataset.listeningHtmlKey === listeningHtml) return
    container.innerHTML = listeningHtml
    container.dataset.listeningHtmlKey = listeningHtml
  }, [listeningHtml, listeningContentRef])

  if (!listeningHtml) {
    return <Typography className="student-exam-player__muted">No listening part content available.</Typography>
  }

  return (
    <Box
      ref={listeningContentRef}
      className="student-exam-player__prose student-exam-player__prose--listening"
      data-question-id={questionDbId ?? undefined}
    />
  )
}
