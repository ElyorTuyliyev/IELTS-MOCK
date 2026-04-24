export type CourseSortOption = 'Created Date' | 'Title A-Z' | 'Title Z-A'

export type CourseItem = {
  title: string
  duration: string
  author: string
  chapters: number
  createdDate: string
  createdAt: string
  accentFrom: string
  accentTo: string
  iconLabel: string
}

export const COURSE_SORT_OPTIONS: CourseSortOption[] = [
  'Created Date',
  'Title A-Z',
  'Title Z-A',
]

export const COURSES: CourseItem[] = [
  {
    title: 'Power BI',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#6d3af2',
    accentTo: '#9558ff',
    iconLabel: 'PB',
  },
  {
    title: 'TOEFL Test Preparation',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#f6c234',
    accentTo: '#ffd45d',
    iconLabel: 'TF',
  },
  {
    title: 'GMAT Preparation Course',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#5e97c7',
    accentTo: '#73a8d4',
    iconLabel: 'GM',
  },
  {
    title: 'GRE Test Prep',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#ef5ad3',
    accentTo: '#ff72db',
    iconLabel: 'GR',
  },
  {
    title: 'NCLEX-RN Exam Prep',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#e06a00',
    accentTo: '#f08600',
    iconLabel: 'NC',
  },
  {
    title: 'Certified Ethical Hacker (CEH) Training',
    duration: '3 minutes 21 second',
    author: 'System Admin',
    chapters: 3,
    createdDate: 'Jan 22, 2025',
    createdAt: '2025-01-22',
    accentFrom: '#4fb6b0',
    accentTo: '#66c8bf',
    iconLabel: 'CE',
  },
]
