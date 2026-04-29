export type ExamCard = {
  title: string
  gradient: string
  category: string
  status: 'Active' | 'Draft' | 'Archived'
  meta: string[]
  date: string
}

