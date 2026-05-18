export function formatPaymentDate(value: string) {
  return new Date(value).toLocaleString()
}

export function resolveCenterName(
  centers: Array<{ _id: string; name: string }>,
  centerId: string,
) {
  return centers.find((center) => center._id === centerId)?.name ?? centerId
}

export const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
] as const
