import { ROUTES_PATH } from './paths'
import { USER_ROLES, type UserRole } from '../store/slices/authSlice'
import type { SidebarIconKey } from './sidebarIcons'

export type SidebarRouteGroup = {
  title: string
  items: Array<{
    label: string
    icon: SidebarIconKey
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
      { label: 'Dashboard', icon: 'dashboard', path: ROUTES_PATH.dashboard },
      {
        label: 'Centers',
        icon: 'centers',
        path: ROUTES_PATH.center,
        allowedRoles: [ USER_ROLES.superAdmin],
      },
      {
        label: 'Exams',
        icon: 'exams',
        path: ROUTES_PATH.allExams,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'All Exams',
            path: ROUTES_PATH.allExams,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Archive',
            path: ROUTES_PATH.examsArchive,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'Student Exam',
        icon: 'studentExam',
        path: ROUTES_PATH.studentMyExams,
        allowedRoles: [USER_ROLES.student],
      },
      {
        label: 'LMS',
        icon: 'lms',
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
        icon: 'questions',
        path: ROUTES_PATH.questions,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'All Questions',
            path: ROUTES_PATH.allQuestions,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'Students',
        icon: 'students',
        path: ROUTES_PATH.students,
        allowedRoles: [USER_ROLES.center, USER_ROLES.center],
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
          
        ],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Results Database',
        icon: 'resultsDatabase',
        path: ROUTES_PATH.resultsDatabase,
        allowedRoles: [ USER_ROLES.superAdmin],
      },
      {
        label: 'Statistics',
        icon: 'statistics',
        path: ROUTES_PATH.statistics,
        allowedRoles: [USER_ROLES.superAdmin],
      },
      {
        label: 'Certificates',
        icon: 'certificates',
        path: ROUTES_PATH.certificates,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
      },
      {
        label: 'Payments',
        icon: 'payments',
        path: ROUTES_PATH.payments,
        allowedRoles: [USER_ROLES.superAdmin],
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        icon: 'settings',
        path: ROUTES_PATH.settings,
        allowedRoles: [USER_ROLES.superAdmin],
      },
      {
        label: 'Help',
        icon: 'help',
        path: ROUTES_PATH.help,
        allowedRoles: [USER_ROLES.superAdmin],
      },
    ],
  },
]
