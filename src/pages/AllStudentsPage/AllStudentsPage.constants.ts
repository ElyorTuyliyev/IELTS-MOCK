export type StudentStatus = 'Completed' | 'Active' | 'Pending' | 'Draft'

export type StudentLevelTone = 'orange' | 'teal' | 'pink' | 'yellow' | 'blue'

export type StudentRow = {
  serial: string
  name: string
  points: string
  loginTime: string
  creationDate: string
  department: string
  status: StudentStatus
  initials: string
  avatarGradient: string
  levelTone: StudentLevelTone
}

export type StudentGridRow = StudentRow & {
  id: string
}

export const STUDENTS_PAGE_SIZE = 8

export const STUDENTS: StudentRow[] = []
