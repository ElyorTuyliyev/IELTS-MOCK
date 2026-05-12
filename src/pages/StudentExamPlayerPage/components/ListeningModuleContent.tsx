import { Box, Typography } from '@mui/material'
import type { RefObject } from 'react'

type ListeningModuleContentProps = {
  listeningHtml: string | null
  listeningContentRef: RefObject<HTMLDivElement | null>
}

export function ListeningModuleContent({ listeningHtml, listeningContentRef }: ListeningModuleContentProps) {
  if (!listeningHtml) {
    return <Typography className="student-exam-player__muted">Listening part content mavjud emas.</Typography>
  }

  return (
    <Box
      ref={listeningContentRef}
      className="student-exam-player__prose student-exam-player__prose--listening"
      dangerouslySetInnerHTML={{ __html: listeningHtml }}
    />
  )
}
