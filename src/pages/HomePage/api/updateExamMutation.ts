import { gql } from '@apollo/client'

export const UPDATE_EXAM_MUTATION = gql`
  mutation UpdateExam(
    $_id: ID!
    $title: String!
    $examiner: String!
    $examType: String!
    $examDate: DateTime!
    $startTime: String!
    $endTime: String!
    $price: Float!
  ) {
    updateExam(
      _id: $_id
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
