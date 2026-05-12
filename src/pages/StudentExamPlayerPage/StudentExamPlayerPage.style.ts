import styled from '@emotion/styled'
import { Box, Dialog } from '@mui/material'

export const StudentExamPlayerRoot = styled.div`
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .student-exam-player__header {
    height: 62px;
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid #d6d6d6;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .student-exam-player__header-left {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 17.6px;
  }

  .student-exam-player__brand {
    font-weight: 800;
    color: #c8191e;
    font-size: 40px;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .student-exam-player__header-meta-title {
    color: #111;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.1;
  }

  .student-exam-player__header-meta-sub {
    color: #111;
    font-size: 13px;
    line-height: 1.1;
  }

  .student-exam-player__header-right {
    display: flex;
    align-items: center;
    gap: 9.6px;
    color: #3f3f3f;
  }

  .student-exam-player__timer-box {
    min-width: 108px;
    padding: 4.4px 9.6px;
    border: 1px solid #d0d7e2;
    border-radius: 8px;
    background-color: #f8fafc;
    text-align: center;
  }

  .student-exam-player__timer-label {
    font-size: 10px;
    color: #64748b;
    line-height: 1.1;
  }

  .student-exam-player__timer-value {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }

  .student-exam-player__header-icon {
    width: 24px;
    height: 24px;
    display: block;
  }

  .student-exam-player__main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 16px 24px;
    position: relative;
  }

  .student-exam-player__part-banner {
    margin-bottom: 12px;
    padding: 12px 10px;
    border: 1px solid #d7d7d7;
    background-color: #ecefe7;
  }

  .student-exam-player__part-title {
    font-size: 20px;
    color: #111;
    font-weight: 700;
    line-height: 1.2;
  }

  .student-exam-player__part-desc {
    font-size: 14px;
    color: #111;
    line-height: 1.3;
  }

  .student-exam-player__listening-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(44, 44, 44, 0.88);
  }

  .student-exam-player__listening-overlay-inner {
    text-align: center;
    padding-left: 24px;
    padding-right: 24px;
    max-width: 760px;
  }

  .student-exam-player__listening-emoji {
    font-size: 68px;
    line-height: 1;
    color: #fff;
    margin-bottom: 8px;
  }

  .student-exam-player__listening-text {
    font-size: 12px;
    color: #fff;
    margin-bottom: 4px;
  }

  .student-exam-player__listening-text--spaced {
    margin-bottom: 12px;
  }

  .student-exam-player__listening-play.MuiButton-root {
    border-radius: 0;
    min-width: 86px;
    min-height: 30px;
    background-color: #161616;
    color: #fff;
    border: 1px solid #101010;
  }

  .student-exam-player__listening-play.MuiButton-root:hover {
    background-color: #0c0c0c;
  }

  .student-exam-player__muted {
    font-size: 16px;
    color: #333;
  }

  .student-exam-player__empty-state {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .student-exam-player__empty-title {
    font-size: 40px;
    font-weight: 800;
    color: #1f2937;
    line-height: 1.1;
  }

  .student-exam-player__empty-sub {
    font-size: 16px;
    color: #4b5563;
  }

  .student-exam-player__loading-text {
    font-size: 16px;
  }

  .student-exam-player__error-text {
    font-size: 16px;
    color: #b00020;
  }

  .student-exam-player__split {
    display: flex;
    gap: 0;
    align-items: stretch;
    height: calc(100vh - 280px);
  }

  .student-exam-player__split-pane {
    height: 100%;
    overflow-y: auto;
  }

  .student-exam-player__split-pane--passage {
    border: 1px solid #d7d7d7;
    background-color: #fff;
    padding: 12px;
    font-size: 16px;
    color: #0f172a;
    line-height: 1.62;
  }

  .student-exam-player__split-pane--side {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .student-exam-player__resize-handle {
    width: 28px;
    height: 100%;
    position: relative;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    touch-action: none;
    flex-shrink: 0;
  }

  .student-exam-player__resize-handle::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #8b8b8b;
  }

  .student-exam-player__resize-knob {
    z-index: 1;
    width: 30px;
    height: 30px;
    border: 1px solid #9aa1ac;
    background-color: #f1f5f9;
    color: #334155;
    font-size: 17px;
    line-height: 28px;
    text-align: center;
  }

  .student-exam-player__question-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .student-exam-player__question-row--center {
    align-items: center;
  }

  .student-exam-player__question-num {
    font-size: 16px;
    min-width: 34px;
  }

  .student-exam-player__question-body {
    font-size: 16px;
    flex: 1;
    color: #202020;
  }

  .student-exam-player__question-text {
    font-size: 16px;
    color: #202020;
  }

  .student-exam-player__passage-muted {
    font-size: 16px;
    color: #555;
  }

  .student-exam-player__writing-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .student-exam-player__writing-title {
    font-size: 16px;
    color: #202020;
    font-weight: 700;
  }

  .student-exam-player__writing-count {
    font-size: 14px;
    color: #475569;
  }

  .student-exam-player__writing-textarea {
    width: 100%;
    min-height: 360px;
    flex: 1;
    resize: vertical;
    border: 1px solid #d7d7d7;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    line-height: 1.6;
    color: #0f172a;
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
  }

  .student-exam-player__writing-textarea:focus {
    border-color: #3a7afe;
    box-shadow: 0 0 0 2px rgba(58, 122, 254, 0.15);
  }

  .student-exam-player__module-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .student-exam-player__fab-wrap {
    position: fixed;
    right: 12px;
    bottom: 56px;
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    pointer-events: none;
    z-index: 20;
  }

  .student-exam-player__fab-inner {
    display: flex;
    align-items: center;
    gap: 4px;
    pointer-events: auto;
  }

  .student-exam-player__nav-btn.MuiIconButton-root {
    width: 48px;
    height: 42px;
    border-radius: 0;
    border: 1px solid #1f1f1f;
    background-color: #161616;
    color: #fff;
    transition: background-color 160ms ease, box-shadow 160ms ease, transform 120ms ease;
  }

  .student-exam-player__nav-btn.MuiIconButton-root:hover {
    background-color: #262626;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
    transform: translateY(-1px);
  }

  .student-exam-player__nav-btn.MuiIconButton-root.Mui-disabled {
    background-color: #7a7a7a;
    color: #ddd;
  }

  .student-exam-player__nav-arrow {
    font-size: 22px;
    line-height: 1;
  }

  .student-exam-player__footer {
    min-height: 44px;
    border-top: 1px solid #cfd2d6;
    background-color: #efefef;
    display: flex;
    align-items: stretch;
    overflow-x: auto;
  }

  .student-exam-player__part-tab {
    min-width: 300px;
    flex: 1;
    border-right: 1px solid #d7d9dd;
    border-top: 2px solid transparent;
    background-color: #efefef;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 2px 8px;
    gap: 6px;
    cursor: pointer;
  }

  .student-exam-player__part-tab--current {
    border-top-color: #4e99d2;
    background-color: #fff;
  }

  .student-exam-player__part-tab-title {
    font-size: 15px;
    color: #111;
    line-height: 1;
    white-space: nowrap;
    font-weight: 700;
  }

  .student-exam-player__part-tab-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6.4px;
  }

  .student-exam-player__part-tab-chips {
    display: flex;
    align-items: center;
    gap: 5.6px;
    flex-wrap: nowrap;
  }

  .student-exam-player__q-chip {
    min-width: 22px;
    height: 22px;
    padding: 0 3.6px;
    border-radius: 8px;
    border: 2px solid transparent;
    background-color: transparent;
    color: #202020;
    display: grid;
    place-items: center;
    font-size: 13px;
    line-height: 1;
    font-weight: 500;
    user-select: none;
  }

  .student-exam-player__q-chip--active {
    border-color: #4e99d2;
    background-color: #e7f0fb;
  }

  .student-exam-player__part-tab-idle {
    width: 100%;
    font-size: 15px;
    line-height: 1;
    color: #6f6f6f;
    text-align: center;
    white-space: nowrap;
    font-weight: 500;
  }

  .student-exam-player__complete-cell {
    margin-left: auto;
    min-width: 78px;
    height: 100%;
    border-left: 1px solid #d7d9dd;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e3e3e3;
  }

  .student-exam-player__complete-btn.MuiIconButton-root {
    width: 100%;
    height: 100%;
    color: #4a4a4a;
    border-radius: 8px;
  }

  .student-exam-player__complete-check {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  /* Rich HTML (passage / questions) */
  .student-exam-player__prose p {
    margin: 0.4em 0;
  }

  .student-exam-player__prose h1,
  .student-exam-player__prose h2,
  .student-exam-player__prose h3 {
    margin: 0.55em 0 0.4em;
    font-weight: 750;
    line-height: 1.22;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .student-exam-player__prose h1 {
    font-size: 1.8rem;
  }

  .student-exam-player__prose h2 {
    font-size: 1.42rem;
    color: #1e293b;
  }

  .student-exam-player__prose h3 {
    font-size: 1.18rem;
    color: #334155;
  }

  .student-exam-player__prose ul,
  .student-exam-player__prose ol {
    margin: 0.45em 0;
    padding-left: 1.55rem;
  }

  .student-exam-player__prose li::marker {
    color: #7c3aed;
  }

  .student-exam-player__prose blockquote {
    margin: 0.65em 0;
    padding: 10px 14px 10px 16px;
    border-left: 4px solid #7c3aed;
    border-radius: 0 10px 10px 0;
    background: #f5f3ff;
    color: #475569;
    font-style: italic;
  }

  .student-exam-player__prose pre {
    margin: 0.65em 0;
    padding: 14px 16px;
    border-radius: 12px;
    background: linear-gradient(165deg, #1e293b 0%, #0f172a 100%);
    color: #e2e8f0;
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    border: 1px solid #334155;
  }

  .student-exam-player__prose code {
    padding: 0.12em 0.4em;
    border-radius: 6px;
    background: linear-gradient(180deg, #f1f5f9 0%, #e8eef5 100%);
    font-size: 0.88em;
    color: #7c3aed;
    border: 1px solid #e2e8f0;
  }

  .student-exam-player__prose pre code {
    padding: 0;
    background: none;
    color: inherit;
    border: none;
  }

  .student-exam-player__prose hr {
    margin: 1.15em 0;
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, #334155, transparent);
  }

  .student-exam-player__prose img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
    border: 1px solid #475569;
  }

  .student-exam-player__prose a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
  }

  .student-exam-player__prose a:hover {
    color: #6d28d9;
  }

  .student-exam-player__prose .rte-radio-group,
  .student-exam-player__prose .rte-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 20px;
    margin: 0.65em 0;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #475569;
    user-select: none;
  }

  .student-exam-player__prose .rte-radio-group {
    display: block;
    margin: 0.4em 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .student-exam-player__prose .rte-checkbox-group {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .student-exam-player__prose .rte-radio-option,
  .student-exam-player__prose .rte-checkbox-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 550;
    color: #334155;
  }

  .student-exam-player__prose .rte-radio-option {
    display: flex;
    width: 100%;
    min-height: 0;
    gap: 8px;
    margin: 0;
    padding: 4px 0;
    background: transparent;
    color: #111;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.35;
    border-top: none;
    box-sizing: border-box;
  }

  .student-exam-player__prose .rte-radio-option input[type='radio'],
  .student-exam-player__prose .rte-checkbox-option input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: #7c3aed;
    cursor: pointer;
  }

  .student-exam-player__prose .rte-radio-option input[type='radio'] {
    width: 17px;
    height: 17px;
    accent-color: #5f5f5f;
  }

  .student-exam-player__prose .rte-radio-label {
    color: #111;
    line-height: 1.35;
  }

  .student-exam-player__prose .rte-checkbox-option input[type='checkbox'] {
    border-radius: 4px;
  }

  .student-exam-player__prose table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    margin: 0.65em 0;
    overflow: hidden;
    border-radius: 0;
    border: 1px solid #475569;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    table-layout: fixed;
    background-color: #fff;
  }

  .student-exam-player__prose th,
  .student-exam-player__prose td {
    border: 1px solid #475569;
    padding: 8px 12px;
    vertical-align: top;
    min-width: 56px;
    position: relative;
  }

  .student-exam-player__prose th {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    font-weight: 650;
    text-align: left;
    color: #334155;
  }

  .student-exam-player__prose td {
    background: #fff;
  }

  .student-exam-player__prose--question {
    font-size: 15px;
    line-height: 1.62;
    color: #0f172a;
  }

  .student-exam-player__prose--question input {
    pointer-events: auto;
  }

  .student-exam-player__prose--listening {
    font-size: 16px;
    color: #0f172a;
    line-height: 1.62;
  }

  .student-exam-player__prose--listening .ielts-blank-inline {
    display: inline-flex;
    align-items: center;
    margin: 0 6px;
    vertical-align: middle;
  }

  .student-exam-player__prose--listening .ielts-blank-input {
    width: 86px;
    height: 27px;
    border: 1px solid #7a7a7a;
    border-radius: 4px;
    outline: none;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    background-color: #fff;
    padding: 0 8px;
    box-sizing: border-box;
    pointer-events: auto;
  }

  .student-exam-player__prose--listening .ielts-blank-input::placeholder {
    color: #111;
    opacity: 1;
  }

  .student-exam-player__prose--listening .ielts-blank-input:focus {
    border-color: #3a7afe;
  }

  .student-exam-player__prose--listening table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 16px;
    background-color: #fff;
  }

  .student-exam-player__prose--listening th,
  .student-exam-player__prose--listening td {
    border: 1px solid #5e5e5e;
    padding: 4px 6px;
    vertical-align: top;
  }

  .student-exam-player__prose--listening strong {
    font-weight: 700;
  }
`

export const StudentExamPlayerFinishDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 22px;
    border: 1px solid #e7ecf5;
    background: #fff;
    box-shadow: 0 24px 56px rgba(15, 23, 42, 0.2);
    padding: 24px;
  }

  & .finish-modal__continue.MuiButton-root {
    min-width: 250px;
    min-height: 56px;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.5px;
    border-radius: 13.6px;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
  }

  & .finish-modal__continue.MuiButton-root:hover {
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.42);
  }
`

export const FinishModalTop = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

export const FinishModalLeft = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`

export const FinishModalIcon = styled(Box)`
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background-color: #eaf8ef;
  color: #16a34a;
  display: grid;
  place-items: center;
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
`

export const FinishModalTitle = styled(Box)`
  font-size: 50px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
`

export const FinishModalLead = styled(Box)`
  font-size: 21px;
  color: #334155;
  margin-top: 6.4px;
  font-weight: 700;
`

export const FinishModalHint = styled(Box)`
  font-size: 16px;
  color: #64748b;
  margin-top: 2.4px;
`

export const FinishModalBadge = styled(Box)`
  background-color: #ecfdf3;
  color: #15803d;
  border: 1px solid #b7e7c8;
  border-radius: 16px;
  padding: 7.2px 16px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
`

export const FinishModalDivider = styled(Box)`
  margin-top: 17.6px;
  margin-bottom: 17.6px;
  border-top: 1px solid #e8edf4;
`

export const FinishModalSummaryHead = styled(Box)`
  margin-bottom: 11.2px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const FinishModalSummaryIcon = styled(Box)`
  width: 32px;
  height: 32px;
  border-radius: 8.8px;
  background-color: #eaf2ff;
  color: #2563eb;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
`

export const FinishModalSummaryTitle = styled(Box)`
  font-size: 34px;
  font-weight: 800;
  color: #0f172a;
`

export const FinishModalGrid = styled(Box)`
  border: 1px solid #e2e8f0;
  border-radius: 12.8px;
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`

export const FinishModalCell = styled(Box)`
  padding: 12.8px;
  border-right: 1px solid #e2e8f0;
`

export const FinishModalCellLast = styled(Box)`
  padding: 12.8px;
`

export const FinishModalLabel = styled(Box)`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 2.4px;
`

export const FinishModalValue = styled(Box)`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`

export const FinishModalNotice = styled(Box)`
  margin-top: 11.2px;
  margin-bottom: 12.8px;
  border-radius: 12px;
  padding: 8.8px 12.8px;
  background-color: #eaf3ff;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
`

export const FinishModalActions = styled(Box)`
  display: flex;
  justify-content: flex-end;
`
