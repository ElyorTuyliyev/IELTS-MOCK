import { gql } from '@apollo/client'

export const FIND_ALL_CERTIFICATES_QUERY = gql`
  query FindAllCertificates {
    findAllCertificates {
      id
      studentExamId
      studentName
      examName
      bandScore
      templateName
      status
      verificationCode
      testDate
      issuedDate
      testType
      centreName
      centreNumber
      centerLogo
      candidateNumber
      candidateId
      candidatePhoto
      familyName
      firstName
      dateOfBirth
      sex
      schemeCode
      countryOfOrigin
      nationality
      firstLanguage
      trfNumber
      skillScores {
        listening
        reading
        writing
        speaking
      }
    }
  }
`

export type CertificateApiRow = {
  id: string
  studentExamId: string
  studentName: string
  examName: string
  bandScore: string
  templateName: string
  status: string
  verificationCode: string
  testDate?: string | null
  issuedDate?: string | null
  testType?: string | null
  centreName?: string | null
  centreNumber?: string | null
  centerLogo?: string | null
  candidateNumber?: string | null
  candidateId?: string | null
  candidatePhoto?: string | null
  familyName?: string | null
  firstName?: string | null
  dateOfBirth?: string | null
  sex?: string | null
  schemeCode?: string | null
  countryOfOrigin?: string | null
  nationality?: string | null
  firstLanguage?: string | null
  trfNumber?: string | null
  skillScores?: {
    listening: string
    reading: string
    writing: string
    speaking: string
  } | null
}

export type FindAllCertificatesResponse = {
  findAllCertificates: CertificateApiRow[]
}
