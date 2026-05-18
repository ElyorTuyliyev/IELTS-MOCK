import { gql } from '@apollo/client'

export const FIND_ALL_EXAM_PLANS_QUERY = gql`
  query FindAllExamPlans($activeOnly: Boolean) {
    findAllExamPlans(activeOnly: $activeOnly) {
      _id
      name
      examCount
      price
      paymentInstructions
      isActive
      createdAt
      updatedAt
    }
  }
`

export const CREATE_EXAM_PLAN_MUTATION = gql`
  mutation CreateExamPlan($input: CreateExamPlanInput!) {
    createExamPlan(input: $input) {
      _id
      name
      examCount
      price
      paymentInstructions
      isActive
    }
  }
`

export const UPDATE_EXAM_PLAN_MUTATION = gql`
  mutation UpdateExamPlan($input: UpdateExamPlanInput!) {
    updateExamPlan(input: $input) {
      _id
      name
      examCount
      price
      paymentInstructions
      isActive
    }
  }
`

export const REMOVE_EXAM_PLAN_MUTATION = gql`
  mutation RemoveExamPlan($_id: ID!) {
    removeExamPlan(_id: $_id)
  }
`

export const SUBMIT_PLAN_PURCHASE_MUTATION = gql`
  mutation SubmitPlanPurchase($input: SubmitPlanPurchaseInput!) {
    submitPlanPurchase(input: $input) {
      _id
      planName
      status
      amount
      examCount
    }
  }
`

export const REVIEW_PLAN_PURCHASE_MUTATION = gql`
  mutation ReviewPlanPurchase($input: ReviewPlanPurchaseInput!) {
    reviewPlanPurchase(input: $input) {
      _id
      status
    }
  }
`

export const FIND_PENDING_PLAN_PURCHASES_QUERY = gql`
  query FindPendingPlanPurchases {
    findPendingPlanPurchases {
      _id
      centerId
      planName
      examCount
      amount
      status
      centerNote
      createdAt
    }
  }
`

export const PURCHASE_HISTORY_QUERY = gql`
  query PurchaseHistory($page: Int!, $pageSize: Int!, $centerId: ID) {
    purchaseHistory(page: $page, pageSize: $pageSize, centerId: $centerId) {
      items {
        _id
        recordType
        centerId
        centerName
        amount
        examCredits
        planName
        status
        method
        note
        occurredAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`

export const FIND_ALL_PAYMENTS_QUERY = gql`
  query FindAllPayments {
    findAllPayments {
      _id
      amount
      paidAt
      method
      note
      centerId
      examCreditsAdded
      planPurchaseId
      createdAt
      updatedAt
    }
  }
`

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment(
    $amount: Float!
    $paidAt: DateTime!
    $method: String!
    $note: String
    $centerId: String!
    $examCreditsAdded: Int
  ) {
    createPayment(
      amount: $amount
      paidAt: $paidAt
      method: $method
      note: $note
      centerId: $centerId
      examCreditsAdded: $examCreditsAdded
    ) {
      _id
      amount
      paidAt
      method
      note
      centerId
      examCreditsAdded
      planPurchaseId
    }
  }
`

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePayment(
    $_id: ID!
    $amount: Float
    $paidAt: DateTime
    $method: String
    $note: String
    $centerId: String
    $examCreditsAdded: Int
  ) {
    updatePayment(
      _id: $_id
      amount: $amount
      paidAt: $paidAt
      method: $method
      note: $note
      centerId: $centerId
      examCreditsAdded: $examCreditsAdded
    ) {
      _id
      amount
      paidAt
      method
      note
      centerId
      examCreditsAdded
      planPurchaseId
    }
  }
`

export const REMOVE_PAYMENT_MUTATION = gql`
  mutation RemovePayment($_id: ID!) {
    removePayment(_id: $_id)
  }
`

export const FIND_ALL_CENTERS_BILLING_QUERY = gql`
  query FindAllCentersBilling {
    findAllCenters {
      _id
      name
    }
  }
`

export type ExamPlan = {
  _id: string
  name: string
  examCount: number
  price: number
  paymentInstructions: string
  isActive: boolean
}

export type PurchaseHistoryItem = {
  _id: string
  recordType: string
  centerId: string
  centerName?: string
  amount: number
  examCredits?: number
  planName?: string
  status?: string
  method?: string
  note?: string
  occurredAt: string
}

export type PaymentRecord = {
  _id: string
  amount: number
  paidAt: string
  method: string
  note?: string
  centerId: string
  examCreditsAdded?: number
  planPurchaseId?: string | null
  createdAt: string
  updatedAt: string
}

export type PendingPlanPurchase = {
  _id: string
  centerId: string
  planName: string
  examCount: number
  amount: number
  status: string
  centerNote?: string
  createdAt: string
}
