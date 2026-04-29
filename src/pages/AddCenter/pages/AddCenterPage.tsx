import { useEffect, useState, type ChangeEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { ROUTES_PATH } from '../../../routes'
import { centerTypeOptions, statusOptions } from '../api/addCenterOptions'
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
  address?: string
  phone?: string
  email?: string
  password?: string
  logo?: string
  establishedAt?: string
}

type AddCenterLocationState = {
  mode?: 'create' | 'edit'
  center?: {
    id: string
    name: string
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
  const isEditMode = routeState?.mode === 'edit' && Boolean(routeState?.center?.id)
  const [centerName, setCenterName] = useState('')
  const [city, setCity] = useState('Tashkent')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [managerName, setManagerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [centerType, setCenterType] = useState('Branch')
  const [status, setStatus] = useState('Draft')
  const [submitError, setSubmitError] = useState('')
  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)
  const [updateCenter, { loading: isUpdatingCenter }] = useMutation<
    UpdateCenterMutationResponse,
    UpdateCenterMutationVariables
  >(UPDATE_CENTER_MUTATION)

  useEffect(() => {
    const sendDebugLog = (payload: {
      hypothesisId: string
      location: string
      message: string
      data: Record<string, unknown>
    }) => {
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          timestamp: Date.now(),
          ...payload,
        }),
      }).catch(() => {})
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
    if (!isEditMode || !routeState?.center) {
      return
    }

    setCenterName(routeState.center.name ?? '')
    setAddress(routeState.center.address ?? '')
    setPhone(routeState.center.phone ?? '')
    setEmail(routeState.center.email ?? '')
    setLogoDataUrl(routeState.center.logo ?? '')
    setLogoFileName(routeState.center.logo ? 'existing-logo' : '')
  }, [isEditMode, routeState])

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    if (!selectedFile) {
      setLogoDataUrl('')
      setLogoFileName('')
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setSubmitError('Logo uchun rasm fayl tanlang (png, jpg, webp...).')
      setLogoDataUrl('')
      setLogoFileName('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setLogoDataUrl(result)
      setLogoFileName(selectedFile.name)
      setSubmitError('')

      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
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
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCreateCenter = async () => {
    const normalizedName = centerName.trim()
    const normalizedDistrict = district.trim()
    const normalizedAddress = address.trim()
    const normalizedPhone = phone.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!normalizedName || !normalizedAddress || !normalizedPhone || !normalizedEmail) {
      setSubmitError("Center saqlash uchun name, address, phone va email majburiy.")
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H18',
          location: 'AddCenterPage.tsx:handleCreateCenter',
          message: 'Validation blocked save: core required fields',
          data: {
            mode: isEditMode ? 'edit' : 'create',
            hasName: Boolean(normalizedName),
            hasAddress: Boolean(normalizedAddress),
            hasPhone: Boolean(normalizedPhone),
            hasEmail: Boolean(normalizedEmail),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '24497a',
      },
      body: JSON.stringify({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H6',
        location: 'AddCenterPage.tsx:handleCreateCenter',
        message: 'Create center submit payload snapshot',
        data: {
          hasName: Boolean(normalizedName),
          hasAddress: Boolean(normalizedAddress),
          hasLogo: Boolean(logoDataUrl),
          logoFileName: logoFileName || null,
          hasPhone: Boolean(normalizedPhone),
          hasEmail: Boolean(normalizedEmail),
          hasPassword: Boolean(trimmedPassword),
          passwordLength: trimmedPassword.length,
          city,
          district: normalizedDistrict || null,
          centerType,
          status,
          mode: isEditMode ? 'edit' : 'create',
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    try {
      let mutationCenter: { _id: string; name: string } | null = null
      let apolloErrorMessage: string | null = null
      let hasApolloError = false

      if (isEditMode) {
        const result = await updateCenter({
          variables: {
            _id: routeState?.center?.id ?? '',
            name: normalizedName,
            address: normalizedAddress,
            phone: normalizedPhone,
            email: normalizedEmail,
            ...(trimmedPassword ? { password: trimmedPassword } : {}),
            ...(logoDataUrl ? { logo: logoDataUrl } : {}),
            establishedAt: new Date().toISOString(),
          },
        })
        mutationCenter = result.data?.updateCenter ?? null
        apolloErrorMessage = result.error?.message ?? null
        hasApolloError = Boolean(result.error)
      } else {
        const result = await createCenter({
          variables: {
            name: normalizedName,
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
      }

      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
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
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion

      if (!mutationCenter?._id) {
        setSubmitError(apolloErrorMessage ?? "Center saqlashda xatolik bo'ldi.")
        return
      }

      navigate(ROUTES_PATH.center)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Center yaratishda kutilmagan xatolik.")
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H8',
          location: 'AddCenterPage.tsx:handleCreateCenter',
          message: 'Create center mutation threw exception',
          data: {
            errorMessage: error instanceof Error ? error.message : 'unknown-error',
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
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
                {isEditMode ? 'Update Center' : 'Add New Center'}
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
                />
                <TextField
                  select
                  label="Center type"
                  value={centerType}
                  onChange={(event) => setCenterType(event.target.value)}
                >
                  {centerTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <TextField
                  label="District"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                />
                <TextField
                  className="add-center-form__field--full"
                  label="Full address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <TextField
                  className="add-center-form__field--full"
                  type="file"
                  label="Logo file"
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
                  label="Branch manager"
                  value={managerName}
                  onChange={(event) => setManagerName(event.target.value)}
                />
                <TextField
                  label="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <TextField
                  select
                  label="Launch status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Box className="add-center-form__actions">
              {submitError ? (
                <Typography component="p" className="add-center-form__actions-copy">
                  {submitError}
                </Typography>
              ) : null}
              <Typography component="p" className="add-center-form__actions-copy">
                Current state is UI-ready. Hook this form to create-center mutation
                when backend schema is available.
              </Typography>

              <Box className="add-center-form__buttons">
                <Button
                  component={Link}
                  to={ROUTES_PATH.center}
                  className="add-center-form__cancel"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  className="add-center-form__submit"
                  variant="contained"
                  onClick={handleCreateCenter}
                  disabled={isCreatingCenter || isUpdatingCenter}
                >
                  {isCreatingCenter || isUpdatingCenter
                    ? 'Saving...'
                    : isEditMode
                      ? 'Update Center'
                      : 'Save Center'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </AddCenterPageRoot>
    </Layout>
  )
}
