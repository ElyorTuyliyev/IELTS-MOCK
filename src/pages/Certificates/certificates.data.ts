export type CertificateStatus = 'issued' | 'pending' | 'draft'

export type CertificateSkillScores = {
  listening: string
  reading: string
  writing: string
  speaking: string
}

export type CertificateRecord = {
  id: string
  studentName: string
  examName: string
  bandScore: string
  templateName: string
  status: CertificateStatus
  verificationCode: string
  testDate?: string
  issuedDate?: string
  testType?: 'Academic' | 'General Training'
  centreName?: string
  centreNumber?: string
  centerLogo?: string
  candidateNumber?: string
  candidateId?: string
  candidatePhoto?: string
  familyName?: string
  firstName?: string
  dateOfBirth?: string
  sex?: 'M' | 'F'
  schemeCode?: string
  countryOfOrigin?: string
  nationality?: string
  firstLanguage?: string
  trfNumber?: string
  skillScores?: CertificateSkillScores
}

/** Static template catalog for the Templates tab. */
export const CERTIFICATE_TEMPLATES = [
  { id: 'tpl-1', name: 'IELTS Test Report Form', usageCount: 0 },
  { id: 'tpl-2', name: 'IELTS TRF — General Training', usageCount: 0 },
  { id: 'tpl-3', name: 'IELTS TRF — Academic', usageCount: 0 },
] as const
