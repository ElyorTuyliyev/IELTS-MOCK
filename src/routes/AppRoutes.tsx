import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
  AddCenterPage,
  AddQuestionPage,
  AllStudentsPage,
  CentersPage,
  CoursesPage,
  DashboardPage,
  FeaturePage,
  HomePage,
  PrizeQuizzesPage,
  QuestionsPage,
  SignInPage,
  SignUpPage,
  StatisticsPage,
} from '../pages'
import { useAppSelector } from '../store/hooks'
import { selectAuthToken, selectUserRole } from '../store'
import { hasRequiredRole, USER_ROLES, type UserRole } from '../store/slices/authSlice'
import { ROUTES_PATH } from './paths'

type AppRouteConfig = {
  path: string
  element: ReactNode
  allowedRoles?: UserRole[]
}

const allRoles = Object.values(USER_ROLES)
const superAdminOnly = [USER_ROLES.superAdmin]
const centerRoles = [USER_ROLES.center, USER_ROLES.superAdmin]
const examRoles = [USER_ROLES.student, USER_ROLES.center, USER_ROLES.superAdmin]
const studentRoles = [USER_ROLES.student, USER_ROLES.superAdmin]

function ProtectedRoute({
  element,
  allowedRoles = allRoles,
}: {
  element: ReactNode
  allowedRoles?: UserRole[]
}) {
  const token = useAppSelector(selectAuthToken)
  const role = useAppSelector(selectUserRole)

  if (!token) {
    return <Navigate to={ROUTES_PATH.signIn} replace />
  }

  if (!hasRequiredRole(role, allowedRoles)) {
    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '24497a',
      },
      body: JSON.stringify({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H-role-guard',
        location: 'AppRoutes.tsx:ProtectedRoute',
        message: 'Role rejected by guard',
        data: {
          currentRole: role,
          allowedRoles,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
    return <Navigate to={ROUTES_PATH.dashboard} replace />
  }

  return <>{element}</>
}

const appRoutes: AppRouteConfig[] = [
  {
    path: ROUTES_PATH.dashboard,
    element: <DashboardPage />,
    allowedRoles: allRoles,
  },
  {
    path: ROUTES_PATH.allExams,
    element: <HomePage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.prizeQuizzes,
    element: <PrizeQuizzesPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.center,
    element: <CentersPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.addCenter,
    element: <AddCenterPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.lms,
    element: <Navigate to={ROUTES_PATH.courses} replace />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.courses,
    element: <CoursesPage />,
    allowedRoles: superAdminOnly,
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
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.questions,
    element: <Navigate to={ROUTES_PATH.allQuestions} replace />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.allQuestions,
    element: <QuestionsPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.addQuestion,
    element: <AddQuestionPage />,
    allowedRoles: centerRoles,
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
    allowedRoles: centerRoles,
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
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.students,
    element: <Navigate to={ROUTES_PATH.allStudents} replace />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.allStudents,
    element: <AllStudentsPage />,
    allowedRoles: centerRoles,
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
    allowedRoles: centerRoles,
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
    allowedRoles: centerRoles,
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
    allowedRoles: studentRoles,
  },
  {
    path: ROUTES_PATH.statistics,
    element: <StatisticsPage />,
    allowedRoles: superAdminOnly,
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
    allowedRoles: studentRoles,
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
    allowedRoles: superAdminOnly,
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
    allowedRoles: superAdminOnly,
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
    allowedRoles: superAdminOnly,
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
        <Route
          key={route.path}
          path={route.path}
          element={
            route.allowedRoles ? (
              <ProtectedRoute
                element={route.element}
                allowedRoles={route.allowedRoles}
              />
            ) : (
              route.element
            )
          }
        />
      ))}
      <Route
        path="*"
        element={<Navigate to={ROUTES_PATH.dashboard} replace />}
      />
    </Routes>
  )
}
