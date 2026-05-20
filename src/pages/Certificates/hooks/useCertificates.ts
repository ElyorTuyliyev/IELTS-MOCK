import { useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'

import {
  FIND_ALL_CERTIFICATES_QUERY,
  type FindAllCertificatesResponse,
} from '../api/findAllCertificatesQuery'
import {
  ISSUE_CERTIFICATE_MUTATION,
  issueCertificateMutationOptions,
} from '../api/issueCertificateMutation'
import { mapCertificateFromApi } from '../api/mapCertificateFromApi'
import type { CertificateRecord } from '../certificates.data'

export function useCertificates() {
  const { data, loading, error, refetch } = useQuery<FindAllCertificatesResponse>(
    FIND_ALL_CERTIFICATES_QUERY,
  )

  const [issueCertificateMutation, issueState] = useMutation(ISSUE_CERTIFICATE_MUTATION, {
    ...issueCertificateMutationOptions,
  })

  const certificates = useMemo<CertificateRecord[]>(() => {
    return (data?.findAllCertificates ?? []).map(mapCertificateFromApi)
  }, [data?.findAllCertificates])

  const issueCertificate = async (studentExamId: string) => {
    await issueCertificateMutation({ variables: { _id: studentExamId } })
  }

  return {
    certificates,
    loading,
    error,
    refetch,
    issueCertificate,
    issuing: issueState.loading,
  }
}
