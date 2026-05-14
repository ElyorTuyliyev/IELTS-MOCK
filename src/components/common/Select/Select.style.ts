import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { Box, MenuItem, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { tokens, c } from '../../../theme/tokens'

export type AppSelectSize = 'sm' | 'md'

type StyledSelectProps = {
  $appSize: AppSelectSize
}

const sizeStyles: Record<AppSelectSize, string> = {
  sm: `
  & .MuiOutlinedInput-root {
    min-height: 40px;
    border-radius: 10px;

    .MuiSelect-select {
      padding: 8px 36px 8px 12px;
      font-size: 0.875rem;
    }
  }
  `,
  md: `
  & .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: ${tokens.radii.sm}px;

    .MuiSelect-select {
      padding: 12px 40px 12px 14px;
      font-size: 0.95rem;
    }
  }
  `,
}

export const StyledSelect = styled(TextField, {
  shouldForwardProp: (prop) => prop !== '$appSize',
})<StyledSelectProps>`
  width: 100%;

  & .MuiOutlinedInput-root {
    background: ${c.surface.muted};
    color: ${c.text.primary};
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    fieldset {
      border-color: ${c.border.default};
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    &:hover {
      background: ${c.surface.default};

      fieldset {
        border-color: ${c.slate[300]};
      }
    }

    &.Mui-focused {
      background: ${c.surface.default};
      box-shadow: ${tokens.shadows.focus};

      fieldset {
        border-color: ${c.primary.main};
        border-width: 1px;
      }
    }

    &.Mui-disabled {
      background: ${c.slate[100]};
      color: ${c.slate[400]};
    }
  }

  & .MuiSelect-select {
    font-weight: 600;
    color: ${c.text.primary};
    display: flex;
    align-items: center;
  }

  & .MuiSelect-icon {
    color: ${c.text.secondary};
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiSelect-icon {
    color: ${c.primary.main};
  }

  & .MuiInputLabel-root {
    color: ${c.text.secondary};
    font-weight: 600;
  }

  & .MuiInputLabel-root.Mui-focused {
    color: ${c.primary.main};
  }

  ${({ $appSize }) => sizeStyles[$appSize]}
`

export const SelectChevronWrap = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

export const SelectChevronIcon = styled(KeyboardArrowDownRoundedIcon)`
  font-size: 1.35rem;
`

export const StyledMenuItem = styled(MenuItem)`
  min-height: 42px;
  margin: 2px 6px;
  border-radius: 10px;
  font-size: 0.925rem;
  font-weight: 600;
  color: ${c.text.primary};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &.Mui-selected {
    background: ${tokens.rgba.primary_10};
    color: ${c.primary.main};

    &:hover {
      background: ${tokens.rgba.primary_14};
    }
  }

  &:hover {
    background: ${tokens.rgba.slate900_04};
  }

  &.Mui-disabled {
    opacity: 0.55;
  }
`
