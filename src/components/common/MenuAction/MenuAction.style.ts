import { css } from '@emotion/react'
import styled from '@emotion/styled'

import theme, { tokens, c } from '@/theme'
export const menuActionGlobalStyles = css`
  .menu-action__menu.MuiPaper-root {
    margin-top: 8px;
    width: max-content;
    min-width: unset;
    max-width: 280px;
    padding: 8px 0;
    border: 1px solid ${c.neutral[800]};
    border-radius: 10px;
    background: ${c.surface.default};
    box-shadow: ${tokens.shadows.card};
  }

  .menu-action__menu-list.MuiList-root {
    padding: 0;
    width: max-content;
    min-width: 100%;
  }

  .menu-action__menu-item.MuiMenuItem-root {
    min-height: 44px;
    padding: 10px 16px;
    gap: ${theme.spacing(1.5)};
    width: 100%;
    white-space: nowrap;
    font-size: 0.98rem;
    font-weight: 400;
    line-height: 1.2;
    color: ${c.text.primary};
  }

  .menu-action__menu-item.MuiMenuItem-root:hover {
    background: ${c.surface.muted};
  }

  .menu-action__menu-item--danger.MuiMenuItem-root,
  .menu-action__menu-item--danger.MuiMenuItem-root .menu-action__item-icon {
    color: ${c.error.delete};
  }

  .menu-action__menu-item--danger.MuiMenuItem-root:hover {
    background: ${c.error.bgLight};
  }

  .menu-action__item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${c.text.muted};
  }

  .menu-action__item-icon svg {
    display: block;
    width: 18px;
    height: 18px;
  }
`

export const menuActionCellStyles = css`
  .menu-action__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .menu-action__trigger.MuiIconButton-root {
    width: 34px;
    height: 34px;
    padding: 0;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: ${c.text.subtle};
  }

  .menu-action__trigger.MuiIconButton-root:hover {
    background: ${c.surface.hover};
  }

  .menu-action__more-icon {
    display: block;
    width: 18px;
    height: 18px;
  }
`

export const MenuActionRoot = styled.div`
  ${menuActionCellStyles}
`
