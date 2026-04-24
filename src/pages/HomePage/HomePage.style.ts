import styled from '@emotion/styled'

export const HomePageRoot = styled.div`
  .content__toolbar {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .content__toolbar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .content__section-title {
    margin: 0;
    font-size: clamp(1.6rem, 2vw, 2rem);
    font-weight: 700;
    color: #0f172a;
  }

  .content__primary-button {
    min-height: 48px;
    padding: 0 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
    font-weight: 700;
    text-transform: none;
  }

  .content__toolbar-filters {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .content__toolbar-search {
    width: min(100%, 320px);
  }

  .content__toolbar-search .MuiOutlinedInput-root,
  .content__toolbar-select .MuiOutlinedInput-root,
  .content__category-input .MuiOutlinedInput-root {
    min-height: 48px;
    border-radius: 14px;
    background: #ffffff;
  }

  .content__toolbar-filter-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .content__toolbar-select {
    min-width: 170px;
  }

  .content__category-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .content__category-input {
    width: 180px;
  }

  .content__secondary-button {
    min-height: 48px;
    padding: 0 16px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
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
    gap: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;
    color: #0f172a;
    font-weight: 600;
  }

  .content__results-meta,
  .exam-card__category {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .content__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .exam-card {
    overflow: hidden;
    border: 1px solid #dbe2f1;
    border-radius: 20px;
    background: #f8fafc;
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
    background: rgba(255, 255, 255, 0.28);
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
    border: 10px solid rgba(255, 255, 255, 0.7);
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
    background: rgba(255, 255, 255, 0.78);
    transform: translateX(-50%);
  }

  .exam-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 16px 16px;
  }

  .exam-card__header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .exam-card__title {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.35;
    font-weight: 700;
    color: #0f172a;
  }

  .exam-card__status {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 12px;
    font-weight: 600;
  }

  .exam-card__status--active {
    border: 1px solid #86efac;
    background: #f0fdf4;
    color: #15803d;
  }

  .exam-card__status--draft {
    border: 1px solid #fdba74;
    background: #fff7ed;
    color: #ea580c;
  }

  .exam-card__status--archived {
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
  }

  .exam-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: #475569;
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
    background: #cbd5e1;
    transform: translateY(-50%);
  }

  .exam-card__date {
    margin: 0;
    color: #334155;
  }

  .exam-card__action {
    min-height: 42px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    text-transform: none;
  }

  .content__empty-state {
    padding: 28px;
    border: 1px dashed #cbd5e1;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
    color: #475569;
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
