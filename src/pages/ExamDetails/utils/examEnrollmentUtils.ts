import type { StudentExam, User } from '../api'

export type StudentExamEnrollment = Pick<
  StudentExam,
  '_id' | 'studentId' | 'examId' | 'startedAt' | 'isReleased' | 'isCompleted' | 'isApproved'
>

export function getBestEnrollmentPerStudent(
  examId: string,
  studentExams: StudentExamEnrollment[],
): StudentExamEnrollment[] {
  const forExam = studentExams.filter((item) => String(item.examId) === String(examId))
  const bestByStudent = new Map<string, StudentExamEnrollment>()

  for (const item of forExam) {
    const prev = bestByStudent.get(item.studentId)
    const itemStarted = item.startedAt ? new Date(item.startedAt).getTime() : 0
    const prevStarted = prev?.startedAt ? new Date(prev.startedAt).getTime() : 0
    if (!prev || itemStarted > prevStarted) {
      bestByStudent.set(item.studentId, item)
    }
  }

  return Array.from(bestByStudent.values())
}

export function getInProgressEnrollments(
  examId: string,
  studentExams: StudentExamEnrollment[],
): StudentExamEnrollment[] {
  return getBestEnrollmentPerStudent(examId, studentExams).filter(
    (item) => item.isReleased && !item.isCompleted,
  )
}

export function countInProgressEnrollments(
  examId: string,
  studentExams: StudentExamEnrollment[],
): number {
  return getInProgressEnrollments(examId, studentExams).length
}

export function formatStudentList(names: string[]): string {
  const trimmed = names.map((name) => name.trim()).filter(Boolean)
  if (trimmed.length === 0) {
    return ''
  }
  if (trimmed.length === 1) {
    return trimmed[0]
  }
  if (trimmed.length === 2) {
    return `${trimmed[0]} and ${trimmed[1]}`
  }
  return `${trimmed.slice(0, -1).join(', ')}, and ${trimmed[trimmed.length - 1]}`
}

export function getInProgressStudentNames(
  examId: string,
  studentExams: StudentExamEnrollment[],
  users: Pick<User, '_id' | 'firstName' | 'lastName'>[],
): string[] {
  const userMap = new Map(users.map((user) => [user._id, user]))
  return getInProgressEnrollments(examId, studentExams).map((item) => {
    const user = userMap.get(item.studentId)
    if (!user) {
      return 'Unknown student'
    }
    return `${user.firstName} ${user.lastName}`.trim() || 'Unknown student'
  })
}

export function buildDeactivateBlockedMessage(inProgressNames: string[]): string {
  if (inProgressNames.length === 0) {
    return ''
  }

  const namesLabel = formatStudentList(inProgressNames)
  const count = inProgressNames.length

  if (count === 1) {
    return `An active exam is in progress. ${namesLabel} is still taking this exam. End their attempt in Enrolled students to deactivate the exam.`
  }

  return `An active exam is in progress. ${count} students (${namesLabel}) are still taking this exam. End their attempts in Enrolled students to deactivate the exam.`
}
