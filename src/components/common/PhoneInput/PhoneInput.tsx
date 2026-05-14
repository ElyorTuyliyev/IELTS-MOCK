import { forwardRef, type ChangeEvent } from 'react'
import { TextField, type TextFieldProps } from '@mui/material'

import { formatUzPhone, normalizeUzPhoneDigits } from './phoneFormat'

export const PhoneInput = forwardRef<HTMLInputElement, TextFieldProps>(function PhoneInput(
  { value, onChange, placeholder = '+998(90)123-45-67', ...props },
  ref,
) {
  const formattedValue = formatUzPhone(String(value ?? ''))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = normalizeUzPhoneDigits(event.target.value)
    const nextValue = digits ? formatUzPhone(digits) : ''

    if (onChange) {
      onChange({
        ...event,
        target: { ...event.target, value: nextValue },
        currentTarget: { ...event.currentTarget, value: nextValue },
      })
    }
  }

  return (
    <TextField
      {...props}
      ref={ref}
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      placeholder={placeholder}
      value={formattedValue}
      onChange={handleChange}
    />
  )
})
