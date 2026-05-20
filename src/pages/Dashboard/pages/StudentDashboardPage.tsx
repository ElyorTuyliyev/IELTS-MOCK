import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { c, tokens } from '../../../theme'
import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { useNotifications } from '../../../features/notifications'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { ROUTES_PATH, getStudentMyExamReviewPath } from '../../../routes/paths'
import { selectUserName } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { CertificatePreviewDialog } from '../../Certificates/components/CertificatePreviewDialog'
import type { CertificateRecord } from '../../Certificates/certificates.data'
import { formatCertificateDate } from '../../Certificates/utils/certificateUtils'
import { useMyCertificates } from '../../StudentCertificates/hooks/useMyCertificates'
import {
  useMyStudentExams,
  type StudentExamListItem,
} from '../../StudentMyExams/hooks/useMyStudentExams'
import { DashboardPageRoot } from './DashboardPage.style'
import { StudentDashboardPageRoot } from './StudentDashboardPage.style'

const STAT_SPARK = [28, 42, 36, 18, 44, 32, 52, 38, 22, 30, 26, 40]

function getExamStatusLabel(status: StudentExamListItem['examStatus']) {
  if (status === 'active') return 'Active'
  if (status === 'ended') return 'Ended'
  return 'Scheduled'
}

function getExamStatusClass(status: StudentExamListItem['examStatus']) {
  return `student-exam-list__status student-exam-list__status--${status}`
}

function sortExamsForDashboard(items: StudentExamListItem[]) {
  const priority = (item: StudentExamListItem) => {
    if (item.canStart) return 0
    if (item.examStatus === 'active' && !item.studentCompleted) return 1
    if (!item.studentCompleted) return 2
    return 3
  }

  return [...items].sort((a, b) => priority(a) - priority(b))
}

function getActionLabel(item: StudentExamListItem) {
  if (item.studentCompleted) return 'View results'
  if (item.examStatus === 'ended') return 'Ended'
  if (item.canStart) return 'Start'
  return 'Waiting'
}

export function StudentDashboardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const userName = useAppSelector(selectUserName)
  const { unreadCount } = useNotifications()
  const { items, loading, error } = useMyStudentExams()
  const { certificates, loading: certificatesLoading } = useMyCertificates()
  const [previewRecord, setPreviewRecord] = useState<CertificateRecord | null>(null)

  const sortedItems = useMemo(() => sortExamsForDashboard(items), [items])
  const recentCertificates = useMemo(() => certificates.slice(0, 3), [certificates])

  const openPreview = useCallback((record: CertificateRecord) => {
    setPreviewRecord(record)
  }, [])

  const closePreview = useCallback(() => setPreviewRecord(null), [])

  const stats = useMemo(() => {
    const total = items.length
    const readyToStart = items.filter((item) => item.canStart).length
    const completed = items.filter((item) => item.studentCompleted).length
    const pending = items.filter(
      (item) => !item.studentCompleted && item.examStatus !== 'ended',
    ).length

    const completionPct =
      total === 0 ? 0 : Math.round((completed / total) * 100)

    return { total, readyToStart, completed, pending, completionPct }
  }, [items])

  const nextExam = useMemo(
    () => sortedItems.find((item) => item.canStart) ?? sortedItems.find((item) => !item.studentCompleted),
    [sortedItems],
  )

  useEffect(() => {
    if (error) {
      toast.error(getGraphQLErrorMessage(error, 'Failed to load your exams.'))
    }
  }, [error, toast])

  const greetingName = userName?.trim() || 'Student'
  const ringGradient = `conic-gradient(${c.primary.main} 0deg ${stats.completionPct * 3.6}deg, ${c.background.chartEmpty} ${stats.completionPct * 3.6}deg 360deg)`

  return (
    <Layout>
      <DashboardPageRoot>
        <StudentDashboardPageRoot>
          <Box className="dashboard-screen">
            <Box
              className="student-hero"
              sx={{ '--ring-gradient': ringGradient } as CSSProperties}
            >
              <Box className="student-hero__copy">
                <Typography component="p" className="student-hero__eyebrow">
                  Student dashboard
                </Typography>
                <Typography component="h1" className="student-hero__title">
                  Welcome back, {greetingName}
                </Typography>
                <Typography className="student-hero__subtitle">
                  {stats.readyToStart > 0
                    ? `You have ${stats.readyToStart} exam${stats.readyToStart === 1 ? '' : 's'} ready to start. Open one below or go to My Exams for the full list.`
                    : stats.total === 0
                      ? 'Your center has not assigned any exams yet. Check back later or contact your instructor.'
                      : 'Review your assigned mock exams and track your progress here.'}
                </Typography>
                <Box className="student-hero__actions">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (nextExam?.canStart) {
                        navigate(
                          `${ROUTES_PATH.studentExamPlayer}?examId=${encodeURIComponent(nextExam.id)}`,
                        )
                        return
                      }
                      navigate(ROUTES_PATH.studentMyExams)
                    }}
                  >
                    {nextExam?.canStart ? 'Start next exam' : 'View my exams'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate(ROUTES_PATH.studentMyExams)}>
                    All exams
                  </Button>
                </Box>
              </Box>

              <Box className="student-hero__progress">
                <Box className="student-hero__ring">
                  <Typography component="span" className="student-hero__ring-value">
                    {loading ? '…' : `${stats.completionPct}%`}
                  </Typography>
                </Box>
                <Typography className="student-hero__ring-label">
                  Completion rate
                </Typography>
              </Box>
            </Box>

            <Box className="dashboard-screen__stats">
              <Box
                className="dashboard-stat"
                sx={
                  {
                    '--accent': c.chart.easy,
                    '--soft-accent': tokens.rgba.primary_12,
                    '--delta-color': c.chart.delta,
                  } as CSSProperties
                }
              >
                <Box className="dashboard-stat__header">
                  <Box>
                    <Typography component="p" className="dashboard-stat__eyebrow">
                      Assigned
                    </Typography>
                    <Box className="dashboard-stat__value-row">
                      <Typography component="h2" className="dashboard-stat__value">
                        {loading ? '…' : String(stats.total)}
                      </Typography>
                    </Box>
                    <Typography component="span" className="dashboard-stat__delta">
                      Total mock exams
                    </Typography>
                  </Box>
                  <Box className="dashboard-stat__visual">
                    <Box className="dashboard-stat__badge">📝</Box>
                  </Box>
                </Box>
                <Box className="dashboard-stat__sparkbars">
                  {STAT_SPARK.map((bar, index) => (
                    <Box
                      key={`assigned-${bar}-${index}`}
                      className="dashboard-stat__sparkbar"
                      sx={
                        {
                          '--bar-height': `${bar}px`,
                          '--bar-opacity': index % 3 === 0 ? 1 : 0.45,
                        } as CSSProperties
                      }
                    />
                  ))}
                </Box>
                <Box className="dashboard-stat__footer">
                  <Box className="dashboard-stat__footer-icon">◔</Box>
                  <Typography component="p" className="dashboard-stat__footer-text">
                    Exams released to you by your center
                  </Typography>
                </Box>
              </Box>

              <Box
                className="dashboard-stat"
                sx={
                  {
                    '--accent': c.primary.light,
                    '--soft-accent': tokens.rgba.primaryLight_12,
                    '--delta-color': c.chart.delta,
                  } as CSSProperties
                }
              >
                <Box className="dashboard-stat__header">
                  <Box>
                    <Typography component="p" className="dashboard-stat__eyebrow">
                      Ready now
                    </Typography>
                    <Box className="dashboard-stat__value-row">
                      <Typography component="h2" className="dashboard-stat__value">
                        {loading ? '…' : String(stats.readyToStart)}
                      </Typography>
                    </Box>
                    <Typography component="span" className="dashboard-stat__delta">
                      {stats.readyToStart > 0 ? 'Open and start today' : 'None available'}
                    </Typography>
                  </Box>
                  <Box className="dashboard-stat__visual">
                    <Box className="dashboard-stat__badge">▶</Box>
                  </Box>
                </Box>
                <Box className="dashboard-stat__footer">
                  <Box className="dashboard-stat__footer-icon">◌</Box>
                  <Typography component="p" className="dashboard-stat__footer-text">
                    Active exams you can enter right now
                  </Typography>
                </Box>
              </Box>

              <Box
                className="dashboard-stat"
                sx={
                  {
                    '--accent': c.chart.medium,
                    '--soft-accent': tokens.rgba.chartMedium_12,
                    '--delta-color': c.chart.delta,
                  } as CSSProperties
                }
              >
                <Box className="dashboard-stat__header">
                  <Box>
                    <Typography component="p" className="dashboard-stat__eyebrow">
                      Pending
                    </Typography>
                    <Box className="dashboard-stat__value-row">
                      <Typography component="h2" className="dashboard-stat__value">
                        {loading ? '…' : String(stats.pending)}
                      </Typography>
                    </Box>
                    <Typography component="span" className="dashboard-stat__delta">
                      Not yet submitted
                    </Typography>
                  </Box>
                  <Box className="dashboard-stat__visual">
                    <Box className="dashboard-stat__badge">⏳</Box>
                  </Box>
                </Box>
                <Box className="dashboard-stat__footer">
                  <Box className="dashboard-stat__footer-icon">◌</Box>
                  <Typography component="p" className="dashboard-stat__footer-text">
                    Awaiting your attempt or center release
                  </Typography>
                </Box>
              </Box>

              <Box
                className="dashboard-stat"
                sx={
                  {
                    '--accent': c.teal.main,
                    '--soft-accent': tokens.rgba.teal_12,
                    '--delta-color': c.success.dark,
                  } as CSSProperties
                }
              >
                <Box className="dashboard-stat__header">
                  <Box>
                    <Typography component="p" className="dashboard-stat__eyebrow">
                      Completed
                    </Typography>
                    <Box className="dashboard-stat__value-row">
                      <Typography component="h2" className="dashboard-stat__value">
                        {loading ? '…' : String(stats.completed)}
                      </Typography>
                    </Box>
                    <Typography component="span" className="dashboard-stat__delta">
                      {stats.completionPct}% of assigned
                    </Typography>
                  </Box>
                  <Box className="dashboard-stat__visual">
                    <Box className="dashboard-stat__badge">✓</Box>
                  </Box>
                </Box>
                <Box className="dashboard-stat__footer">
                  <Box className="dashboard-stat__footer-icon">✓</Box>
                  <Typography component="p" className="dashboard-stat__footer-text">
                    Exams you have already submitted
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="student-dashboard__body">
              <Box className="dashboard-screen__panel student-exam-list">
                <Box className="dashboard-screen__panel-head">
                  <Box>
                    <Typography component="h2" className="dashboard-screen__panel-title">
                      My exams
                    </Typography>
                    <Typography component="p" className="dashboard-screen__panel-subtitle">
                      {loading
                        ? 'Loading your exam list…'
                        : `${sortedItems.length} exam${sortedItems.length === 1 ? '' : 's'} assigned`}
                    </Typography>
                  </Box>
                  <Button
                    variant="secondary"
                    className="dashboard-screen__panel-action"
                    onClick={() => navigate(ROUTES_PATH.studentMyExams)}
                  >
                    View all
                  </Button>
                </Box>

                {loading ? (
                  <Typography color="text.secondary">Loading exams…</Typography>
                ) : sortedItems.length === 0 ? (
                  <Box className="student-exam-list__empty">
                    No exams are assigned to you yet. Your center will notify you when a mock exam
                    is ready.
                  </Box>
                ) : (
                  <Box className="student-exam-list__table">
                    <Box className="student-exam-list__head">
                      <span>Exam</span>
                      <span>Schedule</span>
                      <span>Status</span>
                      <span />
                    </Box>
                    {sortedItems.map((item) => (
                      <Box key={item.id} className="student-exam-list__row">
                        <Typography component="p" className="student-exam-list__title">
                          {item.title}
                        </Typography>
                        <Typography className="student-exam-list__meta">
                          {item.scheduleLabel}
                        </Typography>
                        <Box className={getExamStatusClass(item.examStatus)}>
                          {getExamStatusLabel(item.examStatus)}
                          {item.studentCompleted ? ' · Done' : ''}
                        </Box>
                        <Button
                          variant={item.canStart ? 'primary' : 'secondary'}
                          className="student-exam-list__action"
                          disabled={!item.canStart && item.examStatus !== 'ended' && !item.studentCompleted}
                          onClick={() => {
                            if (item.canStart) {
                              navigate(
                                `${ROUTES_PATH.studentExamPlayer}?examId=${encodeURIComponent(item.id)}`,
                              )
                              return
                            }
                            if (item.studentCompleted) {
                              navigate(getStudentMyExamReviewPath(item.studentExamId))
                              return
                            }
                            navigate(ROUTES_PATH.studentMyExams)
                          }}
                        >
                          {getActionLabel(item)}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box className="student-aside">
                <Box className="student-next-card">
                  <Typography component="p" className="student-next-card__label">
                    Up next
                  </Typography>
                  {nextExam ? (
                    <>
                      <Typography component="h3" className="student-next-card__title">
                        {nextExam.title}
                      </Typography>
                      <Typography className="student-next-card__meta">
                        {nextExam.scheduleLabel}
                      </Typography>
                      <Button
                        variant="primary"
                        className="student-next-card__action"
                        disabled={!nextExam.canStart}
                        onClick={() => {
                          if (!nextExam.canStart) {
                            navigate(ROUTES_PATH.studentMyExams)
                            return
                          }
                          navigate(
                            `${ROUTES_PATH.studentExamPlayer}?examId=${encodeURIComponent(nextExam.id)}`,
                          )
                        }}
                      >
                        {nextExam.canStart ? 'Start this exam' : 'View details'}
                      </Button>
                    </>
                  ) : (
                    <Typography className="student-next-card--empty">
                      No upcoming exams right now. Check notifications or contact your center.
                    </Typography>
                  )}
                </Box>

                <Box className="student-quick-links">
                  <Typography component="h3" className="student-quick-links__title">
                    Quick links
                  </Typography>
                  <button
                    type="button"
                    className="student-quick-links__item"
                    onClick={() => navigate(ROUTES_PATH.studentMyExams)}
                  >
                    <span>My exams</span>
                    <span>{sortedItems.length}</span>
                  </button>
                  <button
                    type="button"
                    className="student-quick-links__item"
                    onClick={() => navigate(ROUTES_PATH.notifications)}
                  >
                    <span>Notifications</span>
                    {unreadCount > 0 ? (
                      <span className="student-quick-links__badge">{unreadCount}</span>
                    ) : (
                      <span>0</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="student-quick-links__item"
                    onClick={() => navigate(ROUTES_PATH.studentCertificates)}
                  >
                    <span>My certificates</span>
                    <span>{certificatesLoading ? '…' : certificates.length}</span>
                  </button>
                  <button
                    type="button"
                    className="student-quick-links__item"
                    onClick={() => navigate(ROUTES_PATH.help)}
                  >
                    <span>Help & guide</span>
                    <span>→</span>
                  </button>
                </Box>

                {recentCertificates.length > 0 ? (
                  <Box className="student-next-card" sx={{ marginTop: 2 }}>
                    <Typography component="p" className="student-next-card__label">
                      Recent certificates
                    </Typography>
                    {recentCertificates.map((cert) => (
                      <Box key={cert.id} sx={{ mb: 1.5 }}>
                        <Typography component="h3" className="student-next-card__title">
                          {cert.examName}
                        </Typography>
                        <Typography className="student-next-card__meta">
                          Overall {cert.bandScore}
                          {cert.issuedDate
                            ? ` · ${formatCertificateDate(cert.issuedDate)}`
                            : ''}
                        </Typography>
                        <Button
                          variant="secondary"
                          className="student-next-card__action"
                          onClick={() => openPreview(cert)}
                        >
                          View certificate
                        </Button>
                      </Box>
                    ))}
                    {certificates.length > 3 ? (
                      <Button
                        variant="secondary"
                        className="student-next-card__action"
                        onClick={() => navigate(ROUTES_PATH.studentCertificates)}
                      >
                        View all ({certificates.length})
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>
        </StudentDashboardPageRoot>
      </DashboardPageRoot>

      <CertificatePreviewDialog
        open={previewRecord != null}
        record={previewRecord}
        onClose={closePreview}
      />
    </Layout>
  )
}
