import { gql } from '@apollo/client'

export const FIND_STUDENT_EXAM_REVIEW_QUERY = gql`
  query FindStudentExamReview($_id: ID!) {
    findStudentExamReview(_id: $_id) {
      studentExamId
      examId
      examTitle
      studentId
      studentName
      isCompleted
      listeningScore
      readingScore
      writingScore
      speakingScore
      totalScore
      writingFeedback
      writingEvaluation
      speakingFeedback
      speakingEvaluation
      modules {
        module
        correctCount
        totalCount
        score
        audioUrl
        questions {
          questionId
          title
          ieltsModule
          listeningPart
          passageHtml
          questionsHtml
          slots {
            slotKey
            studentAnswer
            correctAnswer
            isCorrect
          }
        }
      }
    }
  }
`

export const UPDATE_STUDENT_EXAM_REVIEW_MUTATION = gql`
  mutation UpdateStudentExamReview($input: UpdateStudentExamReviewInput!) {
    updateStudentExamReview(input: $input) {
      _id
      writingScore
      speakingScore
      totalScore
      writingFeedback
      writingEvaluation
      speakingFeedback
      speakingEvaluation
    }
  }
`

export type ReviewAnswerSlot = {
  slotKey: string
  studentAnswer?: string | null
  correctAnswer?: string | null
  isCorrect?: boolean | null
}

export type ReviewQuestion = {
  questionId: string
  title?: string | null
  ieltsModule?: string | null
  listeningPart?: number | null
  passageHtml?: string | null
  questionsHtml?: string | null
  slots: ReviewAnswerSlot[]
}

export type ReviewModule = {
  module: string
  correctCount: number
  totalCount: number
  score?: number | null
  audioUrl?: string | null
  questions: ReviewQuestion[]
}

export type StudentExamReview = {
  studentExamId: string
  examId: string
  examTitle: string
  studentId: string
  studentName: string
  isCompleted: boolean
  listeningScore?: number | null
  readingScore?: number | null
  writingScore?: number | null
  speakingScore?: number | null
  totalScore?: number | null
  writingFeedback?: string | null
  writingEvaluation?: string | null
  speakingFeedback?: string | null
  speakingEvaluation?: string | null
  modules: ReviewModule[]
}

export type FindStudentExamReviewResponse = {
  findStudentExamReview: StudentExamReview
}
