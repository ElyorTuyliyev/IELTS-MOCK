import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
  AddQuestionPage,
  AllStudentsPage,
  CoursesPage,
  DashboardPage,
  FeaturePage,
  HomePage,
  PrizeQuizzesPage,
  QuestionsPage,
  SignInPage,
  SignUpPage,
} from '../pages'
import { ROUTES_PATH } from './paths'

type AppRouteConfig = {
  path: string
  element: ReactNode
}

const appRoutes: AppRouteConfig[] = [
  {
    path: ROUTES_PATH.dashboard,
    element: <DashboardPage />,
  },
  {
    path: ROUTES_PATH.allExams,
    element: <HomePage />,
  },
  {
    path: ROUTES_PATH.prizeQuizzes,
    element: <PrizeQuizzesPage />,
  },
  {
    path: ROUTES_PATH.lms,
    element: <Navigate to={ROUTES_PATH.courses} replace />,
  },
  {
    path: ROUTES_PATH.courses,
    element: <CoursesPage />,
  },
  {
    path: ROUTES_PATH.courseware,
    element: (
      <FeaturePage
        eyebrow="Learning"
        title="Courseware"
        description="This page is ready for lessons, modules, and course content management linked to your LMS workflow."
      />
    ),
  },
  {
    path: ROUTES_PATH.questions,
    element: <Navigate to={ROUTES_PATH.allQuestions} replace />,
  },
  {
    path: ROUTES_PATH.allQuestions,
    element: <QuestionsPage />,
  },
  {
    path: ROUTES_PATH.addQuestion,
    element: <AddQuestionPage />,
  },
  {
    path: ROUTES_PATH.batchImport,
    element: (
      <FeaturePage
        eyebrow="Bank"
        title="Batch Import"
        description="Upload, map, and validate bulk question imports from external sources on this screen."
      />
    ),
  },
  {
    path: ROUTES_PATH.importRecords,
    element: (
      <FeaturePage
        eyebrow="Bank"
        title="Import Records"
        description="Track import history, validation results, and retry actions for previously uploaded question files."
      />
    ),
  },
  {
    path: ROUTES_PATH.students,
    element: <Navigate to={ROUTES_PATH.allStudents} replace />,
  },
  {
    path: ROUTES_PATH.allStudents,
    element: <AllStudentsPage />,
  },
  {
    path: ROUTES_PATH.signupForms,
    element: (
      <FeaturePage
        eyebrow="People"
        title="Signup Forms"
        description="Use this page for student registration forms, onboarding flows, and field customization."
      />
    ),
  },
  {
    path: ROUTES_PATH.studentSettings,
    element: (
      <FeaturePage
        eyebrow="People"
        title="Student Settings"
        description="Manage student-facing settings, login fields, access rules, and profile preferences here."
      />
    ),
  },
  {
    path: ROUTES_PATH.resultsDatabase,
    element: (
      <FeaturePage
        eyebrow="Management"
        title="Results Database"
        description="This screen can hold result tables, score history, and searchable assessment records."
      />
    ),
  },
  {
    path: ROUTES_PATH.statistics,
    element: (
      <FeaturePage
        eyebrow="Analytics"
        title="Statistics"
        description="Charts, performance trends, and reporting blocks can now be built here independently."
      />
    ),
  },
  {
    path: ROUTES_PATH.certificates,
    element: (
      <FeaturePage
        eyebrow="Management"
        title="Certificates"
        description="Manage certificate templates, issue history, and verification workflows on this page."
      />
    ),
  },
  {
    path: ROUTES_PATH.surveys,
    element: (
      <FeaturePage
        eyebrow="Feedback"
        title="Surveys"
        description="This route is ready for survey campaigns, response summaries, and follow-up actions."
      />
    ),
  },
  {
    path: ROUTES_PATH.settings,
    element: (
      <FeaturePage
        eyebrow="System"
        title="Settings"
        description="Application preferences, organization settings, and user controls can be added here."
      />
    ),
  },
  {
    path: ROUTES_PATH.help,
    element: (
      <FeaturePage
        eyebrow="Support"
        title="Help"
        description="Use this page for help center links, onboarding tips, FAQs, or support contact actions."
      />
    ),
  },
  {
    path: ROUTES_PATH.signIn,
    element: <SignInPage />,
  },
  {
    path: ROUTES_PATH.signUp,
    element: <SignUpPage />,
  },
]

export function AppRoutes() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<Navigate to={ROUTES_PATH.dashboard} replace />} />
    </Routes>
  )
}
