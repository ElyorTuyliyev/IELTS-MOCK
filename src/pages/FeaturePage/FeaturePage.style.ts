import styled from '@emotion/styled'

export const FeaturePageRoot = styled.div`
  .feature-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .feature-page__hero {
    padding: 28px;
    border: 1px solid #dbe2f1;
    border-radius: 24px;
    background:
      radial-gradient(circle at top right, rgba(14, 165, 233, 0.16), transparent 28%),
      linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  }

  .feature-page__eyebrow {
    margin: 0 0 10px;
    color: #0ea5e9;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .feature-page__title {
    margin: 0;
    color: #0f172a;
    font-size: clamp(1.8rem, 2vw, 2.3rem);
    font-weight: 700;
  }

  .feature-page__description {
    max-width: 720px;
    margin: 12px 0 0;
    color: #475569;
    line-height: 1.7;
  }

  .feature-page__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .feature-page__card {
    padding: 22px;
    border: 1px solid #dbe2f1;
    border-radius: 20px;
    background: #ffffff;
  }

  .feature-page__card-title {
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .feature-page__card-text {
    margin: 0;
    color: #64748b;
    line-height: 1.6;
  }

  @media (max-width: 1100px) {
    .feature-page__grid {
      grid-template-columns: 1fr;
    }
  }
`
