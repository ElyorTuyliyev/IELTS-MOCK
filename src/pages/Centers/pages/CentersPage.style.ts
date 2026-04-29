import styled from '@emotion/styled'

export const CentersPageRoot = styled.div`
  .centers-page {
    display: grid;
    gap: 24px;
  }

  .centers-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 28px 32px;
    border: 1px solid rgba(99, 102, 241, 0.14);
    border-radius: 28px;
    background:
      radial-gradient(circle at top right, rgba(16, 185, 129, 0.2), transparent 30%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 247, 255, 0.94));
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  }

  .centers-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #111827;
  }

  .centers-page__description {
    margin: 10px 0 0;
    max-width: 620px;
    font-size: 15px;
    line-height: 1.7;
    color: #5b6477;
  }

  .centers-page__cta {
    flex-shrink: 0;
    min-width: 180px;
    border-radius: 999px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #0f766e, #14b8a6);
    box-shadow: 0 18px 32px rgba(20, 184, 166, 0.24);
  }

  .centers-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .centers-stat {
    padding: 22px 24px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  }

  .centers-stat__label {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
  }

  .centers-stat__value {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    color: #111827;
  }

  .centers-stat__meta {
    margin-top: 8px;
    font-size: 14px;
    color: #475569;
  }

  .centers-panel {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 28px;
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.06);
    padding: 22px;
  }

  .centers-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  }

  .centers-panel__title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }

  .centers-panel__subtitle {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
  }

  .centers-table {
    overflow: hidden;
    border: 1px solid #dbe2f1;
    border-radius: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .centers-table__filters {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 20px;
    border-bottom: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .centers-table__search {
    width: min(100%, 340px);
  }

  .centers-table__search .MuiOutlinedInput-root,
  .centers-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: #ffffff;
  }

  .centers-table__search-icon {
    color: #334155;
    font-size: 1.15rem;
    line-height: 1;
  }

  .centers-table__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .centers-table__select {
    min-width: 150px;
  }

  .centers-table__ghost-button {
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
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
    background: #f8fafc;
    border-bottom: 1px solid #edf2fb;
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
    color: #475569;
    font-size: 0.92rem;
    font-weight: 800;
  }

  .centers-table .MuiDataGrid-cell--textLeft,
  .centers-table .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .centers-table .MuiDataGrid-row {
    border-top: 1px solid #edf2fb;
  }

  .centers-table .MuiDataGrid-row:hover {
    background: rgba(248, 250, 252, 0.72);
  }

  .centers-table .MuiDataGrid-cell {
    color: #111827;
    font-weight: 500;
    overflow: visible;
  }

  .centers-table .MuiCheckbox-root {
    color: #c0cadc;
  }

  .centers-table .MuiCheckbox-root.Mui-checked {
    color: #0f766e;
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
    background: #ecfdf5;
    color: #2bb6a3;
  }

  .centers-table__pill--growing {
    background: #fff7ed;
    color: #f97316;
  }

  .centers-table__pill--top-score {
    background: #eef2ff;
    color: #4f46e5;
  }

  .centers-table__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-top: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .centers-table__pagination {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .centers-table__page-button,
  .centers-table__show-button {
    min-width: 44px;
    height: 44px;
    border: 1px solid #dbe2f1;
    border-radius: 14px;
    background: #ffffff;
    color: #111827;
    text-transform: none;
    font-size: 1.1rem;
  }

  .centers-table__page-number {
    min-width: 34px;
    height: 34px;
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .centers-table__page-number--active {
    border: 1px solid #dbe2f1;
    border-radius: 12px;
    background: #f8fafc;
  }

  .centers-table__page-ellipsis {
    color: #475569;
    font-weight: 700;
  }

  .centers-table__footer-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    color: #475569;
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
