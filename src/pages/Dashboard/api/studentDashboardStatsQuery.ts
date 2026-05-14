import { gql } from '@apollo/client'

export const STUDENT_DASHBOARD_STATS_QUERY = gql`
  query StudentDashboardStats {
    studentDashboardStats {
      totals {
        totalStudents
        newStudentsThisMonth
      }
      centers {
        centerId
        centerName
        totalStudents
        newStudentsThisMonth
        monthlyNewStudents {
          month
          count
        }
      }
    }
  }
`

export type StudentDashboardMonthCount = {
  month: string
  count: number
}

export type CenterStudentStats = {
  centerId: string
  centerName: string
  totalStudents: number
  newStudentsThisMonth: number
  monthlyNewStudents: StudentDashboardMonthCount[]
}

export type StudentDashboardStatsResponse = {
  studentDashboardStats: {
    totals: {
      totalStudents: number
      newStudentsThisMonth: number
    }
    centers: CenterStudentStats[]
  }
}
