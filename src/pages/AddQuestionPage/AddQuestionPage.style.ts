import styled from '@emotion/styled'

export const AddQuestionPageRoot = styled.div`
  .add-question-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .add-question-page__hero {
    display: grid;
    grid-template-columns: minmax(260px, 320px) 1fr;
    gap: 20px;
    align-items: start;
  }

  @media (max-width: 960px) {
    .add-question-page__hero {
      grid-template-columns: 1fr;
    }
  }

  .add-question-page__panel {
    border: 1px solid #dbe2f1;
    border-radius: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  }

  .add-question-page__rail {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .add-question-page__rail-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .add-question-page__rail-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .add-question-page__rail-copy {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .add-question-page__module-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: min(70vh, 640px);
    overflow-y: auto;
    padding-right: 4px;
  }

  .add-question-page__module-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    text-align: left;
    text-transform: none;
    color: #0f172a;
  }

  .add-question-page__module-card:hover {
    border-color: #c4b5fd;
    background: #faf5ff;
  }

  .add-question-page__module-card--active {
    border-color: #8b5cf6;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(139, 92, 246, 0.06));
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.12);
  }

  .add-question-page__module-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #7c3aed;
  }

  .add-question-page__module-title {
    font-weight: 700;
    font-size: 0.95rem;
  }

  .add-question-page__module-description {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
  }

  .add-question-page__workspace {
    padding: 20px;
  }

  .add-question-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .add-question-card {
    border: 1px solid #edf2fb;
    border-radius: 16px;
    padding: 18px;
    background: #ffffff;
  }

  .add-question-card__title {
    margin: 0 0 14px;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
  }

  .add-question-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 720px) {
    .add-question-form__grid {
      grid-template-columns: 1fr;
    }
  }

  .add-question-form__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    color: #334155;
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
    gap: 10px;
    min-height: 120px;
    padding: 20px 16px;
    border: 2px dashed #c4b5fd;
    border-radius: 14px;
    background: linear-gradient(165deg, #ffffff 0%, #faf5ff 45%, #f5f3ff 100%);
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.22s ease,
      background 0.2s ease;
  }

  .add-question-form__file-zone:hover .add-question-form__file-trigger {
    border-color: #8b5cf6;
    box-shadow: 0 4px 18px rgba(124, 58, 237, 0.12);
  }

  .add-question-form__file-zone:focus-within .add-question-form__file-trigger {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.22);
  }

  .add-question-form__file-trigger-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    color: #ffffff;
    background: linear-gradient(145deg, #7c3aed 0%, #6d28d9 100%);
    box-shadow: 0 4px 14px rgba(109, 40, 217, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.22);
    transition: transform 0.14s ease, box-shadow 0.14s ease;
  }

  .add-question-form__file-zone:hover .add-question-form__file-trigger-icon-wrap {
    box-shadow: 0 6px 20px rgba(109, 40, 217, 0.48);
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
    color: #0f172a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-question-form__file-trigger-placeholder {
    display: block;
    width: 100%;
    font-size: 0.88rem;
    font-weight: 500;
    color: #94a3b8;
    font-style: italic;
  }

  .add-question-form__file-trigger-hint {
    display: block;
    max-width: 22rem;
    margin: 0 auto;
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }

  .add-question-form__audio-preview {
    margin: 12px 0 0;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
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
    gap: 12px;
  }

  .add-question-option {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    background: #fafafa;
  }

  .add-question-option__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .add-question-option__label {
    font-weight: 600;
    font-size: 0.85rem;
    color: #475569;
  }

  .add-question-form__subaction {
    text-transform: none;
    min-width: 110px;
    border-radius: 10px;
    font-weight: 600;
  }

  .add-question-form__publish-errors {
    border: 1px solid #fecaca;
    background: #fef2f2;
    border-radius: 12px;
    padding: 14px 16px;
  }

  .add-question-form__publish-errors-title {
    margin: 0;
    font-weight: 700;
    color: #991b1b;
    font-size: 0.9rem;
  }

  .add-question-form__publish-errors-list {
    margin: 8px 0 0;
    padding-left: 18px;
    color: #b91c1c;
    font-size: 0.85rem;
  }

  .add-question-form__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding-top: 8px;
  }

  .add-question-form__footer-copy {
    margin: 0;
    color: #64748b;
    font-size: 0.85rem;
  }

  .add-question-form__footer-actions {
    display: flex;
    gap: 10px;
  }

  .add-question-form__primary {
    min-height: 46px;
    padding: 0 22px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: none;
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  }

  .add-question-form .MuiOutlinedInput-root {
    border-radius: 12px;
    background: #ffffff;
  }
`
