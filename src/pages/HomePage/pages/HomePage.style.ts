import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const HomePageRoot = styled.div`
  .content__toolbar {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  }

  .content__toolbar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
  }

  .content__section-title {
    margin: 0;
    font-size: clamp(1.6rem, 2vw, 2rem);
    font-weight: 700;
    color: ${c.text.primary};
  }

  .content__primary-button {
    min-height: 48px;
    padding: 0 18px;
    border-radius: 14px;
    background: ${c.gradient.primary};
    color: ${c.surface.default};
    font-weight: 700;
    text-transform: none;
  }

  .content__toolbar-filters {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(2)};
    flex-wrap: wrap;
  }

  .content__toolbar-search {
    width: min(100%, 320px);
  }

  .content__toolbar-search .MuiOutlinedInput-root,
  .content__toolbar-select .MuiOutlinedInput-root {
    min-height: 48px;
    border-radius: 14px;
    background: ${c.surface.default};
  }

  .content__toolbar-filter-group {
    display: flex;
    gap: ${theme.spacing(1.5)};
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .content__toolbar-select {
    min-width: 170px;
    width: auto;
    flex: 0 0 auto;
  }

  .content__section {
    margin-top: 28px;
  }

  .content__screen-reader-title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .content__results-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    margin-bottom: 18px;
    flex-wrap: wrap;
    color: ${c.text.primary};
    font-weight: 600;
  }

  .content__results-meta,
  .exam-card__category {
    color: ${c.text.secondary};
    font-size: 0.95rem;
    font-weight: 500;
  }

  .content__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${theme.spacing(3)};
  }

  .exam-card {
    overflow: hidden;
    border: 1px solid ${c.border.medium};
    border-radius: 20px;
    background: ${c.surface.muted};
  }

  .exam-card__visual {
    position: relative;
    min-height: 238px;
    margin: 14px;
    border-radius: 18px;
    overflow: hidden;
  }

  .exam-card__orb {
    position: absolute;
    border-radius: 50%;
    background: ${tokens.rgba.white_92};
  }

  .exam-card__orb--large {
    top: 24px;
    left: 24px;
    width: 88px;
    height: 88px;
  }

  .exam-card__orb--small {
    right: 42px;
    bottom: 28px;
    width: 56px;
    height: 56px;
  }

  .exam-card__monitor {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 44%;
    aspect-ratio: 1.25;
    border: 10px solid ${tokens.rgba.white_92};
    border-bottom-width: 16px;
    border-radius: 14px;
    transform: translate(-50%, -56%);
  }

  .exam-card__desk {
    position: absolute;
    left: 50%;
    bottom: 32px;
    width: 56%;
    height: 14px;
    border-radius: 999px;
    background: ${tokens.rgba.white_92};
    transform: translateX(-50%);
  }

  .exam-card__body {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    padding: 0 16px 16px;
  }

  .exam-card__header {
    display: flex;
    justify-content: space-between;
    gap: ${theme.spacing(1.5)};
    align-items: flex-start;
  }

  .exam-card__title {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.35;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .exam-card__status {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 12px;
    font-weight: 600;
  }

  .exam-card__status--active {
    border: 1px solid ${c.success.border};
    background: ${c.success.bgSoft};
    color: ${c.success.darker};
  }

  .exam-card__status--draft {
    border: 1px solid ${c.warning.border};
    background: ${c.surface.default}7ed;
    color: ${c.orange.dark};
  }

  .exam-card__status--archived {
    border: 1px solid ${c.border.strong};
    background: ${c.surface.muted};
    color: ${c.text.muted};
  }

  .exam-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1, 2.25)};
    margin: 0;
    padding: 0;
    list-style: none;
    color: ${c.text.muted};
  }

  .exam-card__meta-item {
    position: relative;
  }

  .exam-card__meta-item:not(:last-of-type)::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    width: 1px;
    height: 18px;
    background: ${c.border.strong};
    transform: translateY(-50%);
  }

  .exam-card__date {
    margin: 0;
    color: ${c.text.subtle};
  }

  .exam-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.25)};
    align-items: center;
  }

  .exam-card__action {
    min-height: 42px;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.primary};
    text-transform: none;
  }

  .exam-card__action--danger {
    border-color: ${c.error.border};
    color: ${c.error.main};
  }

  .exam-card__icon-action.MuiIconButton-root {
    width: 42px;
    height: 42px;
    padding: 0;
    border: 1px solid ${c.border.soft};
    border-radius: 12px;
    background: ${c.surface.default};
    color: ${c.text.secondary};
  }

  .exam-card__icon-action.MuiIconButton-root:hover {
    background: ${c.surface.muted};
    border-color: ${c.border.strong};
  }

  .exam-card__icon-action--danger.MuiIconButton-root {
    border-color: ${c.error.border};
    color: ${c.error.main};
  }

  .exam-card__icon-action--danger.MuiIconButton-root:hover {
    background: ${c.error.bg};
    border-color: ${c.error.borderStrong};
    color: ${c.error.bright};
  }

  .exam-card__icon-action.MuiIconButton-root.Mui-disabled {
    border-color: ${c.neutral[200]};
    color: ${c.neutral.placeholder};
    background: ${c.surface.default};
  }

  .exam-card__icon-svg {
    width: 20px;
    height: 20px;
  }

  .content__empty-state {
    padding: 28px;
    border: 1px dashed ${c.border.strong};
    border-radius: 20px;
    background: ${tokens.rgba.white_92};
    color: ${c.text.muted};
    text-align: center;
  }

  @media (max-width: 1380px) {
    .content__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .content__grid {
      grid-template-columns: 1fr;
    }
  }
`
