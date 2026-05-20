import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
import { planPricingCardStyles } from '@/styles/planPricingCardStyles'

export const ExamPlansPageRoot = styled.div`
  ${planPricingCardStyles}
  .exam-plans-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
    width: 100%;
  }

  .exam-plans-page__hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
    padding: 22px 24px;
    border: 1px solid ${c.border.accent};
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      ${c.primary.tint} 0%,
      ${c.surface.default} 52%,
      ${c.surface.muted} 100%
    );
    box-shadow: 0 12px 30px ${tokens.rgba.primary_08};
  }

  .exam-plans-page__hero-main {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    min-width: 0;
  }

  .exam-plans-page__hero-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${c.gradient.primarySoft};
    color: ${c.surface.default};
    box-shadow: 0 10px 24px ${tokens.rgba.primary_28};
    flex-shrink: 0;

    svg {
      width: 28px;
      height: 28px;
      font-size: 28px;
    }
  }

  .exam-plans-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.45rem, 2vw, 1.65rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .exam-plans-page__subtitle {
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.94rem;
    line-height: 1.5;
    max-width: 54ch;
  }

  .exam-plans-page__actions {
    display: flex;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .exam-plans-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .exam-plans-page__stat {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px 16px 58px;
    border: 1px solid ${c.border.default};
    border-radius: 16px;
    background: ${c.surface.default};
    box-shadow: 0 8px 20px ${tokens.rgba.slate900_04};
    overflow: hidden;
  }

  .exam-plans-page__stat::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--exam-plans-stat-accent, ${c.primary.main});
  }

  .exam-plans-page__stat-icon {
    position: absolute;
    top: 14px;
    left: 14px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--exam-plans-stat-icon-bg, ${c.primary.tint});
    color: var(--exam-plans-stat-accent, ${c.primary.main});

    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }

  .exam-plans-page__stat--total {
    --exam-plans-stat-accent: ${c.primary.main};
    --exam-plans-stat-icon-bg: ${c.primary.tintStrong};
  }

  .exam-plans-page__stat--active {
    --exam-plans-stat-accent: ${c.success.main};
    --exam-plans-stat-icon-bg: ${c.success.bgSoft};
  }

  .exam-plans-page__stat--inactive {
    --exam-plans-stat-accent: ${c.text.disabled};
    --exam-plans-stat-icon-bg: ${c.surface.muted};
  }

  .exam-plans-page__stat--credits {
    --exam-plans-stat-accent: ${c.info.main};
    --exam-plans-stat-icon-bg: ${c.info.bgSoft};
  }

  .exam-plans-page__stat-label {
    margin: 0;
    font-size: 0.84rem;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .exam-plans-page__stat-value {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${c.text.primary};
    font-variant-numeric: tabular-nums;
  }

  .exam-plans-page__stat-meta {
    margin: 0;
    font-size: 0.76rem;
    color: ${c.text.disabled};
    line-height: 1.35;
  }

  .exam-plans-page__panel {
    border: 1px solid ${c.border.medium};
    border-radius: 18px;
    background: ${c.surface.default};
    overflow: hidden;
    box-shadow: 0 10px 28px ${tokens.rgba.slate900_04};
  }

  .exam-plans-page__panel-bar {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    padding: 20px 20px 18px;
    border-bottom: 1px solid ${c.border.divider};
    background: linear-gradient(
      180deg,
      ${c.surface.muted} 0%,
      ${c.surface.default} 100%
    );
  }

  .exam-plans-page__tabs {
    display: flex;
    flex-wrap: wrap;
  }

  .exam-plans-page__tabs-track {
    display: inline-flex;
    align-items: stretch;
    gap: 4px;
    padding: 4px;
    border-radius: 14px;
    border: 1px solid ${c.border.soft};
    background: ${tokens.rgba.slate900_04};
    box-shadow: inset 0 1px 2px ${tokens.rgba.slate900_04};
  }

  .exam-plans-page__tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 14px 0 12px;
    border: none;
    border-radius: 11px;
    background: transparent;
    color: ${c.text.secondary};
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
  }

  .exam-plans-page__tab:hover:not(.exam-plans-page__tab--active) {
    color: ${c.text.primary};
    background: ${tokens.rgba.white_95};
  }

  .exam-plans-page__tab--active {
    background: ${c.surface.default};
    color: ${c.primary.dark};
    box-shadow:
      0 1px 2px ${tokens.rgba.slate900_06},
      0 6px 16px ${tokens.rgba.primary_12};
  }

  .exam-plans-page__tab-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${tokens.rgba.slate900_06};
    color: ${c.text.muted};
    flex-shrink: 0;
    transition:
      background 0.18s ease,
      color 0.18s ease;

    svg {
      width: 17px;
      height: 17px;
      font-size: 17px;
    }
  }

  .exam-plans-page__tab--active .exam-plans-page__tab-icon {
    background: ${c.primary.tint};
    color: ${c.primary.main};
  }

  .exam-plans-page__tab-label {
    white-space: nowrap;
  }

  .exam-plans-page__tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: ${tokens.rgba.slate900_08};
    color: ${c.text.secondary};
    font-size: 0.72rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .exam-plans-page__tab--active .exam-plans-page__tab-badge {
    background: ${c.primary.main};
    color: ${c.surface.default};
  }

  .exam-plans-page__panel-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .exam-plans-page__panel-title {
    margin: 0;
    font-size: 1.08rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${c.text.primary};
  }

  .exam-plans-page__panel-desc {
    margin: 0;
    font-size: 0.88rem;
    color: ${c.text.secondary};
    line-height: 1.5;
    max-width: 62ch;
  }

  .exam-plans-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    margin: 0 18px 16px;
    padding: 12px 14px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.muted};
    flex-wrap: wrap;
  }

  .exam-plans-page__search {
    width: min(100%, 320px);
  }

  .exam-plans-page__search .MuiOutlinedInput-root {
    min-height: 44px;
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .exam-plans-page__filter-chips {
    display: flex;
    flex-shrink: 0;
  }

  .exam-plans-page__filter-track {
    display: inline-flex;
    gap: 3px;
    padding: 3px;
    border-radius: 11px;
    border: 1px solid ${c.border.soft};
    background: ${c.surface.default};
  }

  .exam-plans-page__filter-chip {
    min-height: 36px;
    padding: 0 12px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: ${c.text.secondary};
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .exam-plans-page__filter-chip:hover:not(.exam-plans-page__filter-chip--active) {
    color: ${c.text.primary};
    background: ${c.surface.muted};
  }

  .exam-plans-page__filter-chip--active {
    background: ${c.primary.main};
    color: ${c.surface.default};
    box-shadow: 0 4px 12px ${tokens.rgba.primary_20};
  }

  .exam-plans-page__catalog-meta {
    padding: 0 20px 12px;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${c.text.muted};
    letter-spacing: 0.01em;
  }

  .exam-plans-page__catalog-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(2.5)};
    padding: 0 20px 24px;
    align-items: stretch;
  }

  @media (max-width: 1100px) {
    .exam-plans-page__catalog-list {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  .exam-plans-page__empty {
    grid-column: 1 / -1;
    padding: 48px 24px;
    text-align: center;
    border: 1px dashed ${c.border.soft};
    border-radius: 14px;
    background: ${c.surface.muted};
  }

  .exam-plans-page__empty-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .exam-plans-page__empty-desc {
    margin: 8px auto 0;
    max-width: 36ch;
    font-size: 0.88rem;
    color: ${c.text.secondary};
    line-height: 1.45;
  }

  .exam-plans-page__history {
    padding: 0 18px 18px;
  }

  .exam-plans-page__history .purchase-history__table-wrap {
    overflow-x: auto;
    border: 1px solid ${c.border.divider};
    border-radius: 14px;
    background: ${c.surface.default};
  }

  .exam-plans-page__history .purchase-history__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;
  }

  .exam-plans-page__history .purchase-history__table thead {
    background: ${c.surface.muted};
  }

  .exam-plans-page__history .purchase-history__table th {
    text-align: left;
    padding: 12px 14px;
    font-size: 0.84rem;
    font-weight: 700;
    color: ${c.text.muted};
    border-bottom: 1px solid ${c.border.divider};
    white-space: nowrap;
  }

  .exam-plans-page__history .purchase-history__table td {
    padding: 12px 14px;
    font-size: 0.88rem;
    color: ${c.text.primary};
    border-top: 1px solid ${c.border.divider};
    vertical-align: middle;
  }

  .exam-plans-page__history .purchase-history__table tbody tr:hover {
    background: ${tokens.rgba.slate900_04};
  }

  .exam-plans-page__history .purchase-history__amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .exam-plans-page__history .purchase-history__credits {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 3px 8px;
    border-radius: 8px;
    background: ${c.primary.tint};
    color: ${c.primary.dark};
    font-size: 0.82rem;
    font-weight: 700;
  }

  .exam-plans-page__history .purchase-history__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-top: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .exam-plans-page__history .purchase-history__range {
    font-size: 0.86rem;
    color: ${c.text.secondary};
    font-weight: 500;
  }

  @media (max-width: 1100px) {
    .exam-plans-page__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .exam-plans-page__hero {
      padding: 18px;
    }

    .exam-plans-page__stats {
      grid-template-columns: 1fr;
    }

    .exam-plans-page__actions {
      width: 100%;
    }

    .exam-plans-page__actions > * {
      flex: 1;
      min-width: 0;
    }

    .exam-plans-page__panel-bar {
      padding: 16px;
    }

    .exam-plans-page__tabs-track {
      width: 100%;
    }

    .exam-plans-page__tab {
      flex: 1;
      justify-content: center;
      padding: 0 10px;
    }

    .exam-plans-page__tab-label {
      white-space: normal;
      text-align: center;
      line-height: 1.2;
    }

    .exam-plans-page__toolbar {
      margin: 0 14px 14px;
      flex-direction: column;
      align-items: stretch;
    }

    .exam-plans-page__search {
      width: 100%;
    }

    .exam-plans-page__filter-chips {
      width: 100%;
    }

    .exam-plans-page__filter-track {
      width: 100%;
    }

    .exam-plans-page__filter-chip {
      flex: 1;
    }

    .exam-plans-page__catalog-list {
      grid-template-columns: 1fr;
    }
  }
`
