import { gql } from '@apollo/client'

export const FIND_ALL_EXAMS_QUERY = gql`
  query FindAllExams {
    findAllExams {
      _id
      title
      examiner
      examType
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
