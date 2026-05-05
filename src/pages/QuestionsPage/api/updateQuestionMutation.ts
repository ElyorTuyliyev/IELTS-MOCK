import { gql } from '@apollo/client'

export const UPDATE_QUESTION_MUTATION = gql`
  mutation UpdateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      _id
      title
      ieltsModule
    }
  }
`
