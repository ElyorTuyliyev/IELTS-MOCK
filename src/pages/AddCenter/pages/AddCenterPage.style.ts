import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const AddCenterPageRoot = styled.div`
  .add-center-page {
    display: grid;
    gap: ${theme.spacing(3)};
  }

  .add-center-page__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(2.5)};
    padding: 30px 32px;
    border: 1px solid ${tokens.rgba.border_24};
    border-radius: 30px;
    background:
      radial-gradient(circle at top right, ${tokens.rgba.teal_12}, transparent 30%),
      linear-gradient(135deg, ${tokens.rgba.white_92}, ${tokens.rgba.white_92});
    box-shadow: 0 24px 60px ${tokens.rgba.slate900_08};
  }

  .add-center-page__eyebrow {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${c.teal.main};
  }

  .add-center-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${c.text.primary};
  }

  .add-center-page__description {
    margin: 12px 0 0;
    max-width: 640px;
    font-size: 15px;
    line-height: 1.7;
    color: ${c.text.secondary};
  }

  .add-center-page__back {
    flex-shrink: 0;
    border-radius: 999px;
    padding: 12px 18px;
  }

  .add-center-form {
    display: grid;
    gap: ${theme.spacing(2.75)};
  }

  .add-center-form__section {
    padding: 24px;
    border-radius: 28px;
    background: ${tokens.rgba.white_92};
    border: 1px solid ${tokens.rgba.border_24};
    box-shadow: 0 18px 42px ${tokens.rgba.slate900_06};
  }

  .add-center-form__section-header {
    margin-bottom: 18px;
  }

  .add-center-form__section-title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .add-center-form__section-text {
    margin: 8px 0 0;
    font-size: 14px;
    color: ${c.text.secondary};
  }

  .add-center-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing(2)};
  }

  .add-center-form__field--full {
    grid-column: 1 / -1;
  }

  .add-center-form__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.75)};
  }

  .add-center-form__summary-card {
    padding: 18px;
    border-radius: 22px;
    background: linear-gradient(180deg, ${c.surface.muted}, ${c.surface.default});
    border: 1px solid ${tokens.rgba.border_24};
  }

  .add-center-form__summary-label {
    display: block;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${c.text.secondary};
  }

  .add-center-form__summary-value {
    display: block;
    margin-top: 8px;
    font-size: 22px;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .add-center-form__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
  }

  .add-center-form__actions-copy {
    font-size: 14px;
    color: ${c.text.secondary};
  }

  .add-center-form__buttons {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
  }

  .add-center-form__cancel,
  .add-center-form__submit {
    border-radius: 999px;
    padding: 12px 20px;
  }

  .add-center-form__submit {
    background: linear-gradient(135deg, ${c.teal.main}, ${c.teal.accent});
    box-shadow: 0 16px 30px ${tokens.rgba.teal_12};
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
