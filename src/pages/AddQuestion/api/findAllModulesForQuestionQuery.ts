import { gql } from '@apollo/client'

export const FIND_ALL_MODULES_FOR_QUESTION_QUERY = gql`
  query FindAllModulesForQuestion {
    findAllModules {
      _id
      type
    }
  }
`

export type ModuleListItem = {
  _id: string
  type: string
}

export type FindAllModulesResponse = {
  findAllModules: ModuleListItem[]
}
