import { forwardRef } from 'react'
import { TextField, type TextFieldProps } from '@mui/material'

export const DateInput = forwardRef<HTMLInputElement, TextFieldProps>(function DateInput(
  { slotProps, ...props },
  ref,
) {
  const inputLabelSlotProps = slotProps?.inputLabel

  return (
    <TextField
      {...props}
      ref={ref}
      type="date"
      slotProps={{
        ...slotProps,
        inputLabel: {
          shrink: true,
          ...(typeof inputLabelSlotProps === 'object' ? inputLabelSlotProps : {}),
        },
      }}
    />
  )
})
