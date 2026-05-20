export type IeltsSkillScores = {
  listening: string
  reading: string
  writing: string
  speaking: string
}

export type SplitName = {
  familyName: string
  firstName: string
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const

/** Map overall band to CEFR level (IELTS official scale). */
export function bandToCefr(band: number): string {
  if (band >= 8.5) return 'C2'
  if (band >= 7.0) return 'C1'
  if (band >= 5.5) return 'B2'
  if (band >= 4.0) return 'B1'
  if (band >= 3.0) return 'A2'
  return 'A1'
}

function roundToHalf(n: number): string {
  return (Math.round(n * 2) / 2).toFixed(1)
}

/** Derive plausible per-skill bands around the overall score (mock data). */
export function deriveSkillScores(overallBand: number): IeltsSkillScores {
  const offsets = [-0.5, 0, 0.5, -0.5]
  const clamp = (v: number) => Math.min(9, Math.max(0, v))
  const scores = offsets.map((off) => roundToHalf(clamp(overallBand + off)))

  return {
    listening: scores[0],
    reading: scores[1],
    writing: scores[2],
    speaking: scores[3],
  }
}

export function parseBandScore(bandScore: string): number {
  const n = Number.parseFloat(bandScore)
  return Number.isFinite(n) ? n : 0
}

export function inferTestType(examName: string): 'Academic' | 'General Training' {
  return examName.toLowerCase().includes('general') ? 'General Training' : 'Academic'
}

/** TRF header date: 20/OCT/2022 */
export function formatTrfTestDate(isoDate?: string): string {
  const d = isoDate ? new Date(isoDate) : new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/** Issued date: 29/10/2022 */
export function formatTrfIssuedDate(isoDate?: string): string {
  const d = isoDate ? new Date(isoDate) : new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/** @deprecated Use formatTrfTestDate for TRF layout */
export function formatCertificateDate(isoDate?: string): string {
  return formatTrfTestDate(isoDate)
}

/** Last token = family name, rest = first name(s). */
export function splitStudentName(fullName: string): SplitName {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { familyName: '', firstName: '' }
  if (parts.length === 1) return { familyName: parts[0].toUpperCase(), firstName: '' }
  const familyName = parts[parts.length - 1].toUpperCase()
  const firstName = parts.slice(0, -1).join(' ').toUpperCase()
  return { familyName, firstName }
}

export function buildTrfNumber(record: {
  testDate?: string
  centreNumber?: string
  candidateNumber?: string
  verificationCode: string
}): string {
  if (record.verificationCode.length >= 12 && !record.verificationCode.includes('-')) {
    return record.verificationCode
  }
  const d = record.testDate ? new Date(record.testDate) : new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const centre = (record.centreNumber ?? 'UZ001').replace(/\s/g, '').slice(0, 4).toUpperCase()
  const cand = (record.candidateNumber ?? '000000').replace(/\D/g, '').padStart(6, '0').slice(-6)
  const tail = record.verificationCode.replace(/[^A-Z0-9]/gi, '').slice(-6).toUpperCase()
  return `${yy}${centre}${cand}TA${tail}`
}
