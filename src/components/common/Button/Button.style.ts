import styled from '@emotion/styled'
import { Button as MuiButton } from '@mui/material'

import theme, { tokens, c } from '@/theme'
export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text'
export type AppButtonSize = 'sm' | 'md' | 'lg'

type StyledButtonProps = {
  $appVariant: AppButtonVariant
  $appSize: AppButtonSize
}

const sizeStyles: Record<AppButtonSize, string> = {
  sm: `
    min-height: 36px;
    padding: 0 14px;
    border-radius: 12px;
    font-size: 14px;
  `,
  md: `
    min-height: 46px;
    padding: 0 18px;
    border-radius: ${tokens.radii.sm}px;
    font-size: 15px;
  `,
  lg: `
    min-height: 58px;
    padding: 0 24px;
    border-radius: ${tokens.radii.md}px;
    font-size: 16px;
  `,
}

const variantStyles: Record<AppButtonVariant, string> = {
  primary: `
    background: ${c.gradient.primary};
    color: ${c.text.inverse};
    border: none;
    box-shadow: ${tokens.shadows.button};

    &:hover {
      background: ${c.gradient.primaryHover};
      box-shadow: ${tokens.shadows.buttonHover};
    }

    &.Mui-disabled {
      opacity: 0.7;
      color: ${c.text.inverse};
    }
  `,
  secondary: `
    border: 1px solid ${c.border.soft};
    background: ${c.surface.default};
    color: ${c.text.primary};
    box-shadow: none;

    &:hover {
      background: ${c.surface.muted};
      border-color: ${c.slate[300]};
    }
  `,
  ghost: `
    border: 1px solid ${c.border.soft};
    background: ${c.surface.default};
    color: ${c.text.primary};
    box-shadow: none;

    &:hover {
      background: ${c.surface.muted};
      border-color: ${c.slate[300]};
    }
  `,
  danger: `
    border: 1px solid ${tokens.rgba.error_28};
    background: ${c.surface.default};
    color: ${c.error.main};
    box-shadow: none;

    &:hover {
      background: ${c.error.bg};
      border-color: ${tokens.rgba.error_45};
    }
  `,
  text: `
    background: transparent;
    color: ${c.text.muted};
    border: none;
    box-shadow: none;
    min-height: auto;
    padding: 6px 10px;

    &:hover {
      background: ${tokens.rgba.slate900_04};
    }
  `,
}

export const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== '$appVariant' && prop !== '$appSize',
})<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(1.25)};
  font-weight: 700;
  text-transform: none;
  line-height: 1.2;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  ${({ $appSize }) => sizeStyles[$appSize]}
  ${({ $appVariant }) => variantStyles[$appVariant]}

  &.app-button--loading {
    pointer-events: none;
  }
`
