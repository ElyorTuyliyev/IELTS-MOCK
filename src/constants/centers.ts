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
  { label: 'Total centers', value: '12', meta: '3 yangi filial bu oy qo‘shildi' },
  { label: 'Active students', value: '2,480', meta: 'Barcha markazlar bo‘yicha' },
  { label: 'Teachers', value: '146', meta: 'IELTS va General English jamoasi' },
  { label: 'Average band', value: '6.8', meta: 'Oxirgi 30 kun natijasi' },
]

export const CENTERS: CenterRow[] = [
  {
    id: 'center-1',
    name: 'IELTS Study Chilonzor',
    location: 'Tashkent, Chilonzor 19-daha',
    status: 'Active',
    students: '420',
    teachers: '24',
    rooms: '14',
  },
  {
    id: 'center-2',
    name: 'IELTS Study Yunusobod',
    location: 'Tashkent, Yunusobod 4-mavze',
    status: 'Growing',
    students: '315',
    teachers: '18',
    rooms: '10',
  },
  {
    id: 'center-3',
    name: 'IELTS Study Samarqand',
    location: 'Samarqand, University boulevard',
    status: 'Top score',
    students: '290',
    teachers: '16',
    rooms: '8',
  },
]
