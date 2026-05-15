import styled from '@emotion/styled'
import { Box, Dialog } from '@mui/material'

import theme, { c, tokens } from '@/theme'
export const StudentExamPlayerRoot = styled.div`
  height: 100vh;
  background-color: ${c.surface.default};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .student-exam-player__header {
    height: 62px;
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid ${c.examPlayer.borderLight};
    background-color: ${c.surface.default};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .student-exam-player__header-left {
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.spacing(2.2)};
  }

  .student-exam-player__brand {
    font-weight: 800;
    color: ${c.error.exam};
    font-size: 40px;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .student-exam-player__header-meta-title {
    color: ${c.examPlayer.text};
    font-size: 15px;
    font-weight: 700;
    line-height: 1.1;
  }

  .student-exam-player__header-meta-sub {
    color: ${c.examPlayer.text};
    font-size: 13px;
    line-height: 1.1;
  }

  .student-exam-player__header-right {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.2)};
    color: ${c.examPlayer.textMuted};
  }

  .student-exam-player__timer-box {
    min-width: 108px;
    padding: 4.4px 9.6px;
    border: 1px solid ${c.examPlayer.input};
    border-radius: 8px;
    background-color: ${c.surface.muted};
    text-align: center;
  }

  .student-exam-player__timer-label {
    font-size: 10px;
    color: ${c.text.secondary};
    line-height: 1.1;
  }

  .student-exam-player__timer-value {
    font-size: 14px;
    font-weight: 800;
    color: ${c.text.primary};
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
    border: 1px solid ${c.examPlayer.border};
    background-color: ${c.examPlayer.panel};
  }

  .student-exam-player__part-title {
    font-size: 20px;
    color: ${c.examPlayer.text};
    font-weight: 700;
    line-height: 1.2;
  }

  .student-exam-player__part-desc {
    font-size: 14px;
    color: ${c.examPlayer.text};
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
    background-color: ${tokens.rgba.slate900_48};
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
    color: ${c.surface.default};
    margin-bottom: 8px;
  }

  .student-exam-player__listening-text {
    font-size: 12px;
    color: ${c.surface.default};
    margin-bottom: 4px;
  }

  .student-exam-player__listening-text--spaced {
    margin-bottom: 12px;
  }

  .student-exam-player__listening-play.MuiButton-root {
    border-radius: 0;
    min-width: 86px;
    min-height: 30px;
    background-color: ${c.examPlayer.chrome};
    color: ${c.surface.default};
    border: 1px solid ${c.examPlayer.chromeBorder};
  }

  .student-exam-player__listening-play.MuiButton-root:hover {
    background-color: ${c.examPlayer.chromeDark};
  }

  .student-exam-player__muted {
    font-size: 16px;
    color: ${c.examPlayer.textMuted};
  }

  .student-exam-player__empty-state {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    gap: ${theme.spacing(1)};
  }

  .student-exam-player__empty-title {
    font-size: 40px;
    font-weight: 800;
    color: ${c.text.primary};
    line-height: 1.1;
  }

  .student-exam-player__empty-sub {
    font-size: 16px;
    color: ${c.text.muted};
  }

  .student-exam-player__loading-text {
    font-size: 16px;
  }

  .student-exam-player__error-text {
    font-size: 16px;
    color: ${c.error.critical};
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
    border: 1px solid ${c.examPlayer.border};
    background-color: ${c.surface.default};
    padding: 12px;
    font-size: 16px;
    color: ${c.text.primary};
    line-height: 1.62;
  }

  .student-exam-player__split-pane--side {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
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
    background-color: ${c.examPlayer.overlay};
  }

  .student-exam-player__resize-knob {
    z-index: 1;
    width: 30px;
    height: 30px;
    border: 1px solid ${c.examPlayer.inputBorder};
    background-color: ${c.background.subtle};
    color: ${c.text.subtle};
    font-size: 17px;
    line-height: 28px;
    text-align: center;
  }

  .student-exam-player__question-row {
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(1)};
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
    color: ${c.examPlayer.textDark};
  }

  .student-exam-player__question-text {
    font-size: 16px;
    color: ${c.examPlayer.textDark};
  }

  .student-exam-player__passage-muted {
    font-size: 16px;
    color: ${c.examPlayer.textSubtle};
  }

  .student-exam-player__writing-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
  }

  .student-exam-player__writing-title {
    font-size: 16px;
    color: ${c.examPlayer.textDark};
    font-weight: 700;
  }

  .student-exam-player__writing-count {
    font-size: 14px;
    color: ${c.text.muted};
  }

  .student-exam-player__writing-textarea {
    width: 100%;
    min-height: 360px;
    flex: 1;
    resize: vertical;
    border: 1px solid ${c.examPlayer.border};
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    line-height: 1.6;
    color: ${c.text.primary};
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
  }

  .student-exam-player__writing-textarea:focus {
    border-color: ${c.info.focus};
    box-shadow: 0 0 0 2px ${tokens.rgba.primary_14};
  }

  .student-exam-player__module-stack {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
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
    gap: ${theme.spacing(0.5)};
    pointer-events: auto;
  }

  .student-exam-player__nav-btn.MuiIconButton-root {
    width: 48px;
    height: 42px;
    border-radius: 0;
    border: 1px solid ${c.examPlayer.chromeBorder};
    background-color: ${c.examPlayer.chrome};
    color: ${c.surface.default};
    transition: background-color 160ms ease, box-shadow 160ms ease, transform 120ms ease;
  }

  .student-exam-player__nav-btn.MuiIconButton-root:hover {
    background-color: ${c.examPlayer.chromeHover};
    box-shadow: 0 4px 10px ${tokens.rgba.slate900_42};
    transform: translateY(-1px);
  }

  .student-exam-player__nav-btn.MuiIconButton-root.Mui-disabled {
    background-color: ${c.examPlayer.chromeMuted};
    color: ${c.examPlayer.chromeText};
  }

  .student-exam-player__nav-arrow {
    font-size: 22px;
    line-height: 1;
  }

  .student-exam-player__footer {
    min-height: 44px;
    border-top: 1px solid ${c.examPlayer.borderPanel};
    background-color: ${c.examPlayer.panelBg};
    display: flex;
    align-items: stretch;
    overflow-x: auto;
    scrollbar-gutter: stable;
  }

  .student-exam-player__part-tab {
    min-width: 0;
    flex: 1 1 0;
    border-right: 1px solid ${c.examPlayer.borderSplit};
    border-top: 2px solid transparent;
    background-color: ${c.examPlayer.panelBg};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 2px 8px;
    gap: ${theme.spacing(0.75)};
    cursor: pointer;
  }

  .student-exam-player__part-tab--current {
    border-top-color: ${c.examPlayer.tab};
    background-color: ${c.surface.default};
  }

  .student-exam-player__part-tab--collapsed {
    justify-content: center;
  }

  .student-exam-player__part-tab-title {
    font-size: 15px;
    color: ${c.examPlayer.text};
    line-height: 1;
    white-space: nowrap;
    font-weight: 700;
  }

  .student-exam-player__part-tab-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(0.8)};
    flex: 1 1 auto;
    min-width: 0;
  }

  .student-exam-player__part-tab-chips {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.7)};
    flex-wrap: wrap;
    row-gap: ${theme.spacing(0.5)};
    max-width: 100%;
  }

  .student-exam-player__q-chip {
    min-width: 22px;
    height: 22px;
    padding: 0 3.6px;
    border-radius: 8px;
    border: 2px solid transparent;
    background-color: transparent;
    color: ${c.examPlayer.textDark};
    display: grid;
    place-items: center;
    font-size: 13px;
    line-height: 1;
    font-weight: 500;
    user-select: none;
    cursor: pointer;
  }

  .student-exam-player__q-chip--active {
    border-color: ${c.examPlayer.tab};
    background-color: transparent;
  }

  .student-exam-player__q-chip--answered:not(.student-exam-player__q-chip--active) {
    background-color: ${c.examPlayer.panelHover};
  }

  .student-exam-player__part-tab--empty {
    cursor: default;
    opacity: 0.65;
  }

  .student-exam-player__part-tab-idle {
    width: 100%;
    font-size: 15px;
    line-height: 1;
    color: ${c.examPlayer.textGray};
    text-align: center;
    white-space: nowrap;
    font-weight: 500;
  }

  .student-exam-player__part-tab-empty {
    font-size: 13px;
    line-height: 1;
    color: ${c.examPlayer.textLight};
    white-space: nowrap;
  }

  .student-exam-player__complete-cell {
    margin-left: auto;
    min-width: 78px;
    height: 100%;
    border-left: 1px solid ${c.examPlayer.borderSplit};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${c.examPlayer.panelMuted};
  }

  .student-exam-player__complete-btn.MuiIconButton-root {
    width: 100%;
    height: 100%;
    color: ${c.examPlayer.textSubtle};
    border-radius: 8px;
  }

  .student-exam-player__complete-check {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  /* Rich HTML (passage / questions) */
  .student-exam-player__prose p {
    margin: 28px 0 16px;
  }

  .student-exam-player__prose h1,
  .student-exam-player__prose h2,
  .student-exam-player__prose h3 {
    margin: 0.55em 0 0.4em;
    font-weight: 750;
    line-height: 1.22;
    letter-spacing: -0.02em;
    color: ${c.text.primary};
  }

  .student-exam-player__prose h1 {
    font-size: 1.8rem;
  }

  .student-exam-player__prose h2 {
    font-size: 1.42rem;
    color: ${c.text.dark};
  }

  .student-exam-player__prose h3 {
    font-size: 1.18rem;
    color: ${c.text.subtle};
  }

  .student-exam-player__prose ul,
  .student-exam-player__prose ol {
    margin: 0.45em 0;
    padding-left: 1.55rem;
  }

  .student-exam-player__prose li::marker {
    color: ${c.primary.main};
  }

  .student-exam-player__prose blockquote {
    margin: 0.65em 0;
    padding: 10px 14px 10px 16px;
    border-left: 4px solid ${c.primary.main};
    border-radius: 0 10px 10px 0;
    background: ${c.primary.tint};
    color: ${c.text.muted};
    font-style: italic;
  }

  .student-exam-player__prose pre {
    margin: 0.65em 0;
    padding: 14px 16px;
    border-radius: 12px;
    background: ${c.gradient.darkPanel};
    color: ${c.border.default};
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    box-shadow: inset 0 1px 0 ${tokens.rgba.slate900_06};
    border: 1px solid ${c.text.subtle};
  }

  .student-exam-player__prose code {
    padding: 0.12em 0.4em;
    border-radius: 6px;
    background: linear-gradient(180deg, ${c.background.subtle} 0%, ${c.neutral[200]} 100%);
    font-size: 0.88em;
    color: ${c.primary.main};
    border: 1px solid ${c.border.default};
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
    background: linear-gradient(90deg, transparent, ${c.text.subtle}, transparent);
  }

  .student-exam-player__prose img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 24px ${tokens.rgba.slate900_08};
    border: 1px solid ${c.text.muted};
  }

  .student-exam-player__prose a {
    color: ${c.primary.main};
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
  }

  .student-exam-player__prose a:hover {
    color: ${c.primary.dark};
  }

  .student-exam-player__prose .rte-radio-group,
  .student-exam-player__prose .rte-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing(1.25, 2.5)};
    margin: 0.65em 0;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid ${c.text.muted};
    user-select: none;
  }

  .student-exam-player__prose .rte-radio-group {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
    margin: 0.75em 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .student-exam-player__prose .rte-checkbox-group {
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.background.subtle} 100%);
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
  }

  .student-exam-player__prose .rte-radio-option,
  .student-exam-player__prose .rte-checkbox-option {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 550;
    color: ${c.text.subtle};
  }

  .student-exam-player__prose .rte-radio-option {
    display: flex;
    width: 100%;
    min-height: 0;
    gap: ${theme.spacing(1)};
    margin: 0;
    padding: 2px 0;
    background: transparent;
    color: ${c.text.primary};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.35;
    border-top: none;
    box-sizing: border-box;
  }

  .student-exam-player__prose .rte-radio-option input[type='radio'],
  .student-exam-player__prose .rte-checkbox-option input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${c.info.main};
    cursor: pointer;
  }

  .student-exam-player__prose .rte-radio-option input[type='radio'] {
    width: 17px;
    height: 17px;
  }

  .student-exam-player__prose .rte-radio-label {
    color: ${c.text.primary};
    font-weight: 400;
    line-height: 1.35;
  }

  .student-exam-player__prose .rte-radio-question,
  .student-exam-player__prose p:has(+ .rte-radio-group),
  .student-exam-player__prose p:has(+ [data-type='radio-group']) {
    font-weight: 800;
    color: ${c.text.primary};
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
    border: 1px solid ${c.text.muted};
    box-shadow: 0 4px 14px ${tokens.rgba.slate900_04};
    table-layout: fixed;
    background-color: ${c.surface.default};
  }

  .student-exam-player__prose th,
  .student-exam-player__prose td {
    border: 1px solid ${c.text.muted};
    padding: 8px 12px;
    vertical-align: top;
    min-width: 56px;
    position: relative;
  }

  .student-exam-player__prose th {
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.background.subtle} 100%);
    font-weight: 650;
    text-align: left;
    color: ${c.text.subtle};
  }

  .student-exam-player__prose td {
    background: ${c.surface.default};
  }

  .student-exam-player__prose--question {
    font-size: 15px;
    line-height: 1.62;
    color: ${c.text.primary};
  }

  .student-exam-player__prose--question input {
    pointer-events: auto;
  }

  .student-exam-player__prose--listening {
    font-size: 16px;
    color: ${c.text.primary};
    line-height: 1.62;
  }

  .student-exam-player__prose--listening .ielts-blank-inline,
  .student-exam-player__prose--question .ielts-blank-inline {
    display: inline-flex;
    align-items: center;
    margin: 0 6px;
    vertical-align: middle;
  }

  .student-exam-player__prose--listening .ielts-blank-input,
  .student-exam-player__prose--question .ielts-blank-input {
    width: 150px;
    height: 27px;
    border: 1px solid ${c.examPlayer.chromeMuted};
    border-radius: 4px;
    outline: none;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    font-weight: 400;
    padding: 0 8px;
    box-sizing: border-box;
    pointer-events: auto;
  }

  .student-exam-player__prose--listening .ielts-blank-input::placeholder,
  .student-exam-player__prose--question .ielts-blank-input::placeholder {
    text-align: center;
    opacity: 1;
  }

  .student-exam-player__prose--listening .ielts-blank-input:focus,
  .student-exam-player__prose--question .ielts-blank-input:focus {
    border-color: ${c.info.focus};
  }

  .student-exam-player__prose--listening table,
  .student-exam-player__prose--question table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 16px;
    background-color: ${c.surface.default};
  }

  .student-exam-player__prose--listening th,
  .student-exam-player__prose--listening td,
  .student-exam-player__prose--question th,
  .student-exam-player__prose--question td {
    border: 1px solid ${c.examPlayer.inputDark};
    padding: 6px 8px;
    vertical-align: middle;
    text-align: center;
    min-height: 44px;
  }

  .student-exam-player__prose--listening table td:has(.ielts-blank-inline),
  .student-exam-player__prose--listening table th:has(.ielts-blank-inline),
  .student-exam-player__prose--listening table td:has(.ielts-blank-input),
  .student-exam-player__prose--listening table th:has(.ielts-blank-input),
  .student-exam-player__prose--question table td:has(.ielts-blank-inline),
  .student-exam-player__prose--question table th:has(.ielts-blank-inline),
  .student-exam-player__prose--question table td:has(.ielts-blank-input),
  .student-exam-player__prose--question table th:has(.ielts-blank-input) {
    text-align: center;
    vertical-align: middle;
  }

  .student-exam-player__prose--listening table td .ielts-blank-inline,
  .student-exam-player__prose--listening table th .ielts-blank-inline,
  .student-exam-player__prose--question table td .ielts-blank-inline,
  .student-exam-player__prose--question table th .ielts-blank-inline {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 4px;
    vertical-align: middle;
  }

  .student-exam-player__prose--listening table td .ielts-blank-input,
  .student-exam-player__prose--listening table th .ielts-blank-input,
  .student-exam-player__prose--question table td .ielts-blank-input,
  .student-exam-player__prose--question table th .ielts-blank-input {
    margin: 0 auto;
  }

  .student-exam-player__prose--listening strong {
    font-weight: 700;
  }

  .student-exam-player__prose .rte-drag-drop-fill--exam,
  .student-exam-player__prose .rte-drag-drop-fill {
    margin: 16px 0;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid ${c.border.strong};
    background: ${c.surface.default};
    box-shadow: 0 4px 14px ${tokens.rgba.slate900_04};
    overflow: visible;
    height: auto;
  }

  .student-exam-player__prose .rte-drag-drop-fill__instruction {
    margin: 0 0 14px;
    font-size: 15px;
    line-height: 1.55;
    color: ${c.text.primary};
    font-weight: 500;
  }

  .student-exam-player__prose .rte-drag-drop-fill__layout {
  display: flex;
  gap: ${theme.spacing(3.5)};
  width: 100%;
  max-width: 500px;
  align-items: start;
  justify-content: space-between;
  }

  @media (max-width: 720px) {
    .student-exam-player__prose .rte-drag-drop-fill__layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .student-exam-player__prose .rte-drag-drop-fill__targets {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  }

  .student-exam-player__prose .rte-drag-drop-fill__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 110px;
    gap: ${theme.spacing(1.5)};
    align-items: center;
  }

  .student-exam-player__prose .rte-drag-drop-fill__row-label {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 15px;
    line-height: 1.45;
    color: ${c.text.primary};
    font-weight: 500;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop {
    flex: 0 0 110px;
    width: 110px;
    min-height: 38px;
    min-width: 110px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 2px dashed ${c.text.disabled};
    background: ${c.surface.default};
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    cursor: default;
    touch-action: none;
    user-select: none;
    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop-num {
    font-size: 16px;
    font-weight: 700;
    color: ${c.text.subtle};
    line-height: 1.2;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop-text {
    font-size: 13px;
    line-height: 1.35;
    color: ${c.text.primary};
    font-weight: 500;
    word-break: break-word;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--filled {
    border-style: solid;
    border-color: ${c.info.light};
    background: ${c.info.bg};
    padding: 0;
    min-height: 38px;
    justify-content: stretch;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--populated {
    border-style: solid;
    border-color: ${c.info.light};
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop > .rte-drag-drop-fill__chip {
    width: 100%;
    margin: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    box-shadow: none;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop > .rte-drag-drop-fill__chip:hover {
    box-shadow: none;
    border-color: transparent;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--drag-over {
    border-color: ${c.info.main};
    background: ${c.info.bgMuted};
    box-shadow: 0 0 0 2px ${tokens.rgba.primary_20};
  }

  .student-exam-player__prose .rte-drag-drop-fill__question {
    font-size: 15px;
    line-height: 1.6;
    color: ${c.text.primary};
    white-space: pre-wrap;
    word-break: break-word;
    margin-bottom: 14px;
  }

  .student-exam-player__prose .rte-drag-drop-fill__blank {
    display: inline-block;
    min-width: 120px;
    max-width: 280px;
    height: 34px;
    margin: 0 6px;
    padding: 4px 10px;
    border-radius: 8px;
    border: 2px dashed ${c.text.disabled};
    background: ${c.surface.default};
    font-size: 14px;
    color: ${c.text.primary};
    vertical-align: middle;
    text-align: center;
    box-sizing: border-box;
    cursor: default;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .student-exam-player__prose .rte-drag-drop-fill__blank::placeholder {
    color: ${c.text.secondary};
    font-weight: 700;
    opacity: 1;
  }

  .student-exam-player__prose .rte-drag-drop-fill__blank--filled {
    border-style: solid;
    border-color: ${c.info.light};
    background: ${c.info.bg};
    font-weight: 500;
  }

  .student-exam-player__prose .rte-drag-drop-fill__blank--drag-over {
    border-color: ${c.info.main};
    background: ${c.info.bgMuted};
    box-shadow: 0 0 0 2px ${tokens.rgba.primary_20};
  }

  .student-exam-player__prose .rte-drag-drop-fill__pool {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    width: auto;
    display: flex;
    flex-direction: column;
  }

  .student-exam-player__prose .rte-drag-drop-fill__pool-label {
    font-size: 15px;
    font-weight: 700;
    color: ${c.text.primary};
    margin-bottom: 12px;
  }

  .student-exam-player__prose .rte-drag-drop-fill__pool-items {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
    align-items: stretch;
    min-width: 140px;
    box-sizing: border-box;
  }

  .student-exam-player__prose .rte-drag-drop-fill__pool-items:empty {
    border: 2px dashed ${c.border.strong};
    border-radius: 8px;
    background: ${c.surface.muted};
  }

  .student-exam-player__prose .rte-drag-drop-fill__pool-items--drag-over {
    outline: 2px dashed ${c.info.main};
    outline-offset: 4px;
    border-radius: 8px;
  }

  .student-exam-player__prose .rte-drag-drop-fill__chip {
    display: block;
    padding: 11px 14px;
    border-radius: 8px;
    border: 1px solid ${c.examPlayer.inputPlaceholder};
    background: ${c.surface.muted};
    font-size: 14px;
    line-height: 1.45;
    color: ${c.text.primary};
    cursor: grab;
    user-select: none;
    touch-action: none;
    pointer-events: auto;
    box-shadow: 0 1px 2px ${tokens.rgba.slate900_04};
    transition: opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .student-exam-player__prose .rte-drag-drop-fill__chip:hover {
    border-color: ${c.text.disabled};
    box-shadow: 0 2px 8px ${tokens.rgba.slate900_08};
  }

  .student-exam-player__prose .rte-drag-drop-fill__chip--dragging {
    opacity: 0.55;
    cursor: grabbing;
    transform: scale(0.98);
    pointer-events: none;
  }

  .student-exam-player__prose .rte-drag-drop-fill__column-head {
    font-size: 15px;
    font-weight: 700;
    color: ${c.text.primary};
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid ${c.border.default};
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--dragging {
    opacity: 0.45;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--filled {
    cursor: grab;
  }

  .student-exam-player__prose .rte-drag-drop-fill__drop--filled:active {
    cursor: grabbing;
  }

  .ielts-drag-ghost {
    position: fixed;
    z-index: 10000;
    pointer-events: none;
    max-width: 280px;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid ${c.info.light};
    background: ${c.info.bg};
    box-shadow: 0 8px 24px ${tokens.rgba.primary_28};
    font-size: 14px;
    line-height: 1.4;
    color: ${c.text.primary};
    font-weight: 500;
  }
`

export const StudentExamPlayerFinishDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 22px;
    border: 1px solid ${c.neutral[200]};
    background: ${c.surface.default};
    box-shadow: 0 24px 56px ${tokens.rgba.slate900_18};
    padding: 24px;
  }

  & .finish-modal__cancel.MuiButton-root {
    min-width: 140px;
    min-height: 56px;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.3px;
    border-radius: 13.6px;
    border-color: ${c.border.strong};
    color: ${c.text.muted};
    text-transform: none;
  }

  & .finish-modal__cancel.MuiButton-root:hover {
    background: ${c.surface.muted};
    border-color: ${c.text.disabled};
  }

  & .finish-modal__continue.MuiButton-root {
    min-width: 250px;
    min-height: 56px;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.5px;
    border-radius: 13.6px;
    box-shadow: 0 6px 14px ${tokens.rgba.primary_28};
  }

  & .finish-modal__continue.MuiButton-root:hover {
    box-shadow: 0 8px 18px ${tokens.rgba.primary_28};
  }
`

export const FinishModalTop = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing(2)};
`

export const FinishModalLeft = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing(2)};
`

export const FinishModalIcon = styled(Box)`
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background-color: ${c.success.bg};
  color: ${c.success.main};
  display: grid;
  place-items: center;
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
`

export const FinishModalTitle = styled(Box)`
  font-size: 50px;
  font-weight: 800;
  color: ${c.text.primary};
  line-height: 1.1;
`

export const FinishModalLead = styled(Box)`
  font-size: 21px;
  color: ${c.text.subtle};
  margin-top: 6.4px;
  font-weight: 700;
`

export const FinishModalHint = styled(Box)`
  font-size: 16px;
  color: ${c.text.secondary};
  margin-top: 2.4px;
`

export const FinishModalBadge = styled(Box)`
  background-color: ${c.success.bg};
  color: ${c.success.darker};
  border: 1px solid ${c.success.borderSoft};
  border-radius: 16px;
  padding: 7.2px 16px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
`

export const FinishModalDivider = styled(Box)`
  margin-top: 17.6px;
  margin-bottom: 17.6px;
  border-top: 1px solid ${c.neutral[200]};
`

export const FinishModalSummaryHead = styled(Box)`
  margin-bottom: 11.2px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`

export const FinishModalSummaryIcon = styled(Box)`
  width: 32px;
  height: 32px;
  border-radius: 8.8px;
  background-color: ${c.info.bgSoft};
  color: ${c.info.main};
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
`

export const FinishModalSummaryTitle = styled(Box)`
  font-size: 34px;
  font-weight: 800;
  color: ${c.text.primary};
`

export const FinishModalGrid = styled(Box)`
  border: 1px solid ${c.border.default};
  border-radius: 12.8px;
  background-color: ${c.surface.default};
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
`

export const FinishModalCell = styled(Box)`
  padding: 12.8px;
  border-right: 1px solid ${c.border.default};
`

export const FinishModalCellLast = styled(Box)`
  padding: 12.8px;
`

export const FinishModalLabel = styled(Box)`
  font-size: 13px;
  color: ${c.text.secondary};
  margin-bottom: 2.4px;
`

export const FinishModalValue = styled(Box)`
  font-size: 18px;
  font-weight: 700;
  color: ${c.text.primary};
`

export const FinishModalNotice = styled(Box)`
  margin-top: 11.2px;
  margin-bottom: 12.8px;
  border-radius: 12px;
  padding: 8.8px 12.8px;
  background-color: ${c.info.bgPanel};
  color: ${c.info.main};
  font-size: 14px;
  font-weight: 600;
`

export const FinishModalActions = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${theme.spacing(1.5)};
`
