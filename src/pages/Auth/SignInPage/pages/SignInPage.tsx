import { Link, useNavigate } from "react-router-dom";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { c } from "../../../../theme";
import { Button } from "../../../../components/common/Button";
import { PasswordTextField } from "../../../../components/common/PasswordTextField";
import { useToast } from "../../../../components/common/Toast";

import { ROUTES_PATH } from "../../../../routes";
import { useAppDispatch } from "../../../../store/hooks";
import { setAuthSession } from "../../../../store/slices/authSlice";
import {
  AUTH_CHART_BARS,
  AUTH_PAGINATION_DOTS,
  FacebookIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  SparkIcon,
  toUserRole,
} from "../../../../helpers";
import { agentLog } from "../../../../utils/agentLog";
import { emailRegisterRules, isValidEmail, normalizeEmail } from "../../../../utils/emailValidation";
import { LOGIN_MUTATION } from "../api/loginMutation";
import { SignInPageRoot } from "./SignInPage.style";

type SignInFormValues = {
  email: string;
  password: string;
  rememberAccount: boolean;
};

type LoginMutationResponse = {
  login: {
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    token: string | null;
  } | null;
};

type LoginMutationVariables = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { control, handleSubmit, register, formState: { errors } } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberAccount: false,
    },
  });
  const [loginMutation, { loading }] = useMutation<LoginMutationResponse, LoginMutationVariables>(
    LOGIN_MUTATION,
  );

  const onSubmit: SubmitHandler<SignInFormValues> = async (values) => {
    const normalizedEmail = normalizeEmail(values.email);

    if (!isValidEmail(normalizedEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    agentLog({
      sessionId: "24497a",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "SignInPage.tsx:handleSubmit",
      message: "Sign in submit snapshot",
      data: {
        emailTrimmedLength: normalizedEmail.length,
        passwordLength: values.password.length,
        rememberAccount: values.rememberAccount,
        source: "react-hook-form",
      },
    });

    try {
      const result = await loginMutation({
        variables: {
          email: normalizedEmail,
          password: values.password,
          rememberMe: values.rememberAccount,
        },
      });

      const loginData = result.data?.login ?? null;
      const apolloErrorMessage = result.error?.message ?? null;

      agentLog({
        sessionId: "24497a",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "SignInPage.tsx:handleSubmit",
        message: "Login mutation result snapshot",
        data: {
          hasLoginData: Boolean(loginData),
          hasToken: Boolean(loginData?.token),
          role: loginData?.role ?? null,
          hasApolloError: Boolean(result.error),
          apolloErrorMessage,
        },
      });

      if (!loginData?.token) {
        toast.error(apolloErrorMessage ?? 'Incorrect email or password.');
        return;
      }

      const normalizedRole = toUserRole(loginData.role);
      dispatch(
        setAuthSession({
          token: loginData.token,
          role: normalizedRole,
          name: `${loginData.firstName ?? ""} ${loginData.lastName ?? ""}`.trim() || null,
        }),
      );

      agentLog({
        sessionId: "24497a",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "SignInPage.tsx:handleSubmit",
        message: "Auth session persisted from login",
        data: {
          tokenLength: loginData.token.length,
          roleAfterNormalization: normalizedRole,
        },
      });

      navigate(ROUTES_PATH.dashboard);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login request failed.");
      agentLog({
        sessionId: "24497a",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "SignInPage.tsx:handleSubmit",
        message: "Login mutation threw exception",
        data: {
          errorMessage: error instanceof Error ? error.message : "unknown-error",
        },
      });
    }
  };

  return (
    <SignInPageRoot>
      <Box className="sign-in-page">
        <Box component="section" className="sign-in-page__hero">
          <Box
            component={Link}
            to={ROUTES_PATH.dashboard}
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
                {AUTH_CHART_BARS.map((height, index) => (
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
            {AUTH_PAGINATION_DOTS.map((dot) => (
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
                variant="secondary"
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                className="sign-in-page__social-button"
                variant="secondary"
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
                  ...emailRegisterRules,
                  onChange: (event) => {
                    const nextEmail = event.target.value;
                    agentLog({
                      sessionId: "24497a",
                      runId: "pre-fix",
                      hypothesisId: "H1",
                      location: "SignInPage.tsx:emailOnChange",
                      message: "Email field changed",
                      data: {
                        hasAtSymbol: nextEmail.includes("@"),
                        length: nextEmail.length,
                      },
                    });
                  },
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
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
              <PasswordTextField
                id="password"
                className="sign-in-page__field"
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
                          agentLog({
                            sessionId: "24497a",
                            runId: "pre-fix",
                            hypothesisId: "H1",
                            location: "SignInPage.tsx:rememberCheckbox",
                            message: "Remember account toggled",
                            data: {
                              checked,
                              previousValue: field.value,
                            },
                          });
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
              variant="primary"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
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
