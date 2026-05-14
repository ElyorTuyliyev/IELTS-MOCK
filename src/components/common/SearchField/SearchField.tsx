import { forwardRef } from 'react'
import { InputAdornment, type TextFieldProps } from '@mui/material'

import {
  SearchFieldIcon,
  SearchFieldIconWrap,
  StyledSearchField,
} from './SearchField.style'

export type SearchFieldProps = TextFieldProps & {
  showIcon?: boolean
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    {
      className,
      type = 'search',
      placeholder = 'Search...',
      showIcon = true,
      slotProps,
      ...props
    },
    ref,
  ) {
    const inputSlotProps = slotProps?.input

    return (
      <StyledSearchField
        {...props}
        ref={ref}
        className={['search-field', !showIcon && 'search-field--no-icon', className]
          .filter(Boolean)
          .join(' ')}
        type={type}
        placeholder={placeholder}
        slotProps={{
          ...slotProps,
          input: {
            ...inputSlotProps,
            startAdornment: showIcon ? (
              <>
                <InputAdornment position="start">
                  <SearchFieldIconWrap className="search-field__icon" aria-hidden>
                    <SearchFieldIcon />
                  </SearchFieldIconWrap>
                </InputAdornment>
                {inputSlotProps?.startAdornment}
              </>
            ) : (
              inputSlotProps?.startAdornment
            ),
          },
        }}
      />
    )
  },
)
