import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const IeltsEvaluationRoot = styled.div`
  display: grid;
  gap: ${theme.spacing(2.5)};

  .ielts-eval__task-card {
    border: 1px solid ${c.border.default};
    border-radius: 16px;
    padding: 20px 22px;
    background: ${c.background.default};
    box-shadow: 0 6px 18px ${tokens.rgba.slate900_04};
  }

  .ielts-eval__task-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
    margin-bottom: ${theme.spacing(2)};
  }

  .ielts-eval__task-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .ielts-eval__essay-block {
    margin-bottom: ${theme.spacing(2)};
  }

  .ielts-eval__scores-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .ielts-eval__score-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ielts-eval__score-label-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ielts-eval__score-label {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
  }

  .ielts-eval__feedback-label {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
    margin-bottom: 6px;
  }

  .ielts-eval__feedback {
    margin-top: ${theme.spacing(2)};
  }

  .ielts-eval__criteria-toggle {
    margin-top: ${theme.spacing(1.5)};
  }

  .ielts-eval__criteria-panel {
    overflow: hidden;
    transition: max-height 0.35s ease, opacity 0.25s ease, margin-top 0.25s ease;
  }

  .ielts-eval__criteria-panel--collapsed {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
  }

  .ielts-eval__criteria-panel--expanded {
    max-height: 4000px;
    opacity: 1;
    margin-top: ${theme.spacing(1.5)};
  }

  .ielts-eval__overall-card {
    margin-top: ${theme.spacing(1.5)};
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid ${c.primary.main};
    background: linear-gradient(135deg, ${c.primary.tint} 0%, ${c.background.default} 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .ielts-eval__overall-label {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .ielts-eval__overall-value {
    font-size: 2rem;
    font-weight: 900;
    line-height: 1;
    color: ${c.primary.main};
  }

  .ielts-eval__validation {
    margin-top: ${theme.spacing(1)};
    font-size: 13px;
    color: ${c.error.main};
  }

  .ielts-eval__actions {
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(2.5)};
    padding-top: ${theme.spacing(2)};
    border-top: 1px solid ${c.border.default};
  }

  .ielts-eval__descriptor-popover {
    max-width: 360px;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
    color: ${c.text.primary};
  }

  .ielts-eval__descriptor-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${c.text.secondary};
    margin-bottom: 8px;
  }

  .ielts-eval__criteria-table-wrap {
    border: 1px solid ${c.border.default};
    border-radius: 12px;
    overflow: auto;
    max-height: 480px;
  }

  .ielts-eval__criteria-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    min-width: 720px;
  }

  .ielts-eval__criteria-table th,
  .ielts-eval__criteria-table td {
    border-bottom: 1px solid ${c.background.subtle};
    padding: 10px 12px;
    vertical-align: top;
    text-align: left;
  }

  .ielts-eval__criteria-table th {
    position: sticky;
    top: 0;
    background: ${c.background.subtle};
    font-weight: 800;
    color: ${c.text.secondary};
    z-index: 1;
  }

  .ielts-eval__criteria-table td:first-of-type {
    font-weight: 700;
    white-space: nowrap;
    color: ${c.text.primary};
    background: ${c.background.soft};
    position: sticky;
    left: 0;
    z-index: 1;
  }

  .ielts-eval__criteria-table tr:last-child td {
    border-bottom: none;
  }

  .ielts-eval__criteria-accordion {
    display: grid;
    gap: ${theme.spacing(1)};
  }

  .ielts-eval__criteria-accordion-item {
    border: 1px solid ${c.border.default};
    border-radius: 10px;
    overflow: hidden;
  }

  .ielts-eval__criteria-accordion-summary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px;
    background: ${c.background.soft};
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.primary};
    text-align: left;
  }

  .ielts-eval__criteria-accordion-body {
    padding: 10px 12px 12px;
    font-size: 12px;
    line-height: 1.55;
    color: ${c.text.primary};
    white-space: pre-wrap;
  }
`
