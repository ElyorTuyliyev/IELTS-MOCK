export type CenterRow = {
  id: string
  name: string
  location: string
  status: string
  students: string
  teachers: string
  rooms: string
}

export const CENTER_PAGE_SIZE = 10

export const CENTER_PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const

export const CENTERS: CenterRow[] = []
