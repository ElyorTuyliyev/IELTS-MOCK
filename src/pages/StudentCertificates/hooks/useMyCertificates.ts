import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'

import { mapCertificateFromApi } from '../../Certificates/api/mapCertificateFromApi'
import type { CertificateRecord } from '../../Certificates/certificates.data'
import {
  FIND_MY_CERTIFICATES_QUERY,
  type FindMyCertificatesResponse,
} from '../../Certificates/api/findMyCertificatesQuery'

export function useMyCertificates() {
  const { data, loading, error, refetch } = useQuery<FindMyCertificatesResponse>(
    FIND_MY_CERTIFICATES_QUERY,
  )

  const certificates = useMemo<CertificateRecord[]>(() => {
    return (data?.findMyCertificates ?? []).map(mapCertificateFromApi)
  }, [data?.findMyCertificates])

  return {
    certificates,
    loading,
    error,
    refetch,
  }
}
