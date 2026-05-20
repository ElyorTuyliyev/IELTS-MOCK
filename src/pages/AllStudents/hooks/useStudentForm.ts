import { useCallback, useState, type ChangeEvent } from 'react'
import { useMutation } from '@apollo/client/react'

import { useToast } from '../../../components/common/Toast'
import { normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { agentLog } from '../../../utils/agentLog'
import { selectAuthToken, selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { resolveCenterLogoUrl } from '../../Certificates/utils/resolveCenterLogoUrl'
import { CREATE_STUDENT_MUTATION } from '../api/createStudentMutation'
import { DELETE_STUDENT_MUTATION } from '../api/deleteStudentMutation'
import { UPDATE_STUDENT_MUTATION } from '../api/updateStudentMutation'
import type { StudentRow } from '../AllStudentsPage.constants'
import type {
  CreateStudentMutationResponse,
  CreateStudentMutationVariables,
  DeleteStudentMutationResponse,
  DeleteStudentMutationVariables,
  FindAllUsersQueryResponse,
  UpdateStudentMutationResponse,
  UpdateStudentMutationVariables,
} from '@/types/allStudents'
import { normalizeEmail, validateGmailField } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { decodeJwtPayload, OBJECT_ID_PATTERN, safeDateToIso } from '../utils'

type UseStudentFormParams = {
  usersData: FindAllUsersQueryResponse | undefined
  refetchUsers: () => Promise<unknown>
}

export type StudentFormFields = {
  firstName: string
  lastName: string
  email: string
  birthday: string
  gender: string
  phone: string
  password: string
}

export function useStudentForm({ usersData, refetchUsers }: UseStudentFormParams) {
  const toast = useToast()
  const authToken = useAppSelector(selectAuthToken)
  const currentRole = useAppSelector(selectUserRole)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<StudentRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState('')
  const [photoFileName, setPhotoFileName] = useState('')
  const [hasNewPhotoUpload, setHasNewPhotoUpload] = useState(false)

  const [createStudent, { loading: isCreating }] = useMutation<
    CreateStudentMutationResponse,
    CreateStudentMutationVariables
  >(CREATE_STUDENT_MUTATION)

  const [updateStudent, { loading: isUpdating }] = useMutation<
    UpdateStudentMutationResponse,
    UpdateStudentMutationVariables
  >(UPDATE_STUDENT_MUTATION)

  const [deleteStudent] = useMutation<
    DeleteStudentMutationResponse,
    DeleteStudentMutationVariables
  >(DELETE_STUDENT_MUTATION)

  const handleDelete = useCallback((row: StudentRow) => {
    if (!row.userId) return
    setPendingDelete(row)
  }, [])

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!deleteLoading) setPendingDelete(null)
  }, [deleteLoading])

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete?.userId) return

    setDeleteLoading(true)

    try {
      const result = await deleteStudent({ variables: { _id: pendingDelete.userId } })
      if (!result.data?.removeUser) {
        toast.error(result.error?.message ?? 'Could not delete student.')
        return
      }
      setPendingDelete(null)
      await refetchUsers()
      toast.success('Student deleted successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete student.')
    } finally {
      setDeleteLoading(false)
    }
  }, [pendingDelete, deleteStudent, refetchUsers, toast])

  const resetForm = useCallback(() => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setBirthday('')
    setGender('')
    setPhone('')
    setPassword('')
    setPhotoDataUrl('')
    setPhotoFileName('')
    setHasNewPhotoUpload(false)
    setEditingStudentId(null)
  }, [])

  const openCreateModal = useCallback(() => {
    resetForm()
    setIsModalOpen(true)
  }, [resetForm])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    resetForm()
  }, [resetForm])

  const openEditModal = useCallback(
    (row: StudentRow) => {
      const sourceUser = (usersData?.findAllUsers ?? []).find((u) => u._id === row.userId)
      const [firstNameRaw, ...lastNameParts] = row.name.split(/\s+/).filter(Boolean)
      setFirstName(firstNameRaw ?? '')
      setLastName(lastNameParts.join(' '))
      setEmail(row.email === '-' ? '' : row.email)
      setBirthday(sourceUser?.birthday ? sourceUser.birthday.slice(0, 10) : '')
      setGender(sourceUser?.gender ?? '')
      setPhone(sourceUser?.phone ?? '')
      setPassword('')
      const existingPhoto = resolveCenterLogoUrl(sourceUser?.profilePhoto) ?? sourceUser?.profilePhoto ?? ''
      setPhotoDataUrl(existingPhoto)
      setPhotoFileName(sourceUser?.profilePhoto ? 'existing-photo' : '')
      setHasNewPhotoUpload(false)
      setEditingStudentId(row.userId)
      setIsModalOpen(true)
    },
    [usersData],
  )

  const handlePhotoFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null
      if (!selectedFile) {
        setPhotoDataUrl('')
        setPhotoFileName('')
        setHasNewPhotoUpload(false)
        return
      }

      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Select an image file for the profile photo (png, jpg, webp...).')
        setPhotoDataUrl('')
        setPhotoFileName('')
        setHasNewPhotoUpload(false)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : ''
        setPhotoDataUrl(result)
        setPhotoFileName(selectedFile.name)
        setHasNewPhotoUpload(true)
      }
      reader.readAsDataURL(selectedFile)
    },
    [toast],
  )

  const handleSave = useCallback(async () => {
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const normalizedEmail = normalizeEmail(email)
    const normalizedGender = gender.trim().toLowerCase()
    const normalizedPhone = normalizeUzPhoneDigits(phone)
    const trimmedPassword = password.trim()

    // FIX: safeDateToIso handles invalid date strings without throwing
    const normalizedBirthdayIso = safeDateToIso(birthday)

    const tokenPayload = decodeJwtPayload(authToken)
    const centerIdFromToken = [
      tokenPayload?.centerId,
      tokenPayload?.center_id,
      tokenPayload?.['center'] && typeof tokenPayload.center === 'object'
        ? (tokenPayload.center as Record<string, unknown>)?._id
        : null,
    ]
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .find((v) => OBJECT_ID_PATTERN.test(v))

    const normalizedCenterId = currentRole === USER_ROLES.center ? centerIdFromToken ?? '' : ''

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !normalizedEmail ||
      (!editingStudentId && !trimmedPassword)
    ) {
      toast.error(
        editingStudentId
          ? 'First name, last name, and Gmail are required to update a student.'
          : 'First name, last name, Gmail, and password are required to create a student.',
      )
      return
    }

    const gmailValidation = validateGmailField(email)
    if (gmailValidation !== true) {
      toast.error(gmailValidation)
      return
    }

    if (trimmedPassword) {
      const passwordValidation = validatePasswordField(trimmedPassword)
      if (passwordValidation !== true) {
        toast.error(passwordValidation)
        return
      }
    }

    if (currentRole === USER_ROLES.center && !normalizedCenterId) {
      toast.error('Center profile not found. Please sign in again and retry.')
      return
    }

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'useStudentForm:handleSave',
      message: editingStudentId ? 'Update student payload' : 'Create student payload',
      data: {
        firstNameLength: trimmedFirstName.length,
        lastNameLength: trimmedLastName.length,
        emailLength: normalizedEmail.length,
        hasGender: Boolean(normalizedGender),
        phoneLength: normalizedPhone.length,
        passwordLength: trimmedPassword.length,
        centerIdFromToken: centerIdFromToken ?? null,
        hasValidCenterId: Boolean(normalizedCenterId),
        currentRole,
      },
    })

    try {
      const result = editingStudentId
        ? await updateStudent({
            variables: {
              _id: editingStudentId,
              firstName: trimmedFirstName,
              lastName: trimmedLastName,
              email: normalizedEmail,
              ...(normalizedBirthdayIso ? { birthday: normalizedBirthdayIso } : {}),
              ...(normalizedGender ? { gender: normalizedGender } : {}),
              ...(hasNewPhotoUpload && photoDataUrl ? { profilePhoto: photoDataUrl } : {}),
              ...(trimmedPassword ? { password: trimmedPassword } : {}),
              ...(normalizedPhone ? { phone: normalizedPhone } : {}),
              ...(normalizedCenterId ? { centerId: normalizedCenterId } : {}),
              role: 'student',
            },
          })
        : await createStudent({
            variables: {
              firstName: trimmedFirstName,
              lastName: trimmedLastName,
              email: normalizedEmail,
              ...(normalizedBirthdayIso ? { birthday: normalizedBirthdayIso } : {}),
              ...(normalizedGender ? { gender: normalizedGender } : {}),
              ...(photoDataUrl ? { profilePhoto: photoDataUrl } : {}),
              password: trimmedPassword,
              ...(normalizedPhone ? { phone: normalizedPhone } : {}),
              ...(normalizedCenterId ? { centerId: normalizedCenterId } : {}),
            },
          })

      const saved = editingStudentId
        ? (result.data as UpdateStudentMutationResponse | null)?.updateUser ?? null
        : (result.data as CreateStudentMutationResponse | null)?.createUser ?? null
      const apolloError = result.error?.message ?? null

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'useStudentForm:handleSave',
        message: editingStudentId ? 'Update result' : 'Create result',
        data: {
          hasData: Boolean(saved),
          savedId: saved?._id ?? null,
          hasApolloError: Boolean(result.error),
          apolloError,
        },
      })

      if (!saved?._id) {
        toast.error(
          apolloError ??
            (editingStudentId
              ? 'Failed to update student.'
              : 'Failed to create student.'),
        )
        return
      }

      await refetchUsers()
      closeModal()
      toast.success(editingStudentId ? 'Student updated successfully.' : 'Student created successfully.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : editingStudentId
            ? 'Unexpected error while updating student.'
            : 'Unexpected error while creating student.',
      )
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'useStudentForm:handleSave',
        message: editingStudentId ? 'Update threw exception' : 'Create threw exception',
        data: { errorMessage: error instanceof Error ? error.message : 'unknown-error' },
      })
    }
  }, [
    firstName,
    lastName,
    email,
    birthday,
    gender,
    phone,
    password,
    photoDataUrl,
    hasNewPhotoUpload,
    authToken,
    currentRole,
    editingStudentId,
    updateStudent,
    createStudent,
    refetchUsers,
    closeModal,
    toast,
  ])

  return {
    // modal state
    isModalOpen,
    editingStudentId,
    pendingDelete,
    deleteLoading,
    isBusy: isCreating || isUpdating,

    // form fields
    firstName,
    lastName,
    email: email,
    birthday,
    gender,
    phone,
    password,
    photoDataUrl,
    photoFileName,

    // field setters
    setFirstName,
    setLastName,
    setEmail,
    setBirthday,
    setGender,
    setPhone,
    setPassword,
    handlePhotoFileChange,

    // actions
    openCreateModal,
    closeModal,
    openEditModal,
    handleDelete,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
    handleSave,
  }
}
