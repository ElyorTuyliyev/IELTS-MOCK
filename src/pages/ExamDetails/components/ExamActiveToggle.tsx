import { useCallback, useMemo } from 'react'
import { useMutation } from '@apollo/client/react'
import { Box, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material'
import { useToast } from '../../../components/common/Toast'
import { tryGetGraphQLErrorMessage } from '../../../helpers'
import { SET_EXAM_ACTIVE_MUTATION } from '../../CreateExam/api/setExamActiveMutation'
import { c } from '../../../theme'
import { buildDeactivateBlockedMessage } from '../utils/examEnrollmentUtils'

type ExamActiveToggleProps = {
  examId: string
  isStoredActive: boolean
  isArchived: boolean
  inProgressCount: number
  inProgressStudentNames?: string[]
  canManage: boolean
  onChanged?: () => void
}

export function ExamActiveToggle({
  examId,
  isStoredActive,
  isArchived,
  inProgressCount,
  inProgressStudentNames = [],
  canManage,
  onChanged,
}: ExamActiveToggleProps) {
  const toast = useToast()
  const [setExamActive, { loading }] = useMutation(SET_EXAM_ACTIVE_MUTATION, {
    refetchQueries: ['FindAllExams'],
  })

  const blockDeactivate = isStoredActive && inProgressCount > 0

  const deactivateBlockedMessage = useMemo(
    () => (blockDeactivate ? buildDeactivateBlockedMessage(inProgressStudentNames) : ''),
    [blockDeactivate, inProgressStudentNames],
  )

  const handleToggle = useCallback(
    async (nextActive: boolean) => {
      if (!canManage || isArchived || loading) {
        return
      }

      if (!nextActive && blockDeactivate) {
        toast.error(deactivateBlockedMessage)
        return
      }

      try {
        const res = await setExamActive({
          variables: { _id: examId, isActive: nextActive },
        })
        if (res.error) {
          toast.error(tryGetGraphQLErrorMessage(res.error) ?? 'Failed to update exam status.')
          return
        }
        toast.success(nextActive ? 'Exam activated.' : 'Exam deactivated.')
        onChanged?.()
      } catch (error: unknown) {
        toast.error(
          tryGetGraphQLErrorMessage(error) ??
            (error instanceof Error ? error.message : 'Failed to update exam status.'),
        )
      }
    },
    [
      blockDeactivate,
      canManage,
      deactivateBlockedMessage,
      examId,
      isArchived,
      loading,
      onChanged,
      setExamActive,
      toast,
    ],
  )

  if (!canManage || isArchived) {
    return null
  }

  const switchControl = (
    <FormControlLabel
      className="exam-details__active-toggle"
      control={
        <Switch
          checked={isStoredActive}
          disabled={loading || blockDeactivate}
          onChange={(event) => void handleToggle(event.target.checked)}
          color="primary"
        />
      }
      label={isStoredActive ? 'Exam active' : 'Exam inactive'}
    />
  )

  return (
    <Box
      className="exam-details__active-toggle-wrap"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: `1px solid ${c.border.default}`,
        background: c.surface.muted,
      }}
    >
      {blockDeactivate ? (
        <Tooltip title={deactivateBlockedMessage} placement="top">
          <span>{switchControl}</span>
        </Tooltip>
      ) : (
        switchControl
      )}
      {blockDeactivate ? (
        <Typography className="exam-details__active-toggle-hint" variant="caption" color="warning.main">
          {deactivateBlockedMessage}
        </Typography>
      ) : null}
    </Box>
  )
}
