import styled from '@emotion/styled'

export const AddCenterPageRoot = styled.div`
  .add-center-page {
    display: grid;
    gap: 24px;
  }

  .add-center-page__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 30px 32px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 30px;
    background:
      radial-gradient(circle at top right, rgba(20, 184, 166, 0.18), transparent 30%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.96));
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  }

  .add-center-page__eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #0f766e;
  }

  .add-center-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .add-center-page__description {
    margin: 12px 0 0;
    max-width: 640px;
    font-size: 15px;
    line-height: 1.7;
    color: #5b6477;
  }

  .add-center-page__back {
    flex-shrink: 0;
    border-radius: 999px;
    padding: 12px 18px;
  }

  .add-center-form {
    display: grid;
    gap: 22px;
  }

  .add-center-form__section {
    padding: 24px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
  }

  .add-center-form__section-header {
    margin-bottom: 18px;
  }

  .add-center-form__section-title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }

  .add-center-form__section-text {
    margin: 8px 0 0;
    font-size: 14px;
    color: #64748b;
  }

  .add-center-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .add-center-form__field--full {
    grid-column: 1 / -1;
  }

  .add-center-form__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .add-center-form__summary-card {
    padding: 18px;
    border-radius: 22px;
    background: linear-gradient(180deg, #f8fafc, #ffffff);
    border: 1px solid rgba(203, 213, 225, 0.9);
  }

  .add-center-form__summary-label {
    display: block;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
  }

  .add-center-form__summary-value {
    display: block;
    margin-top: 8px;
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
  }

  .add-center-form__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .add-center-form__actions-copy {
    font-size: 14px;
    color: #64748b;
  }

  .add-center-form__buttons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .add-center-form__cancel,
  .add-center-form__submit {
    border-radius: 999px;
    padding: 12px 20px;
  }

  .add-center-form__submit {
    background: linear-gradient(135deg, #0f766e, #14b8a6);
    box-shadow: 0 16px 30px rgba(20, 184, 166, 0.22);
  }

  @media (max-width: 960px) {
    .add-center-page__hero,
    .add-center-form__actions {
      flex-direction: column;
      align-items: flex-start;
    }

    .add-center-form__grid,
    .add-center-form__summary {
      grid-template-columns: 1fr;
    }

    .add-center-form__buttons {
      width: 100%;
    }

    .add-center-form__cancel,
    .add-center-form__submit,
    .add-center-page__back {
      width: 100%;
    }
  }
`
