import { resolveQuestionGroupKey } from '../../../helpers/questionGroupKey'

const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'] as const
export type ExamModuleName = (typeof MODULES)[number]

export type ExamQuestionGroup = {
  groupId: string
  module: ExamModuleName
  title: string
  questionIds: string[]
  partsCount: number
}

type QuestionLike = {
  _id: string
  title?: string | null
  examId?: string | null
  groupId?: string | null
  ieltsModule?: string | null
}

function resolveModule(q: QuestionLike): ExamModuleName {
  const raw = q.ieltsModule?.trim()
  if (raw && MODULES.includes(raw as ExamModuleName)) return raw as ExamModuleName
  return 'Listening'
}

export function buildQuestionGroupsForExam(
  examId: string,
  questions: QuestionLike[],
): ExamQuestionGroup[] {
  const forExam = questions.filter(
    (q) => !q.examId?.trim() || String(q.examId) === String(examId),
  )

  const gMap = new Map<string, ExamQuestionGroup>()
  for (const q of forExam) {
    const mod = resolveModule(q)
    const gid = resolveQuestionGroupKey(q, mod, examId)
    if (!gMap.has(gid)) {
      const baseTitle = (q.title ?? '').split(' — ')[0]?.trim() || mod
      gMap.set(gid, {
        groupId: gid,
        module: mod,
        title: baseTitle,
        questionIds: [],
        partsCount: 0,
      })
    }
    const entry = gMap.get(gid)!
    entry.questionIds.push(String(q._id))
    entry.partsCount = entry.questionIds.length
  }

  return Array.from(gMap.values())
}

export function getAssignedGroups(
  questionIds: string[],
  groups: ExamQuestionGroup[],
): ExamQuestionGroup[] {
  if (questionIds.length === 0) return []
  const idSet = new Set(questionIds.map(String))
  return groups.filter((g) => g.questionIds.some((id) => idSet.has(String(id))))
}

const MODULE_ORDER: Record<ExamModuleName, number> = {
  Listening: 0,
  Reading: 1,
  Writing: 2,
  Speaking: 3,
}

export function sortGroupsByModule(groups: ExamQuestionGroup[]): ExamQuestionGroup[] {
  return [...groups].sort((a, b) => MODULE_ORDER[a.module] - MODULE_ORDER[b.module])
}

export function expandAssignedQuestionIds(
  examId: string,
  questions: Array<{
    _id: string
    examId?: string | null
    groupId?: string | null
    ieltsModule?: string | null
  }>,
  questionIds: string[],
): string[] {
  if (!questionIds.length) return []

  const forExam = questions.filter(
    (q) => !q.examId?.trim() || String(q.examId) === String(examId),
  )
  const idSet = new Set(questionIds.map(String))
  const groupKeys = new Set<string>()

  for (const q of forExam) {
    if (!idSet.has(String(q._id))) continue
    const mod = resolveModule(q)
    groupKeys.add(resolveQuestionGroupKey(q, mod, examId))
  }

  const expanded = forExam.filter((q) => {
    const mod = resolveModule(q)
    const gid = resolveQuestionGroupKey(q, mod, examId)
    return groupKeys.has(gid)
  })

  return [...new Set(expanded.map((q) => String(q._id)))]
}

export function formatAssignedGroupsDetail(groups: ExamQuestionGroup[]): string[] {
  return sortGroupsByModule(groups).map(
    (g) =>
      `${g.module}: ${g.title} (${g.partsCount} ${g.partsCount === 1 ? 'part' : 'parts'})`,
  )
}
