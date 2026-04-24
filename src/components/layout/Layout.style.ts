import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const panelSurface = `
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
`

export const LayoutRoot = styled(Box)`
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  min-height: 100vh;
  gap: 16px;
  padding: 16px;

  .dashboard__content {
    ${panelSurface};
    overflow: hidden;
  }

  .content__main {
    padding: 28px;
  }

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`
