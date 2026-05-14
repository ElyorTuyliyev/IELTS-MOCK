import {
  DeleteActionIcon,
  EditActionIcon,
  MenuAction,
  ViewActionIcon,
} from '../../../components/common/MenuAction'
import type { QuestionGridRow } from '../QuestionsPage.constants'

type QuestionRowActionsMenuProps = {
  row: QuestionGridRow
  onDelete?: (row: QuestionGridRow) => void
  onEdit?: (row: QuestionGridRow) => void
  onView?: (row: QuestionGridRow) => void
}

export function QuestionRowActionsMenu({
  row,
  onDelete,
  onEdit,
  onView,
}: QuestionRowActionsMenuProps) {
  return (
    <MenuAction
      menuId={`question-actions-menu-${row.id}`}
      ariaLabel="Question actions"
      items={[
        {
          id: 'view',
          label: 'View',
          icon: <ViewActionIcon />,
          onClick: () => onView?.(row),
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: <EditActionIcon />,
          onClick: () => onEdit?.(row),
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <DeleteActionIcon />,
          variant: 'danger',
          onClick: () => onDelete?.(row),
        },
      ]}
    />
  )
}
