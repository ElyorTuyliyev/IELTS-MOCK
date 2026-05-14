import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const SignUpPageRoot = styled.div`
  .sign-up-page {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
    min-height: 100vh;
    padding: 28px;
    background: ${c.auth.shell};
  }

  .sign-up-page__hero,
  .sign-up-page__form-section {
    min-width: 0;
  }

  .sign-up-page__hero {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.spacing(4)};
    padding: 34px 28px 28px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 62%, ${tokens.rgba.authGlow}, transparent 26%),
      linear-gradient(180deg, ${c.auth.gradientStart} 0%, ${c.auth.gradientMid} 55%, ${c.auth.gradientEnd} 100%);
  }

  .sign-up-page__hero::before {
    content: '';
    position: absolute;
    inset: auto -4% 14% -8%;
    height: 280px;
    background:
      linear-gradient(${tokens.rgba.authGrid} 1px, transparent 1px),
      linear-gradient(90deg, ${tokens.rgba.authGrid} 1px, transparent 1px);
    background-size: 52px 52px;
    transform: perspective(1000px) rotateX(78deg);
    transform-origin: top center;
    pointer-events: none;
  }

  .sign-up-page__brand {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    width: fit-content;
    color: ${c.text.primary};
    text-decoration: none;
  }

  .sign-up-page__brand-mark {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(180deg, ${c.auth.buttonGradientStart} 0%, ${c.auth.buttonGradientEnd} 100%);
    color: ${c.surface.default};
    box-shadow: 0 18px 32px ${tokens.rgba.primary_28};
  }

  .sign-up-page__brand-mark svg {
    width: 24px;
    height: 24px;
  }

  .sign-up-page__brand-name {
    font-size: 21px;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .sign-up-page__hero-copy {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding-top: 8px;
    text-align: center;
  }

  .sign-up-page__hero-title {
    margin: 0;
    font-size: clamp(44px, 4.4vw, 64px);
    line-height: 1.14;
    letter-spacing: -0.04em;
    color: ${c.text.primary};
  }

  .sign-up-page__hero-text {
    max-width: 720px;
    margin: 26px auto 0;
    font-size: 18px;
    line-height: 1.65;
    color: ${c.text.muted};
  }

  .sign-up-page__visual {
    position: relative;
    z-index: 1;
    min-height: 520px;
    padding-top: 84px;
  }

  .sign-up-page__visual-shape {
    position: absolute;
    right: 4%;
    bottom: 24px;
    width: 160px;
    height: 92px;
    border-radius: 80px 80px 28px 28px;
    background: radial-gradient(circle at 30% 30%, ${tokens.rgba.primary_28}, ${tokens.rgba.primary_14});
    transform: rotate(-28deg);
    filter: blur(1px);
  }

  .sign-up-page__chart-card {
    position: relative;
    width: min(100%, 700px);
    min-height: 420px;
    padding: 28px 24px 24px;
    margin: 110px auto 0;
    border: 1px solid ${tokens.rgba.border_24};
    border-radius: 28px;
    background: ${tokens.rgba.white_92};
    box-shadow: 0 28px 70px ${tokens.rgba.primary_20};
    backdrop-filter: blur(10px);
  }

  .sign-up-page__chart-card-header {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(2.5)};
    align-items: flex-start;
  }

  .sign-up-page__card-title {
    margin: 0;
    font-size: 18px;
    line-height: 1.25;
    color: ${c.text.primary};
  }

  .sign-up-page__card-subtitle {
    margin: 22px 0 0;
    font-size: 16px;
    color: ${c.text.secondary};
  }

  .sign-up-page__legend {
    display: flex;
    gap: ${theme.spacing(2.75)};
    flex-wrap: wrap;
    padding-top: 4px;
    font-size: 15px;
    color: ${c.text.muted};
  }

  .sign-up-page__legend-item {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
  }

  .sign-up-page__legend-dot {
    display: inline-flex;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    box-shadow:
      inset 0 0 0 2px ${tokens.rgba.white_92},
      0 0 0 5px ${tokens.rgba.primary_14};
  }

  .sign-up-page__legend-dot--primary {
    background: ${c.auth.badge};
  }

  .sign-up-page__legend-dot--muted {
    background: ${c.auth.badgeSoft};
    box-shadow:
      inset 0 0 0 2px ${tokens.rgba.white_92},
      0 0 0 5px ${tokens.rgba.primaryLight_22};
  }

  .sign-up-page__chart {
    position: relative;
    display: flex;
    align-items: end;
    gap: ${theme.spacing(3)};
    height: 280px;
    margin-top: 26px;
    padding: 0 18px 34px;
    color: ${c.primary.light};
  }

  .sign-up-page__chart::before {
    content: '';
    position: absolute;
    inset: 0 0 34px;
    border-radius: 20px;
    background:
      linear-gradient(${tokens.rgba.border_24} 1px, transparent 1px),
      linear-gradient(90deg, transparent 100%, transparent 100%);
    background-size: 100% 64px;
    background-position: left 6px;
    opacity: 0.9;
    pointer-events: none;
  }

  .sign-up-page__chart-bar {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 34px;
    border-radius: 18px 18px 0 0;
    background: linear-gradient(180deg, ${tokens.rgba.primary_28}, ${tokens.rgba.primaryLight_22});
  }

  .sign-up-page__chart svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 12px 18px ${tokens.rgba.primary_20});
  }

  .sign-up-page__floating-card {
    position: absolute;
    border: 1px solid ${tokens.rgba.border_24};
    border-radius: 22px;
    background: ${tokens.rgba.white_92};
    box-shadow: 0 18px 42px ${tokens.rgba.primary_20};
  }

  .sign-up-page__floating-card--top {
    top: 8px;
    right: 10%;
    width: min(100%, 330px);
    padding: 18px 18px 16px;
  }

  .sign-up-page__floating-card--bottom {
    left: clamp(-8px, 1vw, 18px);
    bottom: -12px;
    width: min(100%, 290px);
    padding: 18px 18px 14px;
  }

  .sign-up-page__floating-card--top::after {
    content: '';
    position: absolute;
    right: 20px;
    bottom: 18px;
    width: 100px;
    height: 48px;
    background:
      linear-gradient(130deg, transparent 10%, ${c.teal.accent} 11%, ${c.teal.accent} 18%, transparent 19%),
      linear-gradient(45deg, transparent 37%, ${c.teal.accent} 38%, ${c.teal.accent} 46%, transparent 47%),
      linear-gradient(145deg, transparent 59%, ${c.teal.accent} 60%, ${c.teal.accent} 66%, transparent 67%);
    opacity: 0.95;
  }

  .sign-up-page__floating-card--bottom::after {
    content: '';
    position: absolute;
    right: 18px;
    bottom: 20px;
    width: 112px;
    height: 52px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 10% 72%, ${c.primary.light} 0 10px, transparent 11px),
      linear-gradient(135deg, transparent 12%, ${c.primary.light} 13%, ${c.primary.light} 17%, transparent 18%),
      linear-gradient(45deg, transparent 47%, ${c.primary.light} 48%, ${c.primary.light} 52%, transparent 53%),
      linear-gradient(135deg, transparent 70%, ${c.primary.light} 71%, ${c.primary.light} 75%, transparent 76%);
    opacity: 0.92;
  }

  .sign-up-page__floating-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
  }

  .sign-up-page__floating-card-title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .sign-up-page__floating-card-arrow {
    font-size: 26px;
    line-height: 1;
    color: ${c.text.primary};
  }

  .sign-up-page__floating-card-label {
    margin: 18px 0 6px;
    font-size: 15px;
    color: ${c.text.muted};
  }

  .sign-up-page__floating-card-value {
    font-size: 28px;
    line-height: 1;
    color: ${c.text.primary};
  }

  .sign-up-page__pagination {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: ${theme.spacing(1.5)};
  }

  .sign-up-page__pagination-dot {
    width: 18px;
    height: 8px;
    border-radius: 999px;
    background: ${c.auth.dot};
    transition: width 180ms ease;
  }

  .sign-up-page__pagination-dot--active {
    width: 34px;
    background: ${c.auth.dotActive};
  }

  .sign-up-page__form-section {
    display: grid;
    place-items: center;
    padding: 40px 32px;
    background:
      linear-gradient(180deg, ${tokens.rgba.white_92}, ${tokens.rgba.white_92}),
      linear-gradient(180deg, ${c.surface.default} 0%, ${c.auth.cardBg} 100%);
  }

  .sign-up-page__form-card {
    width: min(100%, 640px);
    padding: 46px 48px 42px;
    border: 1px solid ${c.auth.cardBorder};
    border-radius: 30px;
    background:
      linear-gradient(180deg, ${tokens.rgba.primaryLight_22} 0, transparent 140px),
      ${c.surface.default};
    box-shadow:
      inset 0 1px 0 ${tokens.rgba.white_92},
      0 18px 44px ${tokens.rgba.primary_12};
  }

  .sign-up-page__form-badge {
    display: grid;
    place-items: center;
    width: 94px;
    height: 94px;
    margin: 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at center, ${c.auth.accent} 0 28px, transparent 29px),
      radial-gradient(circle at center, ${tokens.rgba.primary_14} 0 44px, transparent 45px),
      linear-gradient(${tokens.rgba.primaryLight_12} 1px, transparent 1px),
      linear-gradient(90deg, ${tokens.rgba.primaryLight_12} 1px, transparent 1px);
    background-size: auto, auto, 28px 28px, 28px 28px;
    color: ${c.surface.default};
  }

  .sign-up-page__form-badge svg {
    width: 24px;
    height: 24px;
  }

  .sign-up-page__form-title {
    margin: 34px 0 0;
    text-align: center;
    font-size: clamp(36px, 3.2vw, 54px);
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: ${c.text.primary};
  }

  .sign-up-page__form-subtitle {
    margin: 18px 0 0;
    text-align: center;
    font-size: 18px;
    color: ${c.text.secondary};
  }

  .sign-up-page__social-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2)};
    margin-top: 34px;
  }

  .sign-up-page__social-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(1.5)};
    min-height: 56px;
    border: 1px solid ${c.neutral[600]};
    border-radius: 16px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
  }

  .sign-up-page__social-button svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .sign-up-page__divider {
    position: relative;
    margin: 28px 0 30px;
    text-align: center;
  }

  .sign-up-page__divider::before {
    content: '';
    position: absolute;
    inset: 50% 0 auto;
    border-top: 1px solid ${c.neutral[700]};
  }

  .sign-up-page__divider-label {
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 0 14px;
    background: ${c.surface.default};
    font-size: 15px;
    color: ${c.text.secondary};
  }

  .sign-up-page__field-group {
    display: grid;
    gap: ${theme.spacing(1.25)};
  }

  .sign-up-page__field-group + .sign-up-page__field-group {
    margin-top: 18px;
  }

  .sign-up-page__field-label {
    font-size: 16px;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .sign-up-page__field .MuiOutlinedInput-root {
    min-height: 58px;
    border-radius: 16px;
    background: ${c.surface.default};
  }

  .sign-up-page__field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${c.primary.light};
  }

  .sign-up-page__field-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    color: ${c.text.secondary};
  }

  .sign-up-page__field-icon svg {
    width: 100%;
    height: 100%;
  }

  .sign-up-page__form-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    margin-top: 14px;
  }

  .sign-up-page__checkbox-label {
    margin: 0;
    color: ${c.text.muted};
  }

  .sign-up-page__checkbox-label .MuiCheckbox-root {
    color: ${c.primary.light};
  }

  .sign-up-page__checkbox-label .MuiTypography-root {
    font-size: 15px;
  }

  .sign-up-page__forgot-link {
    font-size: 15px;
    font-weight: 700;
    color: ${c.text.primary};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .sign-up-page__submit-button {
    min-height: 58px;
    margin-top: 28px;
    border-radius: 16px;
    background: linear-gradient(90deg, ${c.auth.buttonBar} 0%, ${c.auth.buttonBarEnd} 48%, ${c.auth.buttonBar} 100%);
    box-shadow: 0 18px 28px ${tokens.rgba.primary_28};
    color: ${c.surface.default};
    font-size: 16px;
    font-weight: 700;
    text-transform: none;
  }

  .sign-up-page__footer-text {
    margin: 26px 0 0;
    text-align: center;
    font-size: 16px;
    color: ${c.text.secondary};
  }

  .sign-up-page__footer-link {
    font-size: inherit;
    font-weight: 700;
    color: ${c.auth.accent};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 1200px) {
    .sign-up-page {
      grid-template-columns: minmax(0, 1fr);
    }

    .sign-up-page__hero {
      min-height: 860px;
    }
  }

  @media (max-width: 767px) {
    .sign-up-page {
      padding: 12px;
    }

    .sign-up-page__hero {
      min-height: auto;
      padding: 24px 18px;
    }

    .sign-up-page__hero-title {
      font-size: 34px;
    }

    .sign-up-page__hero-text {
      margin-top: 18px;
      font-size: 16px;
    }

    .sign-up-page__visual {
      min-height: 440px;
      padding-top: 48px;
    }

    .sign-up-page__chart-card {
      min-height: 360px;
      padding: 22px 16px 18px;
      margin-top: 96px;
    }

    .sign-up-page__chart-card-header {
      flex-direction: column;
    }

    .sign-up-page__card-subtitle {
      margin-top: 10px;
      font-size: 14px;
    }

    .sign-up-page__chart {
      gap: ${theme.spacing(1.5)};
      height: 230px;
      padding-inline: 10px;
    }

    .sign-up-page__chart-bar {
      max-width: 18px;
    }

    .sign-up-page__floating-card--top {
      right: 4%;
      width: 240px;
      padding: 16px;
    }

    .sign-up-page__floating-card--bottom {
      width: 220px;
      padding: 16px;
    }

    .sign-up-page__form-section {
      padding: 20px 14px 26px;
    }

    .sign-up-page__form-card {
      padding: 30px 18px 24px;
      border-radius: 24px;
    }

    .sign-up-page__form-title {
      margin-top: 24px;
      font-size: 34px;
    }

    .sign-up-page__social-actions {
      grid-template-columns: minmax(0, 1fr);
    }

    .sign-up-page__form-meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`
