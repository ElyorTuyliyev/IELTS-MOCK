import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material'

import { ROUTES_PATH } from '../../routes'
import { SignUpPageRoot } from '../Auth/SignUpPage/SignUpPage.style'
import { CREATE_STUDENT_SIGNUP_LEAD_DATA_MUTATION } from './api/createStudentSignupLeadDataMutation'

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i
const chartBars = [22, 30, 15, 14, 27, 33, 36, 25, 18, 15, 22, 40]
const paginationDots = Array.from({ length: 7 }, (_, index) => index)

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.75l1.95 4.3 4.63.47-3.45 3.02.98 4.51L12 12.72 7.89 15.05l.98-4.51-3.45-3.02 4.63-.47L12 2.75z"
        fill="currentColor"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 8.5l5.5 4 5.5-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 4h2l1.5 4-1.5 1a10 10 0 004 4l1-1.5 4 2v2a2 2 0 01-2 2A16 16 0 014 10a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type LeadFormValues = {
  firstName: string
  lastName: string
  phone: string
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
  centerId?: string | null
}

export function StudentLeadSignupPage() {
  const [searchParams] = useSearchParams()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const inviteCenterId = useMemo(() => {
    const raw = searchParams.get('centerId')?.trim() ?? ''
    return MONGO_OBJECT_ID_RE.test(raw) ? raw : null
  }, [searchParams])

  const { register, handleSubmit, reset } = useForm<LeadFormValues>({
    defaultValues: { firstName: '', lastName: '', phone: '' },
  })

  const [createLeadData, { loading }] = useMutation<CreateLeadDataResponse, CreateLeadDataVariables>(
    CREATE_STUDENT_SIGNUP_LEAD_DATA_MUTATION,
  )

  const onSubmit: SubmitHandler<LeadFormValues> = async (values) => {
    setSubmitError(null)
    try {
      const result = await createLeadData({
        variables: {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: values.phone.trim(),
          centerId: inviteCenterId,
        },
      })

      if (result.error) {
        const err = result.error as { graphQLErrors?: { message?: string }[]; message?: string }
        const gqlMsg =
          err.graphQLErrors?.[0]?.message ??
          err.message ??
          'Something went wrong. Please try again.'
        setSubmitError(gqlMsg)
        return
      }

      setDone(true)
      reset()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
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
              Enter your first name, last name, and phone number. Your details go to the center
              administrators; you can create a full account afterwards.
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
                {chartBars.map((height, index) => (
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
            {paginationDots.map((dot) => (
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

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
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
              Enter your first name, last name, and phone number.
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
              <TextField
                id="lead-phone"
                className="sign-up-page__field"
                required
                type="tel"
                autoComplete="tel"
                placeholder="+1 …"
                {...register('phone', { required: true })}
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
            </Box>

            <Button
              type="submit"
              className="sign-up-page__submit-button"
              variant="contained"
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
