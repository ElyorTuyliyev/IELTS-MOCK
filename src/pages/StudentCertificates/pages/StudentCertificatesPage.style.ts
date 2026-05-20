import styled from '@emotion/styled'

import { c } from '@/theme'

export const StudentCertificatesPageRoot = styled.div`
  .student-certificates-page__empty {
    border: 1px dashed ${c.border.default};
    border-radius: 14px;
    padding: 32px 24px;
    text-align: center;
    color: ${c.text.secondary};
    background: ${c.surface.default};
  }
`
