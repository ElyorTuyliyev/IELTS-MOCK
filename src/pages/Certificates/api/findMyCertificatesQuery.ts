import { gql } from '@apollo/client'

import type { CertificateApiRow } from './findAllCertificatesQuery'

export const FIND_MY_CERTIFICATES_QUERY = gql`
  query FindMyCertificates {
    findMyCertificates {
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

export type FindMyCertificatesResponse = {
  findMyCertificates: CertificateApiRow[]
}
