import { useEffect, useState, type ChangeEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Box, Button, TextField, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { ROUTES_PATH } from '../../../routes'
import { agentLog } from '../../../utils/agentLog'
import { CREATE_CENTER_MUTATION } from '../api/createCenterMutation'
import { UPDATE_CENTER_MUTATION } from '../api/updateCenterMutation'
import { AddCenterPageRoot } from './AddCenterPage.style'

type CreateCenterMutationResponse = {
  createCenter: {
    _id: string
    name: string
  } | null
}

type CreateCenterMutationVariables = {
  name: string
  manager: string
  address: string
  phone: string
  email: string
  password: string
  logo: string
  establishedAt: string
}

type UpdateCenterMutationResponse = {
  updateCenter: {
    _id: string
    name: string
  } | null
}

type UpdateCenterMutationVariables = {
  _id: string
  name?: string
  manager?: string
  address?: string
  phone?: string
  email?: string
  password?: string
  logo?: string
  establishedAt?: string
}

type AddCenterLocationState = {
  mode?: 'create' | 'edit' | 'view'
  center?: {
    id: string
    name: string
    manager?: string
    email: string
    phone: string
    address: string
    logo: string
    establishedAt?: string
  }
}

export function AddCenterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = (location.state as AddCenterLocationState | null) ?? null
  const isViewMode = routeState?.mode === 'view' && Boolean(routeState?.center?.id)
  const isEditMode = routeState?.mode === 'edit' && Boolean(routeState?.center?.id)
  const [centerName, setCenterName] = useState('')
  const [address, setAddress] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [hasNewLogoUpload, setHasNewLogoUpload] = useState(false)
  const [managerName, setManagerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)
  const [updateCenter, { loading: isUpdatingCenter }] = useMutation<
    UpdateCenterMutationResponse,
    UpdateCenterMutationVariables
  >(UPDATE_CENTER_MUTATION)
  const rawGraphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL ?? 'http://127.0.0.1:8000/graphql'
  const graphqlEndpoint = rawGraphqlEndpoint.includes('://localhost')
    ? rawGraphqlEndpoint.replace('://localhost', '://127.0.0.1')
    : rawGraphqlEndpoint

  useEffect(() => {
    const sendDebugLog = (payload: {
      hypothesisId: string
      location: string
      message: string
      data: Record<string, unknown>
    }) => {
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        ...payload,
      })
    }

    const form = document.querySelector('.add-center-form') as HTMLElement | null
    const firstInput = document.querySelector(
      '.add-center-form__grid .MuiFormControl-root',
    ) as HTMLElement | null
    const actions = document.querySelector('.add-center-form__actions') as HTMLElement | null
    const summary = document.querySelector('.add-center-form__summary') as HTMLElement | null

    // #region agent log
    sendDebugLog({
      hypothesisId: 'H1',
      location: 'AddCenterPage.tsx:summary/useEffect',
      message: 'Form container sizing snapshot',
      data: {
        viewportWidth: window.innerWidth,
        formWidth: form?.getBoundingClientRect().width ?? null,
        formDisplay: form ? window.getComputedStyle(form).display : null,
      },
    })
    // #endregion

    // #region agent log
    sendDebugLog({
      hypothesisId: 'H2',
      location: 'AddCenterPage.tsx:summary/useEffect',
      message: 'First field sizing snapshot',
      data: {
        fieldWidth: firstInput?.getBoundingClientRect().width ?? null,
        fieldClasses: firstInput?.className ?? null,
      },
    })
    // #endregion

    // #region agent log
    sendDebugLog({
      hypothesisId: 'H3',
      location: 'AddCenterPage.tsx:summary/useEffect',
      message: 'Actions layout snapshot',
      data: {
        actionsWidth: actions?.getBoundingClientRect().width ?? null,
        actionsDirection: actions ? window.getComputedStyle(actions).flexDirection : null,
        actionsJustify: actions ? window.getComputedStyle(actions).justifyContent : null,
      },
    })
    // #endregion

    // #region agent log
    sendDebugLog({
      hypothesisId: 'H4',
      location: 'AddCenterPage.tsx:summary/useEffect',
      message: 'Actions structural context',
      data: {
        actionsParentClass: actions?.parentElement?.className ?? null,
        previousSiblingClass: actions?.previousElementSibling?.className ?? null,
      },
    })
    // #endregion

    // #region agent log
    sendDebugLog({
      hypothesisId: 'H5',
      location: 'AddCenterPage.tsx:summary/useEffect',
      message: 'Summary and actions spacing snapshot',
      data: {
        summaryBottom: summary?.getBoundingClientRect().bottom ?? null,
        actionsTop: actions?.getBoundingClientRect().top ?? null,
        actionsGapFromSummary:
          summary && actions
            ? Number((actions.getBoundingClientRect().top - summary.getBoundingClientRect().bottom).toFixed(2))
            : null,
      },
    })
    // #endregion
  }, [])

  useEffect(() => {
    const saveButton = document.querySelector('.add-center-form__submit') as HTMLButtonElement | null
    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H-btn-state',
      location: 'AddCenterPage.tsx:saveButton/useEffect',
      message: 'Save button state snapshot',
      data: {
        isViewMode,
        isEditMode,
        isCreatingCenter,
        isUpdatingCenter,
        submitError: submitError || null,
        buttonExists: Boolean(saveButton),
        buttonDisabled: saveButton?.disabled ?? null,
        buttonText: saveButton?.textContent?.trim() ?? null,
      },
    })
  }, [isViewMode, isEditMode, isCreatingCenter, isUpdatingCenter, submitError])

  useEffect(() => {
    if ((!isEditMode && !isViewMode) || !routeState?.center) {
      return
    }

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H-update-prefill',
      location: 'AddCenterPage.tsx:prefill/useEffect',
      message: 'Edit/View prefill state snapshot',
      data: {
        mode: isEditMode ? 'edit' : 'view',
        centerId: routeState.center.id,
        hasManager: Boolean(routeState.center.manager?.trim()),
      },
    })

    setCenterName(routeState.center.name ?? '')
    setManagerName(routeState.center.manager ?? '')
    setAddress(routeState.center.address ?? '')
    setPhone(routeState.center.phone ?? '')
    setEmail(routeState.center.email ?? '')
    setLogoDataUrl(routeState.center.logo ?? '')
    setLogoFileName(routeState.center.logo ? 'existing-logo' : '')
    setHasNewLogoUpload(false)
  }, [isEditMode, isViewMode, routeState])

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    if (!selectedFile) {
      setLogoDataUrl('')
      setLogoFileName('')
      setHasNewLogoUpload(false)
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setSubmitError('Logo uchun rasm fayl tanlang (png, jpg, webp...).')
      setLogoDataUrl('')
      setLogoFileName('')
      setHasNewLogoUpload(false)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setLogoDataUrl(result)
      setLogoFileName(selectedFile.name)
      setHasNewLogoUpload(true)
      setSubmitError('')

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H11',
        location: 'AddCenterPage.tsx:handleLogoFileChange',
        message: 'Logo file converted to base64',
        data: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          hasBase64: Boolean(result),
        },
      })
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCreateCenter = async () => {
    if (isViewMode) {
      return
    }

    const normalizedName = centerName.trim()
    const normalizedAddress = address.trim()
    const normalizedManager = managerName.trim()
    const normalizedPhone = phone.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!normalizedName || !normalizedManager || !normalizedAddress || !normalizedPhone || !normalizedEmail) {
      setSubmitError("Center saqlash uchun center name, manager name, address, phone number va gmail majburiy.")
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H18',
        location: 'AddCenterPage.tsx:handleCreateCenter',
        message: 'Validation blocked save: core required fields',
        data: {
          mode: isEditMode ? 'edit' : 'create',
          hasName: Boolean(normalizedName),
          hasAddress: Boolean(normalizedAddress),
          hasManager: Boolean(normalizedManager),
          hasPhone: Boolean(normalizedPhone),
          hasEmail: Boolean(normalizedEmail),
        },
      })
      return
    }

    if (!isEditMode && !logoDataUrl) {
      setSubmitError("Create uchun logo file majburiy.")
      return
    }

    if (!isEditMode && !trimmedPassword) {
      setSubmitError("Create uchun password majburiy.")
      return
    }

    if (trimmedPassword && trimmedPassword.length < 6) {
      setSubmitError("Password kamida 6 ta belgidan iborat bo'lishi kerak.")
      return
    }

    if (trimmedPassword && trimmedPassword !== trimmedConfirmPassword) {
      setSubmitError('Password va confirm password bir xil emas.')
      return
    }

    setSubmitError('')

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H6',
      location: 'AddCenterPage.tsx:handleCreateCenter',
      message: 'Create center submit payload snapshot',
      data: {
        graphqlEndpoint,
        hasName: Boolean(normalizedName),
        hasAddress: Boolean(normalizedAddress),
        hasLogo: Boolean(logoDataUrl),
        hasNewLogoUpload,
        logoBase64Length: logoDataUrl.length,
        logoApproxBytes: logoDataUrl ? Math.ceil((logoDataUrl.length * 3) / 4) : 0,
        logoFileName: logoFileName || null,
        hasPhone: Boolean(normalizedPhone),
        hasEmail: Boolean(normalizedEmail),
        hasPassword: Boolean(trimmedPassword),
        passwordLength: trimmedPassword.length,
        managerLength: normalizedManager.length,
        mode: isEditMode ? 'edit' : 'create',
      },
    })

    try {
      let mutationCenter: { _id: string; name: string } | null = null
      let apolloErrorMessage: string | null = null
      let hasApolloError = false
      let apolloErrorDetails:
        | {
            name?: string
            message?: string
            graphQLErrors?: Array<{ message?: string }>
            networkError?: { message?: string; name?: string; statusCode?: number }
          }
        | undefined

      if (isEditMode) {
        const result = await updateCenter({
          variables: {
            _id: routeState?.center?.id ?? '',
            name: normalizedName,
            manager: normalizedManager,
            address: normalizedAddress,
            phone: normalizedPhone,
            email: normalizedEmail,
            ...(trimmedPassword ? { password: trimmedPassword } : {}),
            ...(hasNewLogoUpload && logoDataUrl ? { logo: logoDataUrl } : {}),
            establishedAt: new Date().toISOString(),
          },
        })
        mutationCenter = result.data?.updateCenter ?? null
        apolloErrorMessage = result.error?.message ?? null
        hasApolloError = Boolean(result.error)
        apolloErrorDetails = result.error as typeof apolloErrorDetails
      } else {
        const result = await createCenter({
          variables: {
            name: normalizedName,
            manager: normalizedManager,
            address: normalizedAddress,
            phone: normalizedPhone,
            email: normalizedEmail,
            password: trimmedPassword,
            logo: logoDataUrl,
            establishedAt: new Date().toISOString(),
          },
        })
        mutationCenter = result.data?.createCenter ?? null
        apolloErrorMessage = result.error?.message ?? null
        hasApolloError = Boolean(result.error)
        apolloErrorDetails = result.error as typeof apolloErrorDetails
      }

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: isEditMode ? 'H19' : 'H7',
        location: 'AddCenterPage.tsx:handleCreateCenter',
        message: isEditMode
          ? 'Update center mutation result snapshot'
          : 'Create center mutation result snapshot',
        data: {
          hasCenterMutationData: Boolean(mutationCenter),
          centerMutationId: mutationCenter?._id ?? null,
          mode: isEditMode ? 'edit' : 'create',
          hasApolloError,
          apolloErrorMessage,
          hasNewLogoUpload,
          apolloErrorName: apolloErrorDetails?.name ?? null,
          graphQLErrorMessages: apolloErrorDetails?.graphQLErrors?.map((item) => item.message ?? '') ?? [],
          networkErrorMessage: apolloErrorDetails?.networkError?.message ?? null,
          networkErrorName: apolloErrorDetails?.networkError?.name ?? null,
          networkErrorStatusCode: apolloErrorDetails?.networkError?.statusCode ?? null,
          browserOnline: typeof navigator !== 'undefined' ? navigator.onLine : null,
        },
      })

      if (!mutationCenter?._id) {
        setSubmitError(apolloErrorMessage ?? "Center saqlashda xatolik bo'ldi.")
        return
      }

      navigate(ROUTES_PATH.center)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Center yaratishda kutilmagan xatolik.")
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H8',
        location: 'AddCenterPage.tsx:handleCreateCenter',
        message: 'Create center mutation threw exception',
        data: {
          errorMessage: error instanceof Error ? error.message : 'unknown-error',
        },
      })
    }
  }

  return (
    <Layout>
      <AddCenterPageRoot>
        <Box className="add-center-page">
          <Box className="add-center-page__hero">
            <Box>
              <Typography component="p" className="add-center-page__eyebrow">
                Center setup
              </Typography>
              <Typography component="h1" className="add-center-page__title">
                {isViewMode ? 'View Center' : isEditMode ? 'Update Center' : 'Add New Center'}
              </Typography>
              <Typography component="p" className="add-center-page__description">
                Create a new branch profile with its core contact details,
                manager ownership, and starting capacity. You can connect this
                form to your GraphQL mutation later without changing the layout.
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.center}
              className="add-center-page__back"
              variant="outlined"
            >
              Back to centers
            </Button>
          </Box>

          <Box component="form" className="add-center-form">
            <Box className="add-center-form__section">
              <Box className="add-center-form__section-header">
                <Typography component="h2" className="add-center-form__section-title">
                  Basic information
                </Typography>
                <Typography component="p" className="add-center-form__section-text">
                  Main branch identity and location details.
                </Typography>
              </Box>

              <Box className="add-center-form__grid">
                <TextField
                  label="Center name"
                  value={centerName}
                  onChange={(event) => setCenterName(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  className="add-center-form__field--full"
                  label="Address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  className="add-center-form__field--full"
                  type="file"
                  label="Logo file"
                  disabled={isViewMode}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      accept: 'image/*',
                    },
                  }}
                  onChange={handleLogoFileChange}
                />
                {logoFileName ? (
                  <Typography component="p" className="add-center-form__section-text">
                    Tanlangan fayl: {logoFileName}
                  </Typography>
                ) : null}
                {logoDataUrl ? (
                  <Box className="add-center-form__field--full">
                    <Typography component="p" className="add-center-form__section-text">
                      Logo preview
                    </Typography>
                    <Box
                      component="img"
                      src={logoDataUrl}
                      alt="Selected center logo preview"
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid #dbe2f1',
                        mt: 1,
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>

            <Box className="add-center-form__section">
              <Box className="add-center-form__section-header">
                <Typography component="h2" className="add-center-form__section-title">
                  Contact and management
                </Typography>
                <Typography component="p" className="add-center-form__section-text">
                  Person in charge and the branch communication channel.
                </Typography>
              </Box>

              <Box className="add-center-form__grid">
                <TextField
                  label="Manager name"
                  value={managerName}
                  onChange={(event) => setManagerName(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  label="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  label="Gmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isViewMode}
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isViewMode}
                />
              </Box>
            </Box>

            <Box className="add-center-form__actions">
              {submitError ? (
                <Typography component="p" className="add-center-form__actions-copy">
                  {submitError}
                </Typography>
              ) : null}
              <Typography component="p" className="add-center-form__actions-copy">
                Form create/update center mutationlariga ulangan. Ma'lumotlarni
                saqlash uchun Save tugmasidan foydalaning.
              </Typography>

              <Box className="add-center-form__buttons">
                <Button
                  component={Link}
                  to={ROUTES_PATH.center}
                  className="add-center-form__cancel"
                  variant="outlined"
                >
                  {isViewMode ? 'Back' : 'Cancel'}
                </Button>
                {isViewMode ? null : (
                  <Button
                    className="add-center-form__submit"
                    variant="contained"
                    onClick={() => {
                      agentLog({
                        sessionId: '24497a',
                        runId: 'pre-fix',
                        hypothesisId: 'H-btn-click',
                        location: 'AddCenterPage.tsx:saveButton/onClick',
                        message: 'Save button clicked',
                        data: {
                          isViewMode,
                          isEditMode,
                          isCreatingCenter,
                          isUpdatingCenter,
                        },
                      })
                      handleCreateCenter()
                    }}
                    disabled={isCreatingCenter || isUpdatingCenter}
                  >
                    {isCreatingCenter || isUpdatingCenter
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update Center'
                        : 'Save Center'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </AddCenterPageRoot>
    </Layout>
  )
}
