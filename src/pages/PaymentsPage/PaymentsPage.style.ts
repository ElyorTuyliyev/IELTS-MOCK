import styled from '@emotion/styled'

export const PaymentsPageRoot = styled.div`
  .payments-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .payments-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .payments-page__title {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: #0f172a;
  }

  .payments-page__actions {
    display: flex;
    gap: 8px;
  }

  .payments-page__button {
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
  }

  .payments-page__stats {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #fff;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
  }

  .payments-page__stat {
    padding: 16px 18px;
    border-right: 1px solid #e2e8f0;
  }

  .payments-page__stat:last-of-type {
    border-right: none;
  }

  .payments-page__stat-label {
    margin: 0;
    font-size: 0.92rem;
    color: #64748b;
  }

  .payments-page__stat-value {
    margin: 8px 0 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #111827;
  }

  .payments-page__stat-meta {
    margin: 4px 0 0;
    font-size: 0.78rem;
    color: #94a3b8;
  }

  .payments-page__panel {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
  }

  .payments-page__filters {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 14px;
    border-bottom: 1px solid #e2e8f0;
  }

  .payments-page__chips {
    display: flex;
    gap: 8px;
  }

  .payments-page__chip {
    border-radius: 9px;
    text-transform: none;
    min-width: 70px;
  }

  .payments-page__chip--active {
    color: #fff;
    background: #2563eb;
  }

  .payments-page__tools {
    display: flex;
    gap: 8px;
  }

  .payments-page__search {
    width: 220px;
  }

  .payments-page__table-wrap {
    width: 100%;
    overflow-x: auto;
  }

  .payments-page__table {
    width: 100%;
    min-width: 980px;
    border-collapse: collapse;
  }

  .payments-page__table thead th {
    text-align: left;
    font-size: 0.82rem;
    color: #64748b;
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    white-space: nowrap;
  }

  .payments-page__table tbody td {
    font-size: 0.9rem;
    color: #0f172a;
    padding: 12px 14px;
    border-bottom: 1px solid #edf2f7;
    vertical-align: middle;
    white-space: nowrap;
  }

  .payments-page__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .payments-page__status--paid {
    color: #166534;
    background: #dcfce7;
  }

  .payments-page__status--unpaid {
    color: #92400e;
    background: #fef3c7;
  }

  .payments-page__status--overdue {
    color: #991b1b;
    background: #fee2e2;
  }

  .payments-page__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    color: #64748b;
    font-size: 0.86rem;
  }

  @media (max-width: 1200px) {
    .payments-page__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .payments-page__stat:nth-of-type(2) {
      border-right: none;
    }

    .payments-page__stat:nth-of-type(-n + 2) {
      border-bottom: 1px solid #e2e8f0;
    }
  }
`
