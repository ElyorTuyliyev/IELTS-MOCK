import { gql } from '@apollo/client'

export const CREATE_EXAM_MUTATION = gql`
  mutation CreateExam(
    $title: String!
    $examiner: String!
    $examType: String!
    $examDate: DateTime!
    $startTime: String!
    $endTime: String!
    $price: Float!
  ) {
    createExam(
      title: $title
      examiner: $examiner
      examType: $examType
      examDate: $examDate
      startTime: $startTime
      endTime: $endTime
      price: $price
    ) {
      _id
      title
      examiner
      examType
      examDate
      startTime
      endTime
      price
      centerId
    }
  }
`
