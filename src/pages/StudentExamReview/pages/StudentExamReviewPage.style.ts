import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const StudentExamReviewRoot = styled.div`
  display: grid;
  gap: ${theme.spacing(2.5)};

  .review__header {
    padding: 24px 28px;
    border-radius: 20px;
    border: 1px solid ${c.border.default};
    background: linear-gradient(135deg, ${c.surface.muted} 0%, ${c.background.default} 100%);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
  }

  .review__title {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .review__sub {
    color: ${c.text.secondary};
    font-size: 14px;
    margin-top: 4px;
  }

  .review__scores {
    display: flex;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .review__score-chip {
    padding: 8px 14px;
    border-radius: 12px;
    background: ${c.background.soft};
    border: 1px solid ${c.border.default};
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .review__card {
    border-radius: 20px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    padding: 24px 28px;
    box-shadow: 0 10px 24px ${tokens.rgba.slate900_04};
  }

  .review__tabs .MuiTab-root {
    text-transform: none;
    font-weight: 700;
    font-size: 14px;
  }

  .review__module-summary {
    display: flex;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
    margin-bottom: ${theme.spacing(2)};
    font-size: 14px;
    color: ${c.text.secondary};
  }

  .review__question-block {
    border: 1px solid ${c.border.default};
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: ${theme.spacing(1.5)};
  }

  .review__question-title {
    font-weight: 700;
    font-size: 15px;
    color: ${c.text.primary};
    margin-bottom: 12px;
  }

  .review__content-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${c.text.secondary};
    margin-bottom: 8px;
  }

  .review__passage,
  .review__questions-preview {
    margin-bottom: ${theme.spacing(1.5)};
  }

  .review__html {
    border: 1px solid ${c.border.default};
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 14px;
    line-height: 1.55;
    background: ${c.background.soft};
    max-height: 280px;
    overflow: auto;
  }

  .review__html--passage {
    max-height: 220px;
  }

  .review__answers-table {
    border: 1px solid ${c.border.default};
    border-radius: 12px;
    overflow: hidden;
    margin-top: 4px;
  }

  .review__slot-row {
    display: grid;
    grid-template-columns: 100px 1fr 1fr auto;
    gap: 12px;
    align-items: start;
    padding: 10px 14px;
    border-top: 1px solid ${c.background.subtle};
    font-size: 13px;
  }

  .review__slot-row--header {
    background: ${c.background.subtle};
    border-top: none;
    font-size: 12px;
    color: ${c.text.secondary};
  }

  .review__slot-row--correct {
    background: ${c.success.bg};
  }

  .review__slot-row--wrong {
    background: ${c.error.bg};
  }

  .review__answer--missing {
    color: ${c.text.disabled};
    font-style: italic;
  }

  .review__empty--inline {
    padding: 12px 0 0;
    font-size: 13px;
  }

  .review__badge {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .review__badge--correct {
    background: ${c.success.bg};
    color: ${c.success.main};
  }

  .review__badge--wrong {
    background: ${c.error.bg};
    color: ${c.error.bright};
  }

  .review__badge--neutral {
    background: ${c.background.subtle};
    color: ${c.text.secondary};
  }

  .review__essay {
    width: 100%;
    min-height: 160px;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid ${c.border.default};
    background: ${c.background.soft};
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .review__form-grid {
    display: grid;
    gap: ${theme.spacing(2)};
    max-width: 420px;
    margin-top: ${theme.spacing(2)};
  }

  .review__label {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
    margin-bottom: 6px;
  }

  .review__input {
    width: 100%;
  }

  .review__textarea .MuiOutlinedInput-root {
    border-radius: 12px;
  }

  .review__actions {
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(2)};
  }

  .review__empty {
    color: ${c.text.disabled};
    font-style: italic;
    padding: 24px 0;
  }
`
