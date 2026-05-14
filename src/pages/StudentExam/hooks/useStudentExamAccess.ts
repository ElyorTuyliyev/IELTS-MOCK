import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'

import {
  CHECK_MY_STUDENT_EXAM_ACCESS_QUERY,
  type CheckMyStudentExamAccessResponse,
} from '../api/studentExamMutations'
import type { StudentExamUnavailableReason } from '../components/StudentExamUnavailable'

export type StudentExamDenyState = {
  reason: StudentExamUnavailableReason
  description?: string
} | null

function resolveDenyState(
  examId: string,
  access: CheckMyStudentExamAccessResponse['checkMyStudentExamAccess'] | undefined,
  options: { hasError: boolean; noQuestions: boolean },
): StudentExamDenyState {
  if (!examId) {
    return {
      reason: 'no_exam',
      description: 'No exam selected or not assigned to you.',
    }
  }

  if (!access) {
    return options.hasError
      ? { reason: 'no_exam', description: 'Failed to load exam details.' }
      : null
  }

  if (!access.allowed) {
    const reasonText = access.reason ?? ''
    const completed = Boolean(access.enrollment?.isCompleted)

    if (
      completed ||
      reasonText.includes('ended') ||
      reasonText.includes('submitted') ||
      reasonText.includes('completed') ||
      reasonText.includes('finished')
    ) {
      return {
        reason: 'ended',
        description: reasonText || undefined,
      }
    }

    return {
      reason: 'no_exam',
      description: reasonText || undefined,
    }
  }

  if (options.noQuestions) {
    return {
      reason: 'no_exam',
      description: 'No questions are assigned for this exam.',
    }
  }

  return null
}

export function useStudentExamAccess(options?: { noQuestions?: boolean }) {
  const [searchParams] = useSearchParams()
  const examId = searchParams.get('examId')?.trim() ?? ''
  const noQuestions = options?.noQuestions ?? false

  const { data, loading, error } = useQuery<CheckMyStudentExamAccessResponse>(
    CHECK_MY_STUDENT_EXAM_ACCESS_QUERY,
    {
      variables: { examId },
      skip: !examId,
      fetchPolicy: 'network-only',
    },
  )

  const denyState = useMemo(() => {
    if (loading) {
      return null
    }
    return resolveDenyState(examId, data?.checkMyStudentExamAccess, {
      hasError: Boolean(error),
      noQuestions,
    })
  }, [data?.checkMyStudentExamAccess, error, examId, loading, noQuestions])

  return {
    examId,
    denyState,
    accessLoading: Boolean(examId) && loading,
    enrollment: data?.checkMyStudentExamAccess?.enrollment ?? null,
    access: data?.checkMyStudentExamAccess ?? null,
  } as const
}
