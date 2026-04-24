import { ROUTES_PATH } from '../../routes'
import { AuthActions, AuthLink, AuthPage, AuthSection, AuthText, AuthTitle } from './SignUpPage.style'

export function SignUpPage() {
  return (
    <AuthPage className="auth-page auth-page--sign-up">
      <AuthSection className="auth-page__section">
        <AuthTitle>Sign Up</AuthTitle>
        <AuthText>Yangi foydalanuvchi yaratish sahifasi uchun tayyor joy.</AuthText>
        <AuthActions className="auth-page__actions">
          <AuthLink to={ROUTES_PATH.home}>Go to dashboard</AuthLink>
          <AuthLink to={ROUTES_PATH.signIn}>Sign in</AuthLink>
        </AuthActions>
      </AuthSection>
    </AuthPage>
  )
}
