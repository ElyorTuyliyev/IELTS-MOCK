import styled from '@emotion/styled'

export const PrizeQuizzesPageRoot = styled.div`
  .prize-page {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .prize-page__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .prize-page__title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .prize-page__primary-button {
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
    font-weight: 700;
    text-transform: none;
  }

  .prize-table {
    overflow: hidden;
    border: 1px solid #dbe2f1;
    border-radius: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .prize-table__filters {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 20px;
    border-bottom: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .prize-table__search {
    width: min(100%, 340px);
  }

  .prize-table__search .MuiOutlinedInput-root,
  .prize-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: #ffffff;
  }

  .prize-table__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .prize-table__select {
    min-width: 160px;
  }

  .prize-table__ghost-button {
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

  .MuiDataGrid-columnHeaders {
    background: #f8fafc;
    border-bottom: 1px solid #edf2fb;
  }

  .MuiDataGrid-columnHeader,
  .MuiDataGrid-cell {
    padding: 0 12px;
  }

  .MuiDataGrid-columnHeaderTitle {
    color: #475569;
    font-size: 0.92rem;
    font-weight: 700;
  }

  .MuiDataGrid-row {
    border-top: 1px solid #edf2fb;
  }

  .MuiDataGrid-row:hover {
    background: rgba(248, 250, 252, 0.72);
  }

  .MuiDataGrid-cell {
    border-top: 0;
    color: #111827;
    font-weight: 500;
  }

  .MuiDataGrid-footerContainer {
    min-height: 60px;
    padding: 0 10px;
    border-top: 1px solid #edf2fb;
  }

  .MuiTablePagination-root,
  .MuiTablePagination-selectLabel,
  .MuiTablePagination-displayedRows,
  .MuiTablePagination-actions {
    color: #475569;
    font-size: 0.92rem;
    font-weight: 500;
  }

  .MuiCheckbox-root {
    color: #c0cadc;
  }

  .MuiCheckbox-root.Mui-checked {
    color: #7c3aed;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .prize-table__name {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .prize-table__avatar {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--avatar-gradient, linear-gradient(135deg, #7c3aed 0%, #c084fc 100%));
    color: #ffffff;
    font-size: 0.76rem;
    font-weight: 700;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }

  .prize-table__name-text,
  .prize-table__date,
  .prize-table__category {
    color: #111827;
    font-weight: 600;
  }

  .prize-table__name-text {
    margin: 0;
  }

  .prize-table__description {
    color: #334155;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .prize-table__level {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 7px 11px;
    border: 1px solid #dbe2f1;
    border-radius: 10px;
    background: #ffffff;
    color: #111827;
    font-weight: 600;
  }

  .prize-table__level-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
  }

  .prize-table__level-bar {
    width: 3px;
    border-radius: 999px;
    background: var(--level-color, #fb923c);
    height: var(--bar-height, 10px);
    opacity: var(--bar-opacity, 1);
  }

  .prize-table__pill {
    display: inline-flex;
    justify-content: center;
    width: fit-content;
    padding: 7px 12px;
    border-radius: 9px;
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .prize-table__pill--completed {
    background: #ecfdf5;
    color: #2bb6a3;
  }

  .prize-table__pill--active {
    background: #fff7ed;
    color: #f97316;
  }

  .prize-table__pill--pending {
    background: #fffaf0;
    color: #eab308;
  }

  .prize-table__pill--draft {
    background: #fdf2ff;
    color: #f472d0;
  }

  .prize-table__pill--advancing {
    background: #f472d0;
    color: #ffffff;
  }

  .prize-table__pill--prize-quiz {
    background: #67ace7;
    color: #ffffff;
  }

  .prize-table__action-buttons {
    display: flex;
    gap: 8px;
  }

  .prize-table__icon-button {
    min-width: 34px;
    width: 34px;
    height: 34px;
    border: 1px solid #dbe2f1;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.95rem;
    line-height: 1;
  }

  .prize-table__empty {
    padding: 28px;
    color: #64748b;
    text-align: center;
  }

  @media (max-width: 1380px) {
    .prize-table {
      overflow-x: auto;
    }

    .MuiDataGrid-main,
    .MuiDataGrid-columnHeaders,
    .MuiDataGrid-virtualScroller,
    .MuiDataGrid-footerContainer {
      min-width: 1080px;
    }
  }
`
