import { useEffect } from 'react'
import { Box, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import '../certificate-print.css'
import { Button } from '../../../components/common/Button'
import { c } from '../../../theme'
import type { CertificateRecord } from '../certificates.data'
import { useEnrichedCertificate } from '../hooks/useEnrichedCertificate'
import {
  CertificatePreviewDialogRoot,
  certificatePreviewDialogContentSx,
  certificatePreviewDialogTitleSx,
} from './CertificatePreviewDialog.style'
import { IeltsCertificate } from './IeltsCertificate'

type CertificatePreviewDialogProps = {
  open: boolean
  record: CertificateRecord | null
  onClose: () => void
}

const PRINT_BODY_CLASS = 'printing-certificate'

export function CertificatePreviewDialog({ open, record, onClose }: CertificatePreviewDialogProps) {
  const enrichedRecord = useEnrichedCertificate(open ? record : null)

  useEffect(() => {
    const clearPrintClass = () => {
      document.body.classList.remove(PRINT_BODY_CLASS)
    }
    window.addEventListener('afterprint', clearPrintClass)
    return () => {
      window.removeEventListener('afterprint', clearPrintClass)
      clearPrintClass()
    }
  }, [])

  const handlePrint = () => {
    document.body.classList.add(PRINT_BODY_CLASS)
    requestAnimationFrame(() => {
      window.print()
    })
  }

  return (
    <CertificatePreviewDialogRoot
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      aria-labelledby="certificate-preview-title"
    >
      <DialogTitle id="certificate-preview-title" sx={certificatePreviewDialogTitleSx}>
        <Box>
          <Typography component="span" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            IELTS Certificate Preview
          </Typography>
          {enrichedRecord ? (
            <Typography component="p" sx={{ m: 0, mt: 0.25, fontSize: '0.85rem', color: c.text.secondary }}>
              {enrichedRecord.studentName} — Band {enrichedRecord.bandScore}
            </Typography>
          ) : null}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            Print / PDF
          </Button>
          <IconButton aria-label="Close preview" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={certificatePreviewDialogContentSx}>
        {enrichedRecord ? <IeltsCertificate record={enrichedRecord} /> : null}
      </DialogContent>
    </CertificatePreviewDialogRoot>
  )
}
