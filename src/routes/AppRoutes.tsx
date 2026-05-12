import type { ReactNode } from 'react'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAppSelector } from '../store/hooks'
import { selectAuthToken, selectUserRole } from '../store'
import { hasRequiredRole, USER_ROLES, type UserRole } from '../store/slices/authSlice'
import { ROUTES_PATH } from './paths'

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const ExamDetailsPage = lazy(() =>
  import('../pages/ExamDetailsPage').then((m) => ({ default: m.ExamDetailsPage })),
)
const PrizeQuizzesPage = lazy(() =>
  import('../pages/PrizeQuizzesPage').then((m) => ({ default: m.PrizeQuizzesPage })),
)
const CentersPage = lazy(() =>
  import('../pages/Centers').then((m) => ({ default: m.CentersPage })),
)
const AddCenterPage = lazy(() =>
  import('../pages/AddCenter').then((m) => ({ default: m.AddCenterPage })),
)
const CoursesPage = lazy(() =>
  import('../pages/CoursesPage').then((m) => ({ default: m.CoursesPage })),
)
const FeaturePage = lazy(() =>
  import('../pages/FeaturePage/FeaturePage').then((m) => ({ default: m.FeaturePage })),
)
const QuestionsPage = lazy(() =>
  import('../pages/QuestionsPage').then((m) => ({ default: m.QuestionsPage })),
)
const AddQuestionPage = lazy(() =>
  import('../pages/AddQuestionPage').then((m) => ({ default: m.AddQuestionPage })),
)
const AllStudentsPage = lazy(() =>
  import('../pages/AllStudentsPage').then((m) => ({ default: m.AllStudentsPage })),
)
const StatisticsPage = lazy(() =>
  import('../pages/StatisticsPage').then((m) => ({ default: m.StatisticsPage })),
)
const PaymentsPage = lazy(() =>
  import('../pages/PaymentsPage').then((m) => ({ default: m.PaymentsPage })),
)
const SignInPage = lazy(() =>
  import('../pages/Auth/SignInPage').then((m) => ({ default: m.SignInPage })),
)
const SignUpPage = lazy(() =>
  import('../pages/Auth/SignUpPage').then((m) => ({ default: m.SignUpPage })),
)
const SignupFormsPage = lazy(() =>
  import('../pages/SignupFormsPage').then((m) => ({ default: m.SignupFormsPage })),
)
const StudentLeadSignupPage = lazy(() =>
  import('../pages/StudentLeadSignupPage').then((m) => ({ default: m.StudentLeadSignupPage })),
)
const StudentExamPlayerPage = lazy(() =>
  import('../pages/StudentExamPlayerPage').then((m) => ({ default: m.StudentExamPlayerPage })),
)

type AppRouteConfig = {
  path: string
  element: ReactNode
  allowedRoles?: UserRole[]
}

const allRoles = Object.values(USER_ROLES)
const superAdminOnly = [USER_ROLES.superAdmin]
const centerRoles = [USER_ROLES.center, USER_ROLES.superAdmin]
const examRoles = [USER_ROLES.center, USER_ROLES.superAdmin]
const studentOnly = [USER_ROLES.student]
const studentFeatureRoles = [USER_ROLES.center, USER_ROLES.superAdmin]

function ProtectedRoute({
  element,
  allowedRoles = allRoles,
}: {
  element: ReactNode
  allowedRoles?: UserRole[]
}) {
  const token = useAppSelector(selectAuthToken)
  const role = useAppSelector(selectUserRole)

  if (!token || !role) {
    return <Navigate to={ROUTES_PATH.signIn} replace />
  }

  if (!hasRequiredRole(role, allowedRoles)) {
    return <Navigate to={ROUTES_PATH.signIn} replace />
  }

  return <>{element}</>
}

function PublicOnlyRoute({ element }: { element: ReactNode }) {
  const token = useAppSelector(selectAuthToken)
  const role = useAppSelector(selectUserRole)

  if (token && role) {
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
    path: ROUTES_PATH.examDetails,
    element: <ExamDetailsPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.prizeQuizzes,
    element: <PrizeQuizzesPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.studentExamPlayer,
    element: <StudentExamPlayerPage />,
    allowedRoles: studentOnly,
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
    path: ROUTES_PATH.editQuestion,
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
    element: <SignupFormsPage />,
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
    allowedRoles: studentFeatureRoles,
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
    allowedRoles: studentFeatureRoles,
  },
  {
    path: ROUTES_PATH.payments,
    element: <PaymentsPage />,
    allowedRoles: superAdminOnly,
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
  {
    path: ROUTES_PATH.studentJoin,
    element: <SignUpPage />,
  },
  {
    path: ROUTES_PATH.studentLeadJoin,
    element: <StudentLeadSignupPage />,
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
            route.path === ROUTES_PATH.signIn ||
            route.path === ROUTES_PATH.signUp ||
            route.path === ROUTES_PATH.studentJoin ||
            route.path === ROUTES_PATH.studentLeadJoin ? (
              <PublicOnlyRoute element={route.element} />
            ) : route.allowedRoles ? (
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
      <Route path="*" element={<Navigate to={ROUTES_PATH.signIn} replace />} />
    </Routes>
  )
}
