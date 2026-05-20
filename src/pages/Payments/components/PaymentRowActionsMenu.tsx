import {
  DeleteActionIcon,
  EditActionIcon,
  MenuAction,
} from '../../../components/common/MenuAction'
import type { PaymentRow } from '../pages/PaymentsPage.columns'

type PaymentRowActionsMenuProps = {
  row: PaymentRow
  onEdit: (row: PaymentRow) => void
  onDelete: (row: PaymentRow) => void
}

export function PaymentRowActionsMenu({
  row,
  onEdit,
  onDelete,
}: PaymentRowActionsMenuProps) {
  return (
    <MenuAction
      menuId={`payment-actions-menu-${row._id}`}
      ariaLabel="Payment actions"
      items={[
        {
          id: 'edit',
          label: 'Edit',
          icon: <EditActionIcon />,
          onClick: () => onEdit(row),
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <DeleteActionIcon />,
          variant: 'danger',
          onClick: () => onDelete(row),
        },
      ]}
    />
  )
}
