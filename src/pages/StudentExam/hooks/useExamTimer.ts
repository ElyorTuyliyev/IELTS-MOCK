import { useEffect, useRef, useState } from 'react'
import { MODULE_DURATION_SECONDS, MODULE_ORDER, type ModuleName } from '../constants'
import type { ModuleDataResult } from './useExamData'

type TimerAutoAdvanceArgs = {
  activeModule: ModuleName
  moduleIndex: number
  moduleData: ModuleDataResult
  finishModalOpen: boolean
  listeningStarted: boolean
  onAdvanceModule: (nextIndex: number) => void
  onFinishExam: () => void
}

export function useExamTimer({
  activeModule,
  moduleIndex,
  moduleData,
  finishModalOpen,
  listeningStarted,
  onAdvanceModule,
  onFinishExam,
}: TimerAutoAdvanceArgs) {
  const moduleDuration =
    activeModule === 'reading'
      ? 60 * 60
      : moduleData.durationByModule[activeModule] ?? MODULE_DURATION_SECONDS[activeModule]

  const [secondsLeft, setSecondsLeft] = useState(moduleDuration)
  const skipAutoAdvanceRef = useRef(true)

  useEffect(() => {
    skipAutoAdvanceRef.current = true
    setSecondsLeft(moduleDuration)
  }, [moduleDuration, activeModule])

  useEffect(() => {
    const shouldRun = activeModule !== 'listening' || listeningStarted
    if (!shouldRun) return

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [activeModule, listeningStarted])

  useEffect(() => {
    if (skipAutoAdvanceRef.current) {
      skipAutoAdvanceRef.current = false
      return
    }
    if (secondsLeft > 0) return

    if (activeModule === 'writing') {
      const speakingIndex = MODULE_ORDER.indexOf('speaking')
      const hasSpeaking = moduleData.grouped.speaking.some((p) => p.questions.length > 0)
      if (speakingIndex >= 0 && hasSpeaking) {
        onAdvanceModule(speakingIndex)
        return
      }
      if (!finishModalOpen) onFinishExam()
      return
    }

    if (activeModule === 'speaking') {
      if (!finishModalOpen) onFinishExam()
      return
    }

    const nextIdx = moduleIndex + 1
    if (nextIdx < MODULE_ORDER.length) {
      onAdvanceModule(nextIdx)
    }
  }, [
    secondsLeft,
    activeModule,
    moduleIndex,
    moduleData.grouped.speaking,
    finishModalOpen,
    onAdvanceModule,
    onFinishExam,
  ])

  return { secondsLeft } as const
}
