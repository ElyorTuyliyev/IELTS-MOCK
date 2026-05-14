import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const NotFoundPageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${c.gradient.notFoundBg};
  padding: 24px;

  .not-found__card {
    max-width: 520px;
    width: 100%;
    text-align: center;
    padding: 56px 40px;
    border-radius: 28px;
    background: ${c.surface.default};
    border: 1px solid ${c.border.default};
    box-shadow:
      0 20px 50px ${tokens.rgba.slate900_06},
      0 1px 3px ${tokens.rgba.slate900_04};
  }

  .not-found__code {
    font-size: 120px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    background: ${c.gradient.notFound};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .not-found__title {
    font-size: 26px;
    font-weight: 800;
    color: ${c.text.primary};
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .not-found__description {
    font-size: 16px;
    color: ${c.text.secondary};
    line-height: 1.55;
    margin-bottom: 32px;
  }

  .not-found__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .not-found__btn-home.MuiButton-root {
    min-width: 160px;
    min-height: 48px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 14px;
    text-transform: none;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 12px ${tokens.rgba.primary_28};
  }

  .not-found__btn-home.MuiButton-root:hover {
    box-shadow: 0 6px 16px ${tokens.rgba.primary_28};
  }

  .not-found__btn-back.MuiButton-root {
    min-width: 140px;
    min-height: 48px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 14px;
    text-transform: none;
    letter-spacing: 0.01em;
    color: ${c.text.muted};
    border-color: ${c.border.strong};
  }

  .not-found__btn-back.MuiButton-root:hover {
    background: ${c.background.subtle};
    border-color: ${c.text.disabled};
  }
`
