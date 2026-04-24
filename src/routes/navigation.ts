import { ROUTES_PATH } from './paths'

export type SidebarRouteGroup = {
  title: string
  items: Array<{
    label: string
    icon: string
    path?: string
    children?: Array<{
      label: string
      path?: string
    }>
  }>
}

export const SIDEBAR_ROUTE_GROUPS: SidebarRouteGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: 'D', path: ROUTES_PATH.dashboard },
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
      { label: 'Students', icon: 'S', path: ROUTES_PATH.students },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Results Database', icon: 'R', path: ROUTES_PATH.resultsDatabase },
      { label: 'Statistics', icon: 'T', path: ROUTES_PATH.statistics },
      { label: 'Certificates', icon: 'C', path: ROUTES_PATH.certificates },
      { label: 'Surveys', icon: 'V', path: ROUTES_PATH.surveys },
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
