export type StudentStatus = 'Completed' | 'Active' | 'Pending' | 'Draft'

export type StudentLevelTone = 'orange' | 'teal' | 'pink' | 'yellow' | 'blue'

export type StudentRow = {
  userId: string
  serial: string
  name: string
  email: string
  points: string
  creationDate: string
  status: StudentStatus
  levelTone: StudentLevelTone
}

export type StudentGridRow = StudentRow & {
  id: string
}

export const STUDENTS_PAGE_SIZE = 8

export const STUDENTS: StudentRow[] = []
