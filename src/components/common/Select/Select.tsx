import { forwardRef, type ReactNode } from 'react'
import { MenuItem, type TextFieldProps } from '@mui/material'

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

const defaultMenuProps: TextFieldProps['slotProps'] = {
  select: {
    MenuProps: {
      PaperProps: {
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
    IconComponent: () => (
      <SelectChevronWrap className="app-select__icon" aria-hidden>
        <SelectChevronIcon />
      </SelectChevronWrap>
    ),
  },
}

function getMuiSize(appSize: AppSelectSize): TextFieldProps['size'] {
  return appSize === 'sm' ? 'small' : 'medium'
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
  const selectSlotProps = slotProps?.select
  const defaultSelectSlot = defaultMenuProps?.select
  const mergedSelectSlot =
    typeof selectSlotProps === 'function'
      ? selectSlotProps
      : {
          ...defaultSelectSlot,
          ...selectSlotProps,
          MenuProps: {
            ...defaultSelectSlot?.MenuProps,
            ...selectSlotProps?.MenuProps,
            PaperProps: {
              ...defaultSelectSlot?.MenuProps?.PaperProps,
              ...selectSlotProps?.MenuProps?.PaperProps,
              sx: {
                ...(typeof defaultSelectSlot?.MenuProps?.PaperProps?.sx === 'object'
                  ? defaultSelectSlot.MenuProps.PaperProps.sx
                  : {}),
                ...(typeof selectSlotProps?.MenuProps?.PaperProps?.sx === 'object'
                  ? selectSlotProps.MenuProps.PaperProps.sx
                  : {}),
              },
            },
          },
        }

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
        select: mergedSelectSlot,
      }}
    >
      {renderedOptions}
    </StyledSelect>
  )
})

export { MenuItem, StyledMenuItem as SelectMenuItem }
