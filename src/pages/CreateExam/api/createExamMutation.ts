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
    $showPrice: Boolean
    $isUpcomingVisibleToStudents: Boolean
    $useGlobalPaymentInstructions: Boolean
    $customPaymentInstructions: String
  ) {
    createExam(
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
      listeningId
      readingId
      writingId
      speakingId
    }
  }
`
