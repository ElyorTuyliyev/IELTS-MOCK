import { gql } from '@apollo/client'

export const REGISTER_MY_STUDENT_EXAM_MUTATION = gql`
  mutation RegisterMyStudentExam($examId: String!) {
    registerMyStudentExam(examId: $examId) {
      _id
      examId
      isApproved
      isReleased
      isCompleted
    }
  }
`
