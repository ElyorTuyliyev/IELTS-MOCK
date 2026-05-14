import { createTheme } from '@mui/material/styles'

import { tokens } from './tokens'

const { colors: c } = tokens

export const muiTheme = createTheme({
  spacing: tokens.spacing.unit,
  palette: {
    primary: {
      main: c.primary.main,
      light: c.primary.light,
      dark: c.primary.dark,
    },
    text: {
      primary: c.text.primary,
      secondary: c.text.secondary,
      disabled: c.text.disabled,
    },
    background: {
      default: c.background.default,
      paper: c.surface.default,
    },
    success: {
      main: c.success.main,
      dark: c.success.dark,
      light: c.success.bg,
    },
    error: {
      main: c.error.main,
      dark: c.error.dark,
      light: c.error.bg,
    },
    warning: {
      main: c.warning.main,
      dark: c.warning.bright,
      light: c.warning.bg,
    },
    info: {
      main: c.info.main,
      dark: c.info.dark,
      light: c.info.bg,
    },
    grey: {
      50: c.slate[50],
      100: c.slate[100],
      200: c.slate[200],
      300: c.slate[300],
      400: c.slate[400],
      500: c.slate[500],
      600: c.slate[600],
      700: c.slate[700],
      800: c.slate[800],
      900: c.slate[900],
    },
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
  },
  shape: {
    borderRadius: tokens.radii.sm,
  },
})
