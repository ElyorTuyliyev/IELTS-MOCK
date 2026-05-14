import { css } from '@emotion/react'
import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const AdminPageRoot = styled.div`
  .admin-page {
    display: grid;
    gap: ${theme.spacing(3)};
  }

  .admin-page__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(2.5)};
    padding: 30px 32px;
    border-radius: 30px;
    border: 1px solid ${tokens.rgba.border_24};
    background:
      radial-gradient(circle at top right, ${tokens.rgba.chartDifficult_12}, transparent 28%),
      linear-gradient(135deg, ${tokens.rgba.white_92}, ${tokens.rgba.white_92});
    box-shadow: 0 24px 60px ${tokens.rgba.slate900_08};
  }

  .admin-page__eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${c.warning.main};
  }

  .admin-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${c.text.primary};
  }

  .admin-page__description {
    margin: 12px 0 0;
    max-width: 700px;
    font-size: 15px;
    line-height: 1.7;
    color: ${c.text.secondary};
  }

  .admin-page__badge {
    flex-shrink: 0;
    padding: 12px 18px;
    border-radius: 999px;
    background: ${tokens.rgba.chartDifficult_12};
    color: ${c.warning.main};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .admin-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(2.25)};
  }

  .admin-page__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
  }

  .admin-page__section-title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .admin-page__head-actions {
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(1.75)};
    flex-wrap: wrap;
  }

  .admin-page__utility-button,
  .admin-page__primary-button {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
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
    border: 1px solid ${c.border.soft};
    background: ${c.surface.default};
    color: ${c.text.primary};
  }

  .admin-page__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2.5)};
  }

  .admin-page__stat,
  .admin-page__panel {
    padding: 22px 24px;
    border-radius: 26px;
    background: ${tokens.rgba.white_92};
    border: 1px solid ${tokens.rgba.border_24};
    box-shadow: 0 20px 42px ${tokens.rgba.slate900_06};
  }

  .admin-page__stat-label {
    display: block;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${c.text.secondary};
  }

  .admin-page__stat-value {
    display: block;
    margin-top: 10px;
    font-size: 30px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .admin-page__stat-meta {
    margin: 8px 0 0;
    font-size: 14px;
    color: ${c.text.muted};
  }

  .admin-page__panel--table {
    padding: 0;
    overflow: hidden;
  }

  .admin-page__primary-button {
    background: ${c.gradient.primary};
    color: ${c.surface.default};
  }

  .admin-page__table-filters {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(1.75)};
    padding: 20px;
    border-bottom: 1px solid ${c.border.divider};
    flex-wrap: wrap;
  }

  .admin-page__search {
    width: min(100%, 340px);
  }

  .admin-page__search .MuiOutlinedInput-root,
  .admin-page__select .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .admin-page__search-icon {
    color: ${c.text.subtle};
    font-size: 1.15rem;
    line-height: 1;
  }

  .admin-page__table-actions {
    display: flex;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .admin-page__select {
    min-width: 150px;
  }

  .admin-page__ghost-button {
    min-height: 46px;
    padding: 0 16px;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    font-weight: 600;
    text-transform: none;
  }

  .admin-page__danger-button {
    border-radius: 999px;
    color: ${c.error.main};
    border-color: ${tokens.rgba.error_28};
  }

  .admin-page__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
  }

  .admin-page__count-badge {
    flex-shrink: 0;
    min-width: 48px;
    padding: 10px 14px;
    border-radius: 999px;
    text-align: center;
    font-size: 14px;
    font-weight: 800;
    color: ${c.warning.main};
    background: ${tokens.rgba.chartDifficult_12};
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
    background: ${c.surface.muted};
    border-bottom: 1px solid ${c.border.divider};
  }

  .admin-page__table .MuiDataGrid-columnHeaderTitle {
    font-weight: 800;
    color: ${c.text.subtle};
  }

  .admin-page__table .MuiDataGrid-row {
    border-top: 1px solid ${c.border.divider};
  }

  .admin-page__table .MuiDataGrid-cell {
    display: flex;
    align-items: center;
  }

  .admin-page__table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 16px 20px;
    border-top: 1px solid ${c.border.divider};
    color: ${c.text.muted};
    font-size: 0.94rem;
    font-weight: 500;
    flex-wrap: wrap;
  }

  .admin-page__panel-title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .admin-page__panel-text {
    margin: 8px 0 0;
    font-size: 14px;
    color: ${c.text.secondary};
  }

  .admin-page__list {
    display: grid;
    gap: ${theme.spacing(1.75)};
    margin-top: 18px;
  }

  .admin-page__list-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    padding: 16px 0;
    border-top: 1px solid ${tokens.rgba.border_24};
  }

  .admin-page__list-item:first-of-type {
    padding-top: 0;
    border-top: 0;
  }

  .admin-page__list-label {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: ${c.text.dark};
  }

  .admin-page__list-meta {
    margin: 6px 0 0;
    font-size: 13px;
    color: ${c.text.secondary};
  }

  .admin-page__list-value {
    font-size: 13px;
    font-weight: 800;
    color: ${c.warning.main};
    white-space: nowrap;
  }

  .admin-modal__backdrop {
    background: ${tokens.rgba.slate900_48};
    backdrop-filter: blur(3px);
  }

  .admin-modal__paper {
    overflow: hidden;
    border: 1px solid ${c.border.modal};
    border-radius: 28px;
    width: min(100%, 620px);
    max-width: 620px;
    background: linear-gradient(180deg, ${c.surface.default} 0%, ${c.background.card} 100%);
    box-shadow: 0 28px 64px ${tokens.rgba.slate900_18};
  }

  .admin-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 28px 30px 24px;
    border-bottom: 1px solid ${c.neutral[400]};
  }

  .admin-modal__title {
    margin: 0;
    color: ${c.examPlayer.text};
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: ${c.text.muted};
  }

  .admin-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .admin-modal__body {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.75)};
    padding: 28px 30px 18px;
  }

  .admin-modal__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.9fr);
    gap: ${theme.spacing(2)};
  }

  .admin-modal__intro-card,
  .admin-modal__preview {
    border-radius: 24px;
    border: 1px solid ${c.neutral[200]};
  }

  .admin-modal__intro-card {
    padding: 22px;
    background:
      radial-gradient(circle at top right, ${tokens.rgba.primary_14}, transparent 28%),
      linear-gradient(180deg, ${c.primary.tint} 0%, ${c.surface.default} 100%);
  }

  .admin-modal__eyebrow {
    margin: 0 0 8px;
    color: ${c.primary.main};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .admin-modal__intro-title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1.18rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__intro-text {
    margin: 10px 0 0;
    color: ${c.text.secondary};
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .admin-modal__rules {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.25)};
    margin-top: 16px;
  }

  .admin-modal__rule-chip {
    padding: 8px 12px;
    border-radius: 999px;
    background: ${tokens.rgba.primary_08};
    color: ${c.primary.dark};
    font-size: 0.82rem;
    font-weight: 700;
  }

  .admin-modal__preview {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: ${theme.spacing(1.25)};
    padding: 22px 18px;
    background: linear-gradient(180deg, ${c.surface.default} 0%, ${c.background.soft} 100%);
  }

  .admin-modal__preview-avatar {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: ${c.gradient.primaryCyan};
    color: ${c.surface.default};
    font-size: 1.35rem;
    font-weight: 800;
    box-shadow: 0 12px 30px ${tokens.rgba.primary_28};
  }

  .admin-modal__preview-name {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1rem;
    font-weight: 800;
  }

  .admin-modal__preview-email {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.88rem;
  }

  .admin-modal__preview-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 8px 12px;
    border-radius: 999px;
    background: ${c.background.default};
    color: ${c.info.indigo};
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  .admin-modal__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2.25, 2)};
  }

  .admin-modal__field {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  }

  .admin-modal__field--full {
    grid-column: 1 / -1;
  }

  .admin-modal__label {
    color: ${c.text.primary};
    font-size: 0.98rem;
    font-weight: 700;
  }

  .admin-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: ${c.surface.default};
    box-shadow: 0 1px 3px ${tokens.rgba.slate900_06};
  }

  .admin-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: ${c.neutral[800]};
  }

  .admin-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${c.neutral[900]};
  }

  .admin-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: ${c.primary.light};
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_12};
  }

  .admin-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: ${c.text.primary};
    font-size: 0.99rem;
  }

  .admin-modal__body .MuiInputBase-input::placeholder {
    color: ${c.neutral.icon};
    opacity: 1;
  }

  .admin-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(1.5)};
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
    border: 1px solid ${c.border.soft};
    color: ${c.text.primary};
    background: ${c.surface.default};
  }

  .admin-modal__save {
    background: linear-gradient(135deg, ${c.primary.main} 0%, ${c.primary.light} 100%);
    color: ${c.surface.default};
    box-shadow:
      inset 0 1px 0 ${tokens.rgba.white_92},
      0 8px 18px ${tokens.rgba.primary_20};
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
    background: ${tokens.rgba.slate900_48};
    backdrop-filter: blur(3px);
  }

  .admin-modal__paper {
    overflow: hidden;
    border: 1px solid ${c.border.modal};
    border-radius: 28px;
    width: min(100%, 760px);
    max-width: 760px;
    background: linear-gradient(180deg, ${c.surface.default} 0%, ${c.background.card} 100%);
    box-shadow: 0 28px 64px ${tokens.rgba.slate900_18};
  }

  .admin-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 28px 30px 24px;
    border-bottom: 1px solid ${c.neutral[400]};
  }

  .admin-modal__title {
    margin: 0;
    color: ${c.examPlayer.text};
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__close {
    width: 34px;
    height: 34px;
    border-radius: 16px;
    color: ${c.text.muted};
  }

  .admin-modal__close svg {
    width: 22px;
    height: 22px;
  }

  .admin-modal__body {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.75)};
    padding: 28px 30px 18px;
  }

  .admin-modal__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.9fr);
    gap: ${theme.spacing(2)};
  }

  .admin-modal__intro-card,
  .admin-modal__preview {
    border-radius: 24px;
    border: 1px solid ${c.neutral[200]};
  }

  .admin-modal__intro-card {
    padding: 22px;
    background:
      radial-gradient(circle at top right, ${tokens.rgba.primary_14}, transparent 28%),
      linear-gradient(180deg, ${c.primary.tint} 0%, ${c.surface.default} 100%);
  }

  .admin-modal__eyebrow {
    margin: 0 0 8px;
    color: ${c.primary.main};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .admin-modal__intro-title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1.18rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .admin-modal__intro-text {
    margin: 10px 0 0;
    color: ${c.text.secondary};
    font-size: 0.94rem;
    line-height: 1.65;
  }

  .admin-modal__rules {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.25)};
    margin-top: 16px;
  }

  .admin-modal__rule-chip {
    padding: 8px 12px;
    border-radius: 999px;
    background: ${tokens.rgba.primary_08};
    color: ${c.primary.dark};
    font-size: 0.82rem;
    font-weight: 700;
  }

  .admin-modal__preview {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: ${theme.spacing(1.25)};
    padding: 22px 18px;
    background: linear-gradient(180deg, ${c.surface.default} 0%, ${c.background.soft} 100%);
  }

  .admin-modal__preview-avatar {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: ${c.gradient.primaryCyan};
    color: ${c.surface.default};
    font-size: 1.35rem;
    font-weight: 800;
    box-shadow: 0 12px 30px ${tokens.rgba.primary_28};
  }

  .admin-modal__preview-name {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1rem;
    font-weight: 800;
  }

  .admin-modal__preview-email {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.88rem;
  }

  .admin-modal__preview-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 8px 12px;
    border-radius: 999px;
    background: ${c.background.default};
    color: ${c.info.indigo};
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  .admin-modal__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2.25, 2)};
  }

  .admin-modal__field {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  }

  .admin-modal__field--full {
    grid-column: 1 / -1;
  }

  .admin-modal__label {
    color: ${c.text.primary};
    font-size: 0.98rem;
    font-weight: 700;
  }

  .admin-modal__body .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 14px;
    background: ${c.surface.default};
    box-shadow: 0 1px 3px ${tokens.rgba.slate900_06};
  }

  .admin-modal__body .MuiOutlinedInput-notchedOutline {
    border-color: ${c.neutral[800]};
  }

  .admin-modal__body .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${c.neutral[900]};
  }

  .admin-modal__body .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
    border-color: ${c.primary.light};
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_12};
  }

  .admin-modal__body .MuiInputBase-input {
    padding: 13px 15px;
    color: ${c.text.primary};
    font-size: 0.99rem;
  }

  .admin-modal__body .MuiInputBase-input::placeholder {
    color: ${c.neutral.icon};
    opacity: 1;
  }

  .admin-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(1.5)};
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
    border: 1px solid ${c.border.soft};
    color: ${c.text.primary};
    background: ${c.surface.default};
  }

  .admin-modal__save {
    background: linear-gradient(135deg, ${c.primary.main} 0%, ${c.primary.light} 100%);
    color: ${c.surface.default};
    box-shadow:
      inset 0 1px 0 ${tokens.rgba.white_92},
      0 8px 18px ${tokens.rgba.primary_20};
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
