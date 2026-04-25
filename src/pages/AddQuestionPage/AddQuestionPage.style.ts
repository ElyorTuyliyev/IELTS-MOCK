import styled from '@emotion/styled'

export const AddQuestionPageRoot = styled.div`
  .add-question-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .add-question-page a {
    color: inherit;
    text-decoration: none;
  }

  .add-question-page__crumbs {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .add-question-page__crumb-current {
    color: #111827;
    font-weight: 700;
  }

  .add-question-page__hero {
    display: grid;
    grid-template-columns: 1.05fr 1.95fr;
    gap: 18px;
  }

  .add-question-page__panel {
    border: 1px solid #dbe2f1;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .add-question-page__rail {
    overflow: hidden;
  }

  .add-question-page__rail-head {
    padding: 22px 22px 18px;
    border-bottom: 1px solid #edf2fb;
  }

  .add-question-page__rail-title,
  .add-question-page__workspace-title,
  .add-question-card__title,
  .add-question-builder__title {
    margin: 0;
    color: #111827;
    font-weight: 700;
  }

  .add-question-page__rail-title {
    font-size: 1.08rem;
  }

  .add-question-page__rail-copy,
  .add-question-builder__copy,
  .add-question-card__copy {
    margin: 8px 0 0;
    color: #64748b;
    line-height: 1.55;
  }

  .add-question-page__module-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
  }

  .add-question-page__module-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    background: #ffffff;
    color: #111827;
    text-align: left;
    text-transform: none;
  }

  .add-question-page__module-card--active {
    border-color: #c4b5fd;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 50%),
      #f8f4ff;
    box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.08);
  }

  .add-question-page__module-eyebrow {
    display: inline-flex;
    padding: 5px 10px;
    border-radius: 999px;
    background: #efe8ff;
    color: #6d28d9;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .add-question-page__module-title {
    font-size: 1rem;
    font-weight: 700;
  }

  .add-question-page__module-description {
    color: #64748b;
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .add-question-page__workspace {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 22px;
  }

  .add-question-page__workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    flex-wrap: wrap;
  }

  .add-question-page__workspace-title {
    font-size: 1.35rem;
  }

  .add-question-page__summary {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .add-question-page__summary-chip {
    display: inline-flex;
    align-items: center;
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid #ddd6fe;
    border-radius: 999px;
    background: #f8f5ff;
    color: #5b21b6;
    font-weight: 600;
  }

  .add-question-builder {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    padding: 18px;
    border: 1px solid #e7ecf5;
    border-radius: 20px;
    background:
      linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(91, 33, 182, 0.01) 42%, rgba(255, 255, 255, 0.85) 100%),
      #ffffff;
  }

  .add-question-builder__card {
    padding: 16px;
    border: 1px solid #e8eef8;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.88);
  }

  .add-question-builder__card--highlight {
    background:
      linear-gradient(180deg, rgba(124, 58, 237, 0.12) 0%, rgba(255, 255, 255, 0.94) 70%),
      #ffffff;
  }

  .add-question-builder__title {
    font-size: 1rem;
  }

  .add-question-builder__copy {
    font-size: 0.92rem;
  }

  .add-question-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .add-question-card {
    padding: 20px;
    border: 1px solid #e7ecf5;
    border-radius: 20px;
    background: #ffffff;
  }

  .add-question-card__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  .add-question-card__title {
    font-size: 1.05rem;
  }

  .add-question-card__badge {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4338ca;
    font-size: 0.85rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .add-question-form__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .add-question-form__grid--compact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .add-question-form__field--span-2 {
    grid-column: span 2;
  }

  .add-question-form__field--span-4 {
    grid-column: 1 / -1;
  }

  .add-question-form__label {
    display: block;
    margin-bottom: 8px;
    color: #111827;
    font-size: 0.93rem;
    font-weight: 600;
  }

  .add-question-form .MuiOutlinedInput-root,
  .add-question-form .MuiInputBase-root {
    border-radius: 14px;
    background: #ffffff;
  }

  .add-question-form .MuiOutlinedInput-root {
    min-height: 48px;
  }

  .add-question-form__textarea .MuiOutlinedInput-root {
    min-height: 140px;
    align-items: flex-start;
  }

  .add-question-form__textarea--short .MuiOutlinedInput-root {
    min-height: 110px;
  }

  .add-question-form__hint {
    margin-top: 8px;
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .rich-text-editor {
    border: 1px solid #dbe2f1;
    border-radius: 14px;
    background: #ffffff;
  }

  .rich-text-editor__toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  .rich-text-editor__toolbar button {
    min-height: 32px;
    padding: 0 10px;
    border: 1px solid #dbe2f1;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    font-weight: 600;
    cursor: pointer;
  }

  .rich-text-editor__toolbar button.is-active {
    border-color: #c4b5fd;
    background: #f5f3ff;
    color: #6d28d9;
  }

  .rich-text-editor__container {
    padding: 12px;
  }

  .rich-text-editor__content {
    min-height: 100%;
    color: #0f172a;
    line-height: 1.6;
    outline: none;
  }

  .rich-text-editor__content p {
    margin: 0 0 10px;
  }

  .rich-text-editor__content ul,
  .rich-text-editor__content ol {
    margin: 0 0 10px 20px;
  }

  .rich-text-editor__content h3 {
    margin: 0 0 10px;
    font-size: 1rem;
  }

  .add-question-form__toggle-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .add-question-form__toggle {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid #dbe2f1;
    border-radius: 12px;
    background: #ffffff;
    color: #334155;
    font-weight: 600;
    text-transform: none;
  }

  .add-question-form__toggle--active {
    border-color: #c4b5fd;
    background: #f7f2ff;
    color: #6d28d9;
  }

  .add-question-options {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .add-question-option {
    padding: 16px;
    border: 1px solid #e8eef8;
    border-radius: 18px;
    background: #fbfcff;
  }

  .add-question-option__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .add-question-option__label {
    color: #111827;
    font-weight: 700;
  }

  .add-question-option__correct {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-weight: 600;
  }

  .add-question-option__remove {
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    color: #475569;
    font-weight: 600;
    text-transform: none;
  }

  .add-question-form__action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .add-question-form__subaction {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }

  .add-question-form__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border: 1px solid #e7ecf5;
    border-radius: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  }

  .add-question-form__footer-copy {
    color: #64748b;
    line-height: 1.55;
  }

  .add-question-form__footer-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .add-question-form__publish-errors {
    padding: 14px 16px;
    border: 1px solid #fecaca;
    border-radius: 14px;
    background: #fff7f7;
    color: #991b1b;
  }

  .add-question-form__publish-errors-title {
    margin: 0 0 8px;
    font-weight: 700;
  }

  .add-question-form__publish-errors-list {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 4px;
  }

  .add-question-form__image-preview {
    margin-top: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: #f8fafc;
  }

  .add-question-form__image-preview img {
    display: block;
    width: 100%;
    max-height: 260px;
    object-fit: contain;
    background: #f8fafc;
  }

  .add-question-form__secondary,
  .add-question-form__primary {
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    font-weight: 700;
    text-transform: none;
  }

  .add-question-form__secondary {
    border: 1px solid #d8def0;
    background: #ffffff;
    color: #111827;
  }

  .add-question-form__primary {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
  }

  @media (max-width: 1380px) {
    .add-question-page__hero {
      grid-template-columns: 1fr;
    }

    .add-question-builder,
    .add-question-form__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .add-question-page__workspace,
    .add-question-card,
    .add-question-page__rail-head {
      padding: 18px;
    }

    .add-question-builder,
    .add-question-form__grid,
    .add-question-form__grid--compact,
    .add-question-form__footer {
      grid-template-columns: 1fr;
    }

    .add-question-form__field--span-2,
    .add-question-form__field--span-4 {
      grid-column: auto;
    }

    .add-question-form__footer {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
  }
`
