import type { CertificateRecord, CertificateStatus } from '../certificates.data'
import type { CertificateApiRow } from './findAllCertificatesQuery'

function parseStatus(raw: string): CertificateStatus {
  if (raw === 'issued' || raw === 'pending' || raw === 'draft') {
    return raw
  }
  return 'draft'
}

export function mapCertificateFromApi(row: CertificateApiRow): CertificateRecord {
  return {
    id: row.id,
    studentName: row.studentName,
    examName: row.examName,
    bandScore: row.bandScore,
    templateName: row.templateName,
    status: parseStatus(row.status),
    verificationCode: row.verificationCode,
    testDate: row.testDate ?? undefined,
    issuedDate: row.issuedDate ?? undefined,
    testType:
      row.testType === 'General Training' || row.testType === 'Academic'
        ? row.testType
        : undefined,
    centreName: row.centreName ?? undefined,
    centreNumber: row.centreNumber ?? undefined,
    centerLogo: row.centerLogo ?? undefined,
    candidateNumber: row.candidateNumber ?? undefined,
    candidateId: row.candidateId ?? undefined,
    candidatePhoto: row.candidatePhoto ?? undefined,
    familyName: row.familyName ?? undefined,
    firstName: row.firstName ?? undefined,
    dateOfBirth: row.dateOfBirth ?? undefined,
    sex: row.sex === 'M' || row.sex === 'F' ? row.sex : undefined,
    schemeCode: row.schemeCode ?? undefined,
    countryOfOrigin: row.countryOfOrigin ?? undefined,
    nationality: row.nationality ?? undefined,
    firstLanguage: row.firstLanguage ?? undefined,
    trfNumber: row.trfNumber ?? undefined,
    skillScores: row.skillScores
      ? {
          listening: row.skillScores.listening,
          reading: row.skillScores.reading,
          writing: row.skillScores.writing,
          speaking: row.skillScores.speaking,
        }
      : undefined,
  }
}
