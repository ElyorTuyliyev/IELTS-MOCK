import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const CentersPageRoot = styled.div`
  .centers-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
    width: 100%;
    padding: ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(3)};

    @media (min-width: 900px) {
      padding: ${theme.spacing(3)};
    }
  }

  .centers-page__hero {
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

  .centers-page__hero-main {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    min-width: 0;
  }

  .centers-page__hero-icon {
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

  .centers-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.45rem, 2vw, 1.65rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .centers-page__subtitle {
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.94rem;
    line-height: 1.5;
    max-width: 52ch;
  }

  .centers-page__cta {
    flex-shrink: 0;
    min-width: 168px;
    border-radius: 12px;
    box-shadow: 0 10px 22px ${tokens.rgba.primary_20};
  }

  .centers-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .centers-page__stat {
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

  .centers-page__stat::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--centers-stat-accent, ${c.primary.main});
  }

  .centers-page__stat-icon {
    position: absolute;
    top: 14px;
    left: 14px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--centers-stat-icon-bg, ${c.primary.tint});
    color: var(--centers-stat-accent, ${c.primary.main});

    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }

  .centers-page__stat--total {
    --centers-stat-accent: ${c.info.main};
    --centers-stat-icon-bg: ${c.info.bgSoft};
  }

  .centers-page__stat--credits {
    --centers-stat-accent: ${c.primary.main};
    --centers-stat-icon-bg: ${c.primary.tintStrong};
  }

  .centers-page__stat--active {
    --centers-stat-accent: ${c.success.main};
    --centers-stat-icon-bg: ${c.success.bgSoft};
  }

  .centers-page__stat--managers {
    --centers-stat-accent: ${c.warning.main};
    --centers-stat-icon-bg: ${c.warning.bg};
  }

  .centers-page__stat-label {
    margin: 0;
    font-size: 0.84rem;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .centers-page__stat-value {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${c.text.primary};
    font-variant-numeric: tabular-nums;
  }

  .centers-page__stat-meta {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.45;
    color: ${c.text.muted};
  }

  .centers-page__panel {
    border: 1px solid ${c.border.medium};
    border-radius: 20px;
    background: ${c.surface.default};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
    overflow: hidden;
  }

  .centers-page__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    padding: 20px 22px 0;
    flex-wrap: wrap;
  }

  .centers-page__panel-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .centers-page__panel-subtitle {
    margin: 6px 0 0;
    font-size: 0.9rem;
    color: ${c.text.secondary};
  }

  .centers-page__panel-count {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: ${c.primary.tint};
    color: ${c.primary.main};
    font-size: 0.82rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .centers-page__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    padding: 16px 22px 18px;
    flex-wrap: wrap;
  }

  .centers-page__result-hint {
    color: ${c.text.muted};
    font-size: 0.88rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .centers-page__search {
    width: min(100%, 360px);
  }

  .centers-page__search .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: ${c.surface.muted};
  }

  .centers-page__table-wrap {
    border-top: 1px solid ${c.border.divider};
  }

  .centers-page__loading {
    display: grid;
    place-items: center;
    min-height: 280px;
    color: ${c.primary.main};
  }

  .centers-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(1)};
    min-height: 280px;
    padding: 32px 24px;
    text-align: center;
  }

  .centers-page__empty-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: ${c.primary.tint};
    color: ${c.primary.main};

    svg {
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }

  .centers-page__empty h2 {
    margin: 8px 0 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .centers-page__empty p {
    margin: 0;
    max-width: 36ch;
    font-size: 0.92rem;
    line-height: 1.55;
    color: ${c.text.secondary};
  }

  .centers-page__table .MuiDataGrid-root {
    border: 0;
    background: transparent;
  }

  .centers-page__table .MuiDataGrid-columnHeaders {
    background: ${c.surface.muted};
    border-bottom: 1px solid ${c.border.divider};
  }

  .centers-page__table .MuiDataGrid-columnHeader,
  .centers-page__table .MuiDataGrid-cell {
    padding: 0 14px;
  }

  .centers-page__table .MuiDataGrid-columnHeader:focus,
  .centers-page__table .MuiDataGrid-columnHeader:focus-within,
  .centers-page__table .MuiDataGrid-cell:focus,
  .centers-page__table .MuiDataGrid-cell:focus-within {
    outline: none;
  }

  .centers-page__table .MuiDataGrid-columnHeaderTitle {
    color: ${c.text.muted};
    font-size: 0.84rem;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
  }

  .centers-page__table .MuiDataGrid-row {
    border-top: 1px solid ${c.border.divider};
  }

  .centers-page__table .MuiDataGrid-row:hover {
    background: ${tokens.rgba.primary_08};
  }

  .centers-page__table .MuiDataGrid-cell {
    display: flex;
    align-items: center;
    color: ${c.text.primary};
    font-weight: 500;
    overflow: visible;
  }

  .centers-page__table .MuiDataGrid-columnSeparator {
    display: none;
  }

  .centers-page__table .MuiDataGrid-footerContainer {
    border-top: 1px solid ${c.border.divider};
    background: ${c.surface.muted};
    min-height: 52px;
  }

  .centers-page__table .MuiTablePagination-root {
    color: ${c.text.secondary};
    overflow: visible;
  }

  .centers-page__table .MuiTablePagination-selectLabel,
  .centers-page__table .MuiTablePagination-displayedRows {
    font-size: 0.88rem;
    font-weight: 500;
  }

  .centers-page__table .MuiTablePagination-select {
    border-radius: 8px;
  }

  .centers-page__table .MuiIconButton-root {
    border-radius: 10px;
  }

  .centers-page__center-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .centers-page__center-avatar {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: ${c.primary.tint};
    color: ${c.primary.main};
    font-size: 0.95rem;
    font-weight: 800;
    flex-shrink: 0;
    overflow: hidden;
    border: 1px solid ${c.border.soft};
  }

  .centers-page__center-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .centers-page__center-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${c.text.primary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .centers-page__center-meta {
    margin: 2px 0 0;
    font-size: 0.8rem;
    color: ${c.text.muted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .centers-page__email {
    color: ${c.text.secondary};
    font-size: 0.9rem;
  }

  .centers-page__credits {
    font-size: 0.9rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${c.text.primary};
  }

  .centers-page__credits--zero {
    color: ${c.text.muted};
  }

  @media (max-width: 1120px) {
    .centers-page__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .centers-page__hero {
      flex-direction: column;
      align-items: stretch;
    }

    .centers-page__cta {
      width: 100%;
    }

    .centers-page__stats {
      grid-template-columns: 1fr;
    }

    .centers-page__toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .centers-page__search {
      width: 100%;
    }
  }
`
