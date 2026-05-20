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
      icon: SidebarIconKey
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
            icon: 'exams',
            path: ROUTES_PATH.allExams,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Archive',
            icon: 'archive',
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
        label: 'My Certificates',
        icon: 'certificates',
        path: ROUTES_PATH.studentCertificates,
        allowedRoles: [USER_ROLES.student],
      },
      {
        label: 'Modules',
        icon: 'questions',
        path: ROUTES_PATH.listeningQuestions,
        allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
        children: [
          {
            label: 'Listening',
            icon: 'listening',
            path: ROUTES_PATH.listeningQuestions,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Reading',
            icon: 'reading',
            path: ROUTES_PATH.readingQuestions,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Writing',
            icon: 'writing',
            path: ROUTES_PATH.writingQuestions,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Speaking',
            icon: 'speaking',
            path: ROUTES_PATH.speakingQuestions,
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
            icon: 'students',
            path: ROUTES_PATH.allStudents,
            allowedRoles: [USER_ROLES.center, USER_ROLES.superAdmin],
          },
          {
            label: 'Signup Forms',
            icon: 'signupForms',
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
        children: [
          {
            label: 'Billing overview',
            icon: 'payments',
            path: ROUTES_PATH.payments,
            allowedRoles: [USER_ROLES.superAdmin],
          },
          {
            label: 'Exam plans',
            icon: 'examPlans',
            path: ROUTES_PATH.examPlans,
            allowedRoles: [USER_ROLES.superAdmin],
          },
        ],
      },
      {
        label: 'Buy exam plan',
        icon: 'payments',
        path: ROUTES_PATH.buyPlan,
        allowedRoles: [USER_ROLES.center],
      },
      {
        label: 'Exam payments',
        icon: 'payments',
        path: ROUTES_PATH.centerPayments,
        allowedRoles: [USER_ROLES.center],
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
      },
    ],
  },
]
