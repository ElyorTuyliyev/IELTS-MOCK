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
      isActive
      isCompleted
      createdAt
    }
  }
`
