import { forwardRef, type ElementType, type ForwardedRef, type ReactElement } from 'react'
import { CircularProgress, type ButtonProps as MuiButtonProps } from '@mui/material'

import {
  StyledButton,
  type AppButtonSize,
  type AppButtonVariant,
} from './Button.style'

type AppButtonOwnProps = {
  variant?: AppButtonVariant
  size?: AppButtonSize
  loading?: boolean
}

export type ButtonProps<RootComponent extends ElementType = 'button'> = Omit<
  MuiButtonProps<RootComponent>,
  'variant' | 'size' | 'color' | 'loading'
> &
  AppButtonOwnProps

function getMuiVariant(appVariant: AppButtonVariant): MuiButtonProps['variant'] {
  if (appVariant === 'text') return 'text'
  if (appVariant === 'primary') return 'contained'
  return 'outlined'
}

function getMuiColor(appVariant: AppButtonVariant): MuiButtonProps['color'] {
  if (appVariant === 'danger') return 'error'
  if (appVariant === 'secondary' || appVariant === 'ghost') return 'inherit'
  return 'primary'
}

export const Button = forwardRef(function Button<RootComponent extends ElementType = 'button'>(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    children,
    ...props
  }: ButtonProps<RootComponent>,
  ref: ForwardedRef<unknown>,
) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <StyledButton
      {...props}
      ref={ref}
      $appVariant={variant}
      $appSize={size}
      variant={getMuiVariant(variant)}
      color={getMuiColor(variant)}
      disabled={isDisabled}
      className={['app-button', loading && 'app-button--loading', className].filter(Boolean).join(' ')}
    >
      {loading ? (
        <CircularProgress size={size === 'sm' ? 16 : 20} color="inherit" aria-label="Loading" />
      ) : (
        children
      )}
    </StyledButton>
  )
}) as <RootComponent extends ElementType = 'button'>(
  props: ButtonProps<RootComponent> & { ref?: ForwardedRef<unknown> },
) => ReactElement
