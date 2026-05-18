import { gql } from '@apollo/client'

export const FIND_ALL_EXAMS_FOR_QUESTION_QUERY = gql`
  query FindAllExamsForQuestion {
    findAllExams {
      _id
      title
      listeningId
      readingId
      writingId
      speakingId
      isActive
      isCompleted
    }
  }
`
