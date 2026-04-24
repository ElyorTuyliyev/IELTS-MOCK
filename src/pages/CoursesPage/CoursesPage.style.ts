import styled from '@emotion/styled'

export const CoursesPageRoot = styled.div`
  .courses-page {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .courses-page__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .courses-page__title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.65rem, 2vw, 2rem);
    font-weight: 700;
  }

  .courses-page__primary-button {
    min-height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
    font-weight: 700;
    text-transform: none;
  }

  .courses-panel {
    display: flex;
    flex-direction: column;
    gap: 26px;
    padding: 24px;
    border: 1px solid #dbe2f1;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .courses-panel__toolbar {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .courses-panel__search {
    width: min(100%, 320px);
  }

  .courses-panel__search .MuiOutlinedInput-root,
  .courses-panel__select .MuiOutlinedInput-root {
    min-height: 48px;
    border-radius: 14px;
    background: #ffffff;
  }

  .courses-panel__search-icon {
    color: #334155;
    font-size: 1.15rem;
    line-height: 1;
  }

  .courses-panel__actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .courses-panel__select {
    min-width: 170px;
  }

  .courses-panel__ghost-button {
    min-height: 48px;
    padding: 0 18px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }

  .courses-panel__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
  }

  .course-card {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 14px;
    border: 1px solid #dbe2f1;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.03);
  }

  .course-card__visual {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 190px;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(90deg, var(--course-from, #7c3aed) 0%, var(--course-to, #8b5cf6) 100%);
  }

  .course-card__visual::before,
  .course-card__visual::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  .course-card__visual::before {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.85) 0, rgba(0, 0, 0, 0.25) 62%, transparent 100%);
  }

  .course-card__visual::after {
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.16) 0, transparent 62%);
  }

  .course-card__badge {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 62px;
    height: 62px;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.28);
    color: #ffffff;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
    backdrop-filter: blur(6px);
  }

  .course-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .course-card__title {
    margin: 0;
    color: #111827;
    font-size: 1.06rem;
    line-height: 1.35;
    font-weight: 700;
  }

  .course-card__duration {
    margin: 0;
    color: #475569;
    font-size: 0.98rem;
    line-height: 1.5;
  }

  .course-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 18px;
    color: #334155;
    font-weight: 500;
  }

  .course-card__meta-item {
    position: relative;
  }

  .course-card__meta-item:not(:last-of-type)::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    width: 1px;
    height: 22px;
    background: #dbe2f1;
    transform: translateY(-50%);
  }

  .course-card__date {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #334155;
    font-weight: 500;
  }

  .course-card__date-icon {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border: 2px solid #334155;
    border-radius: 6px;
    font-size: 0.7rem;
    line-height: 1;
  }

  .course-card__action {
    min-height: 42px;
    border: 1px solid #d8def0;
    border-radius: 12px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }

  .courses-panel__empty {
    padding: 36px 24px;
    border: 1px dashed #cbd5e1;
    border-radius: 18px;
    background: rgba(248, 250, 252, 0.7);
    color: #64748b;
    text-align: center;
  }

  @media (max-width: 1380px) {
    .courses-panel__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .courses-panel {
      padding: 18px;
    }

    .courses-panel__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .course-card__visual {
      min-height: 176px;
    }
  }
`
