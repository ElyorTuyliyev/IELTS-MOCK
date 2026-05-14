import { forwardRef, useState } from 'react'
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from '@mui/material'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

export const PasswordTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function PasswordTextField({ slotProps, ...props }, ref) {
    const [visible, setVisible] = useState(false)
    const inputSlotProps = slotProps?.input

    return (
      <TextField
        {...props}
        ref={ref}
        type={visible ? 'text' : 'password'}
        slotProps={{
          ...slotProps,
          input: {
            ...inputSlotProps,
            endAdornment: (
              <>
                {inputSlotProps?.endAdornment}
                <InputAdornment position="end">
                  <IconButton
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible((current) => !current)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                    {visible ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              </>
            ),
          },
        }}
      />
    )
  },
)
