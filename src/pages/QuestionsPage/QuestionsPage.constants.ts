export type QuestionTag =
  | 'Easy'
  | 'Anti cheating'
  | 'Online lms'
  | 'Matching'

export type QuestionType =
  | 'Multiple response'
  | 'Single choice'
  | 'Matching'

export type QuestionRow = {
  title: string
  tag: QuestionTag
  author: string
  category: string
  questionType: QuestionType
  errorRate: number
}

export type QuestionGridRow = QuestionRow & {
  id: string
}

export const QUESTION_PAGE_SIZE = 8

const BASE_QUESTIONS: QuestionRow[] = [
  {
    title: 'On which device can candidates access their exam session?',
    tag: 'Easy',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 0,
  },
  {
    title: 'A teacher can create online quizzes with which workflow?',
    tag: 'Anti cheating',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 25,
  },
  {
    title: 'Administrators can create an online LMS assessment from where?',
    tag: 'Online lms',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 50,
  },
  {
    title: 'With OnlineExamMaker, an exam can use which matching logic?',
    tag: 'Matching',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 25,
  },
  {
    title: 'What kind of report can a teacher export after grading?',
    tag: 'Easy',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 0,
  },
  {
    title: 'How can a teacher prevent cheating during online proctoring?',
    tag: 'Anti cheating',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 75,
  },
  {
    title: 'How many concurrent exam takers can the system handle here?',
    tag: 'Matching',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 100,
  },
  {
    title: 'What kind of rich media can be embedded into a question block?',
    tag: 'Online lms',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 0,
  },
  {
    title: 'What can instructors do in OnlineExamMaker question bank?',
    tag: 'Matching',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 25,
  },
  {
    title: 'Which question type is supported for grouped answer selection?',
    tag: 'Easy',
    author: 'System Admin',
    category: 'Samples',
    questionType: 'Multiple response',
    errorRate: 0,
  },
]

export const QUESTIONS: QuestionRow[] = Array.from(
  { length: 5 },
  () => BASE_QUESTIONS,
).flat()
