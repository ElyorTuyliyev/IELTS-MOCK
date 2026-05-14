import { useCallback, useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { useToast } from '../../../components/common/Toast'
import { normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { agentLog } from '../../../utils/agentLog'
import { isValidEmail, normalizeEmail } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { CREATE_ADMIN_MUTATION } from '../api/createAdminMutation'
import type {
  CreateAdminMutationResponse,
  CreateAdminMutationVariables,
  ManagedAdmin,
} from '@/types/admin'

type UseAdminFormParams = {
  admins: ManagedAdmin[]
  refetchUsers: () => Promise<unknown>
}

export function useAdminForm({ admins, refetchUsers }: UseAdminFormParams) {
  const toast = useToast()
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [centerName, setCenterName] = useState('')
  const [centerAddress, setCenterAddress] = useState('')
  const [centerPhone, setCenterPhone] = useState('')
  const [centerLogo, setCenterLogo] = useState('')
  const [centerEstablishedAt, setCenterEstablishedAt] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [createAdmin, { loading: isCreatingAdmin }] = useMutation<
    CreateAdminMutationResponse,
    CreateAdminMutationVariables
  >(CREATE_ADMIN_MUTATION)

  const resetAdminForm = useCallback(() => {
    setFullName('')
    setEmail('')
    setPhone('')
    setCenterName('')
    setCenterAddress('')
    setCenterPhone('')
    setCenterLogo('')
    setCenterEstablishedAt('')
    setPassword('')
    setConfirmPassword('')
  }, [])

  const openAddAdminModal = useCallback(() => {
    setIsAddAdminOpen(true)
  }, [])

  const closeAddAdminModal = useCallback(() => {
    setIsAddAdminOpen(false)
    resetAdminForm()
  }, [resetAdminForm])

  const handleAddAdmin = useCallback(async () => {
    const trimmedName = fullName.trim()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizeUzPhoneDigits(phone)
    const normalizedCenterName = centerName.trim()
    const normalizedCenterAddress = centerAddress.trim()
    const normalizedCenterPhone = normalizeUzPhoneDigits(centerPhone)
    const normalizedCenterLogo = centerLogo.trim()
    const normalizedCenterEstablishedAt = centerEstablishedAt.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (
      !trimmedName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !trimmedPassword ||
      !trimmedConfirmPassword ||
      !normalizedCenterName ||
      !normalizedCenterAddress ||
      !normalizedCenterPhone
    ) {
      toast.error('User and center details must be fully filled in to add an admin.')
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      toast.error('Enter a valid email address.')
      return
    }

    if (admins.some((admin) => admin.email.toLowerCase() === normalizedEmail)) {
      toast.error('An admin with this email already exists.')
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

    const [firstNameRaw, ...lastNameParts] = trimmedName.split(' ')
    const firstName = firstNameRaw?.trim() || trimmedName
    const lastName = lastNameParts.join(' ').trim() || '-'

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'useAdminForm:handleAddAdmin',
      message: 'Create admin submit payload snapshot',
      data: {
        fullNameLength: trimmedName.length,
        emailLength: normalizedEmail.length,
        phoneLength: normalizedPhone.length,
        centerNameLength: normalizedCenterName.length,
        centerAddressLength: normalizedCenterAddress.length,
        centerPhoneLength: normalizedCenterPhone.length,
        passwordLength: trimmedPassword.length,
      },
    })

    try {
      const result = await createAdmin({
        variables: {
          firstName,
          lastName,
          email: normalizedEmail,
          ...(normalizedPhone ? { phone: normalizedPhone } : {}),
          password: trimmedPassword,
          centerName: normalizedCenterName,
          centerAddress: normalizedCenterAddress,
          centerPhone: normalizedCenterPhone,
          ...(normalizedCenterLogo ? { centerLogo: normalizedCenterLogo } : {}),
          ...(normalizedCenterEstablishedAt
            ? { centerEstablishedAt: normalizedCenterEstablishedAt }
            : {}),
        },
      })

      const createdAdmin = result.data?.createAdmin ?? null
      const apolloErrorMessage = result.error?.message ?? null

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'useAdminForm:handleAddAdmin',
        message: 'Create admin mutation result snapshot',
        data: {
          hasCreateUserData: Boolean(createdAdmin),
          createdAdminId: createdAdmin?._id ?? null,
          linkedCenterId: createdAdmin?.centerId ?? null,
          hasApolloError: Boolean(result.error),
          apolloErrorMessage,
        },
      })

      if (!createdAdmin?._id) {
        toast.error(apolloErrorMessage ?? 'Failed to create admin.')
        return
      }

      await refetchUsers()

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'useAdminForm:handleAddAdmin',
        message: 'Admin created and inserted into local grid',
        data: {
          localAdminsCountAfterInsert: admins.length,
        },
      })

      closeAddAdminModal()
      toast.success('Admin created successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error while creating admin.')
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'useAdminForm:handleAddAdmin',
        message: 'Create admin mutation threw exception',
        data: {
          errorMessage: error instanceof Error ? error.message : 'unknown-error',
        },
      })
    }
  }, [
    fullName,
    email,
    phone,
    centerName,
    centerAddress,
    centerPhone,
    centerLogo,
    centerEstablishedAt,
    password,
    confirmPassword,
    admins,
    createAdmin,
    refetchUsers,
    closeAddAdminModal,
    toast,
  ])

  return {
    isAddAdminOpen,
    isCreatingAdmin,
    fullName,
    email,
    phone,
    centerName,
    centerAddress,
    centerPhone,
    centerLogo,
    centerEstablishedAt,
    password,
    confirmPassword,
    setFullName,
    setEmail,
    setPhone,
    setCenterName,
    setCenterAddress,
    setCenterPhone,
    setCenterLogo,
    setCenterEstablishedAt,
    setPassword,
    setConfirmPassword,
    openAddAdminModal,
    closeAddAdminModal,
    handleAddAdmin,
  }
}
