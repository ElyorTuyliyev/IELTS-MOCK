import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, IconButton, Typography } from '@mui/material'
import { ROUTES_PATH } from '../../../routes/paths'
import { selectUserName } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { StudentExamPlayerRoot } from './StudentExamPlayerPage.style'
import { FIND_ALL_EXAMS_QUERY } from '../../CreateExam/api/findAllExamsQuery'
import { MODULE_DURATION_SECONDS, MODULE_ORDER, type ModuleName } from '../constants'
import { collectAnsweredQuestionIds, formatRemainingTime } from '../utils'
import {
  COMPLETE_MY_STUDENT_EXAM_MUTATION,
  SUBMIT_MY_STUDENT_EXAM_MUTATION,
  type CompleteMyStudentExamResponse,
  type SubmitMyStudentExamResponse,
} from '../api/studentExamMutations'
import {
  collectExamAnswersFromRoots,
  flushBlankValuesFromDom,
  flushChoiceValuesFromDom,
} from '../utils/collectExamAnswers'
import {
  buildSubmitAnswersFromStores,
  buildSpeakingSubmitAnswers,
  buildWritingSubmitAnswers,
  mergeSubmitAnswers,
} from '../utils/buildSubmitAnswers'
import {
  useActiveQuestionSync,
  useExamData,
  useExamNavigation,
  useBlankInputSync,
  useDragDropFillSync,
  useExamSessionPersistence,
  clearExamSession,
  useSplitResize,
  useStudentExamAccess,
  useExamTextHighlight,
  useStudentExamExitGuard,
} from '../hooks'
import {
  loadExamSession,
  resolveExamSessionInitial,
  type ExamSessionInitial,
} from '../utils/examSessionPersistence'
import {
  ExamHighlightFloatingToolbar,
  ListeningModuleContent,
  ListeningStartOverlay,
  ReadingModuleContent,
  StudentExamExitConfirmDialog,
  StudentExamFinishModal,
  StudentExamFooter,
  StudentExamPlayerHeader,
  StudentExamUnavailable,
  SpeakingModuleContent,
  WritingModuleContent,
} from '../components'
import { printWritingExam } from '../utils/printWritingExam'

export function StudentExamPlayerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const examIdParam = searchParams.get('examId')?.trim() ?? ''
  const userName = useAppSelector(selectUserName)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const listeningContentRef = useRef<HTMLDivElement | null>(null)
  const moduleContentRef = useRef<HTMLDivElement | null>(null)
  const splitContainerRef = useRef<HTMLDivElement | null>(null)
  const examMainRef = useRef<HTMLDivElement | null>(null)
  const examPlayerRootRef = useRef<HTMLDivElement | null>(null)
  const previousModuleRef = useRef<ModuleName>(MODULE_ORDER[0])

  const { examId, denyState, accessLoading, access, enrollment } = useStudentExamAccess({
    noQuestions: false,
  })
  const { data: examsData } = useQuery<{ findAllExams: Array<{ _id: string; title: string }> }>(
    FIND_ALL_EXAMS_QUERY,
    { skip: !examId },
  )
  const { moduleData, hasAnyQuestions, loading, error } = useExamData(
    enrollment?.questionIds,
  )

  const sessionInitial = useMemo((): ExamSessionInitial | null | undefined => {
    if (accessLoading || (Boolean(examIdParam) && loading)) {
      return undefined
    }
    if (!examId || !access?.allowed) {
      return null
    }
    const snapshot = loadExamSession(examId)
    if (!snapshot) {
      return null
    }
    return resolveExamSessionInitial(
      snapshot,
      examId,
      enrollment?.questionIds ?? undefined,
      moduleData,
    )
  }, [
    access?.allowed,
    accessLoading,
    enrollment?.questionIds,
    examId,
    examIdParam,
    loading,
    moduleData,
  ])

  const [finishModalOpen, setFinishModalOpen] = useState(false)
  const [submittedAtLabel, setSubmittedAtLabel] = useState('')
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>(
    () => sessionInitial?.writingAnswers ?? {},
  )
  const [speakingAnswers, setSpeakingAnswers] = useState<Record<string, string>>({})
  const [listeningPlayed, setListeningPlayed] = useState(
    () => sessionInitial?.listeningPlayed ?? false,
  )
  const [listeningStarted, setListeningStarted] = useState(
    () => sessionInitial?.listeningStarted ?? false,
  )

  const didApplySessionInitialRef = useRef(false)

  useEffect(() => {
    // sessionInitial === undefined => backend/loading hali tugamagan
    if (sessionInitial === undefined) return
    if (didApplySessionInitialRef.current) return
    didApplySessionInitialRef.current = true

    if (sessionInitial) {
      setWritingAnswers(sessionInitial.writingAnswers)
      setListeningPlayed(sessionInitial.listeningPlayed)
      setListeningStarted(sessionInitial.listeningStarted)
    }
  }, [sessionInitial])

  const resolvedDenyState = useMemo(() => {
    if (accessLoading || (Boolean(examIdParam) && loading)) {
      return null
    }
    if (denyState) {
      return denyState
    }
    if (access?.allowed && !hasAnyQuestions) {
      return {
        reason: 'no_exam' as const,
        description: 'No questions are assigned for this exam.',
      }
    }
    return null
  }, [access?.allowed, accessLoading, denyState, examIdParam, hasAnyQuestions, loading])
  const [completeMyStudentExam] = useMutation<CompleteMyStudentExamResponse>(
    COMPLETE_MY_STUDENT_EXAM_MUTATION,
  )
  const [submitMyStudentExam] = useMutation<SubmitMyStudentExamResponse>(
    SUBMIT_MY_STUDENT_EXAM_MUTATION,
  )

  const {
    moduleIndex,
    activeModule,
    visibleParts,
    part,
    activeQuestion,
    currentPartQuestions,
    currentPartPassage,
    currentQuestionIds,
    moduleQuestions,

    activeQuestionIndex,
    canGoToNextModule,
    goToModuleIndex,
    handleMoveQuestion,
    handleSelectPart,
    handleSelectQuestion,
  } = useExamNavigation(moduleData, sessionInitial?.navigation, sessionInitial !== undefined)

  const { listeningHtml, readingHtml, blankValues, choiceValues } = useBlankInputSync(
    activeModule,
    part,
    currentPartQuestions,
    listeningContentRef,
    moduleContentRef,
    sessionInitial
      ? {
          blankValues: sessionInitial.blankValues,
          choiceValues: sessionInitial.choiceValues,
        }
      : undefined,
  )

  const listeningDragDropReady = activeModule !== 'listening' || listeningStarted

  const { dragDropValues } = useDragDropFillSync(
    activeModule,
    currentPartQuestions,
    listeningHtml,
    readingHtml,
    listeningContentRef,
    moduleContentRef,
    listeningDragDropReady,
    sessionInitial ? sessionInitial.dragDropValues : undefined,
  )

  useActiveQuestionSync(
    activeQuestion,
    activeModule,
    handleSelectQuestion,
    listeningContentRef,
    moduleContentRef,
    listeningHtml,
    readingHtml,
  )

  useExamSessionPersistence({
    examId,
    enabled:
      Boolean(examId) &&
      Boolean(access?.allowed) &&
      !finishModalOpen &&
      !resolvedDenyState &&
      sessionInitial !== undefined &&
      (didApplySessionInitialRef.current || sessionInitial === null),
    questionIds: enrollment?.questionIds ?? undefined,
    navigation: { moduleIndex, part, activeQuestion },
    listeningStarted,
    listeningPlayed,
    blankValues,
    choiceValues,
    dragDropValues,
    writingAnswers,
  })

  const handleFinishExam = useCallback(async () => {
    setSubmittedAtLabel(
      new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    )

    if (examId) {
      let finishedOk = false
      let submitAnswers: ReturnType<typeof mergeSubmitAnswers> = []
      try {
        const flushRoots = [
          examMainRef.current,
          listeningContentRef.current,
          moduleContentRef.current,
        ]
        const flushedBlanks = flushBlankValuesFromDom(flushRoots, blankValues)
        const flushedChoices = flushChoiceValuesFromDom(flushRoots, choiceValues)
        submitAnswers = mergeSubmitAnswers(
          buildSubmitAnswersFromStores(
            flushedBlanks,
            dragDropValues,
            flushedChoices,
            moduleData,
          ),
          buildWritingSubmitAnswers(writingAnswers, moduleData),
          buildSpeakingSubmitAnswers(speakingAnswers, moduleData),
          collectExamAnswersFromRoots(flushRoots),
        )
        if (submitAnswers.length > 0) {
          await submitMyStudentExam({ variables: { examId, answers: submitAnswers } })
          finishedOk = true
        } else {
          await completeMyStudentExam({ variables: { examId } })
          finishedOk = true
        }
      } catch {
        if (submitAnswers.length === 0) {
          try {
            await completeMyStudentExam({ variables: { examId } })
            finishedOk = true
          } catch {
            // Modal still opens; access check on next visit will block retake if saved
          }
        }
      }

      if (finishedOk) {
        clearExamSession(examId)
      }
    }

    setFinishModalOpen(true)
  }, [
    blankValues,
    choiceValues,
    completeMyStudentExam,
    dragDropValues,
    examId,
    moduleData,
    submitMyStudentExam,
    writingAnswers,
    speakingAnswers,
  ])

  const { splitLeftWidth, startResize } = useSplitResize(splitContainerRef)

  useEffect(() => {
    const prev = previousModuleRef.current
    if (prev === 'listening' && activeModule !== 'listening' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    previousModuleRef.current = activeModule
  }, [activeModule])

  const handleStartListening = useCallback(async () => {
    if (listeningStarted) return
    setListeningStarted(true)

    const rawAudio = moduleData.audioByModule.listening
    if (!rawAudio || listeningPlayed) return
    try {
      if (audioRef.current) {
        audioRef.current.src = rawAudio
        await audioRef.current.play()
        setListeningPlayed(true)
      }
    } catch {
      // Ignore playback failures
    }
  }, [listeningStarted, moduleData.audioByModule.listening, listeningPlayed])

  const handleCompleteModule = useCallback(() => {
    if (activeModule === 'reading') {
      const writingIndex = MODULE_ORDER.indexOf('writing')
      if (writingIndex >= 0) {
        goToModuleIndex(writingIndex)
        return
      }
    }
    if (activeModule === 'writing') {
      const speakingIndex = MODULE_ORDER.indexOf('speaking')
      const hasSpeaking = moduleData.grouped.speaking.some((p) => p.questions.length > 0)
      if (speakingIndex >= 0 && hasSpeaking) {
        goToModuleIndex(speakingIndex)
        return
      }
      handleFinishExam()
      return
    }
    if (activeModule === 'speaking') {
      handleFinishExam()
      return
    }
    if (canGoToNextModule) {
      goToModuleIndex(moduleIndex + 1)
    }
  }, [
    activeModule,
    canGoToNextModule,
    goToModuleIndex,
    handleFinishExam,
    moduleData.grouped.speaking,
    moduleIndex,
  ])

  const currentWritingKey = `writing-part-${part}`
  const currentWritingAnswer = writingAnswers[currentWritingKey] ?? ''
  const currentWritingWordCount = useMemo(() => {
    const trimmed = currentWritingAnswer.trim()
    return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
  }, [currentWritingAnswer])

  const handleWritingChange = useCallback(
    (value: string) => {
      setWritingAnswers((prev) =>
        prev[currentWritingKey] === value ? prev : { ...prev, [currentWritingKey]: value },
      )
    },
    [currentWritingKey],
  )

  const currentSpeakingKey = `speaking-part-${part}`
  const currentSpeakingAnswer = speakingAnswers[currentSpeakingKey] ?? ''

  const handleSpeakingChange = useCallback(
    (value: string) => {
      setSpeakingAnswers((prev) =>
        prev[currentSpeakingKey] === value ? prev : { ...prev, [currentSpeakingKey]: value },
      )
    },
    [currentSpeakingKey],
  )

  const summaryCandidateName = userName?.trim() || 'Test Taker'
  const summaryTestName = useMemo(() => {
    const examTitle = examsData?.findAllExams?.find((item) => item._id === examId)?.title?.trim()
    if (examTitle) return examTitle
    return 'IELTS Mock Exam'
  }, [examId, examsData?.findAllExams])
  const summaryDuration = useMemo(() => {
    let totalSeconds = 0
    for (const mod of MODULE_ORDER) {
      const hasModuleQuestions = moduleData.grouped[mod]?.some((p) => p.questions.length > 0)
      if (!hasModuleQuestions) continue
      totalSeconds +=
        moduleData.durationByModule[mod] ?? MODULE_DURATION_SECONDS[mod]
    }
    return formatRemainingTime(totalSeconds)
  }, [moduleData.durationByModule, moduleData.grouped])

  const answeredQuestionIds = useMemo(
    () =>
      collectAnsweredQuestionIds(
        blankValues,
        dragDropValues,
        writingAnswers,
        activeModule === 'writing' ? visibleParts : undefined,
        choiceValues,
      ),
    [activeModule, blankValues, choiceValues, dragDropValues, visibleParts, writingAnswers],
  )

  const writingTaskHtml = useMemo(() => {
    if (activeModule !== 'writing') return undefined
    const combined = currentPartQuestions
      .map((q) => q.html?.trim())
      .filter(Boolean)
      .join('')
    return combined || undefined
  }, [activeModule, currentPartQuestions])

  const writingPrintParts = useMemo(() => {
    return moduleData.grouped.writing
      .filter((writingPart) => writingPart.questions.length > 0)
      .map((writingPart) => {
        const taskHtml = writingPart.questions
          .map((q) => q.html?.trim())
          .filter(Boolean)
          .join('')
        return {
          partNumber: writingPart.partNumber,
          passageHtml: writingPart.passageHtml,
          taskHtml: taskHtml || undefined,
          answer: writingAnswers[`writing-part-${writingPart.partNumber}`] ?? '',
        }
      })
  }, [moduleData.grouped.writing, writingAnswers])

  const handlePrintWriting = useCallback(() => {
    printWritingExam(writingPrintParts, summaryTestName)
  }, [summaryTestName, writingPrintParts])

  const examGuardEnabled =
    Boolean(access?.allowed) &&
    !finishModalOpen &&
    !resolvedDenyState &&
    hasAnyQuestions

  const { exitDialogOpen, stayOnExam, confirmLeave } = useStudentExamExitGuard({
    enabled: examGuardEnabled,
  })

  const highlightsEnabled = !finishModalOpen

  const {
    activeColor: highlightActiveColor,
    toolbarOpen: highlightToolbarOpen,
    toolbarPosition: highlightToolbarPosition,
    selectColor: onHighlightSelectColor,
    clearSelectionHighlights: onHighlightClear,
  } = useExamTextHighlight({
    rootRef: examPlayerRootRef,
    enabled: highlightsEnabled,
    bindKey: `${activeModule}-${part}-${hasAnyQuestions}-${loading}`,
  })

  const moduleInstructionPrefix =
    activeModule === 'listening'
      ? 'Listen and answer questions'
      : activeModule === 'reading'
        ? 'Read and answer questions'
        : activeModule === 'writing'
          ? 'Write responses for questions'
          : 'Complete the speaking tasks'

  const handleListeningPlay = useCallback(() => {
    void handleStartListening()
  }, [handleStartListening])

  const handleFinishClose = useCallback(() => setFinishModalOpen(false), [])
  const handleFinishContinue = useCallback(() => {
    setFinishModalOpen(false)
    navigate(ROUTES_PATH.dashboard)
  }, [navigate])

  if (accessLoading || (Boolean(examIdParam) && loading)) {
    return (
      <StudentExamPlayerRoot>
        <Box className="student-exam-player__main">
          <Typography className="student-exam-player__loading-text">Loading exam...</Typography>
        </Box>
      </StudentExamPlayerRoot>
    )
  }

  if (resolvedDenyState) {
    return (
      <StudentExamUnavailable
        reason={resolvedDenyState.reason}
        description={resolvedDenyState.description}
      />
    )
  }

  if (error) {
    return <StudentExamUnavailable reason="no_exam" />
  }

  return (
    <StudentExamPlayerRoot ref={examPlayerRootRef}>
      <audio ref={audioRef} preload="auto" />

      <StudentExamPlayerHeader
        activeModule={activeModule}
        moduleIndex={moduleIndex}
        moduleData={moduleData}
        finishModalOpen={finishModalOpen}
        listeningStarted={listeningStarted}
        onAdvanceModule={goToModuleIndex}
        onFinishExam={handleFinishExam}
      />

      {highlightsEnabled ? (
        <ExamHighlightFloatingToolbar
          open={highlightToolbarOpen}
          position={highlightToolbarPosition}
          activeColor={highlightActiveColor}
          onSelectColor={onHighlightSelectColor}
          onClear={onHighlightClear}
        />
      ) : null}

      <Box ref={examMainRef} className="student-exam-player__main">
        {currentPartQuestions.length > 0 && (
          <Box className="student-exam-player__part-banner">
            <Typography className="student-exam-player__part-title">Part {part}</Typography>
            <Typography className="student-exam-player__part-desc">
              {moduleInstructionPrefix} {currentQuestionIds[0] ?? 1}–
              {currentQuestionIds[currentQuestionIds.length - 1] ?? 1}.
            </Typography>
          </Box>
        )}

        {activeModule === 'listening' && !listeningStarted && (
          <ListeningStartOverlay onPlay={handleListeningPlay} />
        )}

        {activeModule === 'listening' ? (
          <ListeningModuleContent
            listeningHtml={listeningHtml}
            listeningContentRef={listeningContentRef}
            questionDbId={currentPartQuestions[0]?.questionDbId}
          />
        ) : activeModule === 'reading' ? (
          <ReadingModuleContent
            splitContainerRef={splitContainerRef}
            moduleContentRef={moduleContentRef}
            splitLeftWidth={splitLeftWidth}
            currentPartPassage={currentPartPassage}
            readingHtml={readingHtml}
            questionDbId={currentPartQuestions[0]?.questionDbId}
            onStartResize={startResize}
          />
        ) : activeModule === 'writing' ? (
          <WritingModuleContent
            splitContainerRef={splitContainerRef}
            splitLeftWidth={splitLeftWidth}
            currentPartPassage={currentPartPassage}
            writingTaskHtml={writingTaskHtml}
            currentWritingWordCount={currentWritingWordCount}
            currentWritingAnswer={currentWritingAnswer}
            onStartResize={startResize}
            onChangeWritingAnswer={handleWritingChange}
            onPrintWriting={handlePrintWriting}
          />
        ) : activeModule === 'speaking' ? (
          <SpeakingModuleContent
            splitContainerRef={splitContainerRef}
            splitLeftWidth={splitLeftWidth}
            currentPartPassage={currentPartPassage}
            speakingAudioUrl={moduleData.audioByModule.speaking}
            currentSpeakingAnswer={currentSpeakingAnswer}
            onStartResize={startResize}
            onChangeSpeakingAnswer={handleSpeakingChange}
          />
        ) : (
          <Box ref={moduleContentRef} className="student-exam-player__module-stack">
            {currentPartQuestions.map((question) => (
              <Box
                key={question.id}
                className="student-exam-player__question-row student-exam-player__question-row--center"
              >
                <Typography className="student-exam-player__question-num">
                  {question.id}.
                </Typography>
                <Box className="student-exam-player__question-body">
                  {question.html ? (
                    <Box
                      className="student-exam-player__prose student-exam-player__prose--question"
                      dangerouslySetInnerHTML={{ __html: question.html }}
                    />
                  ) : (
                    <Typography className="student-exam-player__question-text">
                      {question.text}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {hasAnyQuestions && (
          <Box className="student-exam-player__fab-wrap">
            <Box className="student-exam-player__fab-inner">
              <IconButton
                size="small"
                className="student-exam-player__nav-btn"
                onClick={() => handleMoveQuestion(-1)}
                disabled={activeQuestionIndex <= 0}
              >
                <Typography className="student-exam-player__nav-arrow">&larr;</Typography>
              </IconButton>
              <IconButton
                size="small"
                className="student-exam-player__nav-btn"
                onClick={() => handleMoveQuestion(1)}
                disabled={activeQuestionIndex >= moduleQuestions.length - 1}
              >
                <Typography className="student-exam-player__nav-arrow">&rarr;</Typography>
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      <StudentExamFooter
        visibleParts={visibleParts}
        activeModule={activeModule}
        activePart={part}
        activeQuestion={activeQuestion}
        answeredQuestionIds={answeredQuestionIds}
        canGoToNextModule={canGoToNextModule}
        onSelectPart={handleSelectPart}
        onSelectQuestion={handleSelectQuestion}
        onCompleteModule={handleCompleteModule}
      />

      <StudentExamFinishModal
        open={finishModalOpen}
        onClose={handleFinishClose}
        summaryCandidateName={summaryCandidateName}
        summaryTestName={summaryTestName}
        summaryDuration={summaryDuration}
        submittedAtLabel={submittedAtLabel}
        onContinue={handleFinishContinue}
      />

      <StudentExamExitConfirmDialog
        open={exitDialogOpen}
        onStay={stayOnExam}
        onLeave={confirmLeave}
      />
    </StudentExamPlayerRoot>
  )
}
