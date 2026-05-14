import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'

import { useToast } from '../../../components/common/Toast'
import { normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { ROUTES_PATH } from '../../../routes'
import { normalizeEmail, validateGmailField } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { CREATE_CENTER_MUTATION } from '../api/createCenterMutation'
import { UPDATE_CENTER_MUTATION } from '../api/updateCenterMutation'
import type {
  AddCenterLocationState,
  CreateCenterMutationResponse,
  CreateCenterMutationVariables,
  UpdateCenterMutationResponse,
  UpdateCenterMutationVariables,
} from '@/types/centers'

export function useAddCenterForm() {
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

  const handleLogoFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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
    },
    [toast],
  )

  const handleSaveCenter = useCallback(async () => {
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
  }, [
    isViewMode,
    centerName,
    address,
    managerName,
    phone,
    email,
    password,
    confirmPassword,
    logoDataUrl,
    isEditMode,
    updateCenter,
    routeState?.center?.id,
    hasNewLogoUpload,
    createCenter,
    toast,
    navigate,
  ])

  return {
    isViewMode,
    isEditMode,
    isSaving: isCreatingCenter || isUpdatingCenter,
    centerName,
    address,
    logoDataUrl,
    logoFileName,
    managerName,
    phone,
    email,
    password,
    confirmPassword,
    setCenterName,
    setAddress,
    setManagerName,
    setPhone,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleLogoFileChange,
    handleSaveCenter,
  }
}
