import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const ExamDetailsRoot = styled.div`
  display: grid;
  gap: ${theme.spacing(2.75)};

  /* ── Page Header ── */
  .exam-details__header {
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

  .exam-details__header-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .exam-details__header-sub {
    color: ${c.text.secondary};
    font-size: 15px;
    margin-top: 4px;
  }

  .exam-details__back-btn.MuiButton-root {
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    min-height: 42px;
    padding: 0 20px;
    border-color: ${c.border.strong};
    color: ${c.text.muted};
  }

  .exam-details__back-btn.MuiButton-root:hover {
    background: ${c.background.subtle};
    border-color: ${c.text.disabled};
  }

  /* ── Cards (shared) ── */
  .exam-details__card {
    border-radius: 20px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    padding: 28px 32px;
    box-shadow:
      0 1px 2px ${tokens.rgba.slate900_04},
      0 10px 24px ${tokens.rgba.slate900_04};
    display: grid;
    gap: ${theme.spacing(2)};
  }

  .exam-details__card-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.01em;
  }

  .exam-details__card-sub {
    color: ${c.text.secondary};
    font-size: 14px;
  }

  /* ── Info grid ── */
  .exam-details__info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .exam-details__info-header-actions {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .exam-details__start-exam-btn.MuiButton-root {
    min-height: 34px;
    padding: 0 16px;
    border-radius: 10px;
    text-transform: none;
    font-weight: 700;
    font-size: 13px;
    box-shadow: 0 4px 12px ${tokens.rgba.primary_20};
  }

  .exam-details__start-exam-btn.MuiButton-root:hover {
    box-shadow: 0 6px 16px ${tokens.rgba.primary_28};
  }

  .exam-details__info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .exam-details__info-cell {
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid ${c.background.default};
    background: linear-gradient(180deg, ${c.background.soft} 0%, ${c.background.subtle} 100%);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .exam-details__info-cell:hover {
    border-color: ${c.indigo.bg};
    box-shadow: 0 4px 12px ${tokens.rgba.primary_08};
  }

  .exam-details__info-label {
    font-size: 12px;
    color: ${c.text.disabled};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .exam-details__info-value {
    margin-top: 4px;
    font-weight: 700;
    color: ${c.text.primary};
    font-size: 15px;
  }

  /* ── Enroll form ── */
  .exam-details__enroll-form {
    display: flex;
    gap: ${theme.spacing(1.75)};
    flex-wrap: wrap;
    align-items: center;
  }

  .exam-details__enroll-select {
    width: auto;
    flex: 0 0 auto;
    min-width: 320px;
  }

  .exam-details__enroll-select .MuiOutlinedInput-root {
    border-radius: 12px;
    background: ${c.surface.default};
  }

  .exam-details__enroll-btn.MuiButton-root {
    height: 56px;
    padding: 0 24px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    box-shadow: 0 4px 12px ${tokens.rgba.primary_20};
  }

  .exam-details__enroll-btn.MuiButton-root:hover {
    box-shadow: 0 6px 16px ${tokens.rgba.primary_28};
  }

  /* ── DataGrid ── */
  .exam-details__grid-wrap .MuiDataGrid-root {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    overflow: hidden;
  }

  .exam-details__grid-wrap .MuiDataGrid-columnHeaders {
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.background.subtle} 100%);
    color: ${c.text.subtle};
    font-weight: 700;
  }

  .exam-details__grid-wrap .MuiDataGrid-cell {
    border-color: ${c.background.subtle};
  }

  .exam-details__grid-wrap .MuiDataGrid-row:hover {
    background: ${c.background.soft};
  }

  .exam-details__grid-wrap .MuiDataGrid-footerContainer {
    border-top: 1px solid ${c.border.divider};
    background: ${c.background.card};
  }

  /* ── Loading ── */
  .exam-details__loading {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
    padding: 20px 24px;
    border-radius: 16px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
  }

  /* ── Status chip ── */
  .exam-details__status-chip.MuiChip-root {
    font-weight: 700;
    font-size: 13px;
    border-radius: 10px;
    letter-spacing: 0.02em;
  }

  .exam-details__action-btn.MuiIconButton-root {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: ${c.text.secondary};
    transition: background 0.12s ease, color 0.12s ease;
  }

  .exam-details__action-btn.MuiIconButton-root:hover {
    background: ${c.background.subtle};
    color: ${c.text.subtle};
  }

  .exam-details__action-btn--danger.MuiIconButton-root:hover {
    background: ${c.error.bg};
    color: ${c.error.bright};
  }

  .exam-details__action-icon {
    display: block;
    width: 18px;
    height: 18px;
  }

  .exam-details__start-btn.MuiButton-root {
    min-width: 72px;
    height: 30px;
    padding: 0 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: none;
    box-shadow: none;
  }

  .exam-details__end-btn.MuiButton-root {
    min-width: 56px;
    height: 30px;
    padding: 0 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: none;
    box-shadow: none;
  }

  .exam-details__start-label {
    font-size: 13px;
    font-weight: 600;
    color: ${c.success.main};
  }

  .exam-details__end-label {
    font-size: 13px;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .exam-details__score-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .exam-details__score-cell--overall {
    color: ${c.primary.main};
    font-size: 14px;
  }
`
