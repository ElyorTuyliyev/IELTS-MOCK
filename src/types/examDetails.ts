export type Exam = {
  _id: string
  title: string
  examiner: string
  examType?: string | null
  examDate: string
  startTime: string
  endTime: string
  price: number
  showPrice?: boolean
  isUpcomingVisibleToStudents?: boolean
  isActive: boolean
  isStoredActive?: boolean
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
  isApproved: boolean
  questionIds?: string[] | null
  listeningScore?: number | null
  readingScore?: number | null
  writingScore?: number | null
  speakingScore?: number | null
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

export type AssignPaymentStatusOption = 'approved' | 'pending'

export type CreateStudentExamMutationResponse = {
  createStudentExam: {
    studentExam: {
      _id: string
      studentId: string
      examId: string
      isApproved?: boolean
    }
    payment?: {
      _id: string
      status: string
      paymentRequestToken?: string | null
    } | null
    paymentRequestUrl?: string | null
  }
}

export type CreateStudentExamMutationVariables = {
  input: {
    studentId: string
    examId: string
    isApproved?: boolean
    createPayment?: boolean
    paymentStatus?: AssignPaymentStatusOption
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
  force?: boolean
}
