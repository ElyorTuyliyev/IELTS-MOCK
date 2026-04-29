export type CenterSummaryItem = {
  label: string
  value: string
}

export function getCenterSummary(centerType: string, roomCount: string, studentCapacity: string) {
  return [
    { label: 'Type', value: centerType },
    { label: 'Rooms planned', value: roomCount || '0' },
    { label: 'Student capacity', value: studentCapacity || '0' },
  ] satisfies CenterSummaryItem[]
}
