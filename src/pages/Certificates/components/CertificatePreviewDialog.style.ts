import styled from '@emotion/styled'
import { Dialog } from '@mui/material'

import { c } from '@/theme'

export const CertificatePreviewDialogRoot = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    max-height: 92vh;
    max-width: 900px;
  }

  @media print {
    position: absolute !important;
    inset: 0 !important;

    & .MuiBackdrop-root {
      display: none !important;
    }

    & .MuiDialog-container {
      display: block !important;
      height: auto !important;
      overflow: visible !important;
    }

    & .MuiDialog-paper {
      box-shadow: none;
      max-height: none;
      height: auto;
      margin: 0;
      max-width: 100%;
      width: 100%;
      overflow: visible;
    }

    & .MuiDialogContent-root {
      overflow: visible !important;
    }
  }
`

export const certificatePreviewDialogContentSx = {
  p: { xs: 2, sm: 3 },
  bgcolor: c.background.muted,
  '@media print': {
    p: 0,
    bgcolor: 'transparent',
  },
} as const

export const certificatePreviewDialogTitleSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  borderBottom: `1px solid ${c.border.default}`,
  py: 1.5,
  '@media print': { display: 'none' },
} as const
