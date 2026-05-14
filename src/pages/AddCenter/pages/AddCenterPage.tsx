import { useEffect, useState, type ChangeEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Box, TextField, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { c } from '../../../theme'
import { Layout } from '../../../components/layout'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput, normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { useToast } from '../../../components/common/Toast'
import { ROUTES_PATH } from '../../../routes'
import { normalizeEmail, validateGmailField } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
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
  const toast = useToast()
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
  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)
  const [updateCenter, { loading: isUpdatingCenter }] = useMutation<
    UpdateCenterMutationResponse,
    UpdateCenterMutationVariables
  >(UPDATE_CENTER_MUTATION)

  useEffect(() => {
    if ((!isEditMode && !isViewMode) || !routeState?.center) {
      return
    }

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
      toast.error('Select an image file for the logo (png, jpg, webp...).')
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
    const normalizedPhone = normalizeUzPhoneDigits(phone)
    const normalizedEmail = normalizeEmail(email)
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!normalizedName || !normalizedManager || !normalizedAddress || !normalizedPhone || !normalizedEmail) {
      toast.error('Center name, manager name, address, phone number, and Gmail are required to save.')
      return
    }

    const gmailValidation = validateGmailField(email)
    if (gmailValidation !== true) {
      toast.error(gmailValidation)
      return
    }

    if (!isEditMode && !logoDataUrl) {
      toast.error('Logo file is required for create.')
      return
    }

    if (!isEditMode && !trimmedPassword) {
      toast.error('Password is required for create.')
      return
    }

    if (trimmedPassword) {
      const passwordValidation = validatePasswordField(trimmedPassword)
      if (passwordValidation !== true) {
        toast.error(passwordValidation)
        return
      }
    }

    if (trimmedPassword && trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Password and confirm password do not match.')
      return
    }

    try {
      let mutationCenter: { _id: string; name: string } | null = null
      let apolloErrorMessage: string | null = null

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
      }

      if (!mutationCenter?._id) {
        toast.error(apolloErrorMessage ?? 'Failed to save center.')
        return
      }

      toast.success(isEditMode ? 'Center updated successfully.' : 'Center created successfully.')
      navigate(ROUTES_PATH.center)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error while creating center.')
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
                manager ownership, and starting capacity.
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.center}
              className="add-center-page__back"
              variant="secondary"
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
                    Selected file: {logoFileName}
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
                        border: `1px solid ${c.border.medium}`,
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
                <PhoneInput
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
                <PasswordTextField
                  label="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isViewMode}
                />
                <PasswordTextField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isViewMode}
                />
              </Box>
            </Box>

            <Box className="add-center-form__actions">
              <Typography component="p" className="add-center-form__actions-copy">
                Use Save to persist your changes.
              </Typography>

              <Box className="add-center-form__buttons">
                <Button
                  component={Link}
                  to={ROUTES_PATH.center}
                  className="add-center-form__cancel"
                  variant="secondary"
                >
                  {isViewMode ? 'Back' : 'Cancel'}
                </Button>
                {isViewMode ? null : (
                  <Button
                    className="add-center-form__submit"
                    variant="primary"
                    onClick={handleCreateCenter}
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
