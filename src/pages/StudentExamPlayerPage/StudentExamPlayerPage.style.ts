import styled from '@emotion/styled'

export const StudentExamPlayerPageRoot = styled.div`
  --topbar-h: 36px;
  --strip-h: 36px;
  --text-xs: 18px;
  --text-sm: 18px;
  --text-md: 18px;

  min-height: 100vh;
  background: #f3f4f6;
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;

  .player__topbar {
    background: #ffffff;
    border-bottom: 1px solid #d8dce3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:12px 20px;
  }

  .player__brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--text-xs);
  }

  .player__identity {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .player__identity-title {
    margin: 0;
    font-size: var(--text-md);
    font-weight: 700;
    line-height: 1;
  }

  .player__identity-audio {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .player__audio-icon {
    font-size: var(--text-md);
    line-height: 1;
  }

  .player__identity-audio-text {
    font-size: var(--text-md);
    line-height: 1;
  }

  .player__logo {
    color: #d91c2f;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 0.25px;
    line-height: 1;
    width: 92px;
    height: 27px;
    display: inline-flex;
    align-items: center;
  }

  .player__top-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #475569;
    font-size: 18px;
  }

  .player__top-actions span {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    cursor: pointer;
  }

  .player__icon-svg {
    width: 22px;
    height: 22px;
    color: #3f3f46;
  }

  .player__workspace {
    padding: 0;
  }

  .player__sheet {
    min-height: calc(100vh - var(--topbar-h));
    border: 1px solid #dfe3ea;
    background: #f0f1f3;
    display: flex;
    flex-direction: column;
  }

  .player__audio-strip {
    height: var(--strip-h);
    border-bottom: 1px solid #d9dde5;
    background: #f7f8fa;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8px;
    font-size: var(--text-xs);
    color: #334155;
  }

  .player__strip-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.05;
  }

  .player__strip-subtitle {
    margin: 0;
    font-size: var(--text-sm);
    line-height: 1.05;
  }

  .player__content {
    flex: 1;
    overflow: auto;
    padding: 10px 10px 6px;
    position: relative;
  }

  .player__audio-gate {
    position: fixed;
    inset: 0;
    background: rgba(28, 31, 38, 0.72);
    z-index: 1400;
    display: grid;
    place-items: center;
  }

  .player__audio-gate-content {
    width: min(620px, 92%);
    padding: 14px 18px;
    border-radius: 10px;
    background: rgba(17, 24, 39, 0.35);
    border: 1px solid rgba(226, 232, 240, 0.25);
    text-align: center;
    color: #fff;
    display: grid;
    gap: 10px;
    justify-items: center;
  }

  .player__audio-gate-icon {
    font-size: 54px;
    line-height: 1;
  }

  .player__audio-gate-text {
    margin: 0;
    font-size: 14px;
    color: #f8fafc;
  }

  .player__audio-gate-button {
    min-width: 88px;
    height: 32px;
    border-radius: 4px;
    text-transform: none;
    border: 1px solid #cbd5e1;
    background: #0f172a;
    color: #fff;
    font-size: 12px;
  }

  .player__split-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 6px minmax(0, 1fr);
    min-height: calc(100vh - (var(--topbar-h) + var(--strip-h) + 40px));
    gap: 0;
  }

  .player__listening-layout {
    width: min(760px, 100%);
    padding: 4px 2px;
  }

  .player__audio-hidden {
    display: none;
  }

  .player__left-pane,
  .player__right-pane {
    background: #f3f4f6;
    padding: 8px 10px 10px;
    overflow: auto;
  }

  .player__divider {
    background: #9da3ad;
    width: 6px;
  }

  .player__title {
    margin: 0 0 8px;
    font-size: var(--text-md);
    font-weight: 700;
  }

  .player__line {
    margin: 0 0 10px;
    font-size: var(--text-sm);
    line-height: 1.35;
  }

  .player__question-list {
    display: grid;
    gap: 12px;
  }

  .player__question-list--stacked {
    margin-top: 14px;
  }

  .player__question-item {
    display: grid;
    gap: 6px;
  }

  .player__question-prompt {
    margin: 0;
    font-size: var(--text-sm);
    line-height: 1.35;
  }

  .player__question-prompt-html {
    margin: 0;
    font-size: var(--text-sm);
    line-height: 1.35;
  }

  .player__choices {
    display: grid;
    gap: 4px;
  }

  .player__choice-btn {
    border: none;
    background: transparent;
    text-align: left;
    padding: 0;
    cursor: pointer;
    font-size: var(--text-sm);
    color: #111827;
  }

  .player__choice-btn--selected {
    font-weight: 700;
  }

  .player__text-input {
    width: min(280px, 100%);
    height: 28px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 0 8px;
    font-size: var(--text-sm);
    background: #fff;
  }

  .blank {
    display: inline-flex;
    min-width: 38px;
    height: 20px;
    border: 1px solid #8ba1b5;
    border-radius: 2px;
    padding: 0 4px;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    background: #edf7ff;
    margin: 0 3px;
  }

  .player__footer {
    min-height: 32px;
    border-top: 1px solid #d9dde5;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    gap: 12px;
  }

  .player__part-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #475569;
  }

  .player__footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .player__part-switch {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .player__part-label {
    font-size: var(--text-xs);
    color: #111827;
    min-width: 44px;
  }

  .player__footer-centers {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    margin-right: 12px;
  }

  .player__questions {
    display: flex;
    gap: 2px;
  }

  .player__q-btn {
    min-width: 16px;
    height: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 2px;
    background: #f8fafc;
    font-size: var(--text-xs);
    line-height: 1;
    color: #334155;
  }

  .player__q-btn--active {
    background: #e2f3e7;
    border-color: #4caf50;
    color: #166534;
  }

  .player__q-btn--answered {
    border-color: #1d4ed8;
  }

  .player__part-btn {
    height: 20px;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    background: #f8fafc;
    font-size: var(--text-xs);
    color: #334155;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0 6px;
  }

  .player__part-btn span {
    color: #6b7280;
  }

  .player__part-btn--active {
    border-color: #7c3aed;
    color: #5b21b6;
    background: #f5f3ff;
  }

  .player__nav {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .player__progress {
    font-size: var(--text-sm);
    color: #475569;
    margin-right: 6px;
  }

  .player__arrow {
    min-width: 26px;
    height: 26px;
    border-radius: 2px;
    border: 1px solid #d1d5db;
    background: #f8fafc;
    color: #111827;
  }

  .player__arrow--next {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
  }

  .player__submit {
    height: 20px;
    border-radius: 4px;
    text-transform: none;
    border: 1px solid #059669;
    color: #ffffff;
    background: #111827;
    border-color: #111827;
    font-size: var(--text-xs);
    min-width: 26px;
    padding: 0 6px;
  }

  .player__side-nav {
    position: absolute;
    right: 8px;
    bottom: 10px;
    display: flex;
    gap: 4px;
  }
`
