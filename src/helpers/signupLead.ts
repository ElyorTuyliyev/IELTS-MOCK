export function formatSignupLeadStatus(status: string): string {
  if (status === 'pending') return 'Pending'
  if (status === 'accepted') return 'Accepted'
  if (status === 'rejected') return 'Rejected'
  return status
}
