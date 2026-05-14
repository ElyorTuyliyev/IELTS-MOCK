import { css } from '@emotion/react'

import { menuActionGlobalStyles } from '../components/common/MenuAction'
import { tokens, c } from '../theme/tokens'

export const globalStyles = css`
  :root {
    font-family: ${tokens.typography.fontFamily};
    color: ${c.text.primary};
    background: ${c.background.default};
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at top left, ${tokens.rgba.primary_14}, transparent 28%),
      ${c.gradient.body};
  }

  button,
  input,
  select {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ${menuActionGlobalStyles}
`
