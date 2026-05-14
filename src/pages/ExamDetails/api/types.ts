export type Exam = {
  _id: string
  title: string
  examiner: string
  examType?: string | null
  examDate: string
  startTime: string
  endTime: string
  price: number
  isActive: boolean
  isCompleted: boolean
}

export type User = {
  _id: string
  firstName: string
  lastName: string
  role?: string | null
}

export type StudentExam = {
  _id: string
  studentId: string
  examId: string
  startedAt?: string | null
  completedAt?: string | null
  isCompleted: boolean
  isReleased: boolean
  questionIds?: string[] | null
  listeningScore?: number | null
  readingScore?: number | null
  writingScore?: number | null
  totalScore?: number | null
}

export type FindAllExamsQueryResponse = {
  findAllExams: Exam[]
}

export type FindAllUsersQueryResponse = {
  findAllUsers: User[]
}

export type FindAllStudentExamsQueryResponse = {
  findAllStudentExams: StudentExam[]
}

export type CreateStudentExamMutationResponse = {
  createStudentExam: {
    _id: string
    studentId: string
    examId: string
  }
}

export type CreateStudentExamMutationVariables = {
  input: {
    studentId: string
    examId: string
  }
}

export type AssignQuestionsMutationVariables = {
  input: { studentExamId: string; questionIds: string[] }
}

export type InitializeRandomQuestionsMutationResponse = {
  initializeRandomQuestionsForStudentExam: {
    _id: string
    questionIds?: string[] | null
  }
}

export type InitializeRandomQuestionsMutationVariables = {
  _id: string
}
