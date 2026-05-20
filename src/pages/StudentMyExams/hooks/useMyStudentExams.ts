import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'

import { FIND_ALL_EXAMS_QUERY } from '../../CreateExam/api/findAllExamsQuery'
import { FIND_MY_STUDENT_EXAMS_QUERY, type FindMyStudentExamsResponse } from '../api/findMyStudentExamsQuery'
import { formatPriceInSom } from '../../../utils/priceFormat'

export type StudentExamListItem = {
  id: string
  studentExamId: string
  title: string
  scheduleLabel: string
  examStatus: 'active' | 'ended' | 'draft'
  studentCompleted: boolean
  canStart: boolean
  isRegistered: boolean
  canRegister: boolean
  isApprovalPending: boolean
  isPaymentPending: boolean
  requiresPayment: boolean
  priceLabel: string
}

type FindAllExamsResponse = {
  findAllExams: Array<{
    _id: string
    title: string
    examDate: string
    startTime: string
    endTime: string
    price: number
    showPrice?: boolean
    isUpcomingVisibleToStudents?: boolean
    isActive: boolean
    isCompleted: boolean
  }>
}

function formatSchedule(examDate: string, startTime: string, endTime: string) {
  const parsed = new Date(examDate)
  const dateLabel = Number.isNaN(parsed.getTime())
    ? '—'
    : parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  return `${dateLabel} · ${startTime} – ${endTime}`
}

export function useMyStudentExams() {
  const { data: examsData, loading: examsLoading, error: examsError, refetch: refetchExams } =
    useQuery<FindAllExamsResponse>(FIND_ALL_EXAMS_QUERY)

  const {
    data: enrollmentsData,
    loading: enrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useQuery<FindMyStudentExamsResponse>(FIND_MY_STUDENT_EXAMS_QUERY)

  const items = useMemo<StudentExamListItem[]>(() => {
    const exams = examsData?.findAllExams ?? []
    const enrollmentByExamId = new Map(
      (enrollmentsData?.findMyStudentExams ?? []).map((enrollment) => [
        String(enrollment.examId),
        enrollment,
      ]),
    )

    return exams
      .map((exam) => {
        const enrollment = enrollmentByExamId.get(String(exam._id))
        const studentCompleted = Boolean(enrollment?.isCompleted)
        const examStatus: StudentExamListItem['examStatus'] = exam.isCompleted
          ? 'ended'
          : exam.isActive
            ? 'active'
            : 'draft'
        const isRegistered = Boolean(enrollment)
        const requiresPayment = Number(exam.price) > 0
        const isApprovalPending = isRegistered && !Boolean(enrollment?.isApproved)
        const isPaymentPending =
          isRegistered &&
          requiresPayment &&
          enrollment?.registrationPaymentStatus === 'pending_approval'

        return {
          id: exam._id,
          studentExamId: enrollment?._id ?? '',
          title: exam.title,
          scheduleLabel: formatSchedule(exam.examDate, exam.startTime, exam.endTime),
          examStatus,
          studentCompleted,
          canStart:
            Boolean(enrollment?.isReleased) &&
            Boolean(enrollment?.isApproved) &&
            (!requiresPayment ||
              enrollment?.registrationPaymentStatus === 'approved') &&
            exam.isActive &&
            !exam.isCompleted &&
            !studentCompleted,
          isRegistered,
          canRegister: !isRegistered && Boolean(exam.isUpcomingVisibleToStudents),
          isApprovalPending,
          isPaymentPending,
          requiresPayment,
          priceLabel: exam.showPrice === false ? 'Price hidden' : formatPriceInSom(exam.price ?? 0),
        }
      })
      .filter((item): item is StudentExamListItem => item != null)
  }, [enrollmentsData?.findMyStudentExams, examsData?.findAllExams])

  return {
    items,
    loading: examsLoading || enrollmentsLoading,
    error: examsError ?? enrollmentsError,
    refetch: async () => {
      await Promise.all([refetchExams(), refetchEnrollments()])
    },
  }
}
