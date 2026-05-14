import { useCallback, useRef, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../../components/common/Toast'
import { normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { normalizeEmail, validateGmailField } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { ROUTES_PATH } from '../../../routes'
import { selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { agentLog } from '../../../utils/agentLog'
import { CREATE_CENTER_MUTATION } from '../../AddCenter/api/createCenterMutation'
import { REMOVE_CENTER_MUTATION } from '../api/deleteCenterMutation'
import type {
  CreateCenterMutationResponse,
  CreateCenterMutationVariables,
  DeleteCenterMutationResponse,
  DeleteCenterMutationVariables,
  EditableCenter,
} from '../types'

type UseCenterFormParams = {
  refetchCenters: () => Promise<unknown>
}

export function useCenterForm({ refetchCenters }: UseCenterFormParams) {
  const toast = useToast()
  const navigate = useNavigate()
  const role = useAppSelector(selectUserRole)
  const canCreateCenter = role === USER_ROLES.superAdmin
  const canDeleteCenter = role === USER_ROLES.superAdmin
  const canEditCenter = role === USER_ROLES.superAdmin

  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)

  const [deleteCenterMutation] = useMutation<
    DeleteCenterMutationResponse,
    DeleteCenterMutationVariables
  >(REMOVE_CENTER_MUTATION)

  const isDeletingRef = useRef(false)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [centerName, setCenterName] = useState('')
  const [email, setEmail] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [managerName, setManagerName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const resetForm = useCallback(() => {
    setCenterName('')
    setEmail('')
    setLogoDataUrl('')
    setLogoFileName('')
    setPhone('')
    setAddress('')
    setManagerName('')
    setPassword('')
    setConfirmPassword('')
  }, [])

  const openModal = useCallback(() => {
    resetForm()
    setIsModalOpen(true)
  }, [resetForm])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    resetForm()
  }, [resetForm])

  const handleLogoFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null
      if (!selectedFile) {
        setLogoDataUrl('')
        setLogoFileName('')
        return
      }

      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Select an image file for the logo (png, jpg, webp...).')
        setLogoDataUrl('')
        setLogoFileName('')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : ''
        setLogoDataUrl(result)
        setLogoFileName(selectedFile.name)
      }
      reader.readAsDataURL(selectedFile)
    },
    [toast],
  )

  const handleCreateCenter = useCallback(async () => {
    const normalizedName = centerName.trim()
    const normalizedManager = managerName.trim()
    const normalizedAddress = address.trim()
    const normalizedPhone = normalizeUzPhoneDigits(phone)
    const normalizedEmail = normalizeEmail(email)
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (
      !normalizedName ||
      !normalizedManager ||
      !normalizedAddress ||
      !normalizedPhone ||
      !normalizedEmail
    ) {
      toast.error('Center name, manager name, address, phone number, and Gmail are required.')
      return
    }

    const gmailValidation = validateGmailField(email)
    if (gmailValidation !== true) {
      toast.error(gmailValidation)
      return
    }

    if (!logoDataUrl) {
      toast.error('Logo is required.')
      return
    }

    if (!trimmedPassword) {
      toast.error('Password is required.')
      return
    }

    const passwordValidation = validatePasswordField(trimmedPassword)
    if (passwordValidation !== true) {
      toast.error(passwordValidation)
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Password and confirm password do not match.')
      return
    }

    try {
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

      if (!result.data?.createCenter?._id) {
        toast.error(result.error?.message ?? 'Failed to create center.')
        return
      }

      await refetchCenters()
      closeModal()
      toast.success('Center created successfully.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create center.',
      )
    }
  }, [
    centerName,
    managerName,
    address,
    phone,
    email,
    password,
    confirmPassword,
    logoDataUrl,
    createCenter,
    refetchCenters,
    closeModal,
    toast,
  ])

  // FIX: uses ref to prevent DataGrid column churn; adds confirmation dialog
  const handleDeleteCenter = useCallback(
    async (id: string) => {
      if (!canDeleteCenter || !id || isDeletingRef.current) return

      const confirmed = window.confirm(
        'Are you sure you want to delete this center? This action cannot be undone.',
      )
      if (!confirmed) return

      isDeletingRef.current = true

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H12',
        location: 'useCenterForm:handleDeleteCenter',
        message: 'Delete center submit snapshot',
        data: { centerId: id, canDeleteCenter },
      })

      try {
        const result = await deleteCenterMutation({ variables: { _id: id } })

        agentLog({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H13',
          location: 'useCenterForm:handleDeleteCenter',
          message: 'Delete center mutation result',
          data: {
            hasDeleteCenterData: Boolean(result.data?.removeCenter),
            hasApolloError: Boolean(result.error),
            apolloErrorMessage: result.error?.message ?? null,
          },
        })

        // FIX: show delete error to user instead of swallowing
        if (!result.data?.removeCenter) {
          toast.error(result.error?.message ?? 'Failed to delete center.')
          return
        }

        await refetchCenters()
        toast.success('Center deleted successfully.')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete center.'
        toast.error(message)
        agentLog({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H14',
          location: 'useCenterForm:handleDeleteCenter',
          message: 'Delete center threw exception',
          data: { errorMessage: message },
        })
      } finally {
        isDeletingRef.current = false
      }
    },
    [canDeleteCenter, deleteCenterMutation, refetchCenters, toast],
  )

  const handleEditCenter = useCallback(
    (row: EditableCenter) => {
      if (!canEditCenter || !row.id) return
      navigate(ROUTES_PATH.addCenter, { state: { mode: 'edit', center: row } })
    },
    [canEditCenter, navigate],
  )

  const handleViewCenter = useCallback(
    (row: EditableCenter) => {
      if (!row.id) return
      navigate(ROUTES_PATH.addCenter, { state: { mode: 'view', center: row } })
    },
    [navigate],
  )

  return {
    // permissions
    canCreateCenter,
    canDeleteCenter,
    canEditCenter,

    // modal state
    isModalOpen,
    isCreatingCenter,

    // form fields
    centerName,
    email,
    logoDataUrl,
    logoFileName,
    phone,
    address,
    managerName,
    password,
    confirmPassword,

    // setters
    setCenterName,
    setEmail,
    setPhone,
    setAddress,
    setManagerName,
    setPassword,
    setConfirmPassword,

    // actions
    openModal,
    closeModal,
    handleLogoFileChange,
    handleCreateCenter,
    handleDeleteCenter,
    handleEditCenter,
    handleViewCenter,
  }
}
