import { useEffect, useMemo } from 'react'
import { useMutation } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'

import {
  BEGIN_MY_STUDENT_EXAM_MUTATION,
  type BeginMyStudentExamResponse,
} from '../api/studentExamMutations'
import { isNetworkFetchError } from '../../../helpers/graphql'
import type { StudentExamUnavailableReason } from '../components/StudentExamUnavailable'

export type StudentExamDenyState = {
  reason: StudentExamUnavailableReason
  description?: string
} | null

function resolveDenyState(
  examId: string,
  access: BeginMyStudentExamResponse['beginMyStudentExam'] | undefined,
  options: { hasError: boolean; networkError: boolean; noQuestions: boolean },
): StudentExamDenyState {
  if (!examId) {
    return {
      reason: 'no_exam',
      description: 'No exam selected or not assigned to you.',
    }
  }

  if (!access) {
    return options.hasError
      ? {
          reason: 'no_exam',
          description: options.networkError
            ? 'Cannot reach the API server. Make sure the backend is running on port 8000 and refresh the page.'
            : 'Failed to load exam details.',
        }
      : null
  }

  if (!access.allowed) {
    const reasonText = access.reason ?? ''
    const completed = Boolean(access.enrollment?.isCompleted)

    if (
      reasonText.toLowerCase().includes('credit') ||
      reasonText.toLowerCase().includes('purchase a plan')
    ) {
      return {
        reason: 'no_credits',
        description: reasonText || undefined,
      }
    }

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

  const [beginExam, { data, loading, error }] = useMutation<BeginMyStudentExamResponse>(
    BEGIN_MY_STUDENT_EXAM_MUTATION,
    { fetchPolicy: 'no-cache' },
  )

  useEffect(() => {
    if (!examId) {
      return
    }
    void beginExam({ variables: { examId } })
  }, [beginExam, examId])

  const denyState = useMemo(() => {
    if (loading) {
      return null
    }
    return resolveDenyState(examId, data?.beginMyStudentExam, {
      hasError: Boolean(error),
      networkError: isNetworkFetchError(error),
      noQuestions,
    })
  }, [data?.beginMyStudentExam, error, examId, loading, noQuestions])

  return {
    examId,
    denyState,
    accessLoading: Boolean(examId) && loading,
    enrollment: data?.beginMyStudentExam?.enrollment ?? null,
    access: data?.beginMyStudentExam ?? null,
  } as const
}
