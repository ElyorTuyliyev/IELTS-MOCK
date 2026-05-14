import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  Alert,
  Box,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput, normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { useToast } from '../../../components/common/Toast'

import { ROUTES_PATH } from '../../../routes'
import {
  AUTH_CHART_BARS,
  AUTH_PAGINATION_DOTS,
  getGraphQLErrorMessage,
  isMongoObjectId,
  LockIcon,
  MailIcon,
  PersonIcon,
  PhoneIcon,
  SparkIcon,
} from '../../../helpers'
import { emailRegisterRules, isValidEmail, normalizeEmail } from '../../../utils/emailValidation'
import { passwordRegisterRules } from '../../../utils/passwordValidation'
import { SignUpPageRoot } from '../../Auth/SignUpPage/pages/SignUpPage.style'
import { CREATE_STUDENT_SIGNUP_LEAD_DATA_MUTATION } from '../api/createStudentSignupLeadDataMutation'

type LeadFormValues = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
}

type CreateLeadDataResponse = {
  createStudentSignupLeadData: {
    _id: string
    firstName: string
    lastName: string
    phone: string
    status: string
    createdAt: string
  } | null
}

type CreateLeadDataVariables = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  centerId?: string | null
}

export function StudentLeadSignupPage() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const [done, setDone] = useState(false)

  const inviteCenterId = useMemo(() => {
    const raw = searchParams.get('centerId')?.trim() ?? ''
    return isMongoObjectId(raw) ? raw : null
  }, [searchParams])

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<LeadFormValues>({
    defaultValues: { firstName: '', lastName: '', phone: '', email: '', password: '' },
  })

  const [createLeadData, { loading }] = useMutation<CreateLeadDataResponse, CreateLeadDataVariables>(
    CREATE_STUDENT_SIGNUP_LEAD_DATA_MUTATION,
  )

  const onSubmit: SubmitHandler<LeadFormValues> = async (values) => {
    const normalizedEmail = normalizeEmail(values.email)

    if (!isValidEmail(normalizedEmail)) {
      toast.error("Enter a valid email address.")
      return
    }

    try {
      const result = await createLeadData({
        variables: {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: normalizeUzPhoneDigits(values.phone),
          email: normalizedEmail,
          password: values.password,
          centerId: inviteCenterId,
        },
      })

      if (result.error) {
        toast.error(getGraphQLErrorMessage(result.error, 'Something went wrong. Please try again.'))
        return
      }

      setDone(true)
      toast.success('Your details were received successfully.')
      reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <SignUpPageRoot>
      <Box className="sign-up-page">
        <Box component="section" className="sign-up-page__hero">
          <Box component={RouterLink} to={ROUTES_PATH.signIn} className="sign-up-page__brand">
            <Box component="span" className="sign-up-page__brand-mark">
              <SparkIcon />
            </Box>
            <Typography component="span" className="sign-up-page__brand-name">
              IELTS Study
            </Typography>
          </Box>

          <Box className="sign-up-page__hero-copy">
            <Typography component="h1" className="sign-up-page__hero-title">
              {inviteCenterId
                ? 'Center invite — quick application'
                : 'IELTS Study — student application'}
            </Typography>
            <Typography component="p" className="sign-up-page__hero-text">
              Enter your first name, last name, phone number, email, and password. Your details go to
              the center administrators; you can sign in after your application is approved.
            </Typography>
          </Box>

          <Box className="sign-up-page__visual">
            <Box className="sign-up-page__visual-shape" />

            <Box component="article" className="sign-up-page__chart-card">
              <Box className="sign-up-page__chart-card-header">
                <Box>
                  <Typography component="h2" className="sign-up-page__card-title">
                    Exam Taken Times
                  </Typography>
                  <Typography component="p" className="sign-up-page__card-subtitle">
                    Taken records of last years
                  </Typography>
                </Box>

                <Box className="sign-up-page__legend">
                  <Box component="span" className="sign-up-page__legend-item">
                    <Box
                      component="span"
                      className="sign-up-page__legend-dot sign-up-page__legend-dot--primary"
                    />
                    Active Exams
                  </Box>
                  <Box component="span" className="sign-up-page__legend-item">
                    <Box
                      component="span"
                      className="sign-up-page__legend-dot sign-up-page__legend-dot--muted"
                    />
                    Active Exam Takers
                  </Box>
                </Box>
              </Box>

              <Box className="sign-up-page__chart">
                {AUTH_CHART_BARS.map((height, index) => (
                  <Box
                    key={index}
                    component="span"
                    className="sign-up-page__chart-bar"
                    sx={{ height: `${height}%` }}
                  />
                ))}

                <svg viewBox="0 0 560 190" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M20 126C52 136 68 140 98 132C128 124 145 114 176 96C206 78 228 63 257 75C287 87 303 126 334 136C364 146 381 122 412 128C442 134 456 154 489 146C521 138 532 124 540 128"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 126C52 136 68 140 98 132C128 124 145 114 176 96C206 78 228 63 257 75C287 87 303 126 334 136C364 146 381 122 412 128C442 134 456 154 489 146C521 138 532 124 540 128"
                    fill="url(#lead-signup-chart-fade)"
                    fillOpacity="0.12"
                  />
                  <defs>
                    <linearGradient id="lead-signup-chart-fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </Box>

            <Box
              component="article"
              className="sign-up-page__floating-card sign-up-page__floating-card--top"
            >
              <Box className="sign-up-page__floating-card-header">
                <Typography component="h3" className="sign-up-page__floating-card-title">
                  Question statistics
                </Typography>
                <Typography component="span" className="sign-up-page__floating-card-arrow">
                  &#8599;
                </Typography>
              </Box>
              <Typography component="p" className="sign-up-page__floating-card-label">
                Total Question
              </Typography>
              <Typography component="strong" className="sign-up-page__floating-card-value">
                20
              </Typography>
            </Box>

            <Box
              component="article"
              className="sign-up-page__floating-card sign-up-page__floating-card--bottom"
            >
              <Typography component="h3" className="sign-up-page__floating-card-title">
                Exam statistics
              </Typography>
              <Typography component="p" className="sign-up-page__floating-card-label">
                Total Exam
              </Typography>
              <Typography component="strong" className="sign-up-page__floating-card-value">
                27
              </Typography>
            </Box>
          </Box>

          <Box className="sign-up-page__pagination" aria-hidden="true">
            {AUTH_PAGINATION_DOTS.map((dot) => (
              <Box
                key={dot}
                component="span"
                className={`sign-up-page__pagination-dot${dot === 1 ? ' sign-up-page__pagination-dot--active' : ''}`}
              />
            ))}
          </Box>
        </Box>

        <Box component="section" className="sign-up-page__form-section">
          <Box component="form" className="sign-up-page__form-card" onSubmit={handleSubmit(onSubmit)}>
            <Box className="sign-up-page__form-badge">
              <MailIcon />
            </Box>

            {inviteCenterId ? (
              <Alert severity="info">
                You are submitting through a center invite link — your application will be linked to that
                center.
              </Alert>
            ) : null}
            {done ? (
              <Alert severity="success">
                Your details were received. To create a full account,{' '}
                <MuiLink component={RouterLink} to={ROUTES_PATH.studentJoin} sx={{ fontWeight: 700 }}>
                  continue here
                </MuiLink>
                .
              </Alert>
            ) : null}

            <Typography component="h2" className="sign-up-page__form-title">
              Welcome — IELTS Study
            </Typography>
            <Typography component="p" className="sign-up-page__form-subtitle">
              Enter your first name, last name, phone number, email, and password.
            </Typography>

            <Box className="sign-up-page__divider">
              <Typography component="span" className="sign-up-page__divider-label">
                Contact details
              </Typography>
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography component="label" htmlFor="lead-first" className="sign-up-page__field-label">
                First name
              </Typography>
              <TextField
                id="lead-first"
                className="sign-up-page__field"
                required
                autoComplete="given-name"
                placeholder="Enter your first name"
                {...register('firstName', { required: true })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-up-page__field-icon">
                          <PersonIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography component="label" htmlFor="lead-last" className="sign-up-page__field-label">
                Last name
              </Typography>
              <TextField
                id="lead-last"
                className="sign-up-page__field"
                required
                autoComplete="family-name"
                placeholder="Enter your last name"
                {...register('lastName', { required: true })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-up-page__field-icon">
                          <PersonIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography component="label" htmlFor="lead-phone" className="sign-up-page__field-label">
                Phone
              </Typography>
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    id="lead-phone"
                    className="sign-up-page__field"
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box className="sign-up-page__field-icon">
                              <PhoneIcon />
                            </Box>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography component="label" htmlFor="lead-email" className="sign-up-page__field-label">
                Email
              </Typography>
              <TextField
                id="lead-email"
                className="sign-up-page__field"
                required
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register('email', emailRegisterRules)}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-up-page__field-icon">
                          <MailIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography component="label" htmlFor="lead-password" className="sign-up-page__field-label">
                Password
              </Typography>
              <PasswordTextField
                id="lead-password"
                className="sign-up-page__field"
                required
                autoComplete="new-password"
                placeholder="Enter your password"
                {...register('password', passwordRegisterRules)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-up-page__field-icon">
                          <LockIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              className="sign-up-page__submit-button"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create data'}
            </Button>

            <Typography component="p" className="sign-up-page__footer-text">
              <MuiLink component={RouterLink} to={ROUTES_PATH.signIn} className="sign-up-page__footer-link">
                Sign in
              </MuiLink>
              {' · '}
              <MuiLink component={RouterLink} to={ROUTES_PATH.studentJoin} className="sign-up-page__footer-link">
                Full sign up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </SignUpPageRoot>
  )
}
