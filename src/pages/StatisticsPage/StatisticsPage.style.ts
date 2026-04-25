import styled from '@emotion/styled'

export const StatisticsPageRoot = styled.div`
  .stats-page {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .stats-panel,
  .stats-card {
    border: 1px solid #dbe2f1;
    border-radius: 18px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .stats-page__hero-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .stats-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stats-card__head {
    display: flex;
    justify-content: space-between;
    color: #334155;
    font-weight: 700;
  }

  .stats-card__title {
    margin: 0;
    font-size: 0.93rem;
  }

  .stats-card__label {
    margin: 0;
    color: #64748b;
    font-size: 0.82rem;
  }

  .stats-card__value {
    margin: 0;
    color: #0f172a;
    font-size: 1.9rem;
    line-height: 1;
  }

  .stats-card__sparkline {
    margin-top: auto;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    min-height: 44px;
  }

  .stats-card__sparkline-dot {
    width: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, #c4b5fd 0%, #7c3aed 100%);
  }

  .stats-page__chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stats-page__bottom-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .stats-panel {
    padding: 16px;
  }

  .stats-panel__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .stats-panel__head h3 {
    margin: 0;
    font-size: 1rem;
    color: #111827;
  }

  .stats-radar {
    position: relative;
    height: 240px;
    display: grid;
    place-items: center;
  }

  .stats-radar__ring {
    position: absolute;
    border: 1px dashed #e2e8f0;
    border-radius: 50%;
  }

  .stats-radar__ring--one {
    width: 190px;
    height: 190px;
  }

  .stats-radar__ring--two {
    width: 140px;
    height: 140px;
  }

  .stats-radar__ring--three {
    width: 90px;
    height: 90px;
  }

  .stats-radar__shape {
    position: absolute;
    clip-path: polygon(50% 0%, 95% 30%, 80% 90%, 20% 90%, 5% 30%);
  }

  .stats-radar__shape--primary {
    width: 130px;
    height: 140px;
    background: rgba(124, 58, 237, 0.2);
    border: 1px solid #7c3aed;
  }

  .stats-radar__shape--secondary {
    width: 100px;
    height: 110px;
    background: rgba(250, 204, 21, 0.18);
    border: 1px solid #f59e0b;
  }

  .stats-bars {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 10px;
    align-items: end;
    min-height: 240px;
  }

  .stats-bars__month {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 0.75rem;
  }

  .stats-bars__stack {
    display: flex;
    flex-direction: column-reverse;
    gap: 4px;
    align-items: center;
  }

  .stats-bars__segment {
    width: 16px;
    border-radius: 999px;
  }

  .stats-bars__segment--purple {
    background: #8b5cf6;
  }

  .stats-bars__segment--mint {
    background: #5cc0b8;
  }

  .stats-bars__segment--gold {
    background: #f3c85a;
  }

  .stats-certificate {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .stats-certificate__col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #334155;
    font-size: 0.84rem;
  }

  .stats-certificate__bar {
    margin-top: 8px;
    border-radius: 10px 10px 4px 4px;
    height: 84px;
  }

  .stats-certificate__bar--mint {
    background: linear-gradient(180deg, #7de6da 0%, #44c3b3 100%);
  }

  .stats-certificate__bar--pink {
    background: linear-gradient(180deg, #f9b2f0 0%, #e879f9 100%);
  }

  .stats-certificate__bar--purple {
    background: linear-gradient(180deg, #b794ff 0%, #8b5cf6 100%);
  }

  .stats-prize {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stats-prize__row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 10px;
    align-items: center;
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    color: #334155;
    font-size: 0.84rem;
  }

  .stats-prize__row strong {
    color: #111827;
  }

  .stats-signup__label {
    margin: 0;
    color: #64748b;
    font-size: 0.86rem;
  }

  .stats-signup__value {
    margin: 6px 0 0;
    color: #111827;
    font-size: 2rem;
  }

  .stats-signup__bars {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1.6fr 1fr 0.8fr;
    gap: 8px;
  }

  .stats-signup__bar {
    height: 26px;
    border-radius: 8px;
  }

  .stats-signup__bar--purple {
    background: linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%);
  }

  .stats-signup__bar--pink {
    background: linear-gradient(90deg, #e879f9 0%, #f0abfc 100%);
  }

  .stats-signup__bar--mint {
    background: linear-gradient(90deg, #5cc0b8 0%, #84d7ce 100%);
  }

  @media (max-width: 1280px) {
    .stats-page__hero-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .stats-page__chart-grid {
      grid-template-columns: 1fr;
    }

    .stats-page__bottom-grid {
      grid-template-columns: 1fr;
    }
  }
`
