import { gql } from '@apollo/client'
import type { StudentExamReview } from '../../StudentExamReview/api/queries'

export const FIND_MY_STUDENT_EXAM_REVIEW_QUERY = gql`
  query FindMyStudentExamReview($_id: ID!) {
    findMyStudentExamReview(_id: $_id) {
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
      speakingFeedback
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

export type FindMyStudentExamReviewResponse = {
  findMyStudentExamReview: StudentExamReview
}
