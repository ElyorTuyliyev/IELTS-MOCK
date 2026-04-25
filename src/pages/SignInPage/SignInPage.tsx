import { Link, useNavigate } from "react-router-dom";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { ROUTES_PATH } from "../../routes";
import { SignInPageRoot } from "./SignInPage.style";

const chartBars = [22, 30, 15, 14, 27, 33, 36, 25, 18, 15, 22, 40];
const paginationDots = Array.from({ length: 7 }, (_, index) => index);

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.75l1.95 4.3 4.63.47-3.45 3.02.98 4.51L12 12.72 7.89 15.05l.98-4.51-3.45-3.02 4.63-.47L12 2.75z"
        fill="currentColor"
      />
    </svg>
  );
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
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 10V8.75a4.5 4.5 0 119 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="5.5"
        y="10"
        width="13"
        height="9.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 13.25v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 12.2c0-.57-.05-1.12-.16-1.64H12v3.11h4.77a4.09 4.09 0 01-1.78 2.69v2.23h2.88c1.68-1.55 2.63-3.83 2.63-6.39z"
        fill="#4285F4"
      />
      <path
        d="M12 21c2.39 0 4.39-.8 5.85-2.18l-2.88-2.23c-.8.54-1.81.86-2.97.86-2.29 0-4.23-1.55-4.92-3.63H4.1v2.3A8.84 8.84 0 0012 21z"
        fill="#34A853"
      />
      <path
        d="M7.08 13.82A5.3 5.3 0 016.8 12c0-.63.1-1.23.28-1.82v-2.3H4.1A8.91 8.91 0 003 12c0 1.43.34 2.78 1.1 4.12l2.98-2.3z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.55c1.3 0 2.46.45 3.38 1.33l2.54-2.54C16.38 3.91 14.38 3 12 3 8.53 3 5.54 4.98 4.1 7.88l2.98 2.3c.69-2.08 2.63-3.63 4.92-3.63z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 10-10.4 8.9v-6.29H8.3V12h2.3v-1.92c0-2.28 1.36-3.54 3.44-3.54.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.69-1.47 1.41V12h2.5l-.4 2.61h-2.1v6.29A9 9 0 0021 12z"
        fill="#1877F2"
      />
    </svg>
  );
}

type SignInFormValues = {
  email: string;
  password: string;
  rememberAccount: boolean;
};

export function SignInPage() {
  const navigate = useNavigate();
  const { control, handleSubmit, register } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberAccount: false,
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = (values) => {
    // #region agent log
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "post-fix",
        hypothesisId: "H6",
        location: "SignInPage.tsx:handleSubmit",
        message: "Sign in submit snapshot",
        data: {
          emailTrimmedLength: values.email.trim().length,
          passwordLength: values.password.length,
          rememberAccount: values.rememberAccount,
          source: "react-hook-form",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    navigate(ROUTES_PATH.home);
  };

  return (
    <SignInPageRoot>
      <Box className="sign-in-page">
        <Box component="section" className="sign-in-page__hero">
          <Box
            component={Link}
            to={ROUTES_PATH.home}
            className="sign-in-page__brand"
          >
            <Box component="span" className="sign-in-page__brand-mark">
              <SparkIcon />
            </Box>
            <Typography component="span" className="sign-in-page__brand-name">
              IELTS Study
            </Typography>
          </Box>

          <Box className="sign-in-page__hero-copy">
            <Typography component="h1" className="sign-in-page__hero-title">
              "Secure Your IELTS Study Online Exam System - Please Sign In"
            </Typography>
            <Typography component="p" className="sign-in-page__hero-text">
              Access your personalized online learning and examination portal
              with IELTS Study. Sign in to track progress, take exams, and
              enhance your knowledge anytime, anywhere.
            </Typography>
          </Box>

          <Box className="sign-in-page__visual">
            <Box className="sign-in-page__visual-shape" />

            <Box component="article" className="sign-in-page__chart-card">
              <Box className="sign-in-page__chart-card-header">
                <Box>
                  <Typography
                    component="h2"
                    className="sign-in-page__card-title"
                  >
                    Exam Taken Times
                  </Typography>
                  <Typography
                    component="p"
                    className="sign-in-page__card-subtitle"
                  >
                    Taken records of last years
                  </Typography>
                </Box>

                <Box className="sign-in-page__legend">
                  <Box component="span" className="sign-in-page__legend-item">
                    <Box
                      component="span"
                      className="sign-in-page__legend-dot sign-in-page__legend-dot--primary"
                    />
                    Active Exams
                  </Box>
                  <Box component="span" className="sign-in-page__legend-item">
                    <Box
                      component="span"
                      className="sign-in-page__legend-dot sign-in-page__legend-dot--muted"
                    />
                    Active Exam Takers
                  </Box>
                </Box>
              </Box>

              <Box className="sign-in-page__chart">
                {chartBars.map((height, index) => (
                  <Box
                    key={index}
                    component="span"
                    className="sign-in-page__chart-bar"
                    sx={{ height: `${height}%` }}
                  />
                ))}

                <svg
                  viewBox="0 0 560 190"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 126C52 136 68 140 98 132C128 124 145 114 176 96C206 78 228 63 257 75C287 87 303 126 334 136C364 146 381 122 412 128C442 134 456 154 489 146C521 138 532 124 540 128"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 126C52 136 68 140 98 132C128 124 145 114 176 96C206 78 228 63 257 75C287 87 303 126 334 136C364 146 381 122 412 128C442 134 456 154 489 146C521 138 532 124 540 128"
                    fill="url(#sign-in-chart-fade)"
                    fillOpacity="0.12"
                  />
                  <defs>
                    <linearGradient
                      id="sign-in-chart-fade"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="currentColor" />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </Box>

            <Box
              component="article"
              className="sign-in-page__floating-card sign-in-page__floating-card--top"
            >
              <Box className="sign-in-page__floating-card-header">
                <Typography
                  component="h3"
                  className="sign-in-page__floating-card-title"
                >
                  Question statistics
                </Typography>
                <Typography
                  component="span"
                  className="sign-in-page__floating-card-arrow"
                >
                  &#8599;
                </Typography>
              </Box>
              <Typography
                component="p"
                className="sign-in-page__floating-card-label"
              >
                Total Question
              </Typography>
              <Typography
                component="strong"
                className="sign-in-page__floating-card-value"
              >
                20
              </Typography>
            </Box>

            <Box
              component="article"
              className="sign-in-page__floating-card sign-in-page__floating-card--bottom"
            >
              <Typography
                component="h3"
                className="sign-in-page__floating-card-title"
              >
                Exam statistics
              </Typography>
              <Typography
                component="p"
                className="sign-in-page__floating-card-label"
              >
                Total Exam
              </Typography>
              <Typography
                component="strong"
                className="sign-in-page__floating-card-value"
              >
                27
              </Typography>
            </Box>
          </Box>

          <Box className="sign-in-page__pagination" aria-hidden="true">
            {paginationDots.map((dot) => (
              <Box
                key={dot}
                component="span"
                className={`sign-in-page__pagination-dot${dot === 1 ? " sign-in-page__pagination-dot--active" : ""}`}
              />
            ))}
          </Box>
        </Box>

        <Box component="section" className="sign-in-page__form-section">
          <Box
            component="form"
            className="sign-in-page__form-card"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box className="sign-in-page__form-badge">
              <MailIcon />
            </Box>

            <Typography component="h2" className="sign-in-page__form-title">
              Welcome Back IELTS Study
            </Typography>
            <Typography component="p" className="sign-in-page__form-subtitle">
              Welcome back! Please enter your details.
            </Typography>

            <Box className="sign-in-page__social-actions">
              <Button
                type="button"
                className="sign-in-page__social-button"
                variant="outlined"
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                className="sign-in-page__social-button"
                variant="outlined"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </Button>
            </Box>

            <Box className="sign-in-page__divider">
              <Typography
                component="span"
                className="sign-in-page__divider-label"
              >
                Or with email
              </Typography>
            </Box>

            <Box className="sign-in-page__field-group">
              <Typography
                component="label"
                htmlFor="email"
                className="sign-in-page__field-label"
              >
                Email
              </Typography>
              <TextField
                id="email"
                className="sign-in-page__field"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  onChange: (event) => {
                    const nextEmail = event.target.value;
                    // #region agent log
                    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "X-Debug-Session-Id": "393b5a",
                      },
                      body: JSON.stringify({
                        sessionId: "393b5a",
                        runId: "post-fix",
                        hypothesisId: "H7",
                        location: "SignInPage.tsx:emailOnChange",
                        message: "Email field changed",
                        data: {
                          hasAtSymbol: nextEmail.includes("@"),
                          length: nextEmail.length,
                        },
                        timestamp: Date.now(),
                      }),
                    }).catch(() => {});
                    // #endregion
                  },
                })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-in-page__field-icon">
                          <MailIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box className="sign-in-page__field-group">
              <Typography
                component="label"
                htmlFor="password"
                className="sign-in-page__field-label"
              >
                Password
              </Typography>
              <TextField
                id="password"
                className="sign-in-page__field"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="sign-in-page__field-icon">
                          <LockIcon />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box className="sign-in-page__form-meta">
              <FormControlLabel
                className="sign-in-page__checkbox-label"
                control={
                  <Controller
                    name="rememberAccount"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          // #region agent log
                          fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-Debug-Session-Id": "393b5a",
                            },
                            body: JSON.stringify({
                              sessionId: "393b5a",
                              runId: "post-fix",
                              hypothesisId: "H8",
                              location: "SignInPage.tsx:rememberCheckbox",
                              message: "Remember account toggled",
                              data: {
                                checked,
                                previousValue: field.value,
                              },
                              timestamp: Date.now(),
                            }),
                          }).catch(() => {});
                          // #endregion
                          field.onChange(checked);
                        }}
                      />
                    )}
                  />
                }
                label="Save account"
              />

              <Typography
                component={Link}
                to={ROUTES_PATH.signUp}
                className="sign-in-page__forgot-link"
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              className="sign-in-page__submit-button"
              variant="contained"
            >
              Sign In
            </Button>

            <Typography component="p" className="sign-in-page__footer-text">
              Don&apos;t have an account?{" "}
              <Typography
                component={Link}
                to={ROUTES_PATH.signUp}
                className="sign-in-page__footer-link"
              >
                Create now
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </SignInPageRoot>
  );
}
