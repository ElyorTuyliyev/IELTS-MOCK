import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Box, IconButton, Typography } from '@mui/material'
import { ROUTES_PATH } from '../../../routes/paths'
import { selectUserName } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { StudentExamPlayerRoot } from './StudentExamPlayerPage.style'
import { MODULE_ORDER, type ModuleName } from '../constants'
import { collectAnsweredQuestionIds, formatRemainingTime } from '../utils'
import {
  COMPLETE_MY_STUDENT_EXAM_MUTATION,
  SUBMIT_MY_STUDENT_EXAM_MUTATION,
  type CompleteMyStudentExamResponse,
  type SubmitMyStudentExamResponse,
} from '../api/studentExamMutations'
import { collectExamAnswersFromDom } from '../utils/collectExamAnswers'
import { buildSubmitAnswersFromStores, mergeSubmitAnswers } from '../utils/buildSubmitAnswers'
import {
  useActiveQuestionSync,
  useExamData,
  useExamNavigation,
  useBlankInputSync,
  useDragDropFillSync,
  useSplitResize,
  useStudentExamAccess,
} from '../hooks'
import {
  ListeningModuleContent,
  ListeningStartOverlay,
  ReadingModuleContent,
  StudentExamFinishModal,
  StudentExamFooter,
  StudentExamPlayerHeader,
  StudentExamUnavailable,
  WritingModuleContent,
} from '../components'

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
  const previousModuleRef = useRef<ModuleName>(MODULE_ORDER[0])

  const [finishModalOpen, setFinishModalOpen] = useState(false)
  const [submittedAtLabel, setSubmittedAtLabel] = useState('')
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({})
  const [listeningPlayed, setListeningPlayed] = useState(false)
  const [listeningStarted, setListeningStarted] = useState(false)

  const { examId, denyState, accessLoading, access, enrollment } = useStudentExamAccess({
    noQuestions: false,
  })
  const { examQuestions, moduleData, hasAnyQuestions, loading, error } = useExamData(
    enrollment?.questionIds,
  )

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
  } = useExamNavigation(moduleData)

  const { listeningHtml, readingHtml, blankValues, choiceValues } = useBlankInputSync(
    activeModule,
    part,
    currentPartQuestions,
    listeningContentRef,
    moduleContentRef,
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
      try {
        const answers = mergeSubmitAnswers(
          buildSubmitAnswersFromStores(blankValues, dragDropValues, choiceValues, moduleData),
          collectExamAnswersFromDom(examMainRef.current),
        )
        if (answers.length > 0) {
          await submitMyStudentExam({ variables: { examId, answers } })
        } else {
          await completeMyStudentExam({ variables: { examId } })
        }
      } catch {
        try {
          await completeMyStudentExam({ variables: { examId } })
        } catch {
          // Modal still opens; access check on next visit will block retake if saved
        }
      }
    }

    setFinishModalOpen(true)
  }, [blankValues, choiceValues, completeMyStudentExam, dragDropValues, examId, moduleData, submitMyStudentExam])

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
      handleFinishExam()
      return
    }
    if (canGoToNextModule) {
      goToModuleIndex(moduleIndex + 1)
    }
  }, [activeModule, canGoToNextModule, moduleIndex, goToModuleIndex, handleFinishExam])

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

  const summaryCandidateName = userName?.trim() || 'Test Taker'
  const summaryTestName = useMemo(() => {
    const firstTitle = examQuestions.find((item) => (item.title ?? '').trim())?.title?.trim() ?? ''
    return firstTitle ? firstTitle.split('—')[0]?.trim() || firstTitle : 'IELTS Mock'
  }, [examQuestions])
  const summaryDuration = useMemo(() => {
    const placement = examQuestions.find((item) => Number(item.placementNumber) > 0)?.placementNumber
    if (placement && Number.isFinite(Number(placement))) {
      return `${Math.floor(Number(placement))}:00`
    }
    return formatRemainingTime(0)
  }, [examQuestions])

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

  const moduleInstructionPrefix =
    activeModule === 'listening'
      ? 'Listen and answer questions'
      : activeModule === 'reading'
        ? 'Read and answer questions'
        : 'Write responses for questions'

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
    <StudentExamPlayerRoot>
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
            currentWritingWordCount={currentWritingWordCount}
            currentWritingAnswer={currentWritingAnswer}
            onStartResize={startResize}
            onChangeWritingAnswer={handleWritingChange}
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
    </StudentExamPlayerRoot>
  )
}
