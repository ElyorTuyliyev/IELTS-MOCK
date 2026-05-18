import { c } from '../../theme'

export type ExamCard = {
  id: string
  title: string
  gradient: string
  category: string
  status: 'Active' | 'Draft' | 'Archived'
  meta: string[]
  date: string
  examiner: string
  examType: string
  examDateIso: string
  startTime: string
  endTime: string
  price: number
}

export const EXAMS: ExamCard[] = [
  {
    id: 'mock-1',
    title: 'Years Change Exam',
    gradient: c.gradient.examCard[0],
    category: 'Academic',
    status: 'Active',
    meta: ['Default category', 'Preselected questions'],
    date: 'Created on Jan 22, 2025',
    examiner: 'T. Smith',
    examType: 'IELTS',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '09:00',
    endTime: '12:00',
    price: 0,
  },
  {
    id: 'mock-2',
    title: 'Online exam maker quiz',
    gradient: c.gradient.examCard[1],
    category: 'Listening',
    status: 'Draft',
    meta: ['Default category', 'Questions count'],
    date: 'Created on Jan 22, 2025',
    examiner: 'J. Lee',
    examType: 'IELTS',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '10:00',
    endTime: '13:00',
    price: 0,
  },
  {
    id: 'mock-3',
    title: 'Oracle Certification Exams',
    gradient: c.gradient.examCard[2],
    category: 'Technology',
    status: 'Archived',
    meta: ['Default category', 'Total points 10'],
    date: 'Created on Jan 22, 2025',
    examiner: 'A. Chen',
    examType: 'CEFR',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '09:00',
    endTime: '11:00',
    price: 0,
  },
  {
    id: 'mock-4',
    title: 'Graduate Management Test',
    gradient: c.gradient.examCard[3],
    category: 'Mock Test',
    status: 'Active',
    meta: ['Default category', 'Everyone can test'],
    date: 'Created on Jan 22, 2025',
    examiner: 'M. Brown',
    examType: 'IELTS',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '08:00',
    endTime: '12:00',
    price: 0,
  },
  {
    id: 'mock-5',
    title: 'Scholastic Assessment Test',
    gradient: c.gradient.examCard[4],
    category: 'Reading',
    status: 'Draft',
    meta: ['Default category', 'Preselected questions'],
    date: 'Created on Jan 22, 2025',
    examiner: 'K. Davis',
    examType: 'IELTS',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '09:30',
    endTime: '12:30',
    price: 0,
  },
  {
    id: 'mock-6',
    title: 'Online exam maker quiz',
    gradient: c.gradient.examCard[5],
    category: 'Speaking',
    status: 'Active',
    meta: ['Default category', 'Limited time'],
    date: 'Created on Jan 22, 2025',
    examiner: 'R. Wilson',
    examType: 'IELTS',
    examDateIso: new Date('2025-01-22T00:00:00').toISOString(),
    startTime: '14:00',
    endTime: '17:00',
    price: 0,
  },
]
