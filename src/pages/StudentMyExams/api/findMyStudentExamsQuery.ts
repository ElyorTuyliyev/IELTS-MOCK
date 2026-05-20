import { gql } from '@apollo/client'

export const FIND_MY_STUDENT_EXAMS_QUERY = gql`
  query FindMyStudentExams {
    findMyStudentExams {
      _id
      examId
      isCompleted
      isReleased
      isApproved
      registrationPaymentStatus
      completedAt
      startedAt
    }
  }
`

export type FindMyStudentExamsResponse = {
  findMyStudentExams: Array<{
    _id: string
    examId: string
    isCompleted: boolean
    isReleased: boolean
    isApproved: boolean
    registrationPaymentStatus?: string | null
    completedAt?: string | null
    startedAt: string
  }>
}
