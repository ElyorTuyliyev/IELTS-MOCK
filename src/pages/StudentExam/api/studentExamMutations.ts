import { gql } from '@apollo/client'

export const CHECK_MY_STUDENT_EXAM_ACCESS_QUERY = gql`
  query CheckMyStudentExamAccess($examId: String!) {
    checkMyStudentExamAccess(examId: $examId) {
      allowed
      reason
      enrollment {
        _id
        examId
        isCompleted
        completedAt
        startedAt
        questionIds
      }
    }
  }
`

export const BEGIN_MY_STUDENT_EXAM_MUTATION = gql`
  mutation BeginMyStudentExam($examId: String!) {
    beginMyStudentExam(examId: $examId) {
      allowed
      reason
      enrollment {
        _id
        examId
        isCompleted
        completedAt
        startedAt
        questionIds
      }
    }
  }
`

export const FIND_MY_STUDENT_EXAM_QUERY = gql`
  query FindMyStudentExam($examId: String!) {
    findMyStudentExam(examId: $examId) {
      _id
      examId
      isCompleted
      completedAt
      startedAt
    }
  }
`

export const SUBMIT_MY_STUDENT_EXAM_MUTATION = gql`
  mutation SubmitMyStudentExam($examId: String!, $answers: [StudentExamAnswerInput!]!) {
    submitMyStudentExam(examId: $examId, answers: $answers) {
      _id
      examId
      isCompleted
      completedAt
      listeningScore
      readingScore
      totalScore
    }
  }
`

export const COMPLETE_MY_STUDENT_EXAM_MUTATION = gql`
  mutation CompleteMyStudentExam($examId: String!) {
    completeMyStudentExam(examId: $examId) {
      _id
      examId
      isCompleted
      completedAt
    }
  }
`

export type BeginMyStudentExamResponse = {
  beginMyStudentExam: {
    allowed: boolean
    reason?: string | null
    enrollment?: {
      _id: string
      examId: string
      isCompleted: boolean
      completedAt?: string | null
      startedAt: string
      questionIds?: string[] | null
    } | null
  }
}

export type CheckMyStudentExamAccessResponse = {
  checkMyStudentExamAccess: {
    allowed: boolean
    reason?: string | null
    enrollment?: {
      _id: string
      examId: string
      isCompleted: boolean
      completedAt?: string | null
      startedAt: string
      questionIds?: string[] | null
    } | null
  }
}

export type FindMyStudentExamResponse = {
  findMyStudentExam: {
    _id: string
    examId: string
    isCompleted: boolean
    completedAt?: string | null
    startedAt: string
  } | null
}

export type SubmitMyStudentExamResponse = {
  submitMyStudentExam: {
    _id: string
    examId: string
    isCompleted: boolean
    completedAt?: string | null
    listeningScore?: number | null
    readingScore?: number | null
    totalScore?: number | null
  }
}

export type CompleteMyStudentExamResponse = {
  completeMyStudentExam: {
    _id: string
    examId: string
    isCompleted: boolean
    completedAt?: string | null
  }
}
