import styled from '@emotion/styled'

import theme, { tokens, c } from '@/theme'
const rteSelectChevron = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='${c.text.secondary}'><path d='M7 10l5 5 5-5z'/></svg>`,
)

export const RichTextEditorRoot = styled.div`
  --rte-violet: ${c.primary.main};
  --rte-violet-600: ${c.primary.dark};
  --rte-violet-soft: ${c.primary.tint};
  --rte-violet-mid: ${c.primary.tintBorder};
  --rte-violet-ring: ${tokens.rgba.primary_20};
  --rte-border: ${c.text.muted};
  --rte-border-strong: ${c.text.subtle};
  --rte-surface: ${c.surface.default};
  --rte-surface-muted: ${c.surface.muted};
  --rte-toolbar-bg: linear-gradient(180deg, ${c.surface.default} 0%, ${c.surface.muted} 100%);
  --rte-text: ${c.text.primary};
  --rte-muted: ${c.text.secondary};

  position: relative;
  width: 100%;
  border: 1px solid var(--rte-border);
  border-radius: 16px;
  background: var(--rte-surface);
  box-shadow: ${tokens.shadows.sm}, 0 10px 28px ${tokens.rgba.primary_08};
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.22s ease;

  &.rte-root--expanded {
    position: fixed;
    z-index: 1250;
    inset: 12px;
    width: auto;
    max-width: none;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px ${tokens.rgba.slate900_06},
      0 25px 60px ${tokens.rgba.slate900_18};
  }

  &.rte-root--expanded .rte-toolbar {
    flex-shrink: 0;
  }

  &.rte-root--expanded .rte-body {
    flex: 1;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &:focus-within {
    border-color: var(--rte-violet-mid);
    box-shadow:
      0 0 0 3px var(--rte-violet-ring),
      0 14px 36px ${tokens.rgba.slate900_08};
  }

  .rte-toolbar {
    background: var(--rte-toolbar-bg);
    border-bottom: 1px solid var(--rte-border);
    padding: 10px 10px 8px;
  }

  .rte-toolbar__scroll {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing(0.75, 1)};
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--rte-violet-mid) transparent;
  }

  .rte-toolbar__scroll::-webkit-scrollbar {
    height: 6px;
  }
  .rte-toolbar__scroll::-webkit-scrollbar-thumb {
    background: var(--rte-violet-mid);
    border-radius: 999px;
  }

  .rte-toolbar__group {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing(0.375)};
    padding: 4px 6px;
    border-radius: 12px;
    background: ${tokens.rgba.white_92};
    border: 1px solid ${c.border.default};
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
  }

  .rte-toolbar__group--history {
    background: linear-gradient(135deg, var(--rte-violet-soft) 0%, ${c.primary.tint} 100%);
    border-color: var(--rte-violet-mid);
  }

  .rte-toolbar__sep {
    width: 1px;
    height: 26px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      var(--rte-border-strong) 20%,
      var(--rte-border-strong) 80%,
      transparent 100%
    );
    margin: 0 2px;
    flex-shrink: 0;
    align-self: center;
  }

  .rte-select {
    min-width: 118px;
    height: 34px;
    padding: 0 28px 0 11px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--rte-text);
    border: 1px solid var(--rte-border);
    border-radius: 10px;
    background-color: var(--rte-surface);
    background-image: url("data:image/svg+xml,${rteSelectChevron}");
    background-repeat: no-repeat;
    background-position: right 9px center;
    appearance: none;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .rte-select:hover {
    border-color: var(--rte-violet-mid);
  }

  .rte-select:focus {
    outline: none;
    border-color: var(--rte-violet);
    box-shadow: 0 0 0 3px var(--rte-violet-ring);
  }

  .rte-fontsize-input {
    box-sizing: border-box;
    width: 88px;
    height: 34px;
    padding: 0 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--rte-text);
    border: 1px solid var(--rte-border);
    border-radius: 10px;
    background-color: var(--rte-surface);
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .rte-fontsize-input::placeholder {
    color: var(--rte-muted);
    font-weight: 500;
  }

  .rte-fontsize-input:hover {
    border-color: var(--rte-violet-mid);
  }

  .rte-fontsize-input:focus {
    outline: none;
    border-color: var(--rte-violet);
    box-shadow: 0 0 0 3px var(--rte-violet-ring);
  }

  .rte-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    padding: 0 7px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: ${c.text.muted};
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    line-height: 1;
    transition:
      background 0.14s ease,
      color 0.14s ease,
      border-color 0.14s ease,
      transform 0.12s ease;
  }

  .rte-btn svg {
    flex-shrink: 0;
    opacity: 0.92;
  }

  .rte-btn:hover:not(:disabled) {
    background: var(--rte-violet-soft);
    color: var(--rte-violet-600);
    border-color: ${tokens.rgba.primaryLight_22};
  }

  .rte-btn:active:not(:disabled) {
    transform: scale(0.96);
  }

  .rte-btn:disabled {
    opacity: 0.32;
    cursor: not-allowed;
  }

  .rte-btn.is-active {
    background: linear-gradient(145deg, var(--rte-violet-mid) 0%, ${c.indigo.soft} 100%);
    color: var(--rte-violet-600);
    border-color: ${c.primary.soft};
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
  }

  .rte-btn.is-active svg {
    opacity: 1;
  }

  .rte-btn--icon {
    font-family:
      'Inter',
      system-ui,
      -apple-system,
      sans-serif;
  }

  .rte-color-wrap {
    position: relative;
    display: inline-flex;
    border-radius: 10px;
  }

  .rte-color-wrap .rte-btn {
    min-width: 34px;
  }

  .rte-color-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .rte-swatch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
    line-height: 1;
    border-radius: 6px;
    min-width: 1.25em;
  }

  .rte-swatch--text {
    color: var(--rte-text);
    border-bottom: 3px solid var(--rte-violet);
    padding-bottom: 1px;
  }

  .rte-swatch--highlight {
    color: var(--rte-text);
    background: linear-gradient(180deg, ${c.warning.highlight} 0%, ${c.warning.highlightStrong} 100%);
    padding: 2px 5px;
    box-shadow: 0 1px 2px ${tokens.rgba.slate900_12};
  }

  .rte-body {
    min-height: var(--rte-min-height, 200px);
    max-height: var(--rte-max-height, 500px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--rte-violet-mid) transparent;
    background: linear-gradient(180deg, ${c.surface.elevated} 0%, var(--rte-surface) 48%);
  }

  .rte-body::-webkit-scrollbar {
    width: 8px;
  }
  .rte-body::-webkit-scrollbar-thumb {
    background: var(--rte-violet-mid);
    border-radius: 999px;
  }

  .rte-body .tiptap {
    min-height: inherit;
    padding: 16px 18px 20px;
    outline: none;
    font-size: 15px;
    line-height: 1.62;
    color: var(--rte-text);
    caret-color: var(--rte-violet);
  }

  .rte-body .tiptap p.is-editor-empty:first-of-type::before {
    color: ${c.slate[400]};
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    font-style: italic;
    font-weight: 450;
  }

  .rte-body .tiptap p {
    margin: 0.4em 0;
  }

  .rte-body .tiptap h1,
  .rte-body .tiptap h2,
  .rte-body .tiptap h3 {
    margin: 0.55em 0 0.4em;
    font-weight: 750;
    line-height: 1.22;
    letter-spacing: -0.02em;
    color: ${c.text.primary};
  }

  .rte-body .tiptap h1 {
    font-size: 1.8rem;
    color: ${c.text.primary};
  }
  .rte-body .tiptap h2 {
    font-size: 1.42rem;
    color: ${c.text.dark};
  }
  .rte-body .tiptap h3 {
    font-size: 1.18rem;
    color: ${c.text.subtle};
  }

  .rte-body .tiptap ul,
  .rte-body .tiptap ol {
    margin: 0.45em 0;
    padding-left: 1.55rem;
  }

  .rte-body .tiptap li::marker {
    color: var(--rte-violet);
  }

  .rte-body .tiptap blockquote {
    margin: 0.65em 0;
    padding: 10px 14px 10px 16px;
    border-left: 4px solid var(--rte-violet);
    border-radius: 0 10px 10px 0;
    background: var(--rte-violet-soft);
    color: ${c.text.muted};
    font-style: italic;
  }

  .rte-body .tiptap pre {
    margin: 0.65em 0;
    padding: 14px 16px;
    border-radius: 12px;
    background: ${c.gradient.darkPanel};
    color: ${c.slate[200]};
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    box-shadow: inset 0 1px 0 ${tokens.rgba.slate900_06};
    border: 1px solid ${c.text.subtle};
  }

  .rte-body .tiptap code {
    padding: 0.12em 0.4em;
    border-radius: 6px;
    background: linear-gradient(180deg, ${c.slate[100]} 0%, ${c.neutral[200]} 100%);
    font-size: 0.88em;
    color: ${c.primary.main};
    border: 1px solid ${c.border.default};
  }

  .rte-body .tiptap pre code {
    padding: 0;
    background: none;
    color: inherit;
    border: none;
  }

  .rte-body .tiptap hr {
    margin: 1.15em 0;
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rte-border-strong), transparent);
  }

  .rte-body .tiptap img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 24px ${tokens.rgba.slate900_12};
    border: 1px solid var(--rte-border);
  }

  .rte-body .tiptap .rte-image-wrap {
    position: relative;
    display: inline-flex;
    max-width: 100%;
    margin: 0.5em 0;
    line-height: 0;
    border: 1px dashed ${tokens.rgba.border_24};
    border-radius: 12px;
    padding: 2px;
  }

  .rte-body .tiptap .rte-image-wrap .rte-img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .rte-body .tiptap .rte-image-wrap .rte-image-resize-handle {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: ${c.info.main};
    border: 1px solid ${c.white};
    cursor: nwse-resize;
    box-shadow: 0 2px 6px ${tokens.rgba.slate900_42};
    touch-action: none;
  }

  .rte-body .tiptap .rte-image-wrap .rte-image-resize-handle::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-right: 2px solid ${c.white};
    border-bottom: 2px solid ${c.white};
  }

  .rte-body .tiptap .rte-image-wrap .rte-image-size-badge {
    position: absolute;
    left: 6px;
    bottom: 6px;
    padding: 2px 6px;
    border-radius: 6px;
    background: ${tokens.rgba.slate900_48};
    color: ${c.white};
    font-size: 11px;
    font-weight: 700;
    line-height: 1.2;
    pointer-events: none;
    user-select: none;
    letter-spacing: 0.01em;
  }

  .rte-body .tiptap a {
    color: var(--rte-violet);
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
  }

  .rte-body .tiptap a:hover {
    color: var(--rte-violet-600);
  }

  .rte-body .tiptap .rte-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing(1.25)};
    margin: 0.75em 0;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid var(--rte-border);
    background: linear-gradient(180deg, ${c.surface.elevated} 0%, ${c.neutral[100]} 100%);
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
    user-select: none;
  }

  .rte-body .tiptap .rte-radio-option {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: ${c.text.primary};
  }

  .rte-body .tiptap .rte-radio-option:hover .rte-radio-label {
    color: var(--rte-violet-600);
  }

  .rte-body .tiptap .rte-radio-option input[type='radio'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${c.info.main};
    cursor: pointer;
  }

  .rte-body .tiptap .rte-radio-label {
    color: ${c.text.primary};
    font-weight: 400;
    line-height: 1.3;
    user-select: none;
  }

  .rte-body .tiptap .rte-radio-question,
  .rte-body .tiptap p:has(+ .rte-radio-group),
  .rte-body .tiptap p:has(+ [data-type='radio-group']) {
    font-weight: 800;
    color: ${c.text.primary};
  }

  .rte-body .tiptap .rte-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing(1.25, 2.5)};
    margin: 0.65em 0;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid var(--rte-border);
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.slate[100]} 100%);
    box-shadow: inset 0 1px 0 ${tokens.rgba.white_92};
    user-select: none;
  }

  .rte-body .tiptap .rte-checkbox-option {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin: 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 550;
    color: ${c.text.subtle};
  }

  .rte-body .tiptap .rte-checkbox-option:hover .rte-checkbox-label {
    color: var(--rte-violet-600);
  }

  .rte-body .tiptap .rte-checkbox-option input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--rte-violet);
    cursor: pointer;
    border-radius: 4px;
  }

  .rte-body .tiptap .rte-checkbox-label {
    line-height: 1.3;
    user-select: none;
  }

  .rte-body .tiptap .rte-drag-drop-fill {
    margin: 0.65em 0;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid var(--rte-border);
    background: linear-gradient(165deg, ${c.surface.elevated} 0%, ${c.slate[100]} 100%);
    box-shadow: 0 4px 14px ${tokens.rgba.slate900_04};
    user-select: none;
    position: relative;
  }

  .rte-body .tiptap .rte-drag-drop-fill__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid ${c.border.default};
    background: ${tokens.rgba.white_92};
    color: ${c.text.secondary};
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }

  .rte-body .tiptap .rte-drag-drop-fill__close:hover {
    background: ${tokens.rgba.error_28};
    border-color: ${tokens.rgba.error_45};
    color: ${c.error.main};
  }

  .rte-body .tiptap .rte-drag-drop-fill__badge {
    display: inline-block;
    margin-bottom: 8px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--rte-violet-600);
    background: var(--rte-violet-soft);
    border: 1px solid var(--rte-violet-mid);
  }

  .rte-body .tiptap .rte-drag-drop-fill__excerpt {
    font-size: 14px;
    line-height: 1.55;
    color: var(--rte-text);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .rte-body .tiptap .rte-drag-drop-fill__instruction {
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.55;
    color: var(--rte-text);
  }

  .rte-body .tiptap .rte-drag-drop-fill__column-head {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.subtle};
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${tokens.rgba.border_24};
  }

  .rte-body .tiptap .rte-drag-drop-fill__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${theme.spacing(2.5)};
    align-items: start;
  }

  .rte-body .tiptap .rte-drag-drop-fill__targets {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .rte-body .tiptap .rte-drag-drop-fill__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 100px;
    gap: ${theme.spacing(1.25)};
    align-items: center;
  }

  .rte-body .tiptap .rte-drag-drop-fill__row-label {
    font-size: 13px;
    line-height: 1.45;
    color: var(--rte-text);
    font-weight: 600;
  }

  .rte-body .tiptap .rte-drag-drop-fill__drop {
    min-height: 30px;
    border-radius: 8px;
    border: 1px dashed ${tokens.rgba.border_24};
    background: ${tokens.rgba.white_92};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
  }

  .rte-body .tiptap .rte-drag-drop-fill__drop-num {
    font-size: 13px;
    font-weight: 700;
    color: ${c.text.secondary};
  }

  .rte-body .tiptap .rte-drag-drop-fill__question {
    font-size: 14px;
    line-height: 1.55;
    color: var(--rte-text);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .rte-body .tiptap .rte-drag-drop-fill__blank {
    display: inline-block;
    width: 110px;
    height: 30px;
    margin: 0 6px;
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid ${tokens.rgba.border_24};
    background: ${tokens.rgba.white_92};
    font-size: 13px;
    color: ${c.text.primary};
    vertical-align: baseline;
  }

  .rte-body .tiptap .rte-drag-drop-fill__blank::placeholder {
    color: ${c.slate[400]};
    font-weight: 600;
  }

  .rte-body .tiptap .rte-drag-drop-fill__pool {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  .rte-body .tiptap .rte-drag-drop-fill__pool-label {
    font-size: 12px;
    font-weight: 700;
    color: ${c.text.secondary};
    margin-bottom: 8px;
  }

  .rte-body .tiptap .rte-drag-drop-fill__pool-items {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  }

  .rte-body .tiptap .rte-drag-drop-fill__chip {
    display: block;
    padding: 8px 10px;
    border-radius: 10px;
    background: ${tokens.rgba.white_92};
    border: 1px solid ${c.border.default};
    box-shadow: ${tokens.shadows.md};
    font-size: 12px;
    font-weight: 650;
    color: ${c.text.subtle};
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .rte-body .tiptap .rte-blank-answer {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    padding: 3px 8px;
    border-radius: 10px;
    border: 1px solid ${tokens.rgba.border_24};
    background: ${tokens.rgba.white_92};
    vertical-align: baseline;
    user-select: none;
  }

  .rte-body .tiptap .rte-blank-answer__id {
    font-size: 11px;
    font-weight: 800;
    color: ${c.text.subtle};
    padding: 2px 6px;
    border-radius: 999px;
    background: ${c.info.bgMuted};
    border: 1px solid ${c.info.border};
  }

  .rte-body .tiptap .rte-blank-answer__line {
    display: inline-block;
    min-width: 88px;
    border-bottom: 2px solid ${c.text.muted};
    transform: translateY(-1px);
    color: transparent;
  }

  .rte-body .tiptap .rte-drag-drop-fill__meta {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--rte-muted);
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .rte-body .tiptap .rte-drag-drop-fill__meta-label {
    margin-bottom: 4px;
    color: ${c.text.muted};
  }

  .rte-body .tiptap .rte-drag-drop-fill__meta-line {
    font-weight: 600;
  }

  .rte-body .tiptap .rte-drag-drop-fill__list {
    margin: 0;
    padding-left: 18px;
  }

  .rte-body .tiptap .rte-drag-drop-fill__list li {
    margin: 0;
    line-height: 1.45;
  }

  .rte-body .tiptap table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    margin: 0.65em 0;
    overflow: hidden;
    border-radius: 0;
    border: 1px solid var(--rte-border);
    box-shadow: 0 4px 14px ${tokens.rgba.slate900_04};
    table-layout: fixed;
  }

  /* TipTap table wrapper (needed for resizing + horizontal scroll) */
  .rte-body .tiptap .tableWrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }

  .rte-body .tiptap th,
  .rte-body .tiptap td {
    border: 1px solid var(--rte-border);
    padding: 8px 12px;
    vertical-align: top;
    min-width: 56px;
    position: relative;
  }

  .rte-body .tiptap th {
    background: linear-gradient(180deg, ${c.surface.muted} 0%, ${c.slate[100]} 100%);
    font-weight: 650;
    text-align: left;
    color: ${c.text.subtle};
  }

  .rte-body .tiptap td {
    background: var(--rte-surface);
  }

  .rte-body .tiptap .column-resize-handle {
    position: absolute;
    right: -5px;
    top: 0;
    bottom: -2px;
    width: 10px;
    background: transparent;
    opacity: 0.08;
    pointer-events: auto;
    cursor: col-resize;
    transition: opacity 0.12s ease;
  }

  .rte-body .tiptap .column-resize-handle::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background: var(--rte-violet);
    border-radius: 999px;
    opacity: 0.9;
  }

  .rte-body .tiptap .selectedCell .column-resize-handle,
  .rte-body .tiptap th:hover .column-resize-handle,
  .rte-body .tiptap td:hover .column-resize-handle {
    opacity: 0.4;
  }

  .rte-body .tiptap table:hover .column-resize-handle {
    opacity: 0.16;
  }

  .rte-body .tiptap.resize-cursor {
    cursor: col-resize;
  }

  .rte-body .tiptap.rte-resize-row-cursor {
    cursor: row-resize;
  }

  .rte-body .tiptap .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: var(--rte-violet-ring);
    pointer-events: none;
  }
`

/** Rich editor expanded-mode background for use outside the portal */
export const RichTextEditorExpandBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1240;
  background: ${tokens.rgba.slate900_42};
  backdrop-filter: blur(3px);
`
