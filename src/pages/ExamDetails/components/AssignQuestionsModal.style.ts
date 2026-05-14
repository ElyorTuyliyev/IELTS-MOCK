import styled from '@emotion/styled'
import { Dialog } from '@mui/material'

import theme, { c, tokens } from '@/theme'
export const AssignQuestionsRoot = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 22px;
    border: 1px solid ${c.border.default};
    overflow: hidden;
    box-shadow:
      0 24px 56px ${tokens.rgba.slate900_18},
      0 2px 6px ${tokens.rgba.slate900_04};
    max-height: 85vh;
  }

  .aq__header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 24px 28px 16px;
    background:
      radial-gradient(circle at 8% 30%, ${tokens.rgba.primary_08} 0%, transparent 50%),
      linear-gradient(180deg, ${c.background.card} 0%, ${c.surface.default} 100%);
  }

  .aq__header-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: ${c.gradient.modalHeader};
    border: 1px solid ${c.primary.tintBorder};
    display: grid;
    place-items: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .aq__header-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
  }

  .aq__header-sub {
    font-size: 14px;
    color: ${c.text.secondary};
    margin-top: 2px;
  }

  .aq__tabs {
    padding: 0 28px;
    border-bottom: 1px solid ${c.background.subtle};
  }

  .aq__tab.MuiTab-root {
    text-transform: none;
    font-weight: 700;
    font-size: 14px;
    min-height: 44px;
  }

  .aq__content {
    padding: 20px 28px;
    overflow-y: auto;
    max-height: 50vh;
  }

  .aq__question-list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .aq__question-item {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid ${c.border.default};
    background: ${c.background.card};
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .aq__question-item:hover {
    border-color: ${c.indigo.soft};
    background: ${c.primary.tint};
  }

  .aq__question-item--selected {
    border-color: ${c.primary.main};
    background: ${c.primary.tintStrong};
  }

  .aq__question-title {
    flex: 1;
    font-size: 14px;
    color: ${c.text.dark};
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .aq__question-module {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 6px;
    white-space: nowrap;
  }

  .aq__module--listening {
    background: ${c.primary.tintStrong};
    color: ${c.primary.dark};
  }

  .aq__module--reading {
    background: ${c.info.bgMuted};
    color: ${c.info.dark};
  }

  .aq__module--writing {
    background: ${c.success.bgLight};
    color: ${c.success.dark};
  }

  .aq__module--speaking {
    background: ${c.warning.bg};
    color: ${c.warning.main};
  }

  .aq__empty {
    text-align: center;
    padding: 32px 16px;
    color: ${c.text.disabled};
    font-size: 14px;
  }

  .aq__count-badge {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
    padding: 12px 0 4px;
  }

  .aq__actions {
    padding: 16px 28px 24px;
    gap: ${theme.spacing(1.5)};
  }

  .aq__cancel-btn.MuiButton-root {
    min-height: 44px;
    padding: 0 22px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    border-color: ${c.border.strong};
    color: ${c.text.muted};
  }

  .aq__save-btn.MuiButton-root {
    min-height: 44px;
    padding: 0 24px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    background: ${c.gradient.primaryIndigo};
    box-shadow: 0 4px 14px ${tokens.rgba.primary_28};
  }

  .aq__save-btn.MuiButton-root:hover {
    box-shadow: 0 6px 18px ${tokens.rgba.primary_28};
  }
`
