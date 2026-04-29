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
        label: 'Centers',
        icon: 'C',
        path: ROUTES_PATH.center,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
      },
      {
        label: 'Exams',
        icon: 'E',
        path: ROUTES_PATH.allExams,
        allowedRoles: [USER_ROLES.student, USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'All Exams',
            path: ROUTES_PATH.allExams,
            allowedRoles: [USER_ROLES.student, USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Prize Quizzes',
            path: ROUTES_PATH.prizeQuizzes,
            allowedRoles: [USER_ROLES.student, USER_ROLES.center, USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'LMS',
        icon: 'L',
        path: ROUTES_PATH.lms,
        allowedRoles: [USER_ROLES.superAdmin],
        children: [
          {
            label: 'Courses',
            path: ROUTES_PATH.courses,
            allowedRoles: [USER_ROLES.superAdmin],
          },
          {
            label: 'Courseware',
            path: ROUTES_PATH.courseware,
            allowedRoles: [USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'Questions',
        icon: 'Q',
        path: ROUTES_PATH.questions,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'All Questions',
            path: ROUTES_PATH.allQuestions,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Batch Import',
            path: ROUTES_PATH.batchImport,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Import Records',
            path: ROUTES_PATH.importRecords,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'Students',
        icon: 'S',
        path: ROUTES_PATH.students,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'All students',
            path: ROUTES_PATH.allStudents,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Signup Forms',
            path: ROUTES_PATH.signupForms,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Student Settings',
            path: ROUTES_PATH.studentSettings,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
        ],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Results Database',
        icon: 'R',
        path: ROUTES_PATH.resultsDatabase,
        allowedRoles: [USER_ROLES.student, USER_ROLES.superAdmin],
      },
      {
        label: 'Statistics',
        icon: 'T',
        path: ROUTES_PATH.statistics,
        allowedRoles: [USER_ROLES.superAdmin],
      },
      {
        label: 'Certificates',
        icon: 'C',
        path: ROUTES_PATH.certificates,
        allowedRoles: [USER_ROLES.student, USER_ROLES.superAdmin],
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        icon: 'G',
        path: ROUTES_PATH.settings,
        allowedRoles: [USER_ROLES.superAdmin],
      },
      {
        label: 'Help',
        icon: '?',
        path: ROUTES_PATH.help,
        allowedRoles: [USER_ROLES.superAdmin],
      },
    ],
  },
]
