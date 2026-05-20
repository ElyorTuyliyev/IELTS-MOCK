import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const CertificatesPageRoot = styled.div`
  .certificates-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  }

  .certificates-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .certificates-page__title {
    margin: 0;
    font-size: clamp(1.5rem, 2vw, 1.75rem);
    font-weight: 700;
    color: ${c.text.primary};
  }

  .certificates-page__subtitle {
    margin: 4px 0 0;
    font-size: 0.92rem;
    color: ${c.text.secondary};
  }

  .certificates-page__actions {
    display: flex;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .certificates-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .certificates-page__stat {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    background: ${c.surface.default};
    padding: 16px 18px;
  }

  .certificates-page__stat-label {
    margin: 0;
    font-size: 0.88rem;
    color: ${c.text.secondary};
  }

  .certificates-page__stat-value {
    margin: 8px 0 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .certificates-page__panel {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    background: ${c.surface.default};
    overflow: hidden;
  }

  .certificates-table {
    overflow: hidden;
    background: ${c.surface.default};
  }

  .certificates-table__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding: 16px 18px;
    border-bottom: 1px solid ${c.border.divider};
    flex-wrap: wrap;
  }

  .certificates-table__search {
    width: min(100%, 320px);
  }

  .certificates-table__search .MuiOutlinedInput-root {
    min-height: 44px;
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .certificates-table__chips {
    display: flex;
    gap: ${theme.spacing(0.75)};
    flex-wrap: wrap;
  }

  .certificates-table__chip {
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid ${c.border.soft};
    border-radius: 10px;
    background: ${c.surface.default};
    color: ${c.text.secondary};
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }

  .certificates-table__chip:hover {
    border-color: ${c.border.medium};
    color: ${c.text.primary};
  }

  .certificates-table__chip--active {
    border-color: ${c.primary.main};
    background: ${c.primary.main};
    color: ${c.surface.default};
  }

  .certificates-table__grid-wrap {
    width: 100%;
    min-height: 420px;
    height: clamp(420px, 58vh, 560px);
  }

  .certificates-table__grid-wrap .MuiDataGrid-root {
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

  .certificates-table__band {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    padding: 4px 10px;
    border-radius: 8px;
    background: ${c.surface.muted};
    font-size: 0.9rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${c.text.primary};
  }

  .certificates-table__code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: ${c.text.secondary};
    white-space: nowrap;
  }

  .certificates-table__actions {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    width: 100%;
    min-width: 0;
  }

  .certificates-table__actions-slot {
    flex: 0 0 72px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .certificates-page__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 88px;
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .certificates-page__status--issued {
    color: ${c.success.payment};
    background: ${c.success.bgLight};
    border: 1px solid ${c.success.bg};
  }

  .certificates-page__status--pending {
    color: ${c.warning.main};
    background: ${c.warning.bg};
    border: 1px solid ${c.border.soft};
  }

  .certificates-page__status--draft {
    color: ${c.text.secondary};
    background: ${c.surface.muted};
    border: 1px solid ${c.border.soft};
  }

  .certificates-page__templates {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing(1.5)};
    padding: 14px;
  }

  .certificates-page__template-card {
    border: 1px solid ${c.border.default};
    border-radius: 12px;
    padding: 14px;
    background: ${c.surface.default};
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .certificates-page__template-thumb {
    min-height: 110px;
    border-radius: 6px;
    border: 1px solid #000;
    background: #fff;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
  }

  .certificates-page__template-thumb-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .certificates-page__template-thumb-logo {
    font-size: 1.35rem;
    font-weight: 900;
    color: #000;
    line-height: 1;
  }

  .certificates-page__template-thumb-type {
    font-size: 0.55rem;
    font-weight: 700;
    border: 1px solid #000;
    padding: 3px 6px;
    letter-spacing: 0.04em;
  }

  .certificates-page__template-thumb-title {
    margin: 4px 0 0;
    font-size: 0.62rem;
    font-weight: 700;
    color: #000;
  }

  .certificates-page__template-thumb-bars {
    display: flex;
    gap: 3px;
    margin-top: 8px;
  }

  .certificates-page__template-thumb-bar {
    flex: 1;
    height: 14px;
    background: #d4d4d4;
    border: 1px solid #000;
  }

  .certificates-page__template-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: ${c.text.primary};
  }

  .certificates-page__template-meta {
    margin: 6px 0 0;
    font-size: 0.82rem;
    color: ${c.text.secondary};
  }

  @media (max-width: 900px) {
    .certificates-page__stats {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    .certificates-page {
      display: none !important;
    }
  }
`
