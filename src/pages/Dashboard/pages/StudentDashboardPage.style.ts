import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const StudentDashboardPageRoot = styled.div`
  .student-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(2.5)};
    padding: 24px 26px;
    border: 1px solid ${c.border.medium};
    border-radius: 22px;
    background:
      radial-gradient(circle at 100% 0%, ${tokens.rgba.primary_14} 0%, transparent 42%),
      linear-gradient(135deg, ${c.surface.default} 0%, ${c.background.soft} 100%);
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .student-hero__copy {
    flex: 1;
    min-width: 220px;
  }

  .student-hero__eyebrow {
    margin: 0;
    color: ${c.primary.main};
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .student-hero__title {
    margin: 8px 0 0;
    color: ${c.text.primary};
    font-size: clamp(1.55rem, 2.6vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  .student-hero__subtitle {
    margin: 8px 0 0;
    color: ${c.text.secondary};
    font-size: 0.96rem;
    line-height: 1.5;
    max-width: 520px;
  }

  .student-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.25)};
    margin-top: ${theme.spacing(2)};
  }

  .student-hero__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing(1)};
    min-width: 148px;
  }

  .student-hero__ring {
    display: grid;
    place-items: center;
    width: 124px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(circle at center, ${c.surface.default} 0 58%, transparent 59%),
      var(--ring-gradient);
    box-shadow: inset 0 0 20px ${tokens.rgba.primary_10};
  }

  .student-hero__ring-value {
    color: ${c.text.primary};
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .student-hero__ring-label {
    margin: 0;
    color: ${c.text.muted};
    font-size: 0.84rem;
    font-weight: 600;
    text-align: center;
  }

  .student-dashboard__body {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: ${theme.spacing(2.25)};
    align-items: start;
  }

  .student-exam-list__table {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .student-exam-list__head,
  .student-exam-list__row {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) 110px 120px;
    gap: ${theme.spacing(1.5)};
    align-items: center;
  }

  .student-exam-list__head {
    padding: 0 4px 12px;
    border-bottom: 1px solid ${c.border.divider};
    color: ${c.text.muted};
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .student-exam-list__row {
    padding: 14px 4px;
    border-bottom: 1px solid ${c.border.divider};
  }

  .student-exam-list__row:last-child {
    border-bottom: none;
  }

  .student-exam-list__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 0.96rem;
    font-weight: 700;
  }

  .student-exam-list__meta {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.88rem;
  }

  .student-exam-list__status {
    justify-self: start;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .student-exam-list__status--active {
    background: ${c.success.bg};
    color: ${c.success.dark};
  }

  .student-exam-list__status--ended {
    background: ${c.background.subtle};
    color: ${c.text.muted};
  }

  .student-exam-list__status--draft {
    background: ${c.primary.tint};
    color: ${c.primary.darker};
  }

  .student-exam-list__action.MuiButton-root {
    justify-self: end;
    min-width: 96px;
    border-radius: 10px;
    text-transform: none;
    font-weight: 700;
    font-size: 0.84rem;
  }

  .student-exam-list__empty {
    padding: 36px 16px;
    border: 1px dashed ${c.border.strong};
    border-radius: 16px;
    text-align: center;
    color: ${c.text.secondary};
    line-height: 1.5;
  }

  .student-aside {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
  }

  .student-next-card {
    padding: 20px;
    border: 1px solid ${c.border.medium};
    border-radius: 22px;
    background: ${c.gradient.card};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .student-next-card__label {
    margin: 0;
    color: ${c.text.muted};
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .student-next-card__title {
    margin: 10px 0 0;
    color: ${c.text.primary};
    font-size: 1.12rem;
    font-weight: 800;
    line-height: 1.35;
  }

  .student-next-card__meta {
    margin: 8px 0 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
  }

  .student-next-card__action.MuiButton-root {
    margin-top: ${theme.spacing(2)};
    width: 100%;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
  }

  .student-next-card--empty {
    color: ${c.text.secondary};
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .student-quick-links {
    padding: 18px 20px;
    border: 1px solid ${c.border.medium};
    border-radius: 22px;
    background: ${c.surface.default};
    box-shadow: 0 8px 24px ${tokens.rgba.slate900_04};
  }

  .student-quick-links__title {
    margin: 0 0 14px;
    color: ${c.text.primary};
    font-size: 0.95rem;
    font-weight: 700;
  }

  .student-quick-links__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 8px;
    border: 1px solid ${c.border.soft};
    border-radius: 14px;
    background: ${c.background.card};
    color: ${c.text.primary};
    font-size: 0.92rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  .student-quick-links__item:last-child {
    margin-bottom: 0;
  }

  .student-quick-links__item:hover {
    border-color: ${c.primary.tintBorder};
    background: ${c.primary.tint};
  }

  .student-quick-links__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 999px;
    background: ${c.primary.main};
    color: ${c.text.inverse};
    font-size: 0.72rem;
    font-weight: 700;
  }

  @media (max-width: 1100px) {
    .student-dashboard__body {
      grid-template-columns: 1fr;
    }

    .student-exam-list__head {
      display: none;
    }

    .student-exam-list__row {
      grid-template-columns: 1fr;
      gap: ${theme.spacing(1)};
      padding: 16px 0;
    }

    .student-exam-list__action.MuiButton-root {
      justify-self: start;
    }
  }
`
