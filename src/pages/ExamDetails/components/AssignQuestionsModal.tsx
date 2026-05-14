import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Box,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Radio,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { c } from '../../../theme'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import {
  FIND_ALL_QUESTIONS_QUERY,
  type FindAllQuestionsResponse,
  flattenGroupedQuestions,
  type GroupedQuestionItem,
} from '../../Questions/api/findAllQuestionsQuery'
import {
  ASSIGN_QUESTIONS_MUTATION,
  INITIALIZE_RANDOM_QUESTIONS_MUTATION,
} from '../api/queries'
import type {
  InitializeRandomQuestionsMutationResponse,
  InitializeRandomQuestionsMutationVariables,
} from '@/types/examDetails'
import { AssignQuestionsRoot } from './AssignQuestionsModal.style'

const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'] as const
type ModuleName = (typeof MODULES)[number]

/** Per module: only one question group can be selected */
const SINGLE_SELECT_MODULES: ReadonlySet<ModuleName> = new Set([
  'Listening',
  'Reading',
  'Writing',
])

type FlatQuestion = GroupedQuestionItem['questions'][number]

type QuestionGroup = {
  groupId: string
  module: ModuleName
  title: string
  questionIds: string[]
  partsCount: number
}

type AssignQuestionsModalProps = {
  open: boolean
  studentExamId: string
  studentName: string
  examId: string
  existingQuestionIds: string[]
  onClose: () => void
  onSaved: () => void
}

function resolveModule(q: FlatQuestion): ModuleName {
  const raw = q.ieltsModule?.trim()
  if (raw && MODULES.includes(raw as ModuleName)) return raw as ModuleName
  return 'Listening'
}

export function AssignQuestionsModal({
  open,
  studentExamId,
  studentName,
  examId,
  existingQuestionIds,
  onClose,
  onSaved,
}: AssignQuestionsModalProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [initPending, setInitPending] = useState(false)

  const { data: rawData, loading } = useQuery<FindAllQuestionsResponse>(
    FIND_ALL_QUESTIONS_QUERY,
  )

  const existingSortedKey = useMemo(
    () => [...existingQuestionIds].map(String).sort().join('|'),
    [existingQuestionIds],
  )

  const [assignMutation, { loading: saving }] = useMutation(ASSIGN_QUESTIONS_MUTATION)
  const [initializeMutation] = useMutation<
    InitializeRandomQuestionsMutationResponse,
    InitializeRandomQuestionsMutationVariables
  >(INITIALIZE_RANDOM_QUESTIONS_MUTATION)

  useEffect(() => {
    if (!open || !studentExamId) {
      setInitPending(false)
      return
    }

    setActiveTab(0)

    if (existingQuestionIds.length > 0) {
      setInitPending(false)
      setSelectedIds(new Set(existingQuestionIds.map(String)))
      return
    }

    let cancelled = false
    setInitPending(true)

    void (async () => {
      try {
        const res = await initializeMutation({
          variables: { _id: studentExamId },
        })
        if (cancelled) return
        if (res.error) {
          toast.error(res.error.message ?? 'Failed to load default questions.')
          setSelectedIds(new Set())
          setInitPending(false)
          return
        }
        const ids =
          res.data?.initializeRandomQuestionsForStudentExam?.questionIds ?? []
        const next = new Set(ids.map(String))
        setSelectedIds(next)
        setInitPending(false)
        onSaved()
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : 'Failed to load default questions.')
          setSelectedIds(new Set())
          setInitPending(false)
        }
      }
    })()

    return () => {
      cancelled = true
      setInitPending(false)
    }
  }, [open, studentExamId, existingSortedKey, initializeMutation, onSaved, existingQuestionIds, toast])

  const showQuestionsLoading = loading || initPending

  const questionGroups = useMemo(() => {
    const allFlat = flattenGroupedQuestions(rawData?.findAllQuestions ?? []) as FlatQuestion[]
    const forThisExam = allFlat.filter(
      (q) => !q.examId?.trim() || String(q.examId) === String(examId),
    )

    const gMap = new Map<string, QuestionGroup>()
    for (const q of forThisExam) {
      const mod = resolveModule(q)
      const examKey = q.examId?.trim() || "pool"
      const gid = q.groupId?.trim() || `legacy::${examKey}::${mod}`
      if (!gMap.has(gid)) {
        const baseTitle = (q.title ?? '').split(' — ')[0]?.trim() || mod
        gMap.set(gid, { groupId: gid, module: mod, title: baseTitle, questionIds: [], partsCount: 0 })
      }
      const entry = gMap.get(gid)!
      entry.questionIds.push(q._id)
      entry.partsCount = entry.questionIds.length
    }

    return Array.from(gMap.values())
  }, [rawData, examId])

  const groupedByModule = useMemo(() => {
    const map: Record<ModuleName, QuestionGroup[]> = {
      Listening: [],
      Reading: [],
      Writing: [],
      Speaking: [],
    }
    for (const g of questionGroups) {
      map[g.module].push(g)
    }
    return map
  }, [questionGroups])

  const activeModule = MODULES[activeTab] ?? 'Listening'
  const currentGroups = groupedByModule[activeModule]

  const handleToggleGroup = useCallback((group: QuestionGroup) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const allSelected = group.questionIds.every((id) => next.has(id))

      if (SINGLE_SELECT_MODULES.has(group.module)) {
        const allModuleIds = groupedByModule[group.module].flatMap((g) => g.questionIds)
        for (const id of allModuleIds) next.delete(id)
        if (!allSelected) {
          for (const id of group.questionIds) next.add(id)
        }
      } else {
        if (allSelected) {
          for (const id of group.questionIds) next.delete(id)
        } else {
          for (const id of group.questionIds) next.add(id)
        }
      }
      return next
    })
  }, [groupedByModule])

  const handleSelectAllModule = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const allIds = currentGroups.flatMap((g) => g.questionIds)
      const allSelected = allIds.every((id) => next.has(id))
      if (allSelected) {
        for (const id of allIds) next.delete(id)
      } else {
        for (const id of allIds) next.add(id)
      }
      return next
    })
  }, [currentGroups])

  const handleSave = useCallback(async () => {
    try {
      const res = await assignMutation({
        variables: {
          input: {
            studentExamId,
            questionIds: Array.from(selectedIds),
          },
        },
      })
      if (res.error) {
        toast.error(res.error.message ?? 'Save failed.')
        return
      }
      toast.success('Questions assigned successfully.')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save.')
    }
  }, [assignMutation, studentExamId, selectedIds, onSaved, onClose, toast])

  const allModuleIds = currentGroups.flatMap((g) => g.questionIds)
  const allModuleSelected = allModuleIds.length > 0 && allModuleIds.every((id) => selectedIds.has(id))
  const someModuleSelected = allModuleIds.some((id) => selectedIds.has(id))

  return (
    <AssignQuestionsRoot
      open={open}
      onClose={saving || initPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="aq__header" component="div">
        <Box className="aq__header-icon">📋</Box>
        <Box>
          <Typography className="aq__header-title">Select questions</Typography>
          <Typography className="aq__header-sub">
            Choose exam questions for {studentName}
          </Typography>
        </Box>
      </DialogTitle>

      <Box className="aq__tabs">
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {MODULES.map((mod) => {
            const modGroups = groupedByModule[mod]
            const selectedCount = modGroups.filter((g) =>
              g.questionIds.every((id) => selectedIds.has(id)),
            ).length
            const label = SINGLE_SELECT_MODULES.has(mod)
              ? `${mod} (${selectedCount > 0 ? '1' : '0'}/1)`
              : `${mod} (${selectedCount}/${modGroups.length})`
            return (
              <Tab
                key={mod}
                className="aq__tab"
                label={label}
              />
            )
          })}
        </Tabs>
      </Box>

      <Divider />

      <DialogContent className="aq__content">
        {showQuestionsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : currentGroups.length === 0 ? (
          <Typography className="aq__empty">
            No questions found for this module.
          </Typography>
        ) : (
          <>
            {SINGLE_SELECT_MODULES.has(activeModule) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography className="aq__count-badge">
                  Select one ({currentGroups.filter((g) => g.questionIds.every((id) => selectedIds.has(id))).length}/{currentGroups.length})
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Checkbox
                  checked={allModuleSelected}
                  indeterminate={someModuleSelected && !allModuleSelected}
                  onChange={handleSelectAllModule}
                  size="small"
                />
                <Typography className="aq__count-badge">
                  Select all ({currentGroups.filter((g) => g.questionIds.every((id) => selectedIds.has(id))).length}/{currentGroups.length})
                </Typography>
              </Box>
            )}
            <Box className="aq__question-list">
              {currentGroups.map((group) => {
                const isSelected = group.questionIds.every((id) => selectedIds.has(id))
                const isSomeSelected = !isSelected && group.questionIds.some((id) => selectedIds.has(id))
                return (
                  <Box
                    key={group.groupId}
                    className={`aq__question-item${isSelected ? ' aq__question-item--selected' : ''}`}
                    onClick={() => handleToggleGroup(group)}
                  >
                    {SINGLE_SELECT_MODULES.has(activeModule) ? (
                      <Radio
                        checked={isSelected}
                        size="small"
                        tabIndex={-1}
                      />
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        indeterminate={isSomeSelected}
                        size="small"
                        tabIndex={-1}
                      />
                    )}
                    <Typography className="aq__question-title">
                      {group.title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: c.text.disabled, ml: 'auto', mr: 1 }}>
                      {group.partsCount} {group.partsCount === 1 ? 'part' : 'parts'}
                    </Typography>
                    <span className={`aq__question-module aq__module--${activeModule.toLowerCase()}`}>
                      {activeModule}
                    </span>
                  </Box>
                )
              })}
            </Box>
          </>
        )}

      </DialogContent>

      <Divider />

      <DialogActions className="aq__actions">
        <Typography sx={{ flex: 1, fontSize: 14, color: c.text.secondary, fontWeight: 600 }}>
          {selectedIds.size} question{selectedIds.size === 1 ? '' : 's'} selected
        </Typography>
        <Button
          variant="secondary"
          className="aq__cancel-btn"
          onClick={onClose}
          disabled={saving || initPending}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="aq__save-btn"
          onClick={() => void handleSave()}
          disabled={saving || initPending}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </AssignQuestionsRoot>
  )
}
