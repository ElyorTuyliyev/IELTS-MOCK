import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export const CenterViewPageRoot = styled.div`
  display: grid;
  gap: ${theme.spacing(2.25)};
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(3)};

  @media (min-width: 900px) {
    padding: ${theme.spacing(3)};
  }

  /* ── Top bar ── */
  .center-view__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  }

  .center-view__back-btn.MuiButton-root {
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    min-height: 40px;
    padding: 0 16px;
    border-color: ${c.border.strong};
    color: ${c.text.muted};
    background: ${c.surface.default};
  }

  .center-view__back-btn.MuiButton-root:hover {
    background: ${c.background.subtle};
    border-color: ${c.text.disabled};
    color: ${c.text.primary};
  }

  .center-view__breadcrumb {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    color: ${c.text.muted};
  }

  .center-view__breadcrumb span:last-child {
    color: ${c.primary.main};
  }

  /* ── Hero profile ── */
  .center-view__hero {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid ${c.border.accent};
    background:
      radial-gradient(ellipse 80% 60% at 0% 0%, ${tokens.rgba.primary_14} 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 100% 100%, ${tokens.rgba.primary_08} 0%, transparent 50%),
      linear-gradient(145deg, ${c.primary.tint} 0%, ${c.surface.default} 42%, ${c.surface.muted} 100%);
    box-shadow: 0 16px 40px ${tokens.rgba.primary_12};
    padding: 28px 28px 24px;
  }

  .center-view__hero::after {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: ${tokens.rgba.primary_08};
    pointer-events: none;
  }

  .center-view__hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(2.5)};
    flex-wrap: wrap;
  }

  .center-view__avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .center-view__avatar {
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border-radius: 22px;
    background: ${c.gradient.primarySoft};
    color: ${c.surface.default};
    font-size: 1.75rem;
    font-weight: 800;
    overflow: hidden;
    border: 3px solid ${c.surface.default};
    box-shadow:
      0 12px 28px ${tokens.rgba.primary_28},
      0 0 0 1px ${tokens.rgba.primary_12};
  }

  .center-view__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .center-view__avatar-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 28px;
    height: 28px;
    border-radius: 10px;
    background: ${c.success.main};
    border: 3px solid ${c.surface.default};
    display: grid;
    place-items: center;
    color: ${c.surface.default};
    box-shadow: 0 4px 10px ${tokens.rgba.slate900_12};

    svg {
      width: 14px;
      height: 14px;
      font-size: 14px;
    }
  }

  .center-view__hero-content {
    flex: 1;
    min-width: 0;
    padding-top: 4px;
  }

  .center-view__hero-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    padding: 4px 10px;
    border-radius: 999px;
    background: ${tokens.rgba.primary_12};
    color: ${c.primary.main};
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .center-view__hero-title {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: ${c.text.primary};
  }

  .center-view__hero-manager {
    margin: 8px 0 0;
    font-size: 0.95rem;
    color: ${c.text.secondary};
    font-weight: 500;
  }

  .center-view__hero-manager strong {
    color: ${c.text.primary};
    font-weight: 700;
  }

  .center-view__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .center-view__chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    border: 1px solid transparent;
  }

  .center-view__chip svg {
    width: 16px;
    height: 16px;
    font-size: 16px;
  }

  .center-view__chip--credits {
    background: ${c.primary.tintStrong};
    color: ${c.primary.main};
    border-color: ${tokens.rgba.primary_12};
  }

  .center-view__chip--active {
    background: ${c.success.bgSoft};
    color: ${c.success.dark};
    border-color: ${c.success.bg};
  }

  .center-view__chip--inactive {
    background: ${c.warning.bg};
    color: ${c.warning.main};
    border-color: ${c.warning.border};
  }

  .center-view__chip--date {
    background: ${c.surface.default};
    color: ${c.text.secondary};
    border-color: ${c.border.default};
  }

  /* ── Quick stats ── */
  .center-view__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(1.5)};
  }

  .center-view__stat {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 18px 18px 56px;
    border: 1px solid ${c.border.default};
    border-radius: 18px;
    background: ${c.surface.default};
    box-shadow: 0 8px 22px ${tokens.rgba.slate900_04};
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .center-view__stat:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px ${tokens.rgba.slate900_08};
  }

  .center-view__stat::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: var(--center-stat-accent, ${c.primary.main});
  }

  .center-view__stat-icon {
    position: absolute;
    top: 16px;
    left: 14px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: var(--center-stat-icon-bg, ${c.primary.tint});
    color: var(--center-stat-accent, ${c.primary.main});

    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }

  .center-view__stat--credits {
    --center-stat-accent: ${c.primary.main};
    --center-stat-icon-bg: ${c.primary.tintStrong};
  }

  .center-view__stat--established {
    --center-stat-accent: ${c.info.main};
    --center-stat-icon-bg: ${c.info.bgSoft};
  }

  .center-view__stat--member {
    --center-stat-accent: ${c.success.main};
    --center-stat-icon-bg: ${c.success.bgSoft};
  }

  .center-view__stat-label {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .center-view__stat-value {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${c.text.primary};
    font-variant-numeric: tabular-nums;
  }

  .center-view__stat-meta {
    margin: 0;
    font-size: 0.78rem;
    color: ${c.text.muted};
  }

  /* ── Content grid ── */
  .center-view__grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: ${theme.spacing(2)};
    align-items: start;
  }

  .center-view__card {
    border-radius: 20px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    padding: 24px 26px;
    box-shadow: 0 10px 28px ${tokens.rgba.slate900_04};
    display: grid;
    gap: ${theme.spacing(2)};
  }

  .center-view__card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
  }

  .center-view__card-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.01em;
  }

  .center-view__card-sub {
    margin: 4px 0 0;
    font-size: 0.88rem;
    color: ${c.text.secondary};
    line-height: 1.45;
  }

  .center-view__card-icon {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${c.primary.tint};
    color: ${c.primary.main};
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }

  .center-view__card-icon--timeline {
    background: ${c.info.bgSoft};
    color: ${c.info.main};
  }

  /* ── Detail rows ── */
  .center-view__rows {
    display: grid;
    gap: 10px;
  }

  .center-view__row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid ${c.border.divider};
    background: linear-gradient(180deg, ${c.background.soft} 0%, ${c.surface.default} 100%);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .center-view__row:hover {
    border-color: ${c.indigo.bg};
    box-shadow: 0 4px 14px ${tokens.rgba.primary_08};
  }

  .center-view__row-icon {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: ${c.surface.muted};
    color: ${c.primary.main};
    flex-shrink: 0;

    svg {
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
  }

  .center-view__row-icon--email {
    color: ${c.info.main};
    background: ${c.info.bgSoft};
  }

  .center-view__row-icon--phone {
    color: ${c.success.dark};
    background: ${c.success.bgSoft};
  }

  .center-view__row-icon--address {
    color: ${c.warning.main};
    background: ${c.warning.bg};
  }

  .center-view__row-icon--manager {
    color: ${c.primary.main};
    background: ${c.primary.tint};
  }

  .center-view__row-body {
    min-width: 0;
    flex: 1;
  }

  .center-view__row-label {
    display: block;
    margin-bottom: 3px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${c.text.muted};
  }

  .center-view__row-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${c.text.primary};
    line-height: 1.45;
    word-break: break-word;
  }

  .center-view__row-value a {
    color: ${c.primary.main};
    text-decoration: none;
    font-weight: 700;
  }

  .center-view__row-value a:hover {
    text-decoration: underline;
  }

  /* ── Timeline ── */
  .center-view__timeline {
    display: grid;
    gap: 0;
    position: relative;
    padding-left: 8px;
  }

  .center-view__timeline::before {
    content: '';
    position: absolute;
    left: 22px;
    top: 20px;
    bottom: 20px;
    width: 2px;
    background: linear-gradient(180deg, ${c.primary.main} 0%, ${c.border.divider} 100%);
    border-radius: 2px;
  }

  .center-view__timeline-item {
    display: flex;
    gap: 16px;
    padding: 12px 0;
    position: relative;
  }

  .center-view__timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${c.primary.main};
    border: 3px solid ${c.surface.default};
    box-shadow: 0 0 0 2px ${c.primary.tint};
    flex-shrink: 0;
    margin-top: 4px;
    margin-left: 11px;
    z-index: 1;
  }

  .center-view__timeline-item:last-child .center-view__timeline-dot {
    background: ${c.text.muted};
    box-shadow: 0 0 0 2px ${c.border.divider};
  }

  .center-view__timeline-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${c.text.muted};
    margin-bottom: 2px;
  }

  .center-view__timeline-value {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${c.text.primary};
  }

  /* ── Logo showcase ── */
  .center-view__logo-card {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 20px 24px;
    border-radius: 18px;
    border: 1px dashed ${c.border.soft};
    background: ${c.background.muted};
  }

  .center-view__logo-preview {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    object-fit: cover;
    border: 1px solid ${c.border.medium};
    box-shadow: 0 8px 20px ${tokens.rgba.slate900_08};
    flex-shrink: 0;
  }

  .center-view__logo-text h3 {
    margin: 0 0 4px;
    font-size: 0.95rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .center-view__logo-text p {
    margin: 0;
    font-size: 0.85rem;
    color: ${c.text.secondary};
  }

  /* ── Loading / error ── */
  .center-view__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(2)};
    min-height: 360px;
    border-radius: 24px;
    border: 1px solid ${c.border.default};
    background: ${c.surface.default};
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .center-view__loading-text {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${c.text.secondary};
  }

  .center-view__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(1.5)};
    min-height: 360px;
    padding: 40px 24px;
    text-align: center;
    border-radius: 24px;
    border: 1px solid ${c.border.default};
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.surface.default} 100%);
    box-shadow: 0 12px 30px ${tokens.rgba.slate900_04};
  }

  .center-view__error-icon {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: ${c.warning.bg};
    color: ${c.warning.main};

    svg {
      width: 36px;
      height: 36px;
      font-size: 36px;
    }
  }

  .center-view__error h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .center-view__error p {
    margin: 0;
    max-width: 36ch;
    font-size: 0.92rem;
    line-height: 1.55;
    color: ${c.text.secondary};
  }

  @media (max-width: 900px) {
    .center-view__grid {
      grid-template-columns: 1fr;
    }

    .center-view__stats {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .center-view__hero {
      padding: 22px 20px 20px;
    }

    .center-view__avatar {
      width: 80px;
      height: 80px;
      border-radius: 18px;
      font-size: 1.5rem;
    }

    .center-view__card {
      padding: 20px 18px;
    }
  }
`
