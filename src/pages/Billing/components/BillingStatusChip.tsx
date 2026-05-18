import { Chip, type ChipProps } from '@mui/material'

const STATUS_CONFIG: Record<
  string,
  { label: string; color: NonNullable<ChipProps['color']> }
> = {
  awaiting_approval: { label: 'Awaiting approval', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  completed: { label: 'Completed', color: 'success' },
}

function normalizeStatus(status?: string, recordType?: string) {
  const trimmed = status?.trim().toLowerCase()
  if (trimmed) return trimmed
  return recordType === 'payment' ? 'completed' : 'completed'
}

export function getBillingStatusChipProps(
  status?: string,
  options?: { recordType?: string },
): { label: string; color: NonNullable<ChipProps['color']> } {
  const normalized = normalizeStatus(status, options?.recordType)
  const config = STATUS_CONFIG[normalized]
  if (config) return config
  return {
    label: normalized.replace(/_/g, ' '),
    color: 'default',
  }
}

type BillingStatusChipProps = {
  status?: string
  recordType?: string
  size?: ChipProps['size']
} & Omit<ChipProps, 'label' | 'color' | 'size'>

export function BillingStatusChip({
  status,
  recordType,
  size = 'small',
  sx,
  ...rest
}: BillingStatusChipProps) {
  const { label, color } = getBillingStatusChipProps(status, { recordType })

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
      sx={{
        fontWeight: 600,
        borderRadius: '999px',
        ...sx,
      }}
      {...rest}
    />
  )
}
