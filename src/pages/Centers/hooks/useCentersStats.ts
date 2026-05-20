import { useMemo } from 'react'

import type { EditableCenter } from '@/types/centers'

export type CenterStatItem = {
  key: string
  label: string
  value: string
  meta: string
  tone: 'total' | 'credits' | 'active' | 'managers'
}

export function useCentersStats(centers: EditableCenter[]) {
  return useMemo<CenterStatItem[]>(() => {
    const total = centers.length
    const totalCredits = centers.reduce(
      (sum, center) => sum + Math.max(0, center.availableExamCredits ?? 0),
      0,
    )
    const withCredits = centers.filter((center) => (center.availableExamCredits ?? 0) > 0).length
    const withManager = centers.filter(
      (center) => center.manager.trim().length > 0 && center.manager !== 'N/A',
    ).length

    return [
      {
        key: 'total',
        label: 'Total centers',
        value: String(total),
        meta: total === 1 ? '1 branch on the platform' : `${total} branches on the platform`,
        tone: 'total',
      },
      {
        key: 'credits',
        label: 'Exam credits',
        value: String(totalCredits),
        meta: 'Available across all centers',
        tone: 'credits',
      },
      {
        key: 'active',
        label: 'With credits',
        value: String(withCredits),
        meta: withCredits === 0 ? 'No centers have exam credits yet' : 'Centers ready to run exams',
        tone: 'active',
      },
      {
        key: 'managers',
        label: 'Managers assigned',
        value: String(withManager),
        meta:
          withManager === total
            ? 'Every center has a manager'
            : `${total - withManager} center${total - withManager === 1 ? '' : 's'} missing a manager`,
        tone: 'managers',
      },
    ]
  }, [centers])
}
