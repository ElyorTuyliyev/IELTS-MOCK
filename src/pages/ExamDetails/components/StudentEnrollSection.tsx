import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Button } from '../../../components/common/Button'
import { SearchField } from '../../../components/common/SearchField'
import { useToast } from '../../../components/common/Toast'
import { buildPaymentRequestUrl } from '../../../helpers/paymentRequest'
import { formatPriceInSom } from '../../../utils/priceFormat'
import {
  CREATE_STUDENT_EXAM_MUTATION,
  type AssignPaymentStatusOption,
  type CreateStudentExamMutationResponse,
  type CreateStudentExamMutationVariables,
  type User,
} from '../api'

type PendingPaymentLink = {
  studentId: string
  studentLabel: string
  url: string
}

type StudentEnrollSectionProps = {
  examId: string
  examPrice?: number
  isArchived?: boolean
  studentOptions: User[]
  usersLoading: boolean
  usersError?: { message: string } | null
  onEnrolled: () => void
}

function isPaidExamPrice(price: number) {
  return Number(price) > 0
}

export function StudentEnrollSection({
  examId,
  examPrice = 0,
  isArchived = false,
  studentOptions,
  usersLoading,
  usersError,
  onEnrolled,
}: StudentEnrollSectionProps) {
  const toast = useToast()
  const isPaidExam = isPaidExamPrice(examPrice)
  const [open, setOpen] = useState(false)
  const [linksDialogOpen, setLinksDialogOpen] = useState(false)
  const [pendingLinks, setPendingLinks] = useState<PendingPaymentLink[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [createPayment, setCreatePayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<AssignPaymentStatusOption>('pending')

  const studentLabelById = useMemo(() => {
    const map = new Map<string, string>()
    for (const student of studentOptions) {
      map.set(student._id, `${student.firstName} ${student.lastName}`.trim())
    }
    return map
  }, [studentOptions])

  const filteredStudentOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return studentOptions
    return studentOptions.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.trim().toLowerCase()
      return (
        fullName.includes(query) ||
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, studentOptions])

  const [createStudentExam, { loading: creating }] = useMutation<
    CreateStudentExamMutationResponse,
    CreateStudentExamMutationVariables
  >(CREATE_STUDENT_EXAM_MUTATION)

  const closeDialog = useCallback(() => {
    if (creating) return
    setOpen(false)
    setSearchQuery('')
  }, [creating])

  useEffect(() => {
    if (usersError?.message) {
      toast.error(usersError.message)
    }
  }, [usersError, toast])

  useEffect(() => {
    if (!isPaidExam) {
      setCreatePayment(false)
    }
  }, [isPaidExam])

  const handleCopyLink = useCallback(
    async (url: string) => {
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Payment link copied.')
      } catch {
        toast.error('Could not copy link.')
      }
    },
    [toast],
  )

  const handleAssign = useCallback(async () => {
    if (isArchived) {
      toast.warning('Archived exams cannot accept new students.')
      return
    }
    if (selectedStudentIds.length === 0) {
      toast.error('Please select at least one student.')
      return
    }
    if (createPayment && !isPaidExam) {
      toast.error('This exam has no price — payment records cannot be created.')
      return
    }

    try {
      let successCount = 0
      const collectedLinks: PendingPaymentLink[] = []

      for (const studentId of selectedStudentIds) {
        const result = await createStudentExam({
          variables: {
            input: {
              studentId,
              examId,
              isApproved: true,
              ...(createPayment && isPaidExam
                ? {
                    createPayment: true,
                    paymentStatus,
                  }
                : {}),
            },
          },
        })

        if (result.error) {
          continue
        }

        successCount += 1
        const payload = result.data?.createStudentExam
        const path = payload?.paymentRequestUrl
        if (path && paymentStatus === 'pending') {
          const url = buildPaymentRequestUrl(path)
          if (url) {
            collectedLinks.push({
              studentId,
              studentLabel: studentLabelById.get(studentId) ?? 'Student',
              url,
            })
          }
        }
      }

      if (successCount === 0) {
        toast.error('Could not assign students to exam.')
        return
      }

      toast.success(
        successCount === 1
          ? '1 student was assigned to this exam.'
          : `${successCount} students were assigned to this exam.`,
      )

      setSelectedStudentIds([])
      setSearchQuery('')
      setOpen(false)
      onEnrolled()

      if (collectedLinks.length > 0) {
        setPendingLinks(collectedLinks)
        setLinksDialogOpen(true)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not assign students to the exam.')
    }
  }, [
    createPayment,
    createStudentExam,
    examId,
    isArchived,
    isPaidExam,
    onEnrolled,
    paymentStatus,
    selectedStudentIds,
    studentLabelById,
    toast,
  ])

  const allSelected = useMemo(
    () =>
      filteredStudentOptions.length > 0 &&
      filteredStudentOptions.every((student) => selectedStudentIds.includes(student._id)),
    [filteredStudentOptions, selectedStudentIds],
  )

  const someFilteredSelected = useMemo(
    () => filteredStudentOptions.some((student) => selectedStudentIds.includes(student._id)),
    [filteredStudentOptions, selectedStudentIds],
  )

  return (
    <Box className="exam-details__card">
      <Typography className="exam-details__card-title">Assign students to exam</Typography>
      <Typography className="exam-details__card-sub">
        Assign multiple students in one action. Already assigned students are hidden.
      </Typography>

      {isArchived ? (
        <Alert severity="warning">
          This exam is archived. You cannot add new students to archived exams.
        </Alert>
      ) : null}

      <Box className="exam-details__enroll-form">
        <Button
          variant="primary"
          className="exam-details__enroll-btn"
          disabled={isArchived || usersLoading || creating || studentOptions.length === 0}
          onClick={() => {
            setSearchQuery('')
            setOpen(true)
          }}
        >
          {studentOptions.length === 0 ? 'No available students' : 'Assign students'}
        </Button>
      </Box>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Assign students</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 1 }}>
          {isPaidExam ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Exam price: {formatPriceInSom(examPrice)}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createPayment}
                    onChange={(event) => setCreatePayment(event.target.checked)}
                  />
                }
                label="Create payment record for each assigned student"
              />
              {createPayment ? (
                <FormControl sx={{ mt: 1, ml: 0.5 }}>
                  <FormLabel sx={{ fontSize: 13, mb: 0.5 }}>
                    Payment status (applies to all selected students)
                  </FormLabel>
                  <RadioGroup
                    value={paymentStatus}
                    onChange={(event) =>
                      setPaymentStatus(event.target.value as AssignPaymentStatusOption)
                    }
                  >
                    <FormControlLabel
                      value="approved"
                      control={<Radio size="small" />}
                      label="Approved — payment recorded as confirmed"
                    />
                    <FormControlLabel
                      value="pending"
                      control={<Radio size="small" />}
                      label="Pending — student receives a shareable payment link"
                    />
                  </RadioGroup>
                </FormControl>
              ) : null}
            </Box>
          ) : null}

          <SearchField
            fullWidth
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <FormControlLabel
            sx={{ m: 0, width: '100%' }}
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someFilteredSelected}
                disabled={filteredStudentOptions.length === 0}
                onChange={(event) => {
                  const filteredIds = filteredStudentOptions.map((s) => s._id)
                  setSelectedStudentIds((prev) => {
                    if (event.target.checked) {
                      return [...new Set([...prev, ...filteredIds])]
                    }
                    const filteredSet = new Set(filteredIds)
                    return prev.filter((id) => !filteredSet.has(id))
                  })
                }}
              />
            }
            label={searchQuery.trim() ? 'Select all shown' : 'Select all'}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              maxHeight: 320,
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {filteredStudentOptions.length === 0 ? (
              <Typography sx={{ fontSize: 14, color: 'text.secondary', py: 1 }}>
                {studentOptions.length === 0
                  ? 'No students available.'
                  : 'No students match your search.'}
              </Typography>
            ) : (
              filteredStudentOptions.map((student) => {
                const checked = selectedStudentIds.includes(student._id)
                return (
                  <FormControlLabel
                    key={student._id}
                    sx={{ m: 0, width: '100%', display: 'flex' }}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) =>
                          setSelectedStudentIds((prev) =>
                            event.target.checked
                              ? [...prev, student._id]
                              : prev.filter((id) => id !== student._id),
                          )
                        }
                      />
                    }
                    label={`${student.firstName} ${student.lastName}`.trim()}
                  />
                )
              })
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" disabled={creating} onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={creating || selectedStudentIds.length === 0}
            onClick={() => void handleAssign()}
          >
            {creating ? 'Assigning...' : 'Assign selected'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={linksDialogOpen}
        onClose={() => setLinksDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Shareable payment links</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 1 }}>
          <Alert severity="info">
            Send each student their link so they can view payment instructions and submit proof.
          </Alert>
          {pendingLinks.map((link) => (
            <Box key={link.studentId} sx={{ display: 'grid', gap: 0.5 }}>
              <Typography variant="subtitle2">{link.studentLabel}</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    wordBreak: 'break-all',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    fontFamily: 'monospace',
                    fontSize: 12,
                  }}
                >
                  {link.url}
                </Typography>
                <IconButton
                  aria-label={`Copy payment link for ${link.studentLabel}`}
                  onClick={() => void handleCopyLink(link.url)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="primary" onClick={() => setLinksDialogOpen(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
