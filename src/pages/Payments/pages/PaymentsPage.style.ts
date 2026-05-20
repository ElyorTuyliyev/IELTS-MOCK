import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const PaymentsPageRoot = styled.div`
  .payments-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
    width: 100%;
  }

  .payments-page__hero {
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

  .payments-page__hero-main {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    min-width: 0;
  }

  .payments-page__hero-icon {
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

  .payments-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.45rem, 2vw, 1.65rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .payments-page__subtitle {
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.94rem;
    line-height: 1.5;
    max-width: 52ch;
  }

  .payments-page__actions {
    display: flex;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .payments-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .payments-page__stat {
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

  .payments-page__stat::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--payments-stat-accent, ${c.primary.main});
  }

  .payments-page__stat-icon {
    position: absolute;
    top: 14px;
    left: 14px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--payments-stat-icon-bg, ${c.primary.tint});
    color: var(--payments-stat-accent, ${c.primary.main});

    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }

  .payments-page__stat--pending {
    --payments-stat-accent: ${c.warning.main};
    --payments-stat-icon-bg: ${c.warning.bg};
  }

  .payments-page__stat--payments {
    --payments-stat-accent: ${c.success.main};
    --payments-stat-icon-bg: ${c.success.bgSoft};
  }

  .payments-page__stat--centers {
    --payments-stat-accent: ${c.info.main};
    --payments-stat-icon-bg: ${c.info.bgSoft};
  }

  .payments-page__stat--credits {
    --payments-stat-accent: ${c.primary.main};
    --payments-stat-icon-bg: ${c.primary.tintStrong};
  }

  .payments-page__stat-label {
    margin: 0;
    font-size: 0.84rem;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .payments-page__stat-value {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${c.text.primary};
    font-variant-numeric: tabular-nums;
  }

  .payments-page__stat-meta {
    margin: 0;
    font-size: 0.76rem;
    color: ${c.text.disabled};
    line-height: 1.35;
  }

  .payments-page__panel {
    border: 1px solid ${c.border.medium};
    border-radius: 18px;
    background: ${c.surface.default};
    overflow: hidden;
    box-shadow: 0 10px 28px ${tokens.rgba.slate900_04};
  }

  .payments-page__tabs {
    display: flex;
    gap: ${theme.spacing(0.75)};
    padding: 14px 16px;
    border-bottom: 1px solid ${c.border.divider};
    background: ${c.surface.muted};
    flex-wrap: wrap;
  }

  .payments-page__tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.secondary};
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .payments-page__tab:hover:not(.payments-page__tab--active) {
    border-color: ${c.border.medium};
    color: ${c.text.primary};
  }

  .payments-page__tab--active,
  .payments-page__tab--active:hover {
    border-color: ${c.primary.main};
    background: ${c.primary.main};
    color: ${c.text.inverse};
    box-shadow: 0 8px 18px ${tokens.rgba.primary_20};
  }

  .payments-page__tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 999px;
    background: ${tokens.rgba.slate900_08};
    font-size: 0.72rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .payments-page__tab--active .payments-page__tab-badge {
    background: ${tokens.rgba.white_92};
    color: ${c.primary.dark};
  }

  .payments-page__panel-head {
    padding: 16px 18px 0;
  }

  .payments-page__panel-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .payments-page__panel-desc {
    margin: 4px 0 0;
    font-size: 0.86rem;
    color: ${c.text.secondary};
    line-height: 1.45;
  }

  .payments-table {
    overflow: hidden;
    background: ${c.surface.default};
  }

  .payments-table__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding: 14px 18px 16px;
    flex-wrap: wrap;
  }

  .payments-table__search {
    width: min(100%, 340px);
  }

  .payments-table__search .MuiOutlinedInput-root {
    min-height: 44px;
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .payments-table__hint {
    font-size: 0.82rem;
    color: ${c.text.disabled};
    font-weight: 500;
  }

  .payments-table__grid-wrap {
    width: 100%;
    min-height: 420px;
    height: clamp(420px, 58vh, 560px);
  }

  .payments-table__grid-wrap .MuiDataGrid-root {
    height: 100%;
  }

  .MuiDataGrid-root {
    border: 0;
    background: transparent;
  }

  .MuiDataGrid-main,
  .MuiDataGrid-virtualScroller {
    overflow-x: auto;
  }

  .MuiDataGrid-main {
    min-height: 0;
  }

  .MuiDataGrid-columnHeaders {
    background: ${c.surface.muted};
    border-bottom: 1px solid ${c.border.divider};
  }

  .MuiDataGrid-columnHeader,
  .MuiDataGrid-cell {
    padding: 0 14px;
  }

  .MuiDataGrid-columnHeader:focus,
  .MuiDataGrid-columnHeader:focus-within,
  .MuiDataGrid-cell:focus,
  .MuiDataGrid-cell:focus-within {
    outline: none;
  }

  .MuiDataGrid-columnHeaderTitle {
    color: ${c.text.muted};
    font-size: 0.88rem;
    font-weight: 700;
  }

  .MuiDataGrid-cell--textLeft,
  .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .MuiDataGrid-row {
    border-top: 1px solid ${c.border.divider};
  }

  .MuiDataGrid-row:hover {
    background: ${tokens.rgba.slate900_04};
  }

  .MuiDataGrid-cell {
    border-top: 0;
    color: ${c.text.primary};
    font-weight: 500;
    overflow: hidden;
  }

  .MuiDataGrid-cell--withRenderer {
    overflow: visible;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .payments-table__amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${c.text.primary};
  }

  .payments-table__credits {
    font-size: 0.88rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${c.text.primary};
  }

  .payments-table__source {
    font-size: 0.86rem;
    font-weight: 600;
    color: ${c.text.secondary};
    white-space: nowrap;
  }

  .payments-table__source--plan {
    color: ${c.success.payment};
  }

  .payments-table__actions {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    width: 100%;
    min-width: 0;
  }

  .payments-table__note {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${c.text.secondary};
    font-size: 0.86rem;
  }

  @media (max-width: 1100px) {
    .payments-page__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .payments-page__hero {
      padding: 18px;
    }

    .payments-page__stats {
      grid-template-columns: 1fr;
    }

    .payments-page__actions {
      width: 100%;
    }

    .payments-page__actions > * {
      flex: 1;
      min-width: 0;
    }
  }
`
