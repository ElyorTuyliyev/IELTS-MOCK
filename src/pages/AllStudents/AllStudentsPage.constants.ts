export type StudentStatus = 'Completed' | 'Active' | 'Pending' | 'Draft'

export type StudentRow = {
  userId: string
  serial: string
  name: string
  phone: string
  email: string
  gender: string
  creationDate: string
  status: StudentStatus
}

export type StudentGridRow = StudentRow & {
  id: string
}

export const STUDENTS_PAGE_SIZE = 8

export const STUDENTS: StudentRow[] = []
