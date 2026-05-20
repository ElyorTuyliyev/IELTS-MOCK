import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { ROUTES_PATH, getStudentMyExamReviewPath } from '../../../routes/paths'
import { CertificatePreviewDialog } from '../../Certificates/components/CertificatePreviewDialog'
import type { CertificateRecord } from '../../Certificates/certificates.data'
import { useMyCertificates } from '../../StudentCertificates/hooks/useMyCertificates'
import {
  useMyStudentExams,
  type StudentExamListItem,
} from '../hooks/useMyStudentExams'
import { REGISTER_MY_STUDENT_EXAM_MUTATION } from '../api/registerMyStudentExamMutation'
import { StudentPaymentRegistrationModal } from '../components/StudentPaymentRegistrationModal'
import { StudentMyExamsPageRoot } from './StudentMyExamsPage.style'

function getExamStatusLabel(status: StudentExamListItem['examStatus']) {
  if (status === 'active') return 'Active'
  if (status === 'ended') return 'Ended'
  return 'Draft'
}

function getExamStatusClass(status: StudentExamListItem['examStatus']) {
  return `student-exam-card__status student-exam-card__status--${status}`
}

export function StudentMyExamsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, loading, error, refetch } = useMyStudentExams()
  const [registerMyStudentExam, { loading: registering }] = useMutation(
    REGISTER_MY_STUDENT_EXAM_MUTATION,
  )
  const { certificates, error: certificatesError } = useMyCertificates()
  const [previewRecord, setPreviewRecord] = useState<CertificateRecord | null>(null)
  const [paymentModalExam, setPaymentModalExam] = useState<{
    examId: string
    title: string
  } | null>(null)

  const certificateByEnrollmentId = useMemo(() => {
    const map = new Map<string, CertificateRecord>()
    for (const cert of certificates) {
      map.set(cert.id, cert)
    }
    return map
  }, [certificates])

  const openCertificate = useCallback(
    (studentExamId: string) => {
      const record = certificateByEnrollmentId.get(studentExamId)
      if (record) setPreviewRecord(record)
    },
    [certificateByEnrollmentId],
  )

  const closePreview = useCallback(() => setPreviewRecord(null), [])

  const registerForExam = useCallback(
    async (examId: string) => {
      try {
        const result = await registerMyStudentExam({ variables: { examId } })
        if (result.error) {
          toast.error(result.error.message ?? 'Failed to register for the exam.')
          return
        }
        toast.success('Registration sent. Your center admin will review your request.')
        await refetch()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to register for the exam.')
      }
    },
    [registerMyStudentExam, refetch, toast],
  )

  useEffect(() => {
    if (error) {
      toast.error(getGraphQLErrorMessage(error, 'Failed to load exams.'))
    }
  }, [error, toast])

  useEffect(() => {
    if (certificatesError) {
      toast.error(getGraphQLErrorMessage(certificatesError, 'Failed to load certificates.'))
    }
  }, [certificatesError, toast])

  return (
    <Layout>
      <StudentMyExamsPageRoot>
        <Box className="student-exams-page">
          <Box>
            <Typography component="h1" className="student-exams-page__title">
              My exams
            </Typography>
            <Typography className="student-exams-page__subtitle">
              Choose an active exam and start the test.
            </Typography>
          </Box>

          {loading ? (
            <Typography color="text.secondary">Loading exams...</Typography>
          ) : items.length === 0 ? (
            <Box className="student-exams-page__empty">No exams are assigned to you.</Box>
          ) : (
            <Box className="student-exams-page__grid">
              {items.map((item) => (
                <Box key={item.id} className="student-exam-card">
                  <Typography component="h2" className="student-exam-card__title">
                    {item.title}
                  </Typography>
                  <Typography className="student-exam-card__meta">{item.scheduleLabel}</Typography>
                  <Typography className="student-exam-card__meta">{item.priceLabel}</Typography>
                  <Box className={getExamStatusClass(item.examStatus)}>
                    {getExamStatusLabel(item.examStatus)}
                    {item.studentCompleted ? ' · Completed' : ''}
                    {item.isApprovalPending ? ' · Approval pending' : ''}
                    {item.isPaymentPending ? ' · Payment pending' : ''}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 'auto' }}>
                    {item.studentCompleted ? (
                      <Button
                        variant="secondary"
                        className="student-exam-card__action"
                        onClick={() => navigate(getStudentMyExamReviewPath(item.studentExamId))}
                      >
                        View results & answers
                      </Button>
                    ) : null}
                    {certificateByEnrollmentId.has(item.studentExamId) ? (
                      <Button
                        variant="secondary"
                        className="student-exam-card__action"
                        onClick={() => openCertificate(item.studentExamId)}
                      >
                        View certificate ·{' '}
                        {certificateByEnrollmentId.get(item.studentExamId)?.bandScore}
                      </Button>
                    ) : null}
                    <Button
                      variant="primary"
                      className="student-exam-card__action"
                      disabled={(!item.canStart && !item.canRegister) || registering}
                      onClick={() => {
                        if (item.canRegister) {
                          if (item.requiresPayment) {
                            setPaymentModalExam({ examId: item.id, title: item.title })
                            return
                          }
                          void registerForExam(item.id)
                          return
                        }
                        navigate(
                          `${ROUTES_PATH.studentExamPlayer}?examId=${encodeURIComponent(item.id)}`,
                        )
                      }}
                    >
                      {item.canRegister
                        ? registering
                          ? 'Registering...'
                          : 'Register for exam'
                        : item.studentCompleted
                          ? 'Submitted'
                          : item.isPaymentPending
                            ? 'Payment pending'
                            : item.isApprovalPending
                              ? 'Awaiting approval'
                              : item.examStatus === 'ended'
                              ? 'Exam ended'
                              : 'Start'}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </StudentMyExamsPageRoot>

      <CertificatePreviewDialog
        open={previewRecord != null}
        record={previewRecord}
        onClose={closePreview}
      />

      <StudentPaymentRegistrationModal
        open={paymentModalExam != null}
        examId={paymentModalExam?.examId ?? ''}
        examTitle={paymentModalExam?.title ?? ''}
        onClose={() => setPaymentModalExam(null)}
        onSubmitted={refetch}
      />
    </Layout>
  )
}
