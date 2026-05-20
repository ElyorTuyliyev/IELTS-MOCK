import {
  DeleteActionIcon,
  EditActionIcon,
  MenuAction,
} from '../../../../components/common/MenuAction'
import type { EditableCenter } from '@/types/centers'

type CenterRowActionsMenuProps = {
  row: EditableCenter
  canDeleteCenter: boolean
  canEditCenter: boolean
  onDelete: (id: string) => void
  onEdit: (row: EditableCenter) => void
}

export function CenterRowActionsMenu({
  row,
  canDeleteCenter,
  canEditCenter,
  onDelete,
  onEdit,
}: CenterRowActionsMenuProps) {
  return (
    <MenuAction
      menuId={`center-actions-menu-${row.id}`}
      ariaLabel="Center actions"
      items={[
        ...(canEditCenter
          ? [
              {
                id: 'edit',
                label: 'Edit',
                icon: <EditActionIcon />,
                onClick: () => onEdit(row),
              },
            ]
          : []),
        ...(canDeleteCenter
          ? [
              {
                id: 'delete',
                label: 'Delete',
                icon: <DeleteActionIcon />,
                variant: 'danger' as const,
                onClick: () => onDelete(row.id),
              },
            ]
          : []),
      ]}
    />
  )
}
