import { gql } from '@apollo/client'

export const FIND_MY_STUDENT_EXAMS_QUERY = gql`
  query FindMyStudentExams {
    findMyStudentExams {
      _id
      examId
      isCompleted
      isReleased
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
    completedAt?: string | null
    startedAt: string
  }>
}
