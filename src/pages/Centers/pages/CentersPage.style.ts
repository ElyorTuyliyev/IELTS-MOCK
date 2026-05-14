import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const CentersPageRoot = styled.div`
  .centers-page {
    display: grid;
    gap: ${theme.spacing(3)};
  }

  .centers-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    padding: 28px 32px;
    border: 1px solid ${tokens.rgba.primary_14};
    border-radius: 28px;
    background:
      radial-gradient(circle at top right, ${tokens.rgba.teal_12}, transparent 30%),
      linear-gradient(135deg, ${tokens.rgba.white_92}, ${tokens.rgba.white_92});
    box-shadow: 0 24px 60px ${tokens.rgba.slate900_08};
  }

  .centers-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${c.text.primary};
  }

  .centers-page__description {
    margin: 10px 0 0;
    max-width: 620px;
    font-size: 15px;
    line-height: 1.7;
    color: ${c.text.secondary};
  }

  .centers-page__cta {
    flex-shrink: 0;
    min-width: 180px;
    border-radius: 999px;
    padding: 14px 20px;
    background: linear-gradient(135deg, ${c.teal.main}, ${c.teal.accent});
    box-shadow: 0 18px 32px ${tokens.rgba.teal_12};
  }

  .centers-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(2.25)};
  }

  .centers-stat {
    padding: 22px 24px;
    border-radius: 24px;
    background: ${c.surface.default};
    border: 1px solid ${tokens.rgba.border_24};
    box-shadow: 0 18px 40px ${tokens.rgba.slate900_06};
  }

  .centers-stat__label {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${c.text.secondary};
  }

  .centers-stat__value {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .centers-stat__meta {
    margin-top: 8px;
    font-size: 14px;
    color: ${c.text.muted};
  }

  .centers-panel {
    background: ${tokens.rgba.white_92};
    border: 1px solid ${tokens.rgba.border_24};
    border-radius: 28px;
    box-shadow: 0 20px 44px ${tokens.rgba.slate900_06};
    padding: 22px;
  }

  .centers-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    margin-bottom: 18px;
  }

  .centers-panel__title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .centers-panel__subtitle {
    margin: 6px 0 0;
    font-size: 14px;
    color: ${c.text.secondary};
  }

  .centers-table {
    overflow-x: auto;
    overflow-y: visible;
    border: 1px solid ${c.border.medium};
    border-radius: 22px;
    background: ${c.gradient.card};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .centers-table__filters {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(1.75)};
    padding: 20px;
    border-bottom: 1px solid ${c.border.divider};
    flex-wrap: wrap;
  }

  .centers-table__search {
    width: min(100%, 340px);
  }

  .centers-table__search .MuiOutlinedInput-root,
  .centers-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .centers-table__search-icon {
    color: ${c.text.subtle};
    font-size: 1.15rem;
    line-height: 1;
  }

  .centers-table__actions {
    display: flex;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .centers-table__select {
    min-width: 150px;
  }

  .centers-table__ghost-button {
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    font-weight: 600;
    text-transform: none;
  }

  .centers-table .MuiDataGrid-root {
    border: 0;
    background: transparent;
  }

  .centers-table .MuiDataGrid-main,
  .centers-table .MuiDataGrid-virtualScroller {
    overflow-x: auto;
  }

  .centers-table .MuiDataGrid-main {
    min-height: 0;
  }

  .centers-table .MuiDataGrid-columnHeaders {
    background: ${c.surface.muted};
    border-bottom: 1px solid ${c.border.divider};
  }

  .centers-table .MuiDataGrid-columnHeader,
  .centers-table .MuiDataGrid-cell {
    padding: 0 12px;
  }

  .centers-table .MuiDataGrid-columnHeader:focus,
  .centers-table .MuiDataGrid-columnHeader:focus-within,
  .centers-table .MuiDataGrid-cell:focus,
  .centers-table .MuiDataGrid-cell:focus-within {
    outline: none;
  }

  .centers-table .MuiDataGrid-columnHeaderTitle {
    color: ${c.text.muted};
    font-size: 0.92rem;
    font-weight: 800;
  }

  .centers-table .MuiDataGrid-cell--textLeft,
  .centers-table .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .centers-table .MuiDataGrid-row {
    border-top: 1px solid ${c.border.divider};
  }

  .centers-table .MuiDataGrid-row:hover {
    background: ${tokens.rgba.slate900_04};
  }

  .centers-table .MuiDataGrid-cell {
    color: ${c.text.primary};
    font-weight: 500;
    overflow: visible;
  }

  .centers-table .MuiCheckbox-root {
    color: ${c.neutral.placeholder};
  }

  .centers-table .MuiCheckbox-root.Mui-checked {
    color: ${c.teal.main};
  }

  .centers-table .MuiDataGrid-columnHeaderCheckbox,
  .centers-table .MuiDataGrid-cellCheckbox {
    justify-content: center;
    align-items: center;
  }

  .centers-table .MuiDataGrid-columnSeparator {
    display: none;
  }

  .centers-table__pill {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    min-height: 34px;
    min-width: 110px;
    padding: 7px 16px;
    border-radius: 9px;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  .centers-table__pill--active {
    background: ${c.success.bg};
    color: ${c.teal.main};
  }

  .centers-table__pill--growing {
    background: ${c.surface.default}7ed;
    color: ${c.orange.main};
  }

  .centers-table__pill--top-score {
    background: ${c.background.default};
    color: ${c.info.indigo};
  }

  .centers-table__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 16px 20px;
    border-top: 1px solid ${c.border.divider};
    flex-wrap: wrap;
  }

  .centers-table__pagination {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
  }

  .centers-table__page-button,
  .centers-table__show-button {
    min-width: 44px;
    height: 44px;
    border: 1px solid ${c.border.medium};
    border-radius: 14px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    text-transform: none;
    font-size: 1.1rem;
  }

  .centers-table__page-number {
    min-width: 34px;
    height: 34px;
    color: ${c.text.primary};
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .centers-table__page-number--active {
    border: 1px solid ${c.border.medium};
    border-radius: 12px;
    background: ${c.surface.muted};
  }

  .centers-table__page-ellipsis {
    color: ${c.text.muted};
    font-weight: 700;
  }

  .centers-table__footer-meta {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
    color: ${c.text.muted};
    font-size: 0.94rem;
    font-weight: 500;
  }

  .centers-table__show-button {
    padding: 0 16px;
    font-size: 0.98rem;
  }

  @media (max-width: 1120px) {
    .centers-page__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .centers-page__header,
    .centers-table__footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .centers-page__cta {
      width: 100%;
    }

    .centers-page__stats {
      grid-template-columns: 1fr;
    }
  }
`
