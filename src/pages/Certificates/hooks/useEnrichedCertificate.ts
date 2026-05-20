import { useMemo } from 'react'

import type { CertificateRecord } from '../certificates.data'
import { resolveCenterLogoUrl } from '../utils/resolveCenterLogoUrl'

/** Ensures certificate media URLs are loadable in the browser. */
export function useEnrichedCertificate(record: CertificateRecord | null): CertificateRecord | null {
  return useMemo(() => {
    if (!record) return null

    const resolvedLogo = resolveCenterLogoUrl(record.centerLogo)
    const resolvedCandidatePhoto = resolveCenterLogoUrl(record.candidatePhoto)

    return {
      ...record,
      centerLogo: resolvedLogo ?? record.centerLogo,
      candidatePhoto: resolvedCandidatePhoto ?? record.candidatePhoto,
    }
  }, [record])
}
