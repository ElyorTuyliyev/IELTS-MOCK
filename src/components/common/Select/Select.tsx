import { forwardRef, type ReactNode } from 'react'
import {
  MenuItem,
  type SelectProps as MuiSelectProps,
  type SxProps,
  type TextFieldProps,
  type Theme,
} from '@mui/material'

import { c, tokens } from '../../../theme'
import type { AppSelectSize } from './Select.style'
import {
  SelectChevronIcon,
  SelectChevronWrap,
  StyledMenuItem,
  StyledSelect,
} from './Select.style'

export type SelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type SelectProps = Omit<TextFieldProps, 'select' | 'size'> & {
  size?: AppSelectSize
  options?: SelectOption[]
}

const defaultSelectSlot: Partial<MuiSelectProps> = {
  MenuProps: {
    slotProps: {
      paper: {
        elevation: 0,
        sx: {
          mt: 0.75,
          borderRadius: '14px',
          border: `1px solid ${c.border.default}`,
          boxShadow: tokens.shadows.dropdown,
          maxHeight: 320,
        },
      },
    },
  },
  IconComponent: () => (
    <SelectChevronWrap className="app-select__icon" aria-hidden>
      <SelectChevronIcon />
    </SelectChevronWrap>
  ),
}

function getMuiSize(appSize: AppSelectSize): TextFieldProps['size'] {
  return appSize === 'sm' ? 'small' : 'medium'
}

function resolveSelectSlotProps(
  slotProps: TextFieldProps['slotProps'],
): Partial<MuiSelectProps> {
  const selectSlotProps = slotProps?.select
  if (typeof selectSlotProps === 'function') {
    return defaultSelectSlot
  }

  const incoming = (selectSlotProps ?? {}) as Partial<MuiSelectProps>
  const defaultPaperSx = (defaultSelectSlot.MenuProps?.slotProps?.paper as { sx?: SxProps<Theme> } | undefined)
    ?.sx
  const incomingPaperSx = (incoming.MenuProps?.slotProps?.paper as { sx?: SxProps<Theme> } | undefined)?.sx

  return {
    ...defaultSelectSlot,
    ...incoming,
    MenuProps: {
      ...defaultSelectSlot.MenuProps,
      ...incoming.MenuProps,
      slotProps: {
        paper: {
          elevation: 0,
          sx: [defaultPaperSx, incomingPaperSx].filter(Boolean) as SxProps<Theme>,
        },
      },
    },
  }
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    size = 'md',
    options,
    children,
    className,
    slotProps,
    ...props
  },
  ref,
) {
  const renderedOptions =
    options?.map((option) => (
      <StyledMenuItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        className="app-select__option"
      >
        {option.label}
      </StyledMenuItem>
    )) ?? children

  return (
    <StyledSelect
      {...props}
      ref={ref}
      select
      $appSize={size}
      size={getMuiSize(size)}
      className={['app-select', className].filter(Boolean).join(' ')}
      slotProps={{
        ...slotProps,
        select: resolveSelectSlotProps(slotProps),
      }}
    >
      {renderedOptions}
    </StyledSelect>
  )
})

export { MenuItem, StyledMenuItem as SelectMenuItem }
