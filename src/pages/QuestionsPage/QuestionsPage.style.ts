import styled from '@emotion/styled'

export const QuestionsPageRoot = styled.div`
  .question-page {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .question-page__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .question-page__title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .question-page__head-actions {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    flex-wrap: wrap;
  }

  .question-page__utility-button,
  .question-page__primary-button {
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .question-page__utility-button {
    border: 1px solid #d8def0;
    background: #ffffff;
    color: #0f172a;
  }

  .question-page__primary-button {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
  }

  .question-table {
    overflow: hidden;
    border: 1px solid #dbe2f1;
    border-radius: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .question-table__filters {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 20px;
    border-bottom: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .question-table__search {
    width: min(100%, 340px);
  }

  .question-table__search .MuiOutlinedInput-root,
  .question-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: #ffffff;
  }

  .question-table__search-icon {
    color: #334155;
    font-size: 1.15rem;
    line-height: 1;
  }

  .question-table__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .question-table__select {
    min-width: 184px;
  }

  .question-table__ghost-button {
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
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
    background: #f8fafc;
    border-bottom: 1px solid #edf2fb;
  }

  .MuiDataGrid-columnHeader,
  .MuiDataGrid-cell {
    padding: 0 12px;
  }

  .MuiDataGrid-columnHeader:focus,
  .MuiDataGrid-columnHeader:focus-within,
  .MuiDataGrid-cell:focus,
  .MuiDataGrid-cell:focus-within {
    outline: none;
  }

  .MuiDataGrid-columnHeaderTitle {
    color: #475569;
    font-size: 0.92rem;
    font-weight: 700;
  }

  .MuiDataGrid-cell--textLeft,
  .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .MuiDataGrid-row {
    border-top: 1px solid #edf2fb;
  }

  .MuiDataGrid-row--lastVisible {
    border-bottom: 0;
  }

  .MuiDataGrid-row:hover {
    background: rgba(248, 250, 252, 0.72);
  }

  .MuiDataGrid-cell {
    border-top: 0;
    color: #111827;
    font-weight: 500;
    overflow: visible;
  }

  .MuiDataGrid-cellEmpty {
    display: none;
  }

  .MuiCheckbox-root {
    color: #c0cadc;
  }

  .MuiCheckbox-root.Mui-checked {
    color: #7c3aed;
  }

  .MuiDataGrid-columnHeaderCheckbox,
  .MuiDataGrid-cellCheckbox {
    justify-content: center;
    align-items: center;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .question-table__title,
  .question-table__meta,
  .question-table__type {
    display: block;
    width: 100%;
    color: #111827;
    font-size: 0.98rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .question-table__title,
  .question-table__type,
  .question-table__meta--strong {
    font-weight: 600;
  }

  .question-table__error-rate {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
  }

  .question-table__error-bars {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .question-table__error-bar {
    width: 24px;
    height: 8px;
    border-radius: 999px;
    background: #e7dbff;
  }

  .question-table__error-bar--active {
    background: #7c3aed;
  }

  .question-table__error-text {
    color: #475569;
    font-weight: 600;
  }

  .question-table__action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
  }

  .question-table__icon-button {
    width: 34px;
    height: 34px;
    border: 1px solid #dbe2f1;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.95rem;
    line-height: 1;
  }

  .question-table__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-top: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .question-table__pagination {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .question-table__page-button,
  .question-table__show-button {
    min-width: 44px;
    height: 44px;
    border: 1px solid #dbe2f1;
    border-radius: 14px;
    background: #ffffff;
    color: #111827;
    text-transform: none;
    font-size: 1.1rem;
  }

  .question-table__page-number {
    min-width: 34px;
    height: 34px;
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .question-table__page-number--active {
    border: 1px solid #dbe2f1;
    border-radius: 12px;
    background: #f8fafc;
  }

  .question-table__page-ellipsis {
    color: #475569;
    font-weight: 700;
  }

  .question-table__footer-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    color: #475569;
    font-size: 0.94rem;
    font-weight: 500;
  }

  .question-table__show-button {
    padding: 0 16px;
    font-size: 0.98rem;
  }

  .MuiDataGrid-overlayWrapper {
    min-height: 180px;
  }

  .MuiDataGrid-overlay {
    color: #64748b;
  }

  @media (max-width: 1380px) {
    .question-table {
      overflow-x: auto;
    }

    .MuiDataGrid-main,
    .MuiDataGrid-columnHeaders,
    .MuiDataGrid-virtualScroller {
      min-width: 1320px;
    }
  }
`
