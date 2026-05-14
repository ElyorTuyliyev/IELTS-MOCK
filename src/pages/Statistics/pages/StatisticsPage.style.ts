import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const StatisticsPageRoot = styled.div`
  .stats-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
  }

  .stats-panel,
  .stats-card {
    border: 1px solid ${c.border.medium};
    border-radius: 18px;
    background: ${c.gradient.card};
    box-shadow: 0 10px 24px ${tokens.rgba.slate900_04};
  }

  .stats-page__hero-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .stats-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .stats-card__head {
    display: flex;
    justify-content: space-between;
    color: ${c.text.subtle};
    font-weight: 700;
  }

  .stats-card__title {
    margin: 0;
    font-size: 0.93rem;
  }

  .stats-card__label {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.82rem;
  }

  .stats-card__value {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1.9rem;
    line-height: 1;
  }

  .stats-card__sparkline {
    margin-top: auto;
    display: flex;
    align-items: flex-end;
    gap: ${theme.spacing(0.5)};
    min-height: 44px;
  }

  .stats-card__sparkline-dot {
    width: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, ${c.indigo.soft} 0%, ${c.primary.main} 100%);
  }

  .stats-page__chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing(1.5)};
  }

  .stats-page__bottom-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .stats-panel {
    padding: 16px;
  }

  .stats-panel__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.25)};
    margin-bottom: 12px;
  }

  .stats-panel__head h3 {
    margin: 0;
    font-size: 1rem;
    color: ${c.text.primary};
  }

  .stats-radar {
    position: relative;
    height: 240px;
    display: grid;
    place-items: center;
  }

  .stats-radar__ring {
    position: absolute;
    border: 1px dashed ${c.border.default};
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
    background: ${tokens.rgba.primary_20};
    border: 1px solid ${c.primary.main};
  }

  .stats-radar__shape--secondary {
    width: 100px;
    height: 110px;
    background: ${tokens.rgba.chartDifficult_12};
    border: 1px solid ${c.warning.bright};
  }

  .stats-bars {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: ${theme.spacing(1.25)};
    align-items: end;
    min-height: 240px;
  }

  .stats-bars__month {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    color: ${c.text.secondary};
    font-size: 0.75rem;
  }

  .stats-bars__stack {
    display: flex;
    flex-direction: column-reverse;
    gap: ${theme.spacing(0.5)};
    align-items: center;
  }

  .stats-bars__segment {
    width: 16px;
    border-radius: 999px;
  }

  .stats-bars__segment--purple {
    background: ${c.primary.light};
  }

  .stats-bars__segment--mint {
    background: ${c.chart.medium};
  }

  .stats-bars__segment--gold {
    background: ${c.chart.difficult};
  }

  .stats-certificate {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.25)};
  }

  .stats-certificate__col {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.75)};
    color: ${c.text.subtle};
    font-size: 0.84rem;
  }

  .stats-certificate__bar {
    margin-top: 8px;
    border-radius: 10px 10px 4px 4px;
    height: 84px;
  }

  .stats-certificate__bar--mint {
    background: linear-gradient(180deg, ${c.teal.gradientLight} 0%, ${c.teal.gradient} 100%);
  }

  .stats-certificate__bar--pink {
    background: linear-gradient(180deg, ${c.pink.soft} 0%, ${c.pink.bright} 100%);
  }

  .stats-certificate__bar--purple {
    background: linear-gradient(180deg, ${c.indigo.soft} 0%, ${c.primary.light} 100%);
  }

  .stats-prize {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  }

  .stats-prize__row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: ${theme.spacing(1.25)};
    align-items: center;
    padding: 8px 10px;
    border: 1px solid ${c.border.default};
    border-radius: 10px;
    color: ${c.text.subtle};
    font-size: 0.84rem;
  }

  .stats-prize__row strong {
    color: ${c.text.primary};
  }

  .stats-signup__label {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.86rem;
  }

  .stats-signup__value {
    margin: 6px 0 0;
    color: ${c.text.primary};
    font-size: 2rem;
  }

  .stats-signup__bars {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1.6fr 1fr 0.8fr;
    gap: ${theme.spacing(1)};
  }

  .stats-signup__bar {
    height: 26px;
    border-radius: 8px;
  }

  .stats-signup__bar--purple {
    background: ${c.gradient.chartBar};
  }

  .stats-signup__bar--pink {
    background: linear-gradient(90deg, ${c.pink.bright} 0%, ${c.pink.gradient} 100%);
  }

  .stats-signup__bar--mint {
    background: linear-gradient(90deg, ${c.teal.light} 0%, ${c.teal.gradientSoft} 100%);
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
