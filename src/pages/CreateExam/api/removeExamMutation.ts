import { gql } from '@apollo/client'

export const REMOVE_EXAM_MUTATION = gql`
  mutation RemoveExam($_id: ID!) {
    removeExam(_id: $_id)
  }
`
