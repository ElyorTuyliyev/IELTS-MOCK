export const ROUTES_PATH = {
  lms: '/lms',
  help: '/help',
  dashboard: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  studentJoin: '/join',
  studentLeadJoin: '/join/lead',
  allExams: '/exams',
  examsArchive: '/exams/archive',
  examDetails: '/exams/:examId',
  examStudentReview: '/exams/:examId/students/:studentExamId',
  studentExamPlayer: '/student/exam-player',
  studentMyExams: '/student/exams',
  center: '/centers',
  surveys: '/surveys',
  students: '/students',
  payments: '/payments',
  examPlans: '/exam-plans',
  buyPlan: '/buy-plan',
  purchaseHistory: '/purchase-history',
  settings: '/settings',
  courses: '/lms/courses',
  questions: '/questions',
  statistics: '/statistics',
  courseware: '/lms/courseware',
  certificates: '/certificates',
  addCenter: '/centers/new',
  addQuestion: '/questions/new',
  editQuestion: '/questions/:questionId/edit',
  allStudents: '/students/all',
  listeningQuestions: '/questions/listening',
  readingQuestions: '/questions/reading',
  writingQuestions: '/questions/writing',
  speakingQuestions: '/questions/speaking',
  prizeQuizzes: '/exams/prize-quizzes',
  signupForms: '/students/signup-forms',
  studentSettings: '/students/settings',
  resultsDatabase: '/results-database',
  notifications: '/notifications',
} as const

export type QuestionsModuleKey = 'Listening' | 'Reading' | 'Writing' | 'Speaking'

export function getQuestionsListPath(module?: QuestionsModuleKey | null): string {
  switch (module) {
    case 'Listening':
      return ROUTES_PATH.listeningQuestions
    case 'Reading':
      return ROUTES_PATH.readingQuestions
    case 'Writing':
      return ROUTES_PATH.writingQuestions
    case 'Speaking':
      return ROUTES_PATH.speakingQuestions
    default:
      return ROUTES_PATH.listeningQuestions
  }
}
