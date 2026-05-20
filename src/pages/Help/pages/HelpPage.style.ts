import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const HelpPageRoot = styled.div`
  .help-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
    max-width: 960px;
    margin: 0 auto;
    padding: ${theme.spacing(3)};
    width: 100%;
  }

  .help-page__hero {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
    padding: 28px 28px 26px;
    border: 1px solid ${c.border.accent};
    border-radius: 22px;
    background: linear-gradient(
      135deg,
      ${c.primary.tint} 0%,
      ${c.surface.default} 48%,
      ${c.info.bg} 100%
    );
    box-shadow: ${tokens.shadows.accent};
  }

  .help-page__hero-top {
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(2)};
  }

  .help-page__hero-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 16px;
    background: ${c.gradient.primarySoft};
    color: ${c.surface.default};
    box-shadow: 0 10px 24px ${tokens.rgba.primary_28};
    flex-shrink: 0;

    svg {
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }

  .help-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.5rem, 2.4vw, 1.9rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .help-page__subtitle {
    margin: 8px 0 0;
    color: ${c.text.secondary};
    font-size: 0.95rem;
    line-height: 1.55;
    max-width: 54ch;
  }

  .help-page__search {
    width: 100%;
    max-width: 100%;

    .MuiOutlinedInput-root {
      border-radius: 14px;
      background: ${c.surface.default};
      box-shadow: 0 4px 18px ${tokens.rgba.slate900_06};

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${c.primary.tintBorder};
      }

      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${c.primary.main};
        border-width: 2px;
      }
    }
  }

  .help-page__categories {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${theme.spacing(1.75)};
  }

  .help-page__category-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 18px 16px;
    border: 1px solid ${c.border.default};
    border-radius: 18px;
    background: ${c.surface.default};
    text-align: left;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      border-color: ${c.primary.tintBorder};
      box-shadow: 0 14px 32px ${tokens.rgba.primary_10};
    }

    &--active {
      border-color: ${c.primary.tintBorderStrong};
      background: linear-gradient(180deg, ${c.primary.tint} 0%, ${c.surface.default} 100%);
      box-shadow: 0 12px 28px ${tokens.rgba.primary_12};
    }
  }

  .help-page__category-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: ${c.primary.tintStrong};
    color: ${c.primary.dark};

    svg {
      width: 22px;
      height: 22px;
      font-size: 22px;
    }
  }

  .help-page__category-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: ${c.text.primary};
    line-height: 1.25;
  }

  .help-page__category-desc {
    margin: 0;
    font-size: 0.8rem;
    color: ${c.text.secondary};
    line-height: 1.45;
  }

  .help-page__section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .help-page__section-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .help-page__section-meta {
    margin: 0;
    font-size: 0.85rem;
    color: ${c.text.secondary};
  }

  .help-page__faq-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .help-page__faq-item {
    border: 1px solid ${c.border.default};
    border-radius: 16px;
    background: ${c.surface.default};
    overflow: hidden;
    box-shadow: 0 4px 16px ${tokens.rgba.slate900_04};
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &--expanded {
      border-color: ${c.primary.tintBorder};
      box-shadow: 0 10px 28px ${tokens.rgba.primary_08};
    }
  }

  .help-page__faq-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    padding: 16px 18px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;

    &:hover {
      background: ${c.background.muted};
    }
  }

  .help-page__faq-question {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${c.text.primary};
    line-height: 1.4;
  }

  .help-page__faq-chevron {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: ${c.primary.tintStrong};
    color: ${c.primary.main};
    flex-shrink: 0;
    transition: transform 0.25s ease;

    svg {
      width: 20px;
      height: 20px;
    }

    &--open {
      transform: rotate(180deg);
    }
  }

  .help-page__faq-answer-wrap {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease;

    &--open {
      max-height: 400px;
    }
  }

  .help-page__faq-answer {
    margin: 0;
    padding: 0 18px 18px;
    color: ${c.text.muted};
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .help-page__faq-tag {
    display: inline-flex;
    margin-bottom: 8px;
    padding: 3px 8px;
    border-radius: 999px;
    background: ${c.primary.tintStrong};
    color: ${c.primary.dark};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .help-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 48px 24px;
    border: 1px dashed ${c.border.strong};
    border-radius: 18px;
    text-align: center;
    color: ${c.text.secondary};
    background: ${c.background.muted};
  }

  .help-page__empty-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .help-page__contact {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 22px 24px;
    border: 1px solid ${c.border.accent};
    border-radius: 20px;
    background: ${c.gradient.card};
    box-shadow: ${tokens.shadows.card};
  }

  @media (max-width: 640px) {
    .help-page__contact {
      grid-template-columns: 1fr;
    }
  }

  .help-page__contact-kicker {
    margin: 0 0 6px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${c.primary.dark};
  }

  .help-page__contact-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .help-page__contact-text {
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .help-page__contact-email {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    color: ${c.primary.main};
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      color: ${c.primary.dark};
      text-decoration: underline;
    }
  }

  .help-page__contact-action.MuiButton-root {
    min-height: 46px;
    padding-left: 22px;
    padding-right: 22px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    white-space: nowrap;
  }
`
