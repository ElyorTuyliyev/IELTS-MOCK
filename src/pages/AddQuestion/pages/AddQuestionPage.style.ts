import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const AddQuestionPageRoot = styled.div`
  .add-question-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
  }

  .add-question-page__hero {
    display: grid;
    grid-template-columns: minmax(260px, 320px) 1fr;
    gap: ${theme.spacing(2.5)};
    align-items: start;
  }

  @media (max-width: 960px) {
    .add-question-page__hero {
      grid-template-columns: 1fr;
    }
  }

  .add-question-page__panel {
    border: 1px solid ${c.border.medium};
    border-radius: 20px;
    background: ${c.gradient.card};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .add-question-page__rail {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  }

  .add-question-page__rail-head {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .add-question-page__rail-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .add-question-page__rail-copy {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .add-question-page__module-list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
    max-height: min(70vh, 640px);
    overflow-y: auto;
    padding-right: 4px;
  }

  .add-question-page__module-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing(0.75)};
    padding: 12px 14px;
    border-radius: 14px;
    border: none;
    background: ${c.surface.muted};
    text-align: left;
    text-transform: none;
    color: ${c.text.primary};
  }

  .add-question-page__module-card:hover {
    background: ${c.background.subtle};
    box-shadow: none;
  }

  .add-question-page__module-card--active {
    background: ${c.border.default};
    box-shadow: none;
  }

  .add-question-page__module-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${c.text.secondary};
  }

  .add-question-page__module-title {
    font-weight: 700;
    font-size: 0.95rem;
  }

  .add-question-page__module-description {
    font-size: 0.8rem;
    color: ${c.text.secondary};
    line-height: 1.4;
  }

  .add-question-page__workspace {
    padding: 20px;
  }

  .add-question-form {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
  }

  .add-question-card {
    border: 1px solid ${c.border.divider};
    border-radius: 16px;
    padding: 18px;
    background: ${c.surface.default};
  }

  .add-question-card__title {
    margin: 0 0 14px;
    font-size: 1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .add-question-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2)};
  }

  @media (max-width: 720px) {
    .add-question-form__grid {
      grid-template-columns: 1fr;
    }
  }

  .add-question-form__parts-grid {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  }

  .add-question-form__part-block {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    padding: ${theme.spacing(2.5)};
    border-radius: 14px;
    border: 1px solid ${c.border.divider};
    background: ${c.surface.muted};
  }

  .add-question-form__part-block .add-question-form__label:first-of-type {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .add-question-form__field {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .add-question-form__field--span-2 {
    grid-column: span 2;
  }

  @media (max-width: 720px) {
    .add-question-form__field--span-2 {
      grid-column: span 1;
    }
  }

  .add-question-form__field--span-4 {
    grid-column: 1 / -1;
  }

  .add-question-form__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${c.text.subtle};
  }

  .add-question-form__file-zone {
    position: relative;
    width: 100%;
  }

  .add-question-form__file-input-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .add-question-form__file-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: ${theme.spacing(1.25)};
    min-height: 120px;
    padding: 20px 16px;
    border: 2px dashed ${c.indigo.soft};
    border-radius: 14px;
    background: linear-gradient(165deg, ${c.surface.default} 0%, ${c.primary.tint} 45%, ${c.primary.tint} 100%);
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.22s ease,
      background 0.2s ease;
  }

  .add-question-form__file-zone:hover .add-question-form__file-trigger {
    border-color: ${c.primary.light};
    box-shadow: 0 4px 18px ${tokens.rgba.primary_12};
  }

  .add-question-form__file-zone:focus-within .add-question-form__file-trigger {
    outline: none;
    border-color: ${c.primary.main};
    box-shadow: 0 0 0 3px ${tokens.rgba.primary_20};
  }

  .add-question-form__file-trigger-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    color: ${c.surface.default};
    background: linear-gradient(145deg, ${c.primary.main} 0%, ${c.primary.dark} 100%);
    box-shadow: 0 4px 14px ${tokens.rgba.primary_28};
    border: 1px solid ${tokens.rgba.white_92};
    transition: transform 0.14s ease, box-shadow 0.14s ease;
  }

  .add-question-form__file-zone:hover .add-question-form__file-trigger-icon-wrap {
    box-shadow: 0 6px 20px ${tokens.rgba.primary_28};
    transform: translateY(-1px);
  }

  .add-question-form__file-zone:active .add-question-form__file-trigger-icon-wrap {
    transform: scale(0.96);
  }

  .add-question-form__file-trigger-svg {
    display: block;
  }

  .add-question-form__file-trigger-filename {
    display: block;
    width: 100%;
    max-width: 100%;
    padding: 0 4px;
    font-size: 0.88rem;
    font-weight: 600;
    color: ${c.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-question-form__file-trigger-placeholder {
    display: block;
    width: 100%;
    font-size: 0.88rem;
    font-weight: 500;
    color: ${c.text.disabled};
    font-style: italic;
  }

  .add-question-form__file-trigger-hint {
    display: block;
    max-width: 22rem;
    margin: 0 auto;
    font-size: 0.72rem;
    color: ${c.text.secondary};
    line-height: 1.45;
    letter-spacing: 0.01em;
  }

  .add-question-form__audio-preview {
    margin: 12px 0 0;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid ${c.border.default};
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.background.subtle} 100%);
  }

  .add-question-form__audio-preview audio {
    display: block;
    width: 100%;
    min-height: 40px;
  }

  .add-question-form__textarea .ProseMirror {
    min-height: 120px;
  }

  .add-question-options {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
  }

  .add-question-option {
    border: 1px solid ${c.border.input};
    border-radius: 12px;
    padding: 12px;
    background: ${c.surface.muted};
  }

  .add-question-option__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    margin-bottom: 8px;
  }

  .add-question-option__label {
    font-weight: 600;
    font-size: 0.85rem;
    color: ${c.text.muted};
  }

  .add-question-form__subaction {
    text-transform: none;
    min-width: 110px;
    border-radius: 10px;
    font-weight: 600;
  }

  .add-question-form__publish-errors {
    border: 1px solid ${c.error.border};
    background: ${c.error.bg};
    border-radius: 12px;
    padding: 14px 16px;
  }

  .add-question-form__publish-errors-title {
    margin: 0;
    font-weight: 700;
    color: ${c.error.dark};
    font-size: 0.9rem;
  }

  .add-question-form__publish-errors-list {
    margin: 8px 0 0;
    padding-left: 18px;
    color: ${c.error.main};
    font-size: 0.85rem;
  }

  .add-question-form__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.75)};
    padding-top: 8px;
  }

  .add-question-form__footer-copy {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.85rem;
  }

  .add-question-form__footer-actions {
    display: flex;
    gap: ${theme.spacing(1.25)};
  }

  .add-question-form__primary {
    min-height: 46px;
    padding: 0 22px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: none;
    background: ${c.gradient.primary};
  }

  .add-question-form__secondary {
    min-height: 46px;
    padding: 0 22px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    border-color: ${c.border.strong};
    color: ${c.text.subtle};
  }

  .add-question-form .MuiOutlinedInput-root {
    border-radius: 12px;
    background: ${c.surface.default};
  }
`
