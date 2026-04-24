import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardPage, FeaturePage, HomePage, PrizeQuizzesPage, SignInPage, SignUpPage } from '../pages'
import { ROUTES_PATH } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES_PATH.dashboard} element={<DashboardPage />} />
      <Route path={ROUTES_PATH.allExams} element={<HomePage />} />
      <Route path={ROUTES_PATH.prizeQuizzes} element={<PrizeQuizzesPage />} />
      <Route
        path={ROUTES_PATH.lms}
        element={
          <FeaturePage
            eyebrow="Learning"
            title="LMS"
            description="This page is ready for course modules, lesson progress, and content management connected to your student workflow."
          />
        }
      />
      <Route
        path={ROUTES_PATH.questions}
        element={
          <FeaturePage
            eyebrow="Bank"
            title="Questions"
            description="Question creation, categorization, and review tools can live here as a dedicated screen."
          />
        }
      />
      <Route
        path={ROUTES_PATH.students}
        element={
          <FeaturePage
            eyebrow="People"
            title="Students"
            description="Use this route for student lists, enrollment, profile details, and exam participation history."
          />
        }
      />
      <Route
        path={ROUTES_PATH.resultsDatabase}
        element={
          <FeaturePage
            eyebrow="Management"
            title="Results Database"
            description="This screen can hold result tables, score history, and searchable assessment records."
          />
        }
      />
      <Route
        path={ROUTES_PATH.statistics}
        element={
          <FeaturePage
            eyebrow="Analytics"
            title="Statistics"
            description="Charts, performance trends, and reporting blocks can now be built here independently."
          />
        }
      />
      <Route
        path={ROUTES_PATH.certificates}
        element={
          <FeaturePage
            eyebrow="Management"
            title="Certificates"
            description="Manage certificate templates, issue history, and verification workflows on this page."
          />
        }
      />
      <Route
        path={ROUTES_PATH.surveys}
        element={
          <FeaturePage
            eyebrow="Feedback"
            title="Surveys"
            description="This route is ready for survey campaigns, response summaries, and follow-up actions."
          />
        }
      />
      <Route
        path={ROUTES_PATH.settings}
        element={
          <FeaturePage
            eyebrow="System"
            title="Settings"
            description="Application preferences, organization settings, and user controls can be added here."
          />
        }
      />
      <Route
        path={ROUTES_PATH.help}
        element={
          <FeaturePage
            eyebrow="Support"
            title="Help"
            description="Use this page for help center links, onboarding tips, FAQs, or support contact actions."
          />
        }
      />
      <Route path={ROUTES_PATH.signIn} element={<SignInPage />} />
      <Route path={ROUTES_PATH.signUp} element={<SignUpPage />} />
      <Route path="*" element={<Navigate to={ROUTES_PATH.dashboard} replace />} />
    </Routes>
  )
}
