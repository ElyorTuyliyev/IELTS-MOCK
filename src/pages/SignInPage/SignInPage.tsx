import { ROUTES_PATH } from '../../routes'
import { AuthActions, AuthLink, AuthPage, AuthSection, AuthText, AuthTitle } from './SignInPage.style'

export function SignInPage() {
  return (
    <AuthPage className="auth-page auth-page--sign-in">
      <AuthSection className="auth-page__section">
        <AuthTitle>Sign In</AuthTitle>
        <AuthText>Platformaga kirish uchun profilingizni tanlang.</AuthText>
        <AuthActions className="auth-page__actions">
          <AuthLink to={ROUTES_PATH.home}>Go to dashboard</AuthLink>
          <AuthLink to={ROUTES_PATH.signUp}>Create account</AuthLink>
        </AuthActions>
      </AuthSection>
    </AuthPage>
  )
}
