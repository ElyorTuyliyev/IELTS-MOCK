export type QuestionType = 'Listening' | 'Reading' | 'Writing' | 'Speaking'

export type QuestionModuleFilter = 'All IELTS modules' | QuestionType

export type QuestionGridRow = {
  id: string
  title: string
  partsCount: number
  questionsCount: number
  author: string
  category: string
  questionType: QuestionType
  questionIds: string[]
}

export const QUESTION_PAGE_SIZE = 8
