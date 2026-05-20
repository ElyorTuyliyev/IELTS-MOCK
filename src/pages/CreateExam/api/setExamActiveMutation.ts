import { gql } from '@apollo/client'

export const SET_EXAM_ACTIVE_MUTATION = gql`
  mutation SetExamActive($_id: ID!, $isActive: Boolean!) {
    setExamActive(_id: $_id, isActive: $isActive) {
      _id
      isActive
      isStoredActive
      isCompleted
    }
  }
`
