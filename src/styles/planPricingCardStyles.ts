import theme, { c, tokens } from '@/theme'

/** Shared pricing card styles — Buy Plan + Exam Plans catalog */
export const planPricingCardStyles = `
  .buy-plan-pricing-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid ${c.border.default};
    border-radius: 18px;
    background: ${c.surface.default};
    overflow: hidden;
    box-shadow: 0 4px 24px ${tokens.rgba.slate900_06};
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

  .buy-plan-pricing-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px ${tokens.rgba.slate900_08};
  }

  .buy-plan-pricing-card--featured {
    border: 2px solid ${c.primary.main};
    box-shadow: 0 8px 32px ${tokens.rgba.primary_14};
  }

  .buy-plan-pricing-card--featured:hover {
    box-shadow: 0 14px 40px ${tokens.rgba.primary_20};
  }

  .buy-plan-pricing-card--hidden {
    opacity: 0.88;
    border-color: ${c.border.soft};
  }

  .buy-plan-pricing-card--hidden .buy-plan-pricing-card__visual {
    filter: saturate(0.45);
  }

  .buy-plan-pricing-card__visual {
    position: relative;
    padding: 28px 24px 22px;
    color: ${c.text.inverse};
    min-height: 118px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 4px;
  }

  .buy-plan-pricing-card__badge {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
    padding: 6px 12px;
    border-radius: 999px;
    background: ${c.surface.default};
    color: ${c.primary.dark};
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: 0 2px 12px ${tokens.rgba.slate900_12};
  }

  .buy-plan-pricing-card__badge--hidden {
    color: ${c.text.secondary};
    background: ${c.surface.muted};
    text-transform: none;
    letter-spacing: 0.02em;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .buy-plan-pricing-card__admin-menu {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
  }

  .buy-plan-pricing-card__menu-btn {
    width: 34px !important;
    height: 34px !important;
    color: ${c.text.inverse} !important;
    background: rgba(255, 255, 255, 0.22) !important;
    border: 1px solid rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 2px 10px ${tokens.rgba.slate900_12};
    transition:
      background 0.18s ease,
      transform 0.18s ease;
  }

  .buy-plan-pricing-card__menu-btn:hover {
    background: rgba(255, 255, 255, 0.36) !important;
    transform: scale(1.04);
  }

  .buy-plan-pricing-card__name {
    margin: 0;
    padding-right: 88px;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .buy-plan-pricing-card__exams {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.95;
  }

  .buy-plan-pricing-card__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: ${theme.spacing(2)};
    padding: 24px 24px 26px;
    background: ${c.surface.default};
  }

  .buy-plan-pricing-card__price-row {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0;
    line-height: 1.1;
  }

  .buy-plan-pricing-card__price {
    margin: 0;
    font-size: clamp(1.55rem, 3.2vw, 2.05rem);
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  .buy-plan-pricing-card__per-exam {
    margin: -4px 0 2px;
    color: ${c.text.secondary};
    font-size: 0.84rem;
    font-weight: 500;
  }

  .buy-plan-pricing-card__features {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .buy-plan-pricing-card__feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: ${c.text.muted};
    font-size: 0.875rem;
    line-height: 1.45;
  }

  .buy-plan-pricing-card__feature-icon {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    margin-top: 0;
    border-radius: 50%;
    background: ${c.primary.main};
    color: ${c.surface.default};
    flex-shrink: 0;
  }

  .buy-plan-pricing-card__feature-icon svg {
    width: 14px;
    height: 14px;
    font-size: 14px;
  }

  .buy-plan-pricing-card__action.MuiButton-root {
    margin-top: auto;
    width: 100%;
    min-height: 50px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 0.94rem;
    letter-spacing: -0.01em;
  }

  .buy-plan-pricing-card__action.MuiButton-root:not(.buy-plan-pricing-card__action--featured) {
    border: 1px solid ${c.border.default} !important;
    background: ${c.surface.default} !important;
    color: ${c.text.primary} !important;
    box-shadow: none !important;
  }

  .buy-plan-pricing-card__action.MuiButton-root:not(.buy-plan-pricing-card__action--featured):hover {
    background: ${c.surface.muted} !important;
    border-color: ${c.slate[300]} !important;
  }

  .buy-plan-pricing-card__action--featured.MuiButton-root,
  .buy-plan-pricing-card--featured .buy-plan-pricing-card__action.MuiButton-root {
    background: ${c.primary.main} !important;
    border: none !important;
    color: ${c.surface.default} !important;
    box-shadow: 0 6px 18px ${tokens.rgba.primary_20} !important;
  }

  .buy-plan-pricing-card__action--featured.MuiButton-root:hover,
  .buy-plan-pricing-card--featured .buy-plan-pricing-card__action.MuiButton-root:hover {
    background: ${c.primary.dark} !important;
    box-shadow: 0 8px 22px ${tokens.rgba.primary_28} !important;
  }

  .buy-plan-pricing-card__action--preview.Mui-disabled {
    opacity: 1 !important;
    pointer-events: none;
  }
`
