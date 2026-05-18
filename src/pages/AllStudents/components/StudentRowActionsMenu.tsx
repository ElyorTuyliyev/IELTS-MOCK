import {
  DeleteActionIcon,
  EditActionIcon,
  MenuAction,
} from '../../../components/common/MenuAction'
import type { StudentGridRow } from '../AllStudentsPage.constants'

type StudentRowActionsMenuProps = {
  row: StudentGridRow
  onDelete?: (row: StudentGridRow) => void
  onEdit?: (row: StudentGridRow) => void
}

export function StudentRowActionsMenu({
  row,
  onDelete,
  onEdit,
}: StudentRowActionsMenuProps) {
  return (
    <MenuAction
      menuId={`student-actions-menu-${row.id}`}
      ariaLabel="Student actions"
      items={[
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
