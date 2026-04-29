import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const AdminPageRoot = styled.div`
  .admin-page {
    display: grid;
    gap: 24px;
  }

  .admin-page__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 30px 32px;
    border-radius: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at top right, rgba(245, 158, 11, 0.22), transparent 28%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  }

  .admin-page__eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #b45309;
  }

  .admin-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .admin-page__description {
    margin: 12px 0 0;
    max-width: 700px;
    font-size: 15px;
    line-height: 1.7;
    color: #5b6477;
  }

  .admin-page__badge {
    flex-shrink: 0;
    padding: 12px 18px;
    border-radius: 999px;
    background: rgba(180, 83, 9, 0.12);
    color: #b45309;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .admin-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .admin-page__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .admin-page__section-title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .admin-page__head-actions {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    flex-wrap: wrap;
  }

  .admin-page__utility-button,
  .admin-page__primary-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .admin-page__button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    font-size: 1.1rem;
    line-height: 1;
  }

  .admin-page__utility-button {
    border: 1px solid #d8def0;
    background: #ffffff;
    color: #0f172a;
  }

  .admin-page__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .admin-page__stat,
  .admin-page__panel {
    padding: 22px 24px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow: 0 20px 42px rgba(15, 23, 42, 0.06);
  }

  .admin-page__stat-label {
    display: block;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
  }

  .admin-page__stat-value {
    display: block;
    margin-top: 10px;
    font-size: 30px;
    font-weight: 800;
    color: #111827;
  }

  .admin-page__stat-meta {
    margin: 8px 0 0;
    font-size: 14px;
    color: #475569;
  }

  .admin-page__panel--table {
    padding: 0;
    overflow: hidden;
  }

  .admin-page__primary-button {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
  }

  .admin-page__table-filters {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 20px;
    border-bottom: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .admin-page__search {
    width: min(100%, 340px);
  }

  .admin-page__search .MuiOutlinedInput-root,
  .admin-page__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: #ffffff;
  }

  .admin-page__search-icon {
    color: #334155;
    font-size: 1.15rem;
    line-height: 1;
  }

  .admin-page__table-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .admin-page__select {
    min-width: 150px;
  }

  .admin-page__ghost-button {
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }

  .admin-page__danger-button {
    border-radius: 999px;
    color: #b91c1c;
    border-color: rgba(239, 68, 68, 0.28);
  }

  .admin-page__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .admin-page__count-badge {
    flex-shrink: 0;
    min-width: 48px;
    padding: 10px 14px;
    border-radius: 999px;
    text-align: center;
    font-size: 14px;
    font-weight: 800;
    color: #b45309;
    background: rgba(245, 158, 11, 0.12);
  }

  .admin-page__table-wrap {
    margin-top: 18px;
  }

  .admin-page__table {
    border: 0;
    border-radius: 0;
    overflow: hidden;
    background: transparent;
  }

  .admin-page__table .MuiDataGrid-columnHeaders {
    background: #f8fafc;
    border-bottom: 1px solid #edf2fb;
  }

  .admin-page__table .MuiDataGrid-columnHeaderTitle {
    font-weight: 800;
    color: #334155;
  }

  .admin-page__table .MuiDataGrid-row {
    border-top: 1px solid #edf2fb;
  }

  .admin-page__table .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .admin-page__table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-top: 1px solid #edf2fb;
    color: #475569;
    font-size: 0.94rem;
    font-weight: 500;
    flex-wrap: wrap;
  }

  .admin-page__panel-title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }

  .admin-page__panel-text {
    margin: 8px 0 0;
    font-size: 14px;
    color: #64748b;
  }

  .admin-page__list {
    display: grid;
    gap: 14px;
    margin-top: 18px;
  }

  .admin-page__list-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 0;
    border-top: 1px solid rgba(226, 232, 240, 0.9);
  }

  .admin-page__list-item:first-of-type {
    padding-top: 0;
    border-top: 0;
  }

  .admin-page__list-label {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  .admin-page__list-meta {
    margin: 6px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .admin-page__list-value {
    font-size: 13px;
    font-weight: 800;
    color: #b45309;
    white-space: nowrap;
  }

  .admin-modal__backdrop {
    background: rgba(19, 27, 51, 0.58);
    backdrop-filter: blur(3px);
  }

  .admin-modal__paper {
    overflow: hidden;
    border: 1px solid #e5e9f3;
    border-radius: 28px;
    width: min(100%, 620px);
    max-width: 620px;
    background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
    box-shadow: 0 28px 64px rgba(23, 26, 57, 0.18);
  }

  .admin-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 28px 30px 24px;
    border-bottom: 1px solid #e8edf8;
  }

  .admin-modal__title {
    margin: 0;
    color: #111111;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: #475069;
  }

  .admin-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .admin-modal__body {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 28px 30px 18px;
  }

  .admin-modal__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.9fr);
    gap: 16px;
  }

  .admin-modal__intro-card,
  .admin-modal__preview {
    border-radius: 24px;
    border: 1px solid #e6eaf5;
  }

  .admin-modal__intro-card {
    padding: 22px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 28%),
      linear-gradient(180deg, #faf8ff 0%, #ffffff 100%);
  }

  .admin-modal__eyebrow {
    margin: 0 0 8px;
    color: #7a3ff2;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .admin-modal__intro-title {
    margin: 0;
    color: #111827;
    font-size: 1.18rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__intro-text {
    margin: 10px 0 0;
    color: #5f6980;
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .admin-modal__rules {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .admin-modal__rule-chip {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(124, 58, 237, 0.08);
    color: #6d28d9;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .admin-modal__preview {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 10px;
    padding: 22px 18px;
    background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  }

  .admin-modal__preview-avatar {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    color: #ffffff;
    font-size: 1.35rem;
    font-weight: 800;
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.24);
  }

  .admin-modal__preview-name {
    margin: 0;
    color: #111827;
    font-size: 1rem;
    font-weight: 800;
  }

  .admin-modal__preview-email {
    margin: 0;
    color: #64748b;
    font-size: 0.88rem;
  }

  .admin-modal__preview-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 8px 12px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4338ca;
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  .admin-modal__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 16px;
  }

  .admin-modal__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .admin-modal__field--full {
    grid-column: 1 / -1;
  }

  .admin-modal__label {
    color: #141414;
    font-size: 0.98rem;
    font-weight: 700;
  }

  .admin-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  }

  .admin-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: #d7deeb;
  }

  .admin-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #c4cce0;
  }

  .admin-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: #8450ff;
    box-shadow: 0 0 0 3px rgba(132, 80, 255, 0.12);
  }

  .admin-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: #121826;
    font-size: 0.99rem;
  }

  .admin-modal__body .MuiInputBase-input::placeholder {
    color: #8a93a7;
    opacity: 1;
  }

  .admin-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 30px 28px;
  }

  .admin-modal__cancel,
  .admin-modal__save {
    min-width: 130px;
    min-height: 46px;
    border-radius: 16px;
    text-transform: none;
    font-weight: 700;
  }

  .admin-modal__cancel {
    border: 1px solid #d8def0;
    color: #111827;
    background: #ffffff;
  }

  .admin-modal__save {
    background: linear-gradient(135deg, #7a3ff2 0%, #9363ff 100%);
    color: #ffffff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 8px 18px rgba(122, 63, 242, 0.22);
  }

  @media (max-width: 1024px) {
    .admin-page__stats,
    .admin-page__management-grid,
    .admin-page__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .admin-page__hero,
    .admin-page__table-footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .admin-modal__header,
    .admin-modal__body,
    .admin-modal__footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    .admin-modal__intro,
    .admin-modal__grid {
      grid-template-columns: 1fr;
    }

    .admin-modal__footer {
      flex-direction: column-reverse;
    }

    .admin-modal__cancel,
    .admin-modal__save {
      width: 100%;
    }
  }
`

export const adminModalGlobalStyles = css`
  .admin-modal__backdrop {
    background: rgba(19, 27, 51, 0.58);
    backdrop-filter: blur(3px);
  }

  .admin-modal__paper {
    overflow: hidden;
    border: 1px solid #e5e9f3;
    border-radius: 28px;
    width: min(100%, 760px);
    max-width: 760px;
    background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
    box-shadow: 0 28px 64px rgba(23, 26, 57, 0.18);
  }

  .admin-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 28px 30px 24px;
    border-bottom: 1px solid #e8edf8;
  }

  .admin-modal__title {
    margin: 0;
    color: #111111;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: #475069;
  }

  .admin-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .admin-modal__body {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 28px 30px 18px;
  }

  .admin-modal__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.9fr);
    gap: 16px;
  }

  .admin-modal__intro-card,
  .admin-modal__preview {
    border-radius: 24px;
    border: 1px solid #e6eaf5;
  }

  .admin-modal__intro-card {
    padding: 22px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 28%),
      linear-gradient(180deg, #faf8ff 0%, #ffffff 100%);
  }

  .admin-modal__eyebrow {
    margin: 0 0 8px;
    color: #7a3ff2;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .admin-modal__intro-title {
    margin: 0;
    color: #111827;
    font-size: 1.18rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__intro-text {
    margin: 10px 0 0;
    color: #5f6980;
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .admin-modal__rules {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .admin-modal__rule-chip {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(124, 58, 237, 0.08);
    color: #6d28d9;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .admin-modal__preview {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 10px;
    padding: 22px 18px;
    background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  }

  .admin-modal__preview-avatar {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    color: #ffffff;
    font-size: 1.35rem;
    font-weight: 800;
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.24);
  }

  .admin-modal__preview-name {
    margin: 0;
    color: #111827;
    font-size: 1rem;
    font-weight: 800;
  }

  .admin-modal__preview-email {
    margin: 0;
    color: #64748b;
    font-size: 0.88rem;
  }

  .admin-modal__preview-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 8px 12px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4338ca;
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  .admin-modal__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 16px;
  }

  .admin-modal__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .admin-modal__field--full {
    grid-column: 1 / -1;
  }

  .admin-modal__label {
    color: #141414;
    font-size: 0.98rem;
    font-weight: 700;
  }

  .admin-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  }

  .admin-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: #d7deeb;
  }

  .admin-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #c4cce0;
  }

  .admin-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: #8450ff;
    box-shadow: 0 0 0 3px rgba(132, 80, 255, 0.12);
  }

  .admin-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: #121826;
    font-size: 0.99rem;
  }

  .admin-modal__body .MuiInputBase-input::placeholder {
    color: #8a93a7;
    opacity: 1;
  }

  .admin-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 30px 28px;
  }

  .admin-modal__cancel,
  .admin-modal__save {
    min-width: 130px;
    min-height: 46px;
    border-radius: 16px;
    text-transform: none;
    font-weight: 700;
  }

  .admin-modal__cancel {
    border: 1px solid #d8def0;
    color: #111827;
    background: #ffffff;
  }

  .admin-modal__save {
    background: linear-gradient(135deg, #7a3ff2 0%, #9363ff 100%);
    color: #ffffff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 8px 18px rgba(122, 63, 242, 0.22);
  }

  @media (max-width: 768px) {
    .admin-modal__header,
    .admin-modal__body,
    .admin-modal__footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    .admin-modal__intro,
    .admin-modal__grid {
      grid-template-columns: 1fr;
    }

    .admin-modal__footer {
      flex-direction: column-reverse;
    }

    .admin-modal__cancel,
    .admin-modal__save {
      width: 100%;
    }
  }
`
