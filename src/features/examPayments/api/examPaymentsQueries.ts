import { gql } from '@apollo/client'

export const CENTER_PAYMENT_SETTINGS_QUERY = gql`
  query CenterPaymentSettings {
    centerPaymentSettings {
      _id
      globalPaymentInstructions
    }
  }
`

export const UPDATE_CENTER_PAYMENT_SETTINGS_MUTATION = gql`
  mutation UpdateCenterPaymentSettings($input: UpdateCenterPaymentSettingsInput!) {
    updateCenterPaymentSettings(input: $input) {
      _id
      globalPaymentInstructions
    }
  }
`

export const EXAM_PAYMENT_INSTRUCTIONS_QUERY = gql`
  query ExamPaymentInstructions($examId: String!) {
    examPaymentInstructions(examId: $examId) {
      instructions
      usesGlobalPaymentInstructions
      requiresPayment
      amount
    }
  }
`

export const FIND_EXAM_REGISTRATION_PAYMENTS_QUERY = gql`
  query FindExamRegistrationPayments($status: String) {
    findExamRegistrationPayments(status: $status) {
      _id
      studentExamId
      studentId
      examId
      centerId
      amount
      status
      studentNote
      proofImageUrl
      adminNote
      reviewedAt
      createdAt
    }
  }
`

export const SUBMIT_EXAM_REGISTRATION_PAYMENT_MUTATION = gql`
  mutation SubmitExamRegistrationPayment($input: SubmitExamRegistrationPaymentInput!) {
    submitExamRegistrationPayment(input: $input) {
      _id
      examId
      isApproved
      registrationPaymentStatus
    }
  }
`

export const REVIEW_EXAM_REGISTRATION_PAYMENT_MUTATION = gql`
  mutation ReviewExamRegistrationPayment($input: ReviewExamRegistrationPaymentInput!) {
    reviewExamRegistrationPayment(input: $input) {
      _id
      status
      studentExamId
    }
  }
`

export const PAYMENT_REQUEST_BY_TOKEN_QUERY = gql`
  query PaymentRequestByToken($token: String!) {
    paymentRequestByToken(token: $token) {
      paymentId
      examTitle
      studentName
      amount
      instructions
      usesGlobalPaymentInstructions
      status
      studentNote
      proofImageUrl
    }
  }
`

export const SUBMIT_PAYMENT_REQUEST_BY_TOKEN_MUTATION = gql`
  mutation SubmitPaymentRequestByToken($input: SubmitPaymentRequestByTokenInput!) {
    submitPaymentRequestByToken(input: $input) {
      _id
      status
      studentNote
      proofImageUrl
    }
  }
`

export const APPROVE_STUDENT_EXAM_WITH_PAYMENT_MUTATION = gql`
  mutation ApproveStudentExamWithPayment($input: ApproveStudentExamWithPaymentInput!) {
    approveStudentExamWithPayment(input: $input) {
      _id
      isApproved
      registrationPaymentStatus
    }
  }
`

export type ExamRegistrationPaymentRecord = {
  _id: string
  studentExamId: string
  studentId: string
  examId: string
  centerId: string
  amount: number
  status: string
  studentNote?: string | null
  proofImageUrl?: string | null
  adminNote?: string | null
  reviewedAt?: string | null
  createdAt: string
}
