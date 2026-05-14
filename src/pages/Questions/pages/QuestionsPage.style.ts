import styled from '@emotion/styled'
import { css } from '@emotion/react'

import theme, { c, tokens } from '@/theme'
export const QuestionsPageRoot = styled.div`
  .question-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  }

  /* ── Header ── */
  .question-page__header {
    padding: 28px 32px;
    border-radius: 22px;
    border: 1px solid ${c.border.default};
    background:
      radial-gradient(circle at 10% 20%, ${tokens.rgba.primary_14} 0%, transparent 45%),
      linear-gradient(135deg, ${c.surface.muted} 0%, ${c.background.default} 100%);
    box-shadow: 0 14px 32px ${tokens.rgba.primary_08};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
  }

  .question-page__title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .question-page__subtitle {
    color: ${c.text.secondary};
    font-size: 15px;
    margin-top: 4px;
  }

  .question-page__primary-button.MuiButton-root {
    min-height: 48px;
    padding: 0 24px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 15px;
    text-transform: none;
    background: ${c.gradient.primaryIndigo};
    color: ${c.surface.default};
    box-shadow: 0 4px 14px ${tokens.rgba.primary_28};
  }

  .question-page__primary-button.MuiButton-root:hover {
    box-shadow: 0 6px 18px ${tokens.rgba.primary_28};
  }

  .question-page__alert {
    border-radius: 14px;
  }

  /* ── Stats Row ── */
  .question-page__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: ${theme.spacing(2)};
  }

  .question-page__stat-card {
    padding: 20px 24px;
    border-radius: 18px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    box-shadow: 0 4px 16px ${tokens.rgba.slate900_04};
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }

  .question-page__stat-card:hover {
    box-shadow: 0 8px 24px ${tokens.rgba.primary_08};
    transform: translateY(-2px);
  }

  .question-page__stat-metrics {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  }

  .question-page__stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .question-page__stat-value-row {
    display: flex;
    align-items: baseline;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .question-page__stat-unit {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${c.text.secondary};
    letter-spacing: 0.01em;
  }

  .question-page__stat-label {
    font-size: 14px;
    color: ${c.text.secondary};
    font-weight: 600;
    margin-top: 10px;
  }

  /* ── Table Card ── */
  .question-table {
    overflow: hidden;
    border: 1px solid ${c.border.default};
    border-radius: 22px;
    background: ${c.surface.default};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .question-table__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.75)};
    padding: 20px 24px;
    border-bottom: 1px solid ${c.background.subtle};
    flex-wrap: wrap;
  }

  .question-table__search {
    width: min(100%, 360px);
  }

  .question-table__search .MuiOutlinedInput-root,
  .question-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 13px;
    background: ${c.surface.muted};
    transition: box-shadow 0.15s ease;
  }

  .question-table__search .MuiOutlinedInput-root:hover,
  .question-table__select .MuiOutlinedInput-root:hover {
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_08};
  }

  .question-table__search .MuiOutlinedInput-root.Mui-focused,
  .question-table__select .MuiOutlinedInput-root.Mui-focused {
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_12};
    background: ${c.surface.default};
  }

  .question-table__search-icon {
    color: ${c.text.disabled};
    font-size: 1.15rem;
    line-height: 1;
  }

  .question-table__select {
    min-width: 170px;
  }

  .question-table__results-count {
    padding: 10px 24px 0;
    color: ${c.text.disabled};
    font-size: 13px;
    font-weight: 600;
  }

  /* ── DataGrid Styling ── */
  .question-table__grid {
    width: 100%;
    min-height: 0;
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

  .MuiDataGrid-root {
    height: min(70vh, 640px);
  }

  .MuiDataGrid-columnHeaders {
    background: ${c.surface.muted};
    border-bottom: 1px solid ${c.background.subtle};
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
    color: ${c.text.secondary};
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: none;
    letter-spacing: 0.01em;
  }

  .MuiDataGrid-cell--textLeft,
  .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .MuiDataGrid-row {
    border-top: 1px solid ${c.background.subtle};
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  .MuiDataGrid-row--lastVisible {
    border-bottom: 0;
  }

  .MuiDataGrid-row:hover {
    background: ${c.background.card};
  }

  .MuiDataGrid-cell {
    border-top: 0;
    color: ${c.text.dark};
    font-weight: 500;
    overflow: visible;
  }

  .MuiDataGrid-cellEmpty {
    display: none;
  }

  .MuiDataGrid-footerContainer {
    border-top: 1px solid ${c.background.subtle};
    background: ${c.background.card};
  }

  .MuiDataGrid-selectedRowCount {
    display: none;
  }

  .MuiCheckbox-root {
    color: ${c.border.strong};
  }

  .MuiCheckbox-root.Mui-checked {
    color: ${c.primary.main};
  }

  .MuiDataGrid-columnHeaderCheckbox,
  .MuiDataGrid-cellCheckbox {
    justify-content: center;
    align-items: center;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .MuiDataGrid-overlayWrapper {
    min-height: 180px;
  }

  .MuiDataGrid-overlay {
    color: ${c.text.secondary};
  }

  /* ── Cell content ── */
  .question-table__module-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 40px;
  }

  .question-table__title {
    display: block;
    width: 100%;
    color: ${c.text.primary};
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question-table__meta {
    display: block;
    width: 100%;
    color: ${c.text.muted};
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question-table__meta--strong {
    font-weight: 600;
    color: ${c.text.dark};
  }

  .question-table__module-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${c.text.subtle};
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .question-table__type {
    display: block;
    width: 100%;
    color: ${c.text.dark};
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question-table__error-rate {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
    white-space: nowrap;
  }

  .question-table__error-bars {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.375)};
  }

  .question-table__error-bar {
    width: 22px;
    height: 7px;
    border-radius: 999px;
    background: ${c.border.default};
  }

  .question-table__error-bar--active {
    background: ${c.primary.main};
  }

  .question-table__error-text {
    color: ${c.text.secondary};
    font-weight: 600;
    font-size: 0.88rem;
  }

  @media (max-width: 1380px) {
    .question-table {
      overflow-x: auto;
    }

    .MuiDataGrid-main,
    .MuiDataGrid-columnHeaders,
    .MuiDataGrid-virtualScroller {
      min-width: 1060px;
    }
  }

  @media (max-width: 640px) {
    .question-page__header {
      padding: 20px;
    }

    .question-page__stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`
