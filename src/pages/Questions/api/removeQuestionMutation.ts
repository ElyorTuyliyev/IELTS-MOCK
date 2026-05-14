import { gql } from '@apollo/client'

export const REMOVE_QUESTION_MUTATION = gql`
  mutation RemoveQuestion($_id: ID!) {
    removeQuestion(_id: $_id)
  }
`
