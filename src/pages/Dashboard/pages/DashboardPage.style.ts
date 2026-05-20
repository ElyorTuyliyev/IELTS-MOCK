import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const DashboardPageRoot = styled.div`
  .dashboard-screen {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3.5)};
  }

  .dashboard-screen__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${theme.spacing(2.25)};
  }

  .dashboard-screen__panel,
  .dashboard-stat {
    border: 1px solid ${c.border.medium};
    border-radius: 22px;
    background: ${c.gradient.card};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .dashboard-stat {
    padding: 20px;
  }

  .dashboard-stat__header {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    align-items: flex-start;
  }

  .dashboard-stat__eyebrow {
    margin: 0;
    color: ${c.text.muted};
    font-size: 0.92rem;
    font-weight: 600;
  }

  .dashboard-stat__value-row {
    display: flex;
    align-items: flex-end;
    gap: ${theme.spacing(1.25)};
    margin-top: 10px;
  }

  .dashboard-stat__value {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(2rem, 2.8vw, 2.45rem);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .dashboard-stat__suffix {
    padding-bottom: 6px;
    color: ${c.text.primary};
    font-size: 0.95rem;
    font-weight: 600;
  }

  .dashboard-stat__delta {
    display: inline-flex;
    margin-top: 6px;
    color: var(--delta-color, ${c.primary.dark});
    font-size: 0.98rem;
    font-weight: 700;
  }

  .dashboard-stat__visual {
    flex-shrink: 0;
  }

  .dashboard-stat__badge {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: var(--soft-accent, ${tokens.rgba.primary_12});
    color: var(--accent, ${c.primary.main});
    font-size: 1.5rem;
  }

  .dashboard-stat__ring {
    display: grid;
    place-items: center;
    width: 136px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(circle at center, ${c.surface.default} 0 54%, transparent 55%),
      conic-gradient(
        ${c.primary.main} 0deg 230deg,
        ${c.chart.pink} 230deg 288deg,
        ${c.primary.tintStrong} 288deg 360deg
      );
    box-shadow: inset 0 0 24px ${tokens.rgba.primary_14};
  }

  .dashboard-stat__ring-value {
    color: ${c.text.primary};
    font-size: 1.1rem;
    font-weight: 700;
  }

  .dashboard-stat__sparkbars {
    display: flex;
    align-items: flex-end;
    gap: ${theme.spacing(1.25)};
    min-height: 80px;
    padding-top: 10px;
  }

  .dashboard-stat__sparkbar {
    width: 8px;
    height: var(--bar-height, 40px);
    border-radius: 999px;
    background: ${c.gradient.chartPurple};
    opacity: var(--bar-opacity, 1);
  }

  .dashboard-stat__module-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.25)};
    margin-top: 10px;
  }

  .dashboard-stat__module-item {
    min-width: 0;
  }

  .dashboard-stat__module-count {
    margin: 0;
    color: ${c.text.primary};
    font-size: clamp(1.35rem, 2vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .dashboard-stat__module-label {
    margin: 4px 0 0;
    color: ${c.text.secondary};
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .dashboard-stat__module-bars {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${theme.spacing(1.75)};
    min-height: 88px;
    padding-top: 10px;
  }

  .dashboard-stat__module-bar-wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing(1)};
    min-width: 0;
  }

  .dashboard-stat__module-bar {
    width: 100%;
    max-width: 42px;
    height: var(--bar-height, 40px);
    border-radius: 999px;
    background: ${c.gradient.chartTeal};
    opacity: var(--bar-opacity, 1);
    box-shadow: 0 8px 18px ${tokens.rgba.teal_12};
  }

  .dashboard-stat__module-bar-label {
    color: ${c.text.secondary};
    font-size: 0.72rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }

  .dashboard-stat__wave {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    min-height: 80px;
    padding-top: 8px;
  }

  .dashboard-stat__wave-pill {
    width: 12px;
    height: var(--pill-height, 32px);
    border-radius: 999px;
    background: ${c.gradient.chartTeal};
    opacity: var(--pill-opacity, 1);
    box-shadow: 0 8px 18px ${tokens.rgba.teal_12};
  }

  .dashboard-stat__footer {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid ${c.background.default};
  }

  .dashboard-stat__footer-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: var(--soft-accent, ${tokens.rgba.primary_12});
    color: var(--accent, ${c.primary.main});
    font-size: 1.2rem;
  }

  .dashboard-stat__footer-text {
    margin: 0;
    color: ${c.text.muted};
    font-size: 0.94rem;
    line-height: 1.45;
  }

  .dashboard-screen__analytics {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: ${theme.spacing(2.25)};
  }

  .dashboard-screen__panel {
    padding: 22px;
  }

  .dashboard-screen__panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${theme.spacing(2)};
    margin-bottom: 18px;
  }

  .dashboard-screen__panel-title {
    margin: 0;
    color: ${c.text.primary};
    font-size: 1rem;
    font-weight: 700;
  }

  .dashboard-screen__panel-subtitle {
    margin: 8px 0 0;
    color: ${c.text.secondary};
  }

  .dashboard-screen__panel-action {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    font-weight: 600;
    text-transform: none;
  }

  .dashboard-screen__period-select {
    min-width: 132px;
  }

  .dashboard-screen__period-select .MuiOutlinedInput-notchedOutline {
    border-color: ${c.border.soft};
  }

  .dashboard-screen__period-select .MuiInputBase-root {
    border-radius: 12px;
    background: ${c.surface.default};
    font-weight: 600;
    color: ${c.text.primary};
  }

  .dashboard-line-chart__legend,
  .dashboard-average__legend {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(2.5)};
    color: ${c.text.muted};
    font-weight: 500;
  }

  .dashboard-line-chart__legend-item,
  .dashboard-average__legend-item {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
  }

  .dashboard-line-chart__legend-dot,
  .dashboard-average__legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--legend-color, ${c.primary.main});
    box-shadow: 0 0 0 5px var(--legend-soft, ${tokens.rgba.primary_12});
  }

  .dashboard-line-chart__canvas {
    position: relative;
    height: 280px;
    margin-top: 16px;
    padding: 18px 0 84px 52px;
  }

  .dashboard-line-chart__grid-line {
    position: absolute;
    left: 52px;
    right: 0;
    border-top: 1px solid ${c.neutral[300]};
  }

  .dashboard-line-chart__y-label {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    color: ${c.text.muted};
    font-weight: 500;
  }

  .dashboard-line-chart__columns {
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    height: 100%;
    gap: ${theme.spacing(1.25)};
  }

  .dashboard-line-chart__month {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .dashboard-line-chart__bar {
    position: absolute;
    bottom: var(--bar-bottom, 2px);
    width: 14px;
    height: var(--bar-height, 0px);
    border-radius: 999px 999px 0 0;
    background: linear-gradient(180deg, ${tokens.rgba.primaryLight_12} 0%, ${tokens.rgba.primary_28} 100%);
  }

  .dashboard-line-chart__point {
    position: absolute;
    left: 50%;
    bottom: var(--point-bottom, -3px);
    z-index: 2;
    width: 10px;
    height: 10px;
    border: 3px solid ${c.primary.main};
    border-radius: 50%;
    background: ${c.surface.default};
    transform: translateX(-50%);
  }

  .dashboard-line-chart__line-segment {
    position: absolute;
    left: calc(50% + 5px);
    bottom: var(--line-bottom, 0.5px);
    width: calc(100% - 10px);
    height: 3px;
    border-radius: 999px;
    background: ${c.gradient.chartBar};
    transform: rotate(var(--angle, 0deg));
    transform-origin: left center;
  }

  .dashboard-line-chart__month-labels {
    position: absolute;
    bottom: -90px;
    left: 50%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .dashboard-line-chart__year-label {
    margin-top: 2px;
    color: ${c.text.secondary};
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.1;
  }

  .dashboard-line-chart__month-label {
    color: ${c.text.muted};
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.1;
  }

  .dashboard-line-chart__month-table {
    margin-top: ${theme.spacing(2.5)};
    padding-top: ${theme.spacing(2)};
    border-top: 1px solid ${c.border.soft};
  }

  .dashboard-line-chart__month-table-title {
    margin: 0 0 ${theme.spacing(1.5)};
    color: ${c.text.primary};
    font-size: 0.95rem;
    font-weight: 700;
  }

  .dashboard-line-chart__month-table-head,
  .dashboard-line-chart__month-table-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: ${theme.spacing(2)};
    align-items: center;
    padding: 8px 0;
    color: ${c.text.secondary};
    font-size: 0.88rem;
  }

  .dashboard-line-chart__month-table-head {
    padding-top: 0;
    color: ${c.text.muted};
    font-weight: 600;
    border-bottom: 1px solid ${c.border.soft};
  }

  .dashboard-line-chart__month-table-row strong {
    color: ${c.text.primary};
    font-size: 0.92rem;
    font-weight: 700;
  }

  .dashboard-average {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.25)};
  }

  .dashboard-average__rows {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
  }

  .dashboard-average__row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: ${theme.spacing(1.75)};
    align-items: center;
  }

  .dashboard-average__subject {
    color: ${c.text.subtle};
    font-size: 0.98rem;
    font-weight: 600;
  }

  .dashboard-average__track {
    display: flex;
    gap: ${theme.spacing(0.75)};
    align-items: center;
  }

  .dashboard-average__segment {
    height: 18px;
    border-radius: 999px;
    background: var(--segment-color, ${c.primary.main});
    width: var(--segment-width, 20%);
  }

  .dashboard-average__segment--empty {
    background: ${c.background.chartEmpty};
  }

  .dashboard-average__scale {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: ${theme.spacing(1.75)};
    align-items: center;
    padding-top: 6px;
  }

  .dashboard-average__scale-title {
    color: ${c.text.primary};
    font-size: 0.96rem;
    font-weight: 700;
  }

  .dashboard-average__ticks {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    color: ${c.text.muted};
    font-weight: 500;
    text-align: center;
  }

  @media (max-width: 1380px) {
    .dashboard-screen__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dashboard-screen__analytics {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 860px) {
    .dashboard-stat__header,
    .dashboard-screen__panel-head,
    .dashboard-average__row,
    .dashboard-average__scale {
      grid-template-columns: 1fr;
      flex-direction: column;
      align-items: flex-start;
    }

    .dashboard-screen__stats {
      grid-template-columns: 1fr;
      gap: ${theme.spacing(1.75)};
    }

    .dashboard-line-chart__canvas {
      height: 250px;
      padding-left: 40px;
    }

    .dashboard-line-chart__grid-line {
      left: 40px;
    }
  }
`
