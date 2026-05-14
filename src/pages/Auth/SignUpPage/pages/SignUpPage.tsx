import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
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
import { emailRegisterRules, isValidEmail, normalizeEmail } from "../../../../utils/emailValidation";
import { passwordRegisterRules } from "../../../../utils/passwordValidation";
import { useAppDispatch } from "../../../../store/hooks";
import { setAuthSession } from "../../../../store/slices/authSlice";
import {
  AUTH_CHART_BARS,
  AUTH_PAGINATION_DOTS,
  FacebookIcon,
  GoogleIcon,
  isMongoObjectId,
  LockIcon,
  MailIcon,
  SparkIcon,
  toUserRole,
} from "../../../../helpers";
import { SIGNUP_MUTATION } from "../api/signupMutation";
import { SignUpPageRoot } from "./SignUpPage.style";

type SignUpFormValues = {
  fullName: string;
  email: string;
  password: string;
  rememberAccount: boolean;
};

type SignupMutationResponse = {
  signup: {
    _id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    role: string | null;
    token: string | null;
  } | null;
};

type SignupMutationVariables = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rememberMe: boolean;
  centerId?: string | null;
};

export function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const inviteCenterId = useMemo(() => {
    const raw = searchParams.get("centerId")?.trim() ?? "";
    return isMongoObjectId(raw) ? raw : null;
  }, [searchParams]);
  const { control, handleSubmit, register, formState: { errors } } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      rememberAccount: false,
    },
  });

  const [signup, { loading }] = useMutation<SignupMutationResponse, SignupMutationVariables>(
    SIGNUP_MUTATION,
  );

  const onSubmit: SubmitHandler<SignUpFormValues> = async (values) => {
    const [firstNameRaw, ...lastNameParts] = values.fullName.trim().split(" ");
    const firstName = firstNameRaw?.trim() || "";
    const lastNameJoined = lastNameParts.join(" ").trim();
    const lastName = lastNameJoined.length > 0 ? lastNameJoined : "";
    const email = normalizeEmail(values.email);

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      const result = await signup({
        variables: {
          firstName,
          lastName,
          email,
          password: values.password,
          rememberMe: values.rememberAccount,
          centerId: inviteCenterId,
        },
      });

      const signupData = result.data?.signup ?? null;
      const apolloErrorMessage = result.error?.message ?? null;
      const graphQLErrorMessages =
        result.error && "errors" in result.error && Array.isArray(result.error.errors)
          ? result.error.errors
              .map((item) => item?.message)
              .filter((message): message is string => Boolean(message))
          : [];

      if (!signupData?.token) {
        const fallbackErrorMessage =
          graphQLErrorMessages[0] ??
          apolloErrorMessage ??
          "Signup completed but token was not returned by backend.";
        toast.error(fallbackErrorMessage);
        return;
      }

      const normalizedRole = toUserRole(signupData.role);
      if (normalizedRole !== USER_ROLES.student) {
        toast.error("Sign up is only available for student accounts.");
        return;
      }
      dispatch(
        setAuthSession({
          token: signupData.token,
          role: normalizedRole,
          name: `${signupData.firstName ?? ""} ${signupData.lastName ?? ""}`.trim() || null,
        }),
      );

      navigate(ROUTES_PATH.dashboard);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup request failed.");
    }
  };

  return (
    <SignUpPageRoot>
      <Box className="sign-up-page">
        <Box component="section" className="sign-up-page__hero">
          <Box
            component={Link}
            to={ROUTES_PATH.signIn}
            className="sign-up-page__brand"
          >
            <Box component="span" className="sign-up-page__brand-mark">
              <SparkIcon />
            </Box>
            <Typography component="span" className="sign-up-page__brand-name">
              IELTS Study
            </Typography>
          </Box>

          <Box className="sign-up-page__hero-copy">
            <Typography component="h1" className="sign-up-page__hero-title">
              "Secure Your IELTS Study Online Exam System - Please Sign In"
            </Typography>
            <Typography component="p" className="sign-up-page__hero-text">
              Access your personalized online learning and examination portal
              with IELTS Study. Sign in to track progress, take exams, and
              enhance your knowledge anytime, anywhere.
            </Typography>
          </Box>

          <Box className="sign-up-page__visual">
            <Box className="sign-up-page__visual-shape" />

            <Box component="article" className="sign-up-page__chart-card">
              <Box className="sign-up-page__chart-card-header">
                <Box>
                  <Typography
                    component="h2"
                    className="sign-up-page__card-title"
                  >
                    Exam Taken Times
                  </Typography>
                  <Typography
                    component="p"
                    className="sign-up-page__card-subtitle"
                  >
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
              className="sign-up-page__floating-card sign-up-page__floating-card--top"
            >
              <Box className="sign-up-page__floating-card-header">
                <Typography
                  component="h3"
                  className="sign-up-page__floating-card-title"
                >
                  Question statistics
                </Typography>
                <Typography
                  component="span"
                  className="sign-up-page__floating-card-arrow"
                >
                  &#8599;
                </Typography>
              </Box>
              <Typography
                component="p"
                className="sign-up-page__floating-card-label"
              >
                Total Question
              </Typography>
              <Typography
                component="strong"
                className="sign-up-page__floating-card-value"
              >
                20
              </Typography>
            </Box>

            <Box
              component="article"
              className="sign-up-page__floating-card sign-up-page__floating-card--bottom"
            >
              <Typography
                component="h3"
                className="sign-up-page__floating-card-title"
              >
                Exam statistics
              </Typography>
              <Typography
                component="p"
                className="sign-up-page__floating-card-label"
              >
                Total Exam
              </Typography>
              <Typography
                component="strong"
                className="sign-up-page__floating-card-value"
              >
                27
              </Typography>
            </Box>
          </Box>

          <Box className="sign-up-page__pagination" aria-hidden="true">
            {AUTH_PAGINATION_DOTS.map((dot) => (
              <Box
                key={dot}
                component="span"
                className={`sign-up-page__pagination-dot${dot === 1 ? " sign-up-page__pagination-dot--active" : ""}`}
              />
            ))}
          </Box>
        </Box>

        <Box component="section" className="sign-up-page__form-section">
          <Box
            component="form"
            className="sign-up-page__form-card"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box className="sign-up-page__form-badge">
              <MailIcon />
            </Box>

            {inviteCenterId ? (
              <Alert severity="info">
                You are signing up through a center invite — your account will be linked to that center.
              </Alert>
            ) : null}

            <Typography component="h2" className="sign-up-page__form-title">
              Welcome Back IELTS Study
            </Typography>
            <Typography component="p" className="sign-up-page__form-subtitle">
              Welcome back! Please enter your details.
            </Typography>

            <Box className="sign-up-page__social-actions">
              <Button
                type="button"
                className="sign-up-page__social-button"
                variant="secondary"
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                className="sign-up-page__social-button"
                variant="secondary"
              >
                <FacebookIcon />
                <span>Facebook</span>
              </Button>
            </Box>

            <Box className="sign-up-page__divider">
              <Typography
                component="span"
                className="sign-up-page__divider-label"
              >
                Or with email
              </Typography>
            </Box>

            <Box className="sign-up-page__field-group">
              <Typography
                component="label"
                htmlFor="email"
                className="sign-up-page__field-label"
              >
                Full name
              </Typography>
              <TextField
                id="email"
                className="sign-up-page__field"
                type="text"
                placeholder="Enter your name"
                {...register("fullName")}
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
              <Typography
                component="label"
                htmlFor="email"
                className="sign-up-page__field-label"
              >
                Email
              </Typography>
              <TextField
                id="email"
                className="sign-up-page__field"
                type="email"
                placeholder="Enter your email"
                {...register("email", emailRegisterRules)}
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
              <Typography
                component="label"
                htmlFor="password"
                className="sign-up-page__field-label"
              >
                Password
              </Typography>
              <PasswordTextField
                id="password"
                className="sign-up-page__field"
                placeholder="Enter your password"
                {...register("password", passwordRegisterRules)}
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

            <Box className="sign-up-page__form-meta">
              <FormControlLabel
                className="sign-up-page__checkbox-label"
                control={
                  <Controller
                    name="rememberAccount"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    )}
                  />
                }
                label="I agree to all Term, Privacy an Police and Fees "
              />
            </Box>

            <Button
              type="submit"
              className="sign-up-page__submit-button"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Typography component="p" className="sign-up-page__footer-text">
              Don&apos;t have an account?{" "}
              <Typography
                component={Link}
                to={ROUTES_PATH.signIn}
                className="sign-up-page__footer-link"
              >
                Sign in account
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </SignUpPageRoot>
  );
}
