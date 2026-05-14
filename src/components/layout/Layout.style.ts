import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

import theme, { tokens } from '@/theme'
const panelSurface = `
  border: 1px solid ${tokens.rgba.border_24};
  border-radius: 24px;
  background: ${tokens.rgba.white_92};
  box-shadow: ${tokens.shadows.card};
`

export const LayoutRoot = styled(Box)`
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  min-height: 100vh;
  gap: ${theme.spacing(2)};
  padding: 16px;

  .dashboard__content {
    ${panelSurface};
    overflow: hidden;
  }

  .content__main {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 28px;
  }

  @media (max-width: 1120px) {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: ${theme.spacing(1.5)};
    padding: 12px;

    .content__main {
      padding: 20px 16px;
    }
  }
`
