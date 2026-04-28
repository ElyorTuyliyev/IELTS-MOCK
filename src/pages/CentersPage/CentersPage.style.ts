import styled from '@emotion/styled'

export const CentersPageRoot = styled.div`
  .centers-page {
    display: grid;
    gap: 24px;
  }

  .centers-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 28px 32px;
    border: 1px solid rgba(99, 102, 241, 0.14);
    border-radius: 28px;
    background:
      radial-gradient(circle at top right, rgba(16, 185, 129, 0.2), transparent 30%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 247, 255, 0.94));
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  }

  .centers-page__title {
    margin: 0;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #111827;
  }

  .centers-page__description {
    margin: 10px 0 0;
    max-width: 620px;
    font-size: 15px;
    line-height: 1.7;
    color: #5b6477;
  }

  .centers-page__cta {
    flex-shrink: 0;
    min-width: 180px;
    border-radius: 999px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #0f766e, #14b8a6);
    box-shadow: 0 18px 32px rgba(20, 184, 166, 0.24);
  }

  .centers-page__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .centers-stat {
    padding: 22px 24px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  }

  .centers-stat__label {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
  }

  .centers-stat__value {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    color: #111827;
  }

  .centers-stat__meta {
    margin-top: 8px;
    font-size: 14px;
    color: #475569;
  }

  .centers-page__content {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(280px, 1fr);
    gap: 20px;
  }

  .centers-panel,
  .centers-sidepanel {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 28px;
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.06);
  }

  .centers-panel {
    padding: 22px;
  }

  .centers-sidepanel {
    padding: 24px;
    display: grid;
    gap: 16px;
    align-content: start;
  }

  .centers-panel__header,
  .centers-sidepanel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  }

  .centers-panel__title,
  .centers-sidepanel__title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }

  .centers-panel__subtitle,
  .centers-sidepanel__subtitle {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
  }

  .centers-panel__list,
  .centers-sidepanel__list {
    display: grid;
    gap: 14px;
  }

  .center-card {
    display: grid;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff, #f8fbff);
    border: 1px solid rgba(203, 213, 225, 0.8);
  }

  .center-card__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .center-card__name {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }

  .center-card__location {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
  }

  .center-card__pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 92px;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: rgba(15, 118, 110, 0.1);
    color: #0f766e;
  }

  .center-card__metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .center-card__metric {
    padding: 12px 14px;
    border-radius: 18px;
    background: #f8fafc;
  }

  .center-card__metric-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
  }

  .center-card__metric-value {
    display: block;
    margin-top: 6px;
    font-size: 18px;
    font-weight: 800;
    color: #111827;
  }

  .centers-sidepanel__item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 0;
    border-top: 1px solid rgba(226, 232, 240, 0.9);
  }

  .centers-sidepanel__item:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  .centers-sidepanel__item-label {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  .centers-sidepanel__item-meta {
    margin: 6px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .centers-sidepanel__item-value {
    font-size: 14px;
    font-weight: 800;
    color: #0f766e;
    white-space: nowrap;
  }

  @media (max-width: 1120px) {
    .centers-page__stats,
    .center-card__metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .centers-page__content {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .centers-page__header,
    .center-card__row {
      flex-direction: column;
      align-items: flex-start;
    }

    .centers-page__cta {
      width: 100%;
    }

    .centers-page__stats,
    .center-card__metrics {
      grid-template-columns: 1fr;
    }
  }
`
