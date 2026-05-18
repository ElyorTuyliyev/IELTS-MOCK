import { useCallback, useState } from 'react'

import type { ExamsViewMode } from '../components/ExamsViewToggle'

const EXAMS_VIEW_MODE_STORAGE_KEY = 'exams-view-mode'

function readStoredExamsViewMode(): ExamsViewMode {
  if (typeof window === 'undefined') {
    return 'card'
  }

  const stored = window.localStorage.getItem(EXAMS_VIEW_MODE_STORAGE_KEY)
  return stored === 'table' ? 'table' : 'card'
}

export function useExamsViewMode() {
  const [viewMode, setViewModeState] = useState<ExamsViewMode>(readStoredExamsViewMode)

  const setViewMode = useCallback((mode: ExamsViewMode) => {
    setViewModeState(mode)
    window.localStorage.setItem(EXAMS_VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  return { viewMode, setViewMode }
}
