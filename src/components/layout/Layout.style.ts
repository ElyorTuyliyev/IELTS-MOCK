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
  height: 100dvh;
  min-height: 0;
  gap: ${theme.spacing(2)};
  padding: 16px;
  overflow: hidden;

  .dashboard__sidebar {
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
  }

  .dashboard__content {
    ${panelSurface};
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .content__main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    direction: ltr;
  }

  .content__main-inner {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
  }

  @media (max-width: 1120px) {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: ${theme.spacing(1.5)};
    padding: 12px;

    .content__main-inner {
      padding: 20px 16px;
    }
  }
`
