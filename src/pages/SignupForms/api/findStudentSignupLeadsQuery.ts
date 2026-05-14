import { gql } from '@apollo/client'

export const FIND_STUDENT_SIGNUP_LEADS_QUERY = gql`
  query FindStudentSignupLeads {
    findStudentSignupLeads {
      _id
      firstName
      lastName
      phone
      email
      status
      createdAt
      updatedAt
    }
  }
`
