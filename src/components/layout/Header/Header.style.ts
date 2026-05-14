import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

import theme, { c } from '@/theme'
export const HeaderRoot = styled(Box)`
  padding: 22px 28px;
  border-bottom: 1px solid ${c.border.default};

  .content__hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(3)};
    flex-wrap: wrap;
  }

  .content__hero-copy {
    min-width: 0;
  }

  .content__title {
    margin: 0;
    font-size: clamp(1.8rem, 2vw, 2.2rem);
    font-weight: 700;
    color: ${c.text.primary};
  }

  .content__meta {
    margin: 8px 0 0;
    color: ${c.text.secondary};
    font-size: 0.95rem;
  }

  .content__actions {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .content__icon-button {
    width: 44px;
    height: 44px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.default};
    color: ${c.text.muted};
  }

  .content__notification-icon {
    width: 22px;
    height: 22px;
    font-size: 22px;
  }

  .content__notification-badge .MuiBadge-badge {
    right: 8px;
    top: 8px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    font-size: 0.65rem;
    font-weight: 700;
    border: 2px solid ${c.surface.default};
  }

  .content__invite-button {
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    font-weight: 600;
    text-transform: none;
  }
`
