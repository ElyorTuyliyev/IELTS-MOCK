type QuestionGroupKeyInput = {
  _id: string
  examId?: string | null
  groupId?: string | null
  ieltsModule?: string | null
}

/**
 * Shared group key for question pools and assignment UI.
 * Without groupId, each question is its own group (avoids merging all Speaking rows).
 */
export function resolveQuestionGroupKey(
  q: QuestionGroupKeyInput,
  moduleName: string,
  examIdFallback?: string,
): string {
  const gid = q.groupId?.trim()
  if (gid) return gid
  const examKey = q.examId?.trim() || examIdFallback?.trim() || 'pool'
  return `legacy::${examKey}::${moduleName}::${String(q._id)}`
}
