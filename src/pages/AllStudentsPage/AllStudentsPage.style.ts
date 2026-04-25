import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const AllStudentsPageRoot = styled.div`
  .students-page {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .students-page__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .students-page__title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .students-page__head-actions {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    flex-wrap: wrap;
  }

  .students-page__utility-button,
  .students-page__primary-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .students-page__button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .students-page__button-icon svg {
    width: 100%;
    height: 100%;
  }

  .students-page__utility-button {
    border: 1px solid #d8def0;
    background: #ffffff;
    color: #0f172a;
  }

  .students-page__primary-button {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
  }

  .students-table {
    overflow: hidden;
    border: 1px solid #dbe2f1;
    border-radius: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .students-table__filters {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 20px;
    border-bottom: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .students-table__search {
    width: min(100%, 340px);
  }

  .students-table__search .MuiOutlinedInput-root,
  .students-table__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: #ffffff;
  }

  .students-table__search-icon {
    color: #334155;
    font-size: 1.15rem;
    line-height: 1;
  }

  .students-table__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .students-table__select {
    min-width: 150px;
  }

  .students-table__ghost-button {
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

  .students-table__serial,
  .students-table__meta {
    display: block;
    color: #111827;
    font-size: 0.98rem;
    white-space: nowrap;
  }

  .students-table__serial,
  .students-table__meta--strong {
    font-weight: 700;
  }

  .students-table__name {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 12px;
    min-width: 0;
  }

  .students-table__avatar {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--avatar-gradient, linear-gradient(135deg, #7c3aed 0%, #c084fc 100%));
    color: #ffffff;
    font-size: 0.76rem;
    font-weight: 700;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }

  .students-table__name-text {
    margin: 0;
    display: flex;
    align-items: center;
    min-height: 46px;
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  .students-table__points {
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
    white-space: nowrap;
  }

  .students-table__points-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    min-width: 15px;
  }

  .students-table__points-bar {
    width: 3px;
    border-radius: 999px;
    background: var(--level-color, #fb923c);
    height: var(--bar-height, 10px);
    opacity: var(--bar-opacity, 1);
  }

  .students-table__points-text {
    font-size: 0.96rem;
    line-height: 1;
  }

  .students-table__department {
    display: block;
    width: 100%;
    color: #111827;
    font-size: 0.98rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .students-table__pill {
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

  .students-table__pill--completed {
    background: #ecfdf5;
    color: #2bb6a3;
  }

  .students-table__pill--active {
    background: #fff7ed;
    color: #f97316;
  }

  .students-table__pill--pending {
    background: #fffaf0;
    color: #eab308;
  }

  .students-table__pill--draft {
    background: #fdf2ff;
    color: #f472d0;
  }

  .students-table__action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
  }

  .students-table__icon-button {
    width: 34px;
    height: 34px;
    border: 1px solid #dbe2f1;
    border-radius: 10px;
    background: #ffffff;
    color: #334155;
    font-size: 0.95rem;
    line-height: 1;
  }

  .students-table__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-top: 1px solid #edf2fb;
    flex-wrap: wrap;
  }

  .students-table__pagination {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .students-table__page-button,
  .students-table__show-button {
    min-width: 44px;
    height: 44px;
    border: 1px solid #dbe2f1;
    border-radius: 14px;
    background: #ffffff;
    color: #111827;
    text-transform: none;
    font-size: 1.1rem;
  }

  .students-table__page-number {
    min-width: 34px;
    height: 34px;
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .students-table__page-number--active {
    border: 1px solid #dbe2f1;
    border-radius: 12px;
    background: #f8fafc;
  }

  .students-table__page-ellipsis {
    color: #475569;
    font-weight: 700;
  }

  .students-table__footer-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    color: #475569;
    font-size: 0.94rem;
    font-weight: 500;
  }

  .students-table__show-button {
    padding: 0 16px;
    font-size: 0.98rem;
  }

  .students-modal__backdrop {
    background: rgba(19, 27, 51, 0.58);
    backdrop-filter: blur(3px);
  }

  .students-modal__paper {
    overflow: hidden;
    border: 1px solid #e5e9f3;
    border-radius: 28px;
    width: min(100%, 734px);
    max-width: 734px;
    background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
    box-shadow: 0 28px 64px rgba(23, 26, 57, 0.18);
  }

  .students-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 28px 30px 24px;
    border-bottom: 1px solid #e8edf8;
  }

  .students-modal__title {
    margin: 0;
    color: #111111;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .students-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: #475069;
  }

  .students-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .students-modal__body {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 28px 30px 18px;
  }

  .students-modal__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .students-modal__label {
    color: #141414;
    font-size: 0.98rem;
    font-weight: 700;
  }

  .students-modal__group-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 136px;
    gap: 16px;
  }

  .students-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  }

  .students-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: #d7deeb;
  }

  .students-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #c4cce0;
  }

  .students-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: #8450ff;
    box-shadow: 0 0 0 3px rgba(132, 80, 255, 0.12);
  }

  .students-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: #121826;
    font-size: 0.99rem;
  }

  .students-modal__body .MuiInputBase-input::placeholder {
    color: #8a93a7;
    opacity: 1;
  }

  .students-modal__control .MuiSelect-select {
    padding-right: 42px;
  }

  .students-modal__select-button,
  .students-modal__add-field,
  .students-modal__save {
    background: linear-gradient(135deg, #7a3ff2 0%, #9363ff 100%);
    color: #ffffff;
    font-weight: 700;
    text-transform: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 8px 18px rgba(122, 63, 242, 0.22);
  }

  .students-modal__select-button {
    min-height: 46px;
    padding: 0 34px;
    border-radius: 16px;
    font-size: 0.98rem;
  }

  .students-modal__select-button:hover,
  .students-modal__add-field:hover,
  .students-modal__save:hover {
    background: linear-gradient(135deg, #6f34eb 0%, #8757fb 100%);
  }

  .students-modal__upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 206px;
    gap: 14px;
    padding: 24px 22px;
    border: 1.5px dashed #d8cbff;
    border-radius: 24px;
    background:
      radial-gradient(circle at top, rgba(123, 66, 246, 0.08), transparent 58%),
      #fcfbff;
    cursor: pointer;
    text-align: center;
  }

  .students-modal__upload-input {
    display: none;
  }

  .students-modal__upload-artwork {
    width: 88px;
    height: 74px;
  }

  .students-modal__upload-artwork svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .students-modal__upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    max-width: 390px;
  }

  .students-modal__upload-title {
    margin: 0;
    color: #171717;
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.45;
  }

  .students-modal__upload-title span {
    color: #7b42f6;
  }

  .students-modal__upload-copy,
  .students-modal__upload-file {
    margin: 0;
    color: #586174;
    line-height: 1.45;
  }

  .students-modal__upload-file {
    margin-top: 8px;
    color: #334155;
    font-weight: 600;
  }

  .students-modal__add-field {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 26px;
    border-radius: 16px;
  }

  .students-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 18px 30px 28px;
  }

  .students-modal__cancel,
  .students-modal__save {
    min-width: 122px;
    min-height: 46px;
    padding: 0 36px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .students-modal__cancel {
    border: 1px solid #7fb1ff;
    background: #ffffff;
    color: #2f80ed;
  }

  .students-modal__cancel:hover {
    border-color: #5b9bff;
    background: #f8fbff;
  }

  .MuiDataGrid-overlayWrapper {
    min-height: 180px;
  }

  .MuiDataGrid-overlay {
    color: #64748b;
  }

  @media (max-width: 1500px) {
    .students-table {
      overflow-x: auto;
    }

    .MuiDataGrid-main,
    .MuiDataGrid-columnHeaders,
    .MuiDataGrid-virtualScroller {
      min-width: 1300px;
    }
  }

  @media (max-width: 860px) {
    .students-modal__header,
    .students-modal__body,
    .students-modal__footer {
      padding-left: 18px;
      padding-right: 18px;
    }

    .students-modal__group-row {
      grid-template-columns: 1fr;
    }

    .students-modal__upload {
      min-height: 220px;
      padding: 24px 18px;
    }

    .students-modal__footer {
      justify-content: stretch;
    }

    .students-modal__cancel,
    .students-modal__save {
      flex: 1;
    }
  }
`

export const allStudentsModalGlobalStyles = css`
  .students-modal__backdrop {
    background: rgba(19, 27, 51, 0.58);
    backdrop-filter: blur(3px);
  }

  .students-modal__paper {
    overflow: hidden;
    border: 1px solid #e5e9f3;
    border-radius: 28px;
    width: min(100%, 734px);
    max-width: 734px;
    background: linear-gradient(180deg, #ffffff 0%, #fdfdff 100%);
    box-shadow: 0 28px 64px rgba(23, 26, 57, 0.18);
  }

  .students-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 28px 30px 24px;
    border-bottom: 1px solid #e8edf8;
  }

  .students-modal__title {
    margin: 0;
    color: #111111;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .students-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: #475069;
  }

  .students-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .students-modal__body {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 28px 30px 18px;
  }

  .students-modal__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .students-modal__label {
    color: #141414;
    font-size: 0.98rem;
    font-weight: 700;
  }

  .students-modal__group-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 136px;
    gap: 16px;
  }

  .students-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  }

  .students-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: #d7deeb;
  }

  .students-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #c4cce0;
  }

  .students-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: #8450ff;
    box-shadow: 0 0 0 3px rgba(132, 80, 255, 0.12);
  }

  .students-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: #121826;
    font-size: 0.99rem;
  }

  .students-modal__body .MuiInputBase-input::placeholder {
    color: #8a93a7;
    opacity: 1;
  }

  .students-modal__control .MuiSelect-select {
    padding-right: 42px;
  }

  .students-modal__select-button,
  .students-modal__add-field,
  .students-modal__save {
    background: linear-gradient(135deg, #7a3ff2 0%, #9363ff 100%);
    color: #ffffff;
    font-weight: 700;
    text-transform: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 8px 18px rgba(122, 63, 242, 0.22);
  }

  .students-modal__select-button {
    min-height: 46px;
    padding: 0 34px;
    border-radius: 16px;
    font-size: 0.98rem;
  }

  .students-modal__select-button:hover,
  .students-modal__add-field:hover,
  .students-modal__save:hover {
    background: linear-gradient(135deg, #6f34eb 0%, #8757fb 100%);
  }

  .students-modal__upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 206px;
    gap: 14px;
    padding: 24px 22px;
    border: 1.5px dashed #d8cbff;
    border-radius: 24px;
    background:
      radial-gradient(circle at top, rgba(123, 66, 246, 0.08), transparent 58%),
      #fcfbff;
    cursor: pointer;
    text-align: center;
  }

  .students-modal__upload-input {
    display: none;
  }

  .students-modal__upload-artwork {
    width: 88px;
    height: 74px;
  }

  .students-modal__upload-artwork svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .students-modal__upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    max-width: 390px;
  }

  .students-modal__upload-title {
    margin: 0;
    color: #171717;
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.45;
  }

  .students-modal__upload-title span {
    color: #7b42f6;
  }

  .students-modal__upload-copy,
  .students-modal__upload-file {
    margin: 0;
    color: #586174;
    line-height: 1.45;
  }

  .students-modal__upload-file {
    margin-top: 8px;
    color: #334155;
    font-weight: 600;
  }

  .students-modal__add-field {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 26px;
    border-radius: 16px;
  }

  .students-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 18px 30px 28px;
  }

  .students-modal__cancel,
  .students-modal__save {
    min-width: 122px;
    min-height: 46px;
    padding: 0 36px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .students-modal__cancel {
    border: 1px solid #7fb1ff;
    background: #ffffff;
    color: #2f80ed;
  }

  .students-modal__cancel:hover {
    border-color: #5b9bff;
    background: #f8fbff;
  }

  @media (max-width: 860px) {
    .students-modal__header,
    .students-modal__body,
    .students-modal__footer {
      padding-left: 18px;
      padding-right: 18px;
    }

    .students-modal__group-row {
      grid-template-columns: 1fr;
    }

    .students-modal__upload {
      min-height: 220px;
      padding: 24px 18px;
    }

    .students-modal__footer {
      justify-content: stretch;
    }

    .students-modal__cancel,
    .students-modal__save {
      flex: 1;
    }
  }
`
