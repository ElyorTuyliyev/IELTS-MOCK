import { gql } from '@apollo/client'

export const ACCEPT_STUDENT_SIGNUP_LEAD_MUTATION = gql`
  mutation AcceptStudentSignupLead($_id: ID!) {
    acceptStudentSignupLead(_id: $_id) {
      _id
      status
    }
  }
`

export const REJECT_STUDENT_SIGNUP_LEAD_MUTATION = gql`
  mutation RejectStudentSignupLead($_id: ID!) {
    rejectStudentSignupLead(_id: $_id) {
      _id
      status
    }
  }
`
