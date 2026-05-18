import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const NotificationsPageRoot = styled.div`
  .notifications-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
    width: 100%;
  }

  .notifications-page__hero {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 22px 24px;
    border: 1px solid ${c.border.accent};
    border-radius: 20px;
    background: linear-gradient(135deg, ${c.primary.tint} 0%, ${c.surface.default} 55%, ${c.surface.muted} 100%);
    box-shadow: 0 12px 30px ${tokens.rgba.primary_08};
  }

  .notifications-page__hero-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${c.gradient.primarySoft};
    color: ${c.surface.default};
    box-shadow: 0 10px 24px ${tokens.rgba.primary_28};
    flex-shrink: 0;

    svg {
      width: 28px;
      height: 28px;
      font-size: 28px;
    }
  }

  .notifications-page__hero-copy {
    min-width: 0;
  }

  .notifications-page__title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .notifications-page__subtitle {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin: 6px 0 0;
    color: ${c.text.secondary};
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .notifications-page__role {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: ${c.primary.tintStrong};
    color: ${c.primary.main};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .notifications-page__subtitle-text {
    display: block;
  }

  .notifications-page__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .notifications-page__stat {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
    padding: 16px 18px;
    border: 1px solid ${c.border.default};
    border-radius: 16px;
    background: ${c.surface.default};
    box-shadow: 0 8px 20px ${tokens.rgba.slate900_04};
  }

  .notifications-page__stat-value {
    color: ${c.text.primary};
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
  }

  .notifications-page__stat-label {
    color: ${c.text.secondary};
    font-size: 0.84rem;
    font-weight: 600;
  }

  .notifications-page__stat--unread .notifications-page__stat-value {
    color: ${c.primary.main};
  }

  .notifications-page__stat--read .notifications-page__stat-value {
    color: ${c.success.main};
  }

  .notifications-page__panel {
    border: 1px solid ${c.border.medium};
    border-radius: 20px;
    background: ${c.gradient.card};
    box-shadow: 0 14px 34px ${tokens.rgba.slate900_06};
    overflow: hidden;
  }

  .notifications-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    padding: 16px 18px;
    border-bottom: 1px solid ${c.neutral[300]};
    background: ${tokens.rgba.slate900_04};
    backdrop-filter: blur(8px);
  }

  .notifications-page__filters {
    display: flex;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .notifications-page__filter {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid ${c.border.medium};
    border-radius: 999px;
    background: ${c.surface.default};
    color: ${c.text.muted};
    font-weight: 600;
    text-transform: none;
    transition: all 0.18s ease;
  }

  .notifications-page__filter:hover {
    border-color: ${c.indigo.soft};
    background: ${c.primary.tint};
  }

  .notifications-page__filter--active {
    border-color: ${c.indigo.soft};
    background: linear-gradient(135deg, ${c.primary.tintStrong} 0%, ${c.primary.tintStrong} 100%);
    color: ${c.primary.dark};
    box-shadow: 0 6px 16px ${tokens.rgba.primary_12};
  }

  .notifications-page__filter-count {
    display: inline-grid;
    place-items: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 999px;
    background: ${tokens.rgba.slate900_06};
    color: inherit;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .notifications-page__filter--active .notifications-page__filter-count {
    background: ${tokens.rgba.primary_12};
  }

  .notifications-page__mark-all {
    min-height: 38px;
    border-radius: 12px;
    border-color: ${c.primary.tintBorder};
    color: ${c.primary.dark};
    background: ${c.surface.default};
    text-transform: none;
    font-weight: 700;
    white-space: nowrap;
  }

  .notifications-page__mark-all:hover {
    border-color: ${c.indigo.soft};
    background: ${c.primary.tint};
  }

  .notifications-page__list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    padding: 16px;
  }

  .notifications-page__item {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${theme.spacing(1.75)};
    align-items: center;
    width: 100%;
    padding: 16px 18px 16px 20px;
    border: 1px solid ${c.neutral[300]};
    border-radius: 16px;
    background: ${c.surface.default};
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease;
  }

  .notifications-page__item:hover {
    transform: translateY(-1px);
    border-color: ${c.primary.tintBorder};
    box-shadow: 0 12px 28px ${tokens.rgba.primary_10};
    background: ${c.surface.default};
  }

  .notifications-page__item--unread {
    border-color: ${c.border.accent};
    background: linear-gradient(90deg, ${c.primary.tint} 0%, ${c.surface.default} 28%);
    box-shadow: 0 8px 22px ${tokens.rgba.primary_08};
  }

  .notifications-page__item--unread:hover {
    background: linear-gradient(90deg, ${c.primary.tint} 0%, ${c.surface.default} 28%);
  }

  .notifications-page__accent {
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 0;
    width: 4px;
    border-radius: 0 999px 999px 0;
    background: var(--accent-color, ${c.primary.light});
  }

  .notifications-page__icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    flex-shrink: 0;
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
  }

  .notifications-page__icon-svg {
    width: 22px;
    height: 22px;
    font-size: 22px;
  }

  .notifications-page__content {
    min-width: 0;
  }

  .notifications-page__item-head {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  }

  .notifications-page__item-title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1rem;
    font-weight: 700;
  }

  .notifications-page__badge {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .notifications-page__message {
    margin: 8px 0 0;
    color: ${c.text.muted};
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .notifications-page__time {
    display: inline-block;
    margin-top: 10px;
    color: ${c.text.disabled};
    font-size: 0.8rem;
    font-weight: 600;
  }

  .notifications-page__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: ${theme.spacing(1.25)};
    flex-shrink: 0;
  }

  .notifications-page__pill {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    background: ${c.gradient.primary};
    color: ${c.surface.default};
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 6px 14px ${tokens.rgba.primary_20};
  }

  .notifications-page__chevron {
    width: 20px;
    height: 20px;
    color: ${c.border.strong};
    transition: transform 0.18s ease, color 0.18s ease;
  }

  .notifications-page__item:hover .notifications-page__chevron {
    transform: translateX(2px);
    color: ${c.primary.light};
  }

  .notifications-page__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 56px 24px;
    text-align: center;
    color: ${c.text.secondary};
  }

  .notifications-page__empty-icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    margin-bottom: 16px;
    border-radius: 20px;
    background: linear-gradient(135deg, ${c.surface.muted} 0%, ${c.background.subtle} 100%);
    color: ${c.text.disabled};
    border: 1px dashed ${c.border.medium};

    svg {
      width: 34px;
      height: 34px;
      font-size: 34px;
    }
  }

  .notifications-page__empty h2 {
    margin: 0 0 8px;
    color: ${c.text.primary};
    font-size: 1.15rem;
    font-weight: 700;
  }

  .notifications-page__empty p {
    margin: 0;
    max-width: 420px;
    font-size: 0.94rem;
    line-height: 1.55;
  }

  .notifications-page__loading {
    display: grid;
    place-items: center;
    padding: 56px 24px;
  }

  @media (max-width: 720px) {
    .notifications-page__hero {
      align-items: flex-start;
    }

    .notifications-page__stats {
      grid-template-columns: 1fr;
    }

    .notifications-page__toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .notifications-page__mark-all {
      width: 100%;
    }

    .notifications-page__item {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .notifications-page__meta {
      grid-column: 2;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  }
`
