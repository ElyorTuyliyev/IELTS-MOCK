export type CenterStat = {
  label: string
  value: string
  meta: string
}

export type CenterRow = {
  id: string
  name: string
  location: string
  status: string
  students: string
  teachers: string
  rooms: string
}

export const CENTER_PAGE_SIZE = 8

export const CENTER_STATS: CenterStat[] = [
  { label: 'Total centers', value: '0', meta: 'No centers yet' },
  { label: 'Active students', value: '0', meta: 'Updates when a center is added' },
  { label: 'Teachers', value: '0', meta: 'Updates when a center is added' },
  { label: 'Average band', value: '0', meta: 'No results yet' },
]

export const CENTERS: CenterRow[] = []
