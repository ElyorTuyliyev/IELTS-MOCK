import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const PaymentsPageRoot = styled.div`
  .payments-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  }

  .payments-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
  }

  .payments-page__title {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .payments-page__actions {
    display: flex;
    gap: ${theme.spacing(1)};
  }

  .payments-page__button {
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
  }

  .payments-page__stats {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    background: ${c.surface.default};
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    overflow: hidden;
  }

  .payments-page__stat {
    padding: 16px 18px;
    border-right: 1px solid ${c.border.default};
  }

  .payments-page__stat:last-of-type {
    border-right: none;
  }

  .payments-page__stat-label {
    margin: 0;
    font-size: 0.92rem;
    color: ${c.text.secondary};
  }

  .payments-page__stat-value {
    margin: 8px 0 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .payments-page__stat-meta {
    margin: 4px 0 0;
    font-size: 0.78rem;
    color: ${c.text.disabled};
  }

  .payments-page__panel {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    background: ${c.surface.default};
    overflow: hidden;
  }

  .payments-page__filters {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(1.25)};
    padding: 14px;
    border-bottom: 1px solid ${c.border.default};
  }

  .payments-page__chips {
    display: flex;
    gap: ${theme.spacing(1)};
  }

  .payments-page__chip {
    border-radius: 9px;
    text-transform: none;
    min-width: 70px;
  }

  .payments-page__chip--active {
    color: ${c.surface.default};
    background: ${c.info.main};
  }

  .payments-page__tools {
    display: flex;
    gap: ${theme.spacing(1)};
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
    color: ${c.text.secondary};
    padding: 12px 14px;
    border-bottom: 1px solid ${c.border.default};
    font-weight: 600;
    white-space: nowrap;
  }

  .payments-page__table tbody td {
    font-size: 0.9rem;
    color: ${c.text.primary};
    padding: 12px 14px;
    border-bottom: 1px solid ${c.border.divider};
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
    color: ${c.success.payment};
    background: ${c.success.bgLight};
  }

  .payments-page__status--unpaid {
    color: ${c.warning.main};
    background: ${c.warning.bg};
  }

  .payments-page__status--overdue {
    color: ${c.error.dark};
    background: ${c.error.bg};
  }

  .payments-page__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1)};
    padding: 12px 14px;
    color: ${c.text.secondary};
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
      border-bottom: 1px solid ${c.border.default};
    }
  }
`
