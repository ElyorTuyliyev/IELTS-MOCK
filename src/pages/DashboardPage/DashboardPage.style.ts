import styled from '@emotion/styled'

export const DashboardPageRoot = styled.div`
  .dashboard-screen {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .dashboard-screen__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .dashboard-screen__panel,
  .dashboard-stat {
    border: 1px solid #dbe2f1;
    border-radius: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .dashboard-stat {
    padding: 20px;
  }

  .dashboard-stat__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
  }

  .dashboard-stat__eyebrow {
    margin: 0;
    color: #475569;
    font-size: 0.92rem;
    font-weight: 600;
  }

  .dashboard-stat__value-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-top: 10px;
  }

  .dashboard-stat__value {
    margin: 0;
    color: #0f172a;
    font-size: clamp(2rem, 2.8vw, 2.45rem);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .dashboard-stat__suffix {
    padding-bottom: 6px;
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .dashboard-stat__delta {
    display: inline-flex;
    margin-top: 6px;
    color: var(--delta-color, #6d28d9);
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
    background: var(--soft-accent, rgba(124, 58, 237, 0.12));
    color: var(--accent, #7c3aed);
    font-size: 1.5rem;
  }

  .dashboard-stat__ring {
    display: grid;
    place-items: center;
    width: 136px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(circle at center, #ffffff 0 54%, transparent 55%),
      conic-gradient(
        #7c3aed 0deg 230deg,
        #f472d0 230deg 288deg,
        #e9ddff 288deg 360deg
      );
    box-shadow: inset 0 0 24px rgba(124, 58, 237, 0.14);
  }

  .dashboard-stat__ring-value {
    color: #111827;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .dashboard-stat__sparkbars {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    min-height: 80px;
    padding-top: 10px;
  }

  .dashboard-stat__sparkbar {
    width: 8px;
    height: var(--bar-height, 40px);
    border-radius: 999px;
    background: linear-gradient(180deg, #dbcafe 0%, #7c3aed 100%);
    opacity: var(--bar-opacity, 1);
  }

  .dashboard-stat__wave {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 80px;
    padding-top: 8px;
  }

  .dashboard-stat__wave-pill {
    width: 12px;
    height: var(--pill-height, 32px);
    border-radius: 999px;
    background: linear-gradient(180deg, #5fd0bf 0%, #38b2ac 100%);
    opacity: var(--pill-opacity, 1);
    box-shadow: 0 8px 18px rgba(56, 178, 172, 0.18);
  }

  .dashboard-stat__footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #eef2ff;
  }

  .dashboard-stat__footer-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: var(--soft-accent, rgba(124, 58, 237, 0.12));
    color: var(--accent, #7c3aed);
    font-size: 1.2rem;
  }

  .dashboard-stat__footer-text {
    margin: 0;
    color: #475569;
    font-size: 0.94rem;
    line-height: 1.45;
  }

  .dashboard-screen__analytics {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 18px;
  }

  .dashboard-screen__panel {
    padding: 22px;
  }

  .dashboard-screen__panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
  }

  .dashboard-screen__panel-title {
    margin: 0;
    color: #111827;
    font-size: 1rem;
    font-weight: 700;
  }

  .dashboard-screen__panel-subtitle {
    margin: 8px 0 0;
    color: #64748b;
  }

  .dashboard-screen__panel-action {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }

  .dashboard-screen__period-select {
    min-width: 132px;
  }

  .dashboard-screen__period-select .MuiOutlinedInput-notchedOutline {
    border-color: #d8def0;
  }

  .dashboard-screen__period-select .MuiInputBase-root {
    border-radius: 12px;
    background: #ffffff;
    font-weight: 600;
    color: #0f172a;
  }

  .dashboard-line-chart__legend,
  .dashboard-average__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    color: #475569;
    font-weight: 500;
  }

  .dashboard-line-chart__legend-item,
  .dashboard-average__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .dashboard-line-chart__legend-dot,
  .dashboard-average__legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--legend-color, #7c3aed);
    box-shadow: 0 0 0 5px var(--legend-soft, rgba(124, 58, 237, 0.12));
  }

  .dashboard-line-chart__canvas {
    position: relative;
    height: 280px;
    margin-top: 16px;
    padding: 18px 0 36px 52px;
  }

  .dashboard-line-chart__grid-line {
    position: absolute;
    left: 52px;
    right: 0;
    border-top: 1px solid #e9edf7;
  }

  .dashboard-line-chart__y-label {
    position: absolute;
    left: 0;
    transform: translateY(-50%);
    color: #475569;
    font-weight: 500;
  }

  .dashboard-line-chart__columns {
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    height: 100%;
    gap: 10px;
  }

  .dashboard-line-chart__month {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .dashboard-line-chart__bar {
    position: absolute;
    bottom: 28px;
    width: 14px;
    height: var(--bar-height, 80px);
    border-radius: 999px 999px 0 0;
    background: linear-gradient(180deg, rgba(192, 132, 252, 0.18) 0%, rgba(167, 139, 250, 0.42) 100%);
  }

  .dashboard-line-chart__point {
    position: absolute;
    left: 50%;
    bottom: calc(var(--point-height, 100px) + 22px);
    z-index: 2;
    width: 10px;
    height: 10px;
    border: 3px solid #7c3aed;
    border-radius: 50%;
    background: #ffffff;
    transform: translateX(-50%);
  }

  .dashboard-line-chart__line-segment {
    position: absolute;
    left: calc(50% + 5px);
    bottom: calc(var(--start-height, 0px) + 27px);
    width: calc(100% - 10px);
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%);
    transform: rotate(var(--angle, 0deg));
    transform-origin: left center;
  }

  .dashboard-line-chart__month-label {
    position: absolute;
    bottom: -8px;
    color: #475569;
    font-weight: 500;
  }

  .dashboard-average {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .dashboard-average__rows {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dashboard-average__row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 14px;
    align-items: center;
  }

  .dashboard-average__subject {
    color: #334155;
    font-size: 0.98rem;
    font-weight: 600;
  }

  .dashboard-average__track {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .dashboard-average__segment {
    height: 18px;
    border-radius: 999px;
    background: var(--segment-color, #7c3aed);
    width: var(--segment-width, 20%);
  }

  .dashboard-average__segment--empty {
    background: #eef2f7;
  }

  .dashboard-average__scale {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 14px;
    align-items: center;
    padding-top: 6px;
  }

  .dashboard-average__scale-title {
    color: #111827;
    font-size: 0.96rem;
    font-weight: 700;
  }

  .dashboard-average__ticks {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    color: #475569;
    font-weight: 500;
    text-align: center;
  }

  @media (max-width: 1380px) {
    .dashboard-screen__stats,
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
      gap: 14px;
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
