import { gql } from '@apollo/client'

export const FIND_ALL_PARTS_FOR_QUESTION_QUERY = gql`
  query FindAllPartsForQuestion {
    findAllParts {
      _id
      partNumber
      title
      moduleId
    }
  }
`
