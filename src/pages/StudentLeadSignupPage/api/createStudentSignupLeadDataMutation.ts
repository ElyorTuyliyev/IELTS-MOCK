import { gql } from '@apollo/client'

export const CREATE_STUDENT_SIGNUP_LEAD_DATA_MUTATION = gql`
  mutation CreateStudentSignupLeadData(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $centerId: String
  ) {
    createStudentSignupLeadData(
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      centerId: $centerId
    ) {
      _id
      firstName
      lastName
      phone
      status
      createdAt
    }
  }
`
