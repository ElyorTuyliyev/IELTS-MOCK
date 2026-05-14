import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Alert, Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import { MenuItem, Select } from '../../../components/common/Select'
import { useToast } from '../../../components/common/Toast'
import {
  CREATE_STUDENT_EXAM_MUTATION,
  type CreateStudentExamMutationResponse,
  type CreateStudentExamMutationVariables,
  type User,
} from '../api'

type StudentEnrollSectionProps = {
  examId: string
  isArchived?: boolean
  studentOptions: User[]
  usersLoading: boolean
  usersError?: { message: string } | null
  onEnrolled: () => void
}

export function StudentEnrollSection({
  examId,
  isArchived = false,
  studentOptions,
  usersLoading,
  usersError,
  onEnrolled,
}: StudentEnrollSectionProps) {
  const toast = useToast()
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const [createStudentExam, { loading: creating }] = useMutation<
    CreateStudentExamMutationResponse,
    CreateStudentExamMutationVariables
  >(CREATE_STUDENT_EXAM_MUTATION)

  useEffect(() => {
    if (usersError?.message) {
      toast.error(usersError.message)
    }
  }, [usersError, toast])

  const handleAssign = useCallback(async () => {
    if (isArchived) {
      toast.warning('Archived exams cannot accept new students.')
      return
    }
    if (!selectedStudentId) {
      toast.error('Please select a student.')
      return
    }
    try {
      const result = await createStudentExam({
        variables: {
          input: {
            studentId: selectedStudentId,
            examId,
          },
        },
      })
      if (result.error) {
        toast.error(result.error.message ?? 'Could not add student.')
        return
      }
      toast.success('Student was added to this exam successfully.')
      setSelectedStudentId('')
      onEnrolled()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not add student to the exam.')
    }
  }, [isArchived, selectedStudentId, examId, createStudentExam, onEnrolled, toast])

  return (
    <Box className="exam-details__card">
      <Typography className="exam-details__card-title">Add students to exam</Typography>
      <Typography className="exam-details__card-sub">
        Select a student linked to your center and add them to this exam.
      </Typography>

      {isArchived ? (
        <Alert severity="warning">
          This exam is archived. You cannot add new students to archived exams.
        </Alert>
      ) : null}

      <Box className="exam-details__enroll-form">
        <Select
          label="Student"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="exam-details__enroll-select"
          disabled={isArchived || usersLoading || creating}
        >
          <MenuItem value="">Select student</MenuItem>
          {studentOptions.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {`${s.firstName} ${s.lastName}`.trim()}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="primary"
          className="exam-details__enroll-btn"
          disabled={isArchived || usersLoading || creating || !selectedStudentId}
          onClick={() => void handleAssign()}
        >
          {creating ? 'Adding...' : 'Add to exam'}
        </Button>
      </Box>
    </Box>
  )
}
