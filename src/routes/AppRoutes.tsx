import type { ReactNode } from 'react'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAppSelector } from '../store/hooks'
import { selectAuthToken, selectUserRole } from '../store'
import { hasRequiredRole, USER_ROLES, type UserRole } from '../store/slices/authSlice'
import { ROUTES_PATH } from './paths'

const DashboardPage = lazy(() =>
  import('../pages/Dashboard').then((m) => ({ default: m.DashboardPage })),
)
const HomePage = lazy(() =>
  import('../pages/CreateExam').then((m) => ({ default: m.HomePage })),
)
const ArchivedExamsPage = lazy(() =>
  import('../pages/ArchivedExams').then((m) => ({ default: m.ArchivedExamsPage })),
)
const ExamDetailsPage = lazy(() =>
  import('../pages/ExamDetails').then((m) => ({ default: m.ExamDetailsPage })),
)
const StudentExamReviewPage = lazy(() =>
  import('../pages/StudentExamReview').then((m) => ({ default: m.StudentExamReviewPage })),
)
const CentersPage = lazy(() =>
  import('../pages/Centers').then((m) => ({ default: m.CentersPage })),
)
const CenterViewPage = lazy(() =>
  import('../pages/Centers').then((m) => ({ default: m.CenterViewPage })),
)

const ListeningQuestionsPage = lazy(() =>
  import('../pages/Questions').then((m) => ({ default: m.ListeningQuestionsPage })),
)
const ReadingQuestionsPage = lazy(() =>
  import('../pages/Questions').then((m) => ({ default: m.ReadingQuestionsPage })),
)
const WritingQuestionsPage = lazy(() =>
  import('../pages/Questions').then((m) => ({ default: m.WritingQuestionsPage })),
)
const SpeakingQuestionsPage = lazy(() =>
  import('../pages/Questions').then((m) => ({ default: m.SpeakingQuestionsPage })),
)
const AddQuestionPage = lazy(() =>
  import('../pages/AddQuestion').then((m) => ({ default: m.AddQuestionPage })),
)
const AllStudentsPage = lazy(() =>
  import('../pages/AllStudents').then((m) => ({ default: m.AllStudentsPage })),
)

const PaymentsPage = lazy(() =>
  import('../pages/Payments').then((m) => ({ default: m.PaymentsPage })),
)
const ExamPlansPage = lazy(() =>
  import('../pages/ExamPlans').then((m) => ({ default: m.ExamPlansPage })),
)
const BuyPlanPage = lazy(() =>
  import('../pages/BuyPlan').then((m) => ({ default: m.BuyPlanPage })),
)
const CenterExamPaymentsPage = lazy(() =>
  import('../pages/CenterExamPayments').then((m) => ({ default: m.CenterExamPaymentsPage })),
)
const PurchaseHistoryRedirect = lazy(() =>
  import('../pages/PurchaseHistory').then((m) => ({ default: m.PurchaseHistoryRedirect })),
)
const SignInPage = lazy(() =>
  import('../pages/Auth/SignInPage').then((m) => ({ default: m.SignInPage })),
)
const SignUpPage = lazy(() =>
  import('../pages/Auth/SignUpPage').then((m) => ({ default: m.SignUpPage })),
)
const SignupFormsPage = lazy(() =>
  import('../pages/SignupForms').then((m) => ({ default: m.SignupFormsPage })),
)
const StudentLeadSignupPage = lazy(() =>
  import('../pages/StudentLeadSignup').then((m) => ({ default: m.StudentLeadSignupPage })),
)
const StudentExamPlayerPage = lazy(() =>
  import('../pages/StudentExam').then((m) => ({ default: m.StudentExamPlayerPage })),
)
const StudentMyExamsPage = lazy(() =>
  import('../pages/StudentMyExams').then((m) => ({ default: m.StudentMyExamsPage })),
)
const StudentMyExamReviewPage = lazy(() =>
  import('../pages/StudentMyExamReview').then((m) => ({ default: m.StudentMyExamReviewPage })),
)
const StudentCertificatesPage = lazy(() =>
  import('../pages/StudentCertificates').then((m) => ({ default: m.StudentCertificatesPage })),
)
const CertificatesPage = lazy(() =>
  import('../pages/Certificates').then((m) => ({ default: m.CertificatesPage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFound').then((m) => ({ default: m.NotFoundPage })),
)
const NotificationsPage = lazy(() =>
  import('../pages/Notifications').then((m) => ({ default: m.NotificationsPage })),
)
const HelpPage = lazy(() =>
  import('../pages/Help').then((m) => ({ default: m.HelpPage })),
)
const PaymentRequestPage = lazy(() =>
  import('../pages/PaymentRequest').then((m) => ({ default: m.PaymentRequestPage })),
)
const StatisticsPage = lazy(() =>
  import('../pages/Statistics').then((m) => ({ default: m.StatisticsPage })),
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
    path: ROUTES_PATH.examsArchive,
    element: <ArchivedExamsPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.examDetails,
    element: <ExamDetailsPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.examStudentReview,
    element: <StudentExamReviewPage />,
    allowedRoles: examRoles,
  },
  {
    path: ROUTES_PATH.studentMyExams,
    element: <StudentMyExamsPage />,
    allowedRoles: studentOnly,
  },
  {
    path: ROUTES_PATH.studentMyExamReview,
    element: <StudentMyExamReviewPage />,
    allowedRoles: studentOnly,
  },
  {
    path: ROUTES_PATH.studentExamPlayer,
    element: <StudentExamPlayerPage />,
    allowedRoles: studentOnly,
  },
  {
    path: ROUTES_PATH.studentCertificates,
    element: <StudentCertificatesPage />,
    allowedRoles: studentOnly,
  },
  {
    path: ROUTES_PATH.center,
    element: <CentersPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.centerView,
    element: <CenterViewPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.addCenter,
    element: <Navigate to={ROUTES_PATH.center} replace />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.lms,
    element: <Navigate to={ROUTES_PATH.courses} replace />,
    allowedRoles: superAdminOnly,
  },
  
  {
    path: ROUTES_PATH.courseware,
    element: <NotFoundPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.questions,
    element: <Navigate to={ROUTES_PATH.listeningQuestions} replace />,
    allowedRoles: centerRoles,
  },
  {
    path: '/questions/all',
    element: <Navigate to={ROUTES_PATH.listeningQuestions} replace />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.listeningQuestions,
    element: <ListeningQuestionsPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.readingQuestions,
    element: <ReadingQuestionsPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.writingQuestions,
    element: <WritingQuestionsPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.speakingQuestions,
    element: <SpeakingQuestionsPage />,
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
    element: <NotFoundPage />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.resultsDatabase,
    element: <NotFoundPage />,
    allowedRoles: studentFeatureRoles,
  },
  {
    path: ROUTES_PATH.statistics,
    element: <StatisticsPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.certificates,
    element: <CertificatesPage />,
    allowedRoles: studentFeatureRoles,
  },
  {
    path: ROUTES_PATH.payments,
    element: <PaymentsPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.examPlans,
    element: <ExamPlansPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.buyPlan,
    element: <BuyPlanPage />,
    allowedRoles: [USER_ROLES.center],
  },
  {
    path: ROUTES_PATH.centerPayments,
    element: <CenterExamPaymentsPage />,
    allowedRoles: [USER_ROLES.center],
  },
  {
    path: ROUTES_PATH.purchaseHistory,
    element: <PurchaseHistoryRedirect />,
    allowedRoles: centerRoles,
  },
  {
    path: ROUTES_PATH.surveys,
    element: <NotFoundPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.settings,
    element: <NotFoundPage />,
    allowedRoles: superAdminOnly,
  },
  {
    path: ROUTES_PATH.help,
    element: <HelpPage />,
    allowedRoles: allRoles,
  },
  {
    path: ROUTES_PATH.notifications,
    element: <NotificationsPage />,
    allowedRoles: allRoles,
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
  {
    path: ROUTES_PATH.paymentRequest,
    element: <PaymentRequestPage />,
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
            ) : route.path === ROUTES_PATH.paymentRequest ? (
              route.element
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
