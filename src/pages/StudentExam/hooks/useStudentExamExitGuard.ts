import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES_PATH } from '../../../routes/paths'

type UseStudentExamExitGuardOptions = {
  enabled: boolean
  exitPath?: string
}

export function useStudentExamExitGuard({
  enabled,
  exitPath = ROUTES_PATH.dashboard,
}: UseStudentExamExitGuardOptions) {
  const navigate = useNavigate()
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const allowLeaveRef = useRef(false)
  const historyTrapActiveRef = useRef(false)

  const confirmLeave = useCallback(() => {
    allowLeaveRef.current = true
    setExitDialogOpen(false)
    navigate(exitPath)
  }, [exitPath, navigate])

  const stayOnExam = useCallback(() => {
    setExitDialogOpen(false)
    if (historyTrapActiveRef.current) {
      window.history.pushState({ examGuard: true }, '', window.location.href)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      historyTrapActiveRef.current = false
      return
    }

    allowLeaveRef.current = false

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      historyTrapActiveRef.current = false
      return
    }

    window.history.pushState({ examGuard: true }, '', window.location.href)
    historyTrapActiveRef.current = true

    const onPopState = () => {
      if (allowLeaveRef.current) return
      window.history.pushState({ examGuard: true }, '', window.location.href)
      setExitDialogOpen(true)
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      historyTrapActiveRef.current = false
    }
  }, [enabled])

  return {
    exitDialogOpen,
    stayOnExam,
    confirmLeave,
    requestExit: () => setExitDialogOpen(true),
  }
}
