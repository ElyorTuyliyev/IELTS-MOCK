import { ROUTES_PATH } from './paths'
import { USER_ROLES, type UserRole } from '../store/slices/authSlice'

export type SidebarRouteGroup = {
  title: string
  items: Array<{
    label: string
    icon: string
    path?: string
    allowedRoles?: UserRole[]
    children?: Array<{
      label: string
      path?: string
      allowedRoles?: UserRole[]
    }>
  }>
}

export const SIDEBAR_ROUTE_GROUPS: SidebarRouteGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: 'D', path: ROUTES_PATH.dashboard },
      {
        label: 'Admin',
        icon: 'A',
        path: ROUTES_PATH.admin,
        allowedRoles: [USER_ROLES.superAdmin],
      },
      { label: 'Centers', icon: 'C', path: ROUTES_PATH.center },
      {
        label: 'Exams',
        icon: 'E',
        path: ROUTES_PATH.allExams,
        children: [
          { label: 'All Exams', path: ROUTES_PATH.allExams },
          { label: 'Prize Quizzes', path: ROUTES_PATH.prizeQuizzes },
        ],
      },
      {
        label: 'LMS',
        icon: 'L',
        path: ROUTES_PATH.lms,
        children: [
          { label: 'Courses', path: ROUTES_PATH.courses },
          { label: 'Courseware', path: ROUTES_PATH.courseware },
        ],
      },
      {
        label: 'Questions',
        icon: 'Q',
        path: ROUTES_PATH.questions,
        children: [
          { label: 'All Questions', path: ROUTES_PATH.allQuestions },
          { label: 'Batch Import', path: ROUTES_PATH.batchImport },
          { label: 'Import Records', path: ROUTES_PATH.importRecords },
        ],
      },
      {
        label: 'Students',
        icon: 'S',
        path: ROUTES_PATH.students,
        children: [
          { label: 'All students', path: ROUTES_PATH.allStudents },
          { label: 'Signup Forms', path: ROUTES_PATH.signupForms },
          { label: 'Student Settings', path: ROUTES_PATH.studentSettings },
        ],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Results Database', icon: 'R', path: ROUTES_PATH.resultsDatabase },
      { label: 'Statistics', icon: 'T', path: ROUTES_PATH.statistics },
      { label: 'Certificates', icon: 'C', path: ROUTES_PATH.certificates },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', icon: 'G', path: ROUTES_PATH.settings },
      { label: 'Help', icon: '?', path: ROUTES_PATH.help },
    ],
  },
]
