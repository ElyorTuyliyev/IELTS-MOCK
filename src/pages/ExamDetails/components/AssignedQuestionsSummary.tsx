import { Box, Typography } from '@mui/material'
import type { ExamQuestionGroup } from '../utils/examQuestionGroups'
import { formatAssignedGroupsDetail } from '../utils/examQuestionGroups'

type AssignedQuestionsSummaryProps = {
  groups: ExamQuestionGroup[]
}

export function AssignedQuestionsSummary({ groups }: AssignedQuestionsSummaryProps) {
  if (groups.length === 0) {
    return (
      <Typography className="aq__assigned-empty">No questions assigned yet.</Typography>
    )
  }

  const lines = formatAssignedGroupsDetail(groups)

  return (
    <Box className="aq__assigned-list">
      {lines.map((line) => (
        <Typography key={line} className="aq__assigned-list-row">
          {line}
        </Typography>
      ))}
    </Box>
  )
}
