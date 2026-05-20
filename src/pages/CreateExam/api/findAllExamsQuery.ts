import { gql } from '@apollo/client'

export const FIND_ALL_EXAMS_QUERY = gql`
  query FindAllExams {
    findAllExams {
      _id
      title
      examiner
      examType
      centerId
      examDate
      startTime
      endTime
      price
      showPrice
      isUpcomingVisibleToStudents
      useGlobalPaymentInstructions
      customPaymentInstructions
      startedAt
      completedAt
      isActive
      isStoredActive
      isCompleted
      createdAt
      listeningId
      readingId
      writingId
      speakingId
    }
  }
`
