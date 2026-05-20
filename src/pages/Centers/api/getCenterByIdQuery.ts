import { gql } from '@apollo/client'

export const GET_CENTER_BY_ID_QUERY = gql`
  query GetCenterById($_id: ID!) {
    findOneCenter(_id: $_id) {
      _id
      name
      manager
      address
      phone
      email
      logo
      establishedAt
      availableExamCredits
      createdAt
      updatedAt
    }
  }
`
