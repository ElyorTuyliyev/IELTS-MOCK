import styled from '@emotion/styled'
import { Dialog } from '@mui/material'

import theme, { c, tokens } from '@/theme'
export const ExamFormDialogRoot = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 24px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    box-shadow:
      0 24px 60px ${tokens.rgba.slate900_18},
      0 2px 6px ${tokens.rgba.slate900_04};
    overflow: hidden;
  }

  .exam-form__title {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 28px 32px 20px;
    background:
      radial-gradient(circle at 8% 30%, ${tokens.rgba.primary_08} 0%, transparent 50%),
      ${c.gradient.cardSoft};
  }

  .exam-form__title-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: ${c.gradient.modalHeader};
    border: 1px solid ${c.primary.tintBorder};
    display: grid;
    place-items: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .exam-form__title-text {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .exam-form__title-sub {
    font-size: 14px;
    color: ${c.text.secondary};
    margin-top: 2px;
  }

  .exam-form__content {
    padding: 24px 32px 20px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
  }

  .exam-form__field .MuiOutlinedInput-root {
    border-radius: 14px;
    transition: box-shadow 0.15s ease;
  }

  .exam-form__field .MuiOutlinedInput-root:hover {
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_08};
  }

  .exam-form__field .MuiOutlinedInput-root.Mui-focused {
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_12};
  }

  .exam-form__field .MuiInputLabel-root {
    font-weight: 600;
  }

  .exam-form__row {
    display: flex;
    gap: ${theme.spacing(2)};
  }

  .exam-form__alert {
    border-radius: 12px;
  }

  .exam-form__actions {
    padding: 16px 32px 24px;
    gap: ${theme.spacing(1.5)};
  }

  .exam-form__cancel-btn.MuiButton-root {
    min-height: 46px;
    padding: 0 24px;
    border-radius: 13px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    border-color: ${c.border.strong};
    color: ${c.text.muted};
  }

  .exam-form__cancel-btn.MuiButton-root:hover {
    background: ${c.surface.muted};
    border-color: ${c.text.disabled};
  }

  .exam-form__save-btn.MuiButton-root {
    min-height: 46px;
    padding: 0 28px;
    border-radius: 13px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    background: ${c.gradient.primaryIndigo};
    box-shadow: 0 4px 14px ${tokens.rgba.primary_28};
  }

  .exam-form__save-btn.MuiButton-root:hover {
    box-shadow: 0 6px 18px ${tokens.rgba.primary_28};
  }

  .exam-form__save-btn.MuiButton-root.Mui-disabled {
    background: ${c.indigo.soft};
    color: ${c.surface.default};
    box-shadow: none;
  }
`
