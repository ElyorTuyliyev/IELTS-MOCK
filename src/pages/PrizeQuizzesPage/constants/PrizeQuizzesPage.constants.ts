export type PrizeQuizStatus = 'Completed' | 'Active' | 'Pending' | 'Draft'
export type PrizeQuizCategory = 'Default' | 'Exams' | 'Test Exams'
export type PrizeQuizType = 'Advancing' | 'Prize Quiz'

export type PrizeQuizRow = {
  name: string
  description: string
  level: string
  createdDate: string
  examStatus: PrizeQuizStatus
  category: PrizeQuizCategory
  status: PrizeQuizType
  initials: string
  avatarGradient: string
  levelTone: 'orange' | 'teal' | 'pink' | 'yellow' | 'blue'
}

export type PrizeQuizGridRow = PrizeQuizRow & {
  id: string
}

export const PRIZE_QUIZ_PAGE_SIZE = 8

export const PRIZE_QUIZZES: PrizeQuizRow[] = [
  {
    name: 'Exam Sphere',
    description: 'A comprehensive challenge hub',
    level: '53/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Completed',
    category: 'Default',
    status: 'Advancing',
    initials: 'ES',
    avatarGradient: 'linear-gradient(135deg, #38b2ac 0%, #7c3aed 100%)',
    levelTone: 'orange',
  },
  {
    name: 'Test Trek',
    description: 'Navigate the world of quizzes',
    level: '27/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Active',
    category: 'Exams',
    status: 'Prize Quiz',
    initials: 'TT',
    avatarGradient: 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)',
    levelTone: 'teal',
  },
  {
    name: 'Eval Ease',
    description: 'Simplify your evaluation flow',
    level: '100/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Pending',
    category: 'Test Exams',
    status: 'Advancing',
    initials: 'EE',
    avatarGradient: 'linear-gradient(135deg, #111827 0%, #7c3aed 100%)',
    levelTone: 'pink',
  },
  {
    name: 'Smart Exam Pro',
    description: 'SmartExam Pro learning engine',
    level: '00/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Draft',
    category: 'Default',
    status: 'Advancing',
    initials: 'SP',
    avatarGradient: 'linear-gradient(135deg, #60a5fa 0%, #f59e0b 100%)',
    levelTone: 'yellow',
  },
  {
    name: 'AssessIQ',
    description: 'AssessIQ combined scoring',
    level: '53/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Pending',
    category: 'Test Exams',
    status: 'Advancing',
    initials: 'AQ',
    avatarGradient: 'linear-gradient(135deg, #1f2937 0%, #fb923c 100%)',
    levelTone: 'orange',
  },
  {
    name: 'Quizzy',
    description: 'Quizzy is a versatile contest',
    level: '53/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Draft',
    category: 'Exams',
    status: 'Prize Quiz',
    initials: 'QZ',
    avatarGradient: 'linear-gradient(135deg, #334155 0%, #60a5fa 100%)',
    levelTone: 'blue',
  },
  {
    name: 'Proctor Ace',
    description: 'ProctorAce is a secure suite',
    level: '100/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Active',
    category: 'Test Exams',
    status: 'Prize Quiz',
    initials: 'PA',
    avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
    levelTone: 'orange',
  },
  {
    name: 'Edu Examine',
    description: 'EduExamine offers fresh rounds',
    level: '53/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Completed',
    category: 'Default',
    status: 'Advancing',
    initials: 'EX',
    avatarGradient: 'linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)',
    levelTone: 'teal',
  },
  {
    name: 'Certify Now',
    description: 'CertifyNow is the final sprint',
    level: '00/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Completed',
    category: 'Exams',
    status: 'Advancing',
    initials: 'CN',
    avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #0f172a 100%)',
    levelTone: 'pink',
  },
  {
    name: 'Virtual ExamHub',
    description: 'Virtual ExamHub remote sessions',
    level: '53/100',
    createdDate: 'Jan 20, 2025',
    examStatus: 'Active',
    category: 'Test Exams',
    status: 'Prize Quiz',
    initials: 'VH',
    avatarGradient: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
    levelTone: 'blue',
  },
]
