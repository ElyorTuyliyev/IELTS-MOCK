import { gql } from '@apollo/client'

import { FIND_ALL_CERTIFICATES_QUERY } from './findAllCertificatesQuery'

export const ISSUE_CERTIFICATE_MUTATION = gql`
  mutation IssueCertificate($_id: ID!) {
    issueCertificate(_id: $_id) {
      id
      status
      issuedDate
    }
  }
`

export const issueCertificateMutationOptions = {
  refetchQueries: [{ query: FIND_ALL_CERTIFICATES_QUERY }],
} as const
