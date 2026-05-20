import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
import { planPricingCardStyles } from '@/styles/planPricingCardStyles'

export const BuyPlanPageRoot = styled.div`
  ${planPricingCardStyles}
  .buy-plan-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
    max-width: 1080px;
    margin: 0 auto;
    padding: ${theme.spacing(3)};
    width: 100%;
  }

  .buy-plan-page__hero {
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(2)};
    padding: 24px 26px;
    border: 1px solid ${c.border.accent};
    border-radius: 22px;
    background: linear-gradient(135deg, ${c.primary.tint} 0%, ${c.surface.default} 52%, ${c.surface.muted} 100%);
    box-shadow: ${tokens.shadows.accent};
  }

  .buy-plan-page__hero-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 16px;
    background: ${c.gradient.primarySoft};
    color: ${c.surface.default};
    box-shadow: 0 10px 24px ${tokens.rgba.primary_28};
    flex-shrink: 0;

    svg {
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }

  .buy-plan-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.5rem, 2.4vw, 1.85rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .buy-plan-page__subtitle {
    margin: 8px 0 0;
    color: ${c.text.secondary};
    font-size: 0.95rem;
    line-height: 1.55;
    max-width: 52ch;
  }

  .buy-plan-page__credits {
    border: 1px solid ${c.border.accent};
    border-radius: 20px;
    background: ${c.gradient.card};
    box-shadow: 0 10px 28px ${tokens.rgba.slate900_06};
    overflow: hidden;
  }

  .buy-plan-page__credits-inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: ${theme.spacing(2.5)};
    padding: 22px 24px;
  }

  @media (max-width: 720px) {
    .buy-plan-page__credits-inner {
      grid-template-columns: 1fr;
    }
  }

  .buy-plan-page__credits-stat {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px 20px;
    border-radius: 16px;
    background: ${c.gradient.primary};
    color: ${c.text.inverse};
    box-shadow: 0 12px 28px ${tokens.rgba.primary_20};
  }

  .buy-plan-page__credits-label {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.9;
  }

  .buy-plan-page__credits-value {
    margin: 0;
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .buy-plan-page__credits-hint {
    margin: 0;
    font-size: 0.82rem;
    opacity: 0.88;
  }

  .buy-plan-page__credits-plan {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;
  }

  .buy-plan-page__credits-plan-label {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${c.text.secondary};
  }

  .buy-plan-page__credits-plan-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .buy-plan-page__credits-plan-name {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .buy-plan-page__credits-meta {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
  }

  .buy-plan-page__credits-date {
    margin: 0;
    color: ${c.text.disabled};
    font-size: 0.8rem;
  }

  .buy-plan-page__section-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .buy-plan-page__section-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .buy-plan-page__section-subtitle {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
  }

  .buy-plan-page__plans-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(2.5)};
    align-items: stretch;
  }

  @media (max-width: 1100px) {
    .buy-plan-page__plans-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  .buy-plan-page__checkout {
    border: 1px solid ${c.border.accent};
    border-radius: 22px;
    background: ${c.surface.default};
    overflow: hidden;
    box-shadow: ${tokens.shadows.card};
  }

  .buy-plan-page__checkout-header {
    padding: 22px 24px;
    background: ${c.gradient.modalHeader};
    border-bottom: 1px solid ${c.border.divider};
  }

  .buy-plan-page__checkout-kicker {
    margin: 0 0 6px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${c.primary.dark};
  }

  .buy-plan-page__checkout-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .buy-plan-page__checkout-summary {
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.92rem;
  }

  .buy-plan-page__checkout-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
  }

  .buy-plan-page__steps {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .buy-plan-page__step {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: ${c.background.subtle};
    color: ${c.text.secondary};
    font-size: 0.82rem;
    font-weight: 600;
  }

  .buy-plan-page__step--active {
    background: ${c.primary.tintStrong};
    color: ${c.primary.dark};
  }

  .buy-plan-page__step-num {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${c.surface.default};
    font-size: 0.75rem;
    font-weight: 800;
    color: ${c.primary.main};
  }

  .buy-plan-page__instructions {
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid ${c.border.default};
    background: ${c.background.soft};
  }

  .buy-plan-page__instructions-title {
    margin: 0 0 10px;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .buy-plan-page__instructions-text {
    margin: 0;
    white-space: pre-wrap;
    color: ${c.text.muted};
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .buy-plan-page__note-field .MuiOutlinedInput-root {
    border-radius: 14px;
    background: ${c.surface.default};
  }

  .buy-plan-page__checkout-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .buy-plan-page__checkout-actions .MuiButton-root {
    min-height: 46px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
  }

  .buy-plan-page__history {
    padding-top: ${theme.spacing(1)};
  }

  .buy-plan-page__history-divider {
    margin: 0 0 ${theme.spacing(3)};
    border: none;
    border-top: 1px solid ${c.border.divider};
  }

  .buy-plan-page__loading,
  .buy-plan-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 56px 24px;
    border: 1px dashed ${c.border.strong};
    border-radius: 20px;
    text-align: center;
    color: ${c.text.secondary};
    background: ${c.background.muted};
  }

  .buy-plan-page__empty-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }
`
