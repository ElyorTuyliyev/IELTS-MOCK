import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

import type { CertificateRecord } from '../certificates.data'
import {
  bandToCefr,
  buildTrfNumber,
  deriveSkillScores,
  formatTrfIssuedDate,
  formatTrfTestDate,
  inferTestType,
  parseBandScore,
  splitStudentName,
} from '../utils/certificateUtils'
import { CenterLogo } from './CenterLogo'
import { resolveCenterLogoUrl } from '../utils/resolveCenterLogoUrl'
import { IeltsCertificateRoot } from './IeltsCertificate.style'

type IeltsCertificateProps = {
  record: CertificateRecord
  className?: string
}

function TrfField({
  label,
  value,
  shaded = false,
  className,
}: {
  label: string
  value: string
  shaded?: boolean
  className?: string
}) {
  return (
    <Box className={`ielts-trf__field ${className ?? ''}`}>
      <Typography component="span" className="ielts-trf__field-label">
        {label}
      </Typography>
      <Box className={`ielts-trf__field-value ${shaded ? 'ielts-trf__field-value--shaded' : ''}`}>
        {value || '\u00A0'}
      </Box>
    </Box>
  )
}

function ScoreField({ label, value }: { label: string; value: string }) {
  return (
    <Box className="ielts-trf__score-field">
      <Typography component="span" className="ielts-trf__field-label">
        {label}
      </Typography>
      <Box className="ielts-trf__field-value ielts-trf__field-value--shaded ielts-trf__field-value--score">
        {value}
      </Box>
    </Box>
  )
}

function TrfWideField({
  label,
  value,
  shaded,
}: {
  label: string
  value: string
  shaded?: boolean
}) {
  return (
    <Box className="ielts-trf__field ielts-trf__field--full-row">
      <Typography component="span" className="ielts-trf__field-label">
        {label}
      </Typography>
      <Box
        className={`ielts-trf__field-value ${shaded ? 'ielts-trf__field-value--shaded' : ''}`}
      >
        {value || '\u00A0'}
      </Box>
    </Box>
  )
}

export function IeltsCertificate({ record, className }: IeltsCertificateProps) {
  const overall = parseBandScore(record.bandScore)
  const skills = record.skillScores ?? deriveSkillScores(overall)
  const cefr = bandToCefr(overall)
  const testType = record.testType ?? inferTestType(record.examName)
  const typeLabel = testType === 'General Training' ? 'GENERAL TRAINING' : 'ACADEMIC'

  const { familyName, firstName } =
    record.familyName && record.firstName
      ? { familyName: record.familyName.toUpperCase(), firstName: record.firstName.toUpperCase() }
      : splitStudentName(record.studentName)

  const centreNumber = record.centreNumber ?? 'UZ001'
  const candidateNumber = record.candidateNumber ?? record.id.replace('cert-', '').padStart(6, '0')
  const testDate = formatTrfTestDate(record.testDate)
  const issuedDate = formatTrfIssuedDate(record.issuedDate ?? record.testDate)
  const trfNumber = record.trfNumber ?? buildTrfNumber(record)
  const dateOfBirth = record.dateOfBirth ? formatTrfIssuedDate(record.dateOfBirth) : ''
  const centreName = record.centreName ?? 'IELTS MOCK CENTRE'

  /** Rectangular centre stamp lines (similar to ink-stamp hierarchy on paper TRFs). */
  const centreStampLine1 =
    centreName.length > 22 ? `${centreName.slice(0, 22)}\u2026`.toUpperCase() : centreName.toUpperCase()



  const [photoSrc, setPhotoSrc] = useState<string | null>(null)

  useEffect(() => {
    const src = resolveCenterLogoUrl(record.candidatePhoto)
    setPhotoSrc(src ?? null)
  }, [record.candidatePhoto])

  const handleCandidatePhotoError = () => {
    setPhotoSrc(null)
  }

  const noteParagraphs =
    testType === 'Academic'
      ? [
          'NOTE Admission to undergraduate and post graduate courses should be based on the ACADEMIC Reading and Writing Modules.',
          "It is recommended that the candidate's language ability as indicated in this Test Report Form be re-assessed after two years from the date of the test.",
        ]
      : [
          'NOTE Admission to undergraduate and post graduate courses should be based on the ACADEMIC Reading and Writing Modules.',
          'GENERAL TRAINING Reading and Writing Modules are not designed to test the full range of language skills required for academic purposes.',
          "It is recommended that the candidate's language ability as indicated in this Test Report Form be re-assessed after two years from the date of the test.",
        ]

  return (
    <IeltsCertificateRoot className={className} data-certificate-print>
      <Box className="ielts-trf">
        {/* Header */}
        <Box className="ielts-trf__header">
          <Box className="ielts-trf__header-left">
            <Typography component="h1" className="ielts-trf__logo">
              IELTS<sup className="ielts-trf__tm">™</sup>
            </Typography>
            <Typography component="p" className="ielts-trf__form-title">
              Test Report Form
            </Typography>
          </Box>
          <Box className="ielts-trf__type-box">{typeLabel}</Box>
        </Box>

        <Box className="ielts-trf__note" aria-label="Important information about modules and validity">
          {noteParagraphs.map((line, i) => (
            <Typography key={`trf-note-${i}`} component="p" className="ielts-trf__note-line">
              {line}
            </Typography>
          ))}
        </Box>

        <Box className="ielts-trf__ref-row">
          <TrfField label="Centre Number" value={centreNumber} />
          <TrfField label="Date" value={testDate} />
          <TrfField label="Candidate Number" value={candidateNumber} />
        </Box>

        <Box className="ielts-trf__candidate-section">
          <Typography component="h2" className="ielts-trf__section-title">
            Candidate Details
          </Typography>

          <Box className="ielts-trf__candidate-block">
            <Box className="ielts-trf__candidate-fields">
              <Box className="ielts-trf__row ielts-trf__row--photo-row">
                <Box className="ielts-trf__name-column">
                  <TrfWideField label="Family Name" value={familyName} shaded />
                  <TrfWideField label="First Name" value={firstName} shaded />
                  <TrfWideField label="Candidate ID" value={record.candidateId ?? ''} shaded />
                </Box>
                <Box className="ielts-trf__photo" aria-label="Candidate photograph placeholder">
                  <Box className="ielts-trf__photo-inner">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt="Candidate"
                        className="ielts-trf__photo-image"
                        onError={handleCandidatePhotoError}
                        draggable={false}
                      />
                    ) : (
                      <span className="ielts-trf__photo-icon" aria-hidden>
                        👤
                      </span>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box className="ielts-trf__row ielts-trf__row--3">
                <TrfField label="Date of Birth" value={dateOfBirth} />
                <TrfField label="Sex (M/F)" value={record.sex ?? ''} />
                <TrfField label="Scheme Code" value={record.schemeCode ?? 'Private Candidate'} />
              </Box>
              <Box className="ielts-trf__row ielts-trf__row--1">
                <TrfWideField label="Country or Region of Origin" value={record.countryOfOrigin ?? ''} />
              </Box>
              <Box className="ielts-trf__row ielts-trf__row--1">
                <TrfWideField label="Country of Nationality" value={record.nationality ?? ''} />
              </Box>
              <Box className="ielts-trf__row ielts-trf__row--1">
                <TrfWideField label="First Language" value={record.firstLanguage ?? ''} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Test Results */}
        <Typography component="h2" className="ielts-trf__section-title">
          Test Results
        </Typography>
        <Box className="ielts-trf__scores-row">
          <ScoreField label="Listening" value={skills.listening} />
          <ScoreField label="Reading" value={skills.reading} />
          <ScoreField label="Writing" value={skills.writing} />
          <ScoreField label="Speaking" value={skills.speaking} />
          <ScoreField label="Overall Band Score" value={record.bandScore} />
          <ScoreField label="CEFR Level" value={cefr} />
        </Box>

        {/* Administrator */}
        <Box className="ielts-trf__admin-row">
          <Box className="ielts-trf__comments">
            <Typography component="span" className="ielts-trf__field-label">
              Administrator Comments
            </Typography>
            <Box className="ielts-trf__comments-box" />
          </Box>
          <Box className="ielts-trf__stamps">
            <Box className="ielts-trf__stamp-box">
              <Typography component="span" className="ielts-trf__stamp-box-label">
                Centre stamp
              </Typography>
              <Box className="ielts-trf__stamp-box-inner">
                <Box className="ielts-trf__centre-stamp" aria-hidden>
                  <CenterLogo
                    src={record.centerLogo}
                    alt=""
                    variant="stamp"
                    className="ielts-trf__centre-stamp-logo"
                  />
                  <span className="ielts-trf__centre-stamp-line1">{centreStampLine1}</span>
                  <span className="ielts-trf__centre-stamp-line2">{centreNumber}</span>
                </Box>
              </Box>
            </Box>
            <Box className="ielts-trf__stamp-box">
              <Typography component="span" className="ielts-trf__stamp-box-label">
                Validation stamp
              </Typography>
              <Box className="ielts-trf__stamp-box-inner">
                <Box className="ielts-trf__validation-stamp">
                  <span className="ielts-trf__validation-stamp-centre">IELTS</span>
                  <span className="ielts-trf__validation-stamp-ring">VALIDATION STAMP</span>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="ielts-trf__sign-row">
          <Box className="ielts-trf__signature">
            <Typography component="span" className="ielts-trf__field-label">
              Administrator&apos;s Signature
            </Typography>
            <Box className="ielts-trf__signature-line" aria-hidden>
              <span className="ielts-trf__signature-script">S. Administrator</span>
            </Box>
          </Box>
          <TrfField label="Date" value={issuedDate} className="ielts-trf__issued-date" />
        </Box>

        <Box className="ielts-trf__trf-number-row">
          <Typography component="span" className="ielts-trf__field-label">
            Test Report Form Number
          </Typography>
          <Box className="ielts-trf__field-value ielts-trf__field-value--shaded ielts-trf__trf-number">
            {trfNumber}
          </Box>
        </Box>

        {/* Footer partners — mirrors British Council / IDP / Cambridge layout */}
        <Box className="ielts-trf__partners">
          <Box className="ielts-trf__partner ielts-trf__partner--bc">
            <Box className="ielts-trf__bc-mark" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </Box>
            <Typography component="span" className="ielts-trf__partner-bc-name">
              BRITISH COUNCIL
            </Typography>
          </Box>
          <Box className="ielts-trf__partner ielts-trf__partner--idp">
            <Typography component="span" className="ielts-trf__idp-wordmark">
              idp
            </Typography>
            <Typography component="span" className="ielts-trf__idp-sub">
              IELTS AUSTRALIA
            </Typography>
          </Box>
          <Box className="ielts-trf__partner ielts-trf__partner--cambridge">
            <Box className="ielts-trf__cambridge-crest" aria-hidden />
            <Box className="ielts-trf__cambridge-text">
              <Typography component="span" className="ielts-trf__cambridge-line1">
                CAMBRIDGE ENGLISH
              </Typography>
              <Typography component="span" className="ielts-trf__cambridge-line2">
                Language Assessment
              </Typography>
              <Typography component="span" className="ielts-trf__cambridge-line3">
                Part of the University of Cambridge
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography component="p" className="ielts-trf__verify-footer">
          The validity of this IELTS Test Report Form can be verified online by recognising
          organisations at http://ielts.ucles.org.uk
        </Typography>

        <Typography component="p" className="ielts-trf__mock-disclaimer">
          Practice mock certificate — {record.examName}. Not issued by British Council, IDP, or
          Cambridge Assessment English.
        </Typography>
      </Box>
    </IeltsCertificateRoot>
  )
}
