import {
  DeleteActionIcon,
  EditActionIcon,
  MenuAction,
} from '../../../components/common/MenuAction'
import type { ExamCard } from '../HomePage.constants'

type ExamRowActionsMenuProps = {
  exam: ExamCard
  className?: string
  onEdit?: (exam: ExamCard) => void
  onDelete?: (exam: ExamCard) => void
}

export function ExamRowActionsMenu({
  exam,
  className = 'exam-card__menu-action',
  onEdit,
  onDelete,
}: ExamRowActionsMenuProps) {
  const items = [
    ...(exam.status !== 'Archived'
      ? [
          {
            id: 'edit',
            label: 'Edit',
            icon: <EditActionIcon />,
            onClick: () => onEdit?.(exam),
          },
        ]
      : []),
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteActionIcon />,
      variant: 'danger' as const,
      onClick: () => onDelete?.(exam),
    },
  ]

  return (
    <MenuAction
      className={className}
      menuId={`exam-actions-menu-${exam.id}`}
      ariaLabel="Exam actions"
      items={items}
    />
  )
}
