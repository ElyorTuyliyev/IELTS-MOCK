import { Box, Popover, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

import theme, { tokens, c } from '@/theme'
export const SidebarRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: ${theme.spacing(3)};
  padding: 22px;
  border: 1px solid ${tokens.rgba.border_24};
  border-radius: 24px;
  background: ${tokens.rgba.white_92};
  box-shadow: ${tokens.shadows.card};

  .sidebar__header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding-bottom: 20px;
    border-bottom: 1px dashed ${c.border.dashed};
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    min-width: 0;
  }

  .sidebar__brand-logo {
    display: grid;
    place-items: center;
    overflow: hidden;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: ${c.gradient.primary};
    color: ${c.text.inverse};
    font-size: 1.5rem;
  }

  .sidebar__brand-logo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .sidebar__brand-title {
    display: block;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .sidebar__brand-text {
    display: block;
    margin-top: 4px;
    color: ${c.text.secondary};
    font-size: 0.875rem;
  }

  .sidebar__utility-button {
    margin-left: auto;
    width: 40px;
    height: 40px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.default};
    color: ${c.text.primary};
  }

  .sidebar__search {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 48px;
    gap: ${theme.spacing(1)};
  }

  .sidebar__search-input .MuiOutlinedInput-root {
    min-height: 48px;
    border-radius: 14px;
    background: ${c.surface.default};
  }

  .sidebar__search-button {
    width: 48px;
    height: 48px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.default};
    color: ${c.text.primary};
  }

  .sidebar__nav {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: ${theme.spacing(3)};
    min-height: 0;
    overflow-y: auto;
  }

  .sidebar__section {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
  }

  .sidebar__section-title {
    margin: 0;
    color: ${c.text.muted};
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .sidebar__list,
  .sidebar__sublist {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .sidebar__list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .sidebar__link,
  .sidebar__sublink {
    justify-content: flex-start;
    width: 100%;
    color: ${c.text.dark};
    text-transform: none;
    font-weight: 600;

    &.MuiButton-root {
      color: ${c.text.dark};
    }

    &:hover {
      color: ${c.text.primary};
      background: ${tokens.rgba.slate900_04};
    }
  }

  .sidebar__link {
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
  }

  .sidebar__link--active {
    background: ${c.primary.tint};
    border-color: ${c.primary.tintBorderStrong};
    color: ${c.primary.darker};

    &.MuiButton-root,
    &:hover {
      color: ${c.primary.darker};
      background: ${c.primary.tint};
    }
  }

  .sidebar__link-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: 1px solid ${c.border.medium};
    border-radius: 10px;
    background: ${c.surface.default};
    color: ${c.text.muted};
    flex-shrink: 0;
  }

  .sidebar__link-icon-svg {
    width: 18px;
    height: 18px;
    font-size: 18px;
  }

  .sidebar__link--active .sidebar__link-icon {
    color: ${c.primary.main};
    border-color: ${c.primary.tintBorderStrong};
    background: ${c.primary.tint};
  }

  .sidebar__link-arrow,
  .sidebar__profile-arrow {
    margin-left: auto;
  }

  .sidebar__link-arrow {
    transition: transform 0.2s ease;
  }

  .sidebar__link-arrow--expanded {
    transform: rotate(180deg);
  }

  .sidebar__sublist {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
    margin-top: 8px;
    padding-left: 18px;
  }

  .sidebar__sublink {
    min-height: 36px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    color: ${c.text.muted};
    font-weight: 500;

    &.MuiButton-root {
      color: ${c.text.muted};
    }

    &:hover {
      color: ${c.text.subtle};
      background: ${tokens.rgba.slate900_04};
    }
  }

  .sidebar__sublink--active {
    border-color: ${c.primary.tintBorder};
    background: ${c.primary.tint};
    color: ${c.primary.darker};

    &.MuiButton-root,
    &:hover {
      color: ${c.primary.darker};
      background: ${c.primary.tint};
    }
  }

  .sidebar__sublink-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    border: 1px solid ${c.border.medium};
    border-radius: 8px;
    background: ${c.surface.default};
    color: ${c.text.muted};
    flex-shrink: 0;
  }

  .sidebar__sublink-icon-svg {
    width: 16px;
    height: 16px;
    font-size: 16px;
  }

  .sidebar__sublink--active .sidebar__sublink-icon {
    color: ${c.primary.main};
    border-color: ${c.primary.tintBorderStrong};
    background: ${c.primary.tint};
  }

  .sidebar__profile {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding: 14px;
    border: 1px solid ${c.border.soft};
    border-radius: 16px;
    background: ${c.surface.default};
  }

  .sidebar__profile-avatar {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${c.gradient.primaryWide};
    color: ${c.text.inverse};
    font-size: 0.875rem;
    font-weight: 700;
  }

  .sidebar__profile-copy {
    display: flex;
    align-items: center;
    min-width: 0;
    text-align: left;
  }

  .sidebar__profile-name {
    display: block;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .sidebar__footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px dashed ${c.border.dashed};
  }

  .sidebar__logout {
    justify-content: flex-start;
    width: 100%;
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    color: ${c.error.main};
    text-transform: none;
    font-weight: 600;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    &.MuiButton-root {
      color: ${c.error.main};
    }

    &:hover {
      border-color: ${c.error.border};
      background: ${c.error.bgLight};
      color: ${c.error.dark};
    }

    &:focus-visible {
      outline: 2px solid ${c.error.borderStrong};
      outline-offset: 2px;
    }
  }

  .sidebar__logout-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: 1px solid ${c.error.border};
    border-radius: 10px;
    background: ${c.error.bgSoft};
    color: ${c.error.bright};
    flex-shrink: 0;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .sidebar__logout:hover .sidebar__logout-icon {
    border-color: ${c.error.borderStrong};
    background: ${c.error.bg};
    color: ${c.error.main};
  }

  .sidebar__logout-icon-svg {
    width: 18px;
    height: 18px;
    font-size: 18px;
  }

  .sidebar__logout-text {
    font-size: 0.95rem;
  }

  @media (max-width: 1120px) {
    gap: ${theme.spacing(1.5)};
    padding: 12px;
    border-radius: 20px;

    .sidebar__header {
      justify-content: center;
      padding-bottom: 12px;
    }

    .sidebar__brand {
      justify-content: center;
    }

    .sidebar__brand-copy,
    .sidebar__utility-button,
    .sidebar__search,
    .sidebar__section-title,
    .sidebar__link-text,
    .sidebar__link-arrow,
    .sidebar__sublist-wrap,
    .sidebar__logout-text {
      display: none;
    }

    .sidebar__brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      font-size: 1.25rem;
    }

    .sidebar__nav {
      gap: ${theme.spacing(1)};
    }

    .sidebar__section {
      gap: ${theme.spacing(0.5)};
    }

    .sidebar__link,
    .sidebar__logout {
      justify-content: center;
      min-width: 0;
      padding: 8px;
    }

    .sidebar__link-icon,
    .sidebar__logout-icon {
      margin-right: 0;
    }

    .sidebar__footer {
      padding-top: 12px;
    }
  }
`

export const SidebarCollapsedPopoverPaper = styled(Paper)`
  min-width: 220px;
  padding: 12px;
  border: 1px solid ${tokens.rgba.border_24};
  border-radius: 16px;
  background: ${tokens.rgba.white_92};
  box-shadow: ${tokens.shadows.card};

  .sidebar__collapsed-popover-title {
    margin: 0 0 8px;
    padding: 0 8px;
    color: ${c.text.muted};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sidebar__collapsed-popover-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  }

  .sidebar__collapsed-popover-link {
    justify-content: flex-start;
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    color: ${c.text.muted};
    text-transform: none;
    font-weight: 500;

    &.MuiButton-root {
      color: ${c.text.muted};
    }

    &:hover {
      color: ${c.text.subtle};
      background: ${tokens.rgba.slate900_04};
    }
  }

  .sidebar__collapsed-popover-link--active {
    border-color: ${c.primary.tintBorder};
    background: ${c.primary.tint};
    color: ${c.primary.darker};

    &.MuiButton-root,
    &:hover {
      color: ${c.primary.darker};
      background: ${c.primary.tint};
    }
  }

  .sidebar__collapsed-popover-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    border: 1px solid ${c.border.medium};
    border-radius: 8px;
    background: ${c.surface.default};
    color: ${c.text.muted};
    flex-shrink: 0;
  }

  .sidebar__collapsed-popover-icon-svg {
    width: 16px;
    height: 16px;
    font-size: 16px;
  }

  .sidebar__collapsed-popover-link--active .sidebar__collapsed-popover-icon {
    color: ${c.primary.main};
    border-color: ${c.primary.tintBorderStrong};
    background: ${c.primary.tint};
  }
`

export const SidebarCollapsedPopover = styled(Popover)`
  & .MuiPaper-root {
    margin-left: 8px;
  }
`
