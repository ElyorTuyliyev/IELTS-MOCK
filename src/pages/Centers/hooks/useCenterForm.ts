import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { useMutation } from '@apollo/client/react'

import { useToast } from '../../../components/common/Toast'
import { normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { normalizeEmail, validateGmailField } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { agentLog } from '../../../utils/agentLog'
import { CREATE_CENTER_MUTATION } from '../../AddCenter/api/createCenterMutation'
import { UPDATE_CENTER_MUTATION } from '../../AddCenter/api/updateCenterMutation'
import { REMOVE_CENTER_MUTATION } from '../api/deleteCenterMutation'
import type {
  CreateCenterMutationResponse,
  CreateCenterMutationVariables,
  DeleteCenterMutationResponse,
  DeleteCenterMutationVariables,
  EditableCenter,
  UpdateCenterMutationResponse,
  UpdateCenterMutationVariables,
} from '@/types/centers'

export type CenterModalMode = 'create' | 'edit'

type UseCenterFormParams = {
  refetchCenters: () => Promise<unknown>
}

export function useCenterForm({ refetchCenters }: UseCenterFormParams) {
  const toast = useToast()
  const role = useAppSelector(selectUserRole)
  const canCreateCenter = role === USER_ROLES.superAdmin
  const canDeleteCenter = role === USER_ROLES.superAdmin
  const canEditCenter = role === USER_ROLES.superAdmin

  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)

  const [updateCenter, { loading: isUpdatingCenter }] = useMutation<
    UpdateCenterMutationResponse,
    UpdateCenterMutationVariables
  >(UPDATE_CENTER_MUTATION)

  const [deleteCenterMutation] = useMutation<
    DeleteCenterMutationResponse,
    DeleteCenterMutationVariables
  >(REMOVE_CENTER_MUTATION)

  const isDeletingRef = useRef(false)

  const [modalMode, setModalMode] = useState<CenterModalMode | null>(null)
  const [editingCenterId, setEditingCenterId] = useState('')
  const [centerName, setCenterName] = useState('')
  const [email, setEmail] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [hasNewLogoUpload, setHasNewLogoUpload] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [managerName, setManagerName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isModalOpen = modalMode !== null
  const isEditMode = modalMode === 'edit'
  const isSaving = isCreatingCenter || isUpdatingCenter

  const resetForm = useCallback(() => {
    setEditingCenterId('')
    setCenterName('')
    setEmail('')
    setLogoDataUrl('')
    setLogoFileName('')
    setHasNewLogoUpload(false)
    setPhone('')
    setAddress('')
    setManagerName('')
    setPassword('')
    setConfirmPassword('')
  }, [])

  const closeModal = useCallback(() => {
    setModalMode(null)
    resetForm()
  }, [resetForm])

  const openModalForCreate = useCallback(() => {
    resetForm()
    setModalMode('create')
  }, [resetForm])

  const populateFormFromCenter = useCallback((row: EditableCenter) => {
    setEditingCenterId(row.id)
    setCenterName(row.name ?? '')
    setManagerName(row.manager ?? '')
    setAddress(row.address ?? '')
    setPhone(row.phone ?? '')
    setEmail(row.email ?? '')
    setLogoDataUrl(row.logo ?? '')
    setLogoFileName(row.logo ? 'existing-logo' : '')
    setHasNewLogoUpload(false)
    setPassword('')
    setConfirmPassword('')
  }, [])

  const handleAddCenter = useCallback(() => {
    if (!canCreateCenter) return
    openModalForCreate()
  }, [canCreateCenter, openModalForCreate])

  const handleEditCenter = useCallback(
    (row: EditableCenter) => {
      if (!canEditCenter || !row.id) return
      populateFormFromCenter(row)
      setModalMode('edit')
    },
    [canEditCenter, populateFormFromCenter],
  )

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
    if (!modalMode) {
      return
    }

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

    if (!isEditMode && !logoDataUrl) {
      toast.error('Logo is required.')
      return
    }

    if (!isEditMode && !trimmedPassword) {
      toast.error('Password is required.')
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
      let mutationCenter: { _id: string } | null = null
      let apolloErrorMessage: string | null = null

      if (isEditMode) {
        const result = await updateCenter({
          variables: {
            _id: editingCenterId,
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

      await refetchCenters()
      closeModal()
      toast.success(isEditMode ? 'Center updated successfully.' : 'Center created successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save center.')
    }
  }, [
    modalMode,
    centerName,
    managerName,
    address,
    phone,
    email,
    password,
    confirmPassword,
    logoDataUrl,
    isEditMode,
    editingCenterId,
    hasNewLogoUpload,
    updateCenter,
    createCenter,
    refetchCenters,
    closeModal,
    toast,
  ])

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

  return {
    canCreateCenter,
    canDeleteCenter,
    canEditCenter,
    isModalOpen,
    modalMode,
    isSaving,
    centerName,
    email,
    logoDataUrl,
    logoFileName,
    phone,
    address,
    managerName,
    password,
    confirmPassword,
    setCenterName,
    setEmail,
    setPhone,
    setAddress,
    setManagerName,
    setPassword,
    setConfirmPassword,
    handleAddCenter,
    handleDeleteCenter,
    handleEditCenter,
    handleLogoFileChange,
    handleSaveCenter,
    closeModal,
  }
}
