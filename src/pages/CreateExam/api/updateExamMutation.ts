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
    $showPrice: Boolean
    $isUpcomingVisibleToStudents: Boolean
    $useGlobalPaymentInstructions: Boolean
    $customPaymentInstructions: String
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
      showPrice: $showPrice
      isUpcomingVisibleToStudents: $isUpcomingVisibleToStudents
      useGlobalPaymentInstructions: $useGlobalPaymentInstructions
      customPaymentInstructions: $customPaymentInstructions
    ) {
      _id
      title
      examiner
      examType
      examDate
      startTime
      endTime
      price
      showPrice
      isUpcomingVisibleToStudents
      useGlobalPaymentInstructions
      customPaymentInstructions
      centerId
    }
  }
`
