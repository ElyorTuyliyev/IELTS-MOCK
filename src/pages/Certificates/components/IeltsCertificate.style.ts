import styled from '@emotion/styled'

const BORDER = '#000000'
const SHADE = '#d4d4d4'
const TEXT = '#000000'
const LABEL = '#1a1a1a'

export const IeltsCertificateRoot = styled.div`
  .ielts-trf {
    position: relative;
    z-index: 0;
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    padding: 20px 22px 18px;
    border: 1px solid ${BORDER};
    font-family: Arial, Helvetica, 'Segoe UI', sans-serif;
    font-size: 9px;
    color: ${TEXT};
    line-height: 1.25;
    box-sizing: border-box;
    background-color: #e8ede8;
  }

  .ielts-trf > * {
    position: relative;
    z-index: 1;
  }

  /** Repeating IELTS diagonal watermark (similar to printed TRFs). */
  .ielts-trf::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.07;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='92'%3E%3Ctext x='12' y='54' transform='rotate(-22 65 46)' fill='%23000000' font-family='Arial,Helvetica,sans-serif' font-size='15' font-weight='700'%3EIELTS%3C/text%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  .ielts-trf *,
  .ielts-trf *::before,
  .ielts-trf *::after {
    box-sizing: border-box;
  }

  /* ── Header ── */
  .ielts-trf__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }

  .ielts-trf__logo {
    margin: 0;
    font-size: 42px;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
    color: ${TEXT};
  }

  .ielts-trf__tm {
    font-size: 0.35em;
    font-weight: 400;
    vertical-align: super;
    margin-left: 1px;
  }

  .ielts-trf__form-title {
    margin: 4px 0 0;
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT};
  }

  .ielts-trf__type-box {
    flex-shrink: 0;
    min-width: 120px;
    padding: 10px 14px;
    border: 1.5px solid ${BORDER};
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    align-self: flex-start;
  }

  .ielts-trf__note {
    margin: 0 0 10px;
    max-width: 95%;
  }

  .ielts-trf__note-line {
    margin: 0 0 3px;
    font-size: 7.5px;
    line-height: 1.38;
    font-style: italic;
    color: ${TEXT};
    font-weight: 400;
  }

  .ielts-trf__note-line:last-child {
    margin-bottom: 0;
  }

  /* ── Reference row ── */
  .ielts-trf__ref-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border: 1px solid ${BORDER};
    margin-bottom: 12px;
  }

  .ielts-trf__ref-row .ielts-trf__field {
    border-right: 1px solid ${BORDER};
  }

  .ielts-trf__ref-row .ielts-trf__field:last-child {
    border-right: 0;
  }

  /* ── Section titles ── */
  .ielts-trf__section-title {
    margin: 10px 0 6px;
    padding-bottom: 2px;
    font-size: 10px;
    font-weight: 700;
    color: ${TEXT};
  }

  .ielts-trf__candidate-section {
    border-top: 1px solid ${BORDER};
    border-bottom: 1px solid ${BORDER};
    padding-bottom: 2px;
    margin-bottom: 6px;
  }

  .ielts-trf__candidate-section .ielts-trf__section-title {
    margin-top: 6px;
    border-bottom: 0;
  }

  /* ── Fields ── */
  .ielts-trf__field {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ielts-trf__field-label {
    display: block;
    font-size: 7.5px;
    font-weight: 400;
    color: ${LABEL};
    padding: 2px 4px 1px;
    line-height: 1.2;
  }

  .ielts-trf__field-value {
    min-height: 22px;
    padding: 4px 6px;
    border-top: 1px solid ${BORDER};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    word-break: break-word;
  }

  .ielts-trf__field-value--shaded {
    background: ${SHADE};
  }

  .ielts-trf__field-value--score {
    min-height: 28px;
    justify-content: center;
    font-size: 13px;
    text-align: center;
  }

  .ielts-trf__field--full-row {
    width: 100%;
  }

  .ielts-trf__field--full-row .ielts-trf__field-value {
    width: 100%;
  }

  /* ── Candidate block ── */
  .ielts-trf__candidate-block {
    border: 1px solid ${BORDER};
    margin-bottom: 0;
  }

  .ielts-trf__candidate-fields {
    flex: 1;
    min-width: 0;
  }

  .ielts-trf__row {
    display: grid;
    border-bottom: 1px solid ${BORDER};
  }

  .ielts-trf__row:last-child {
    border-bottom: 0;
  }

  .ielts-trf__row--photo-row {
    grid-template-columns: 1fr 112px;
    align-items: stretch;
  }

  .ielts-trf__name-column {
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-right: 1px solid ${BORDER};
  }

  .ielts-trf__name-column .ielts-trf__field--full-row {
    border-bottom: 1px solid ${BORDER};
    flex: 1;
  }

  .ielts-trf__name-column .ielts-trf__field--full-row:last-child {
    border-bottom: none;
  }

  .ielts-trf__row--3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .ielts-trf__row--1 {
    grid-template-columns: 1fr;
  }

  .ielts-trf__row--1 .ielts-trf__field {
    border-right: none;
  }

  .ielts-trf__row .ielts-trf__field {
    border-right: 1px solid ${BORDER};
  }

  .ielts-trf__row .ielts-trf__field:last-child {
    border-right: 0;
  }

  .ielts-trf__photo {
    flex-shrink: 0;
    width: 112px;
    display: flex;
    align-items: stretch;
    background: #fff;
  }

  .ielts-trf__photo-inner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8e8e8;
    min-height: 132px;
    border-left: 0;
  }

  .ielts-trf__photo-icon {
    font-size: 36px;
    opacity: 0.35;
    filter: grayscale(1);
  }

  .ielts-trf__photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    filter: grayscale(1);
  }


  /* ── Test results ── */
  .ielts-trf__scores-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    border: 1px solid ${BORDER};
    margin-bottom: 0;
    background: rgba(255, 255, 255, 0.35);
  }

  .ielts-trf__score-field {
    display: flex;
    flex-direction: column;
    border-right: 1px solid ${BORDER};
    min-width: 0;
  }

  .ielts-trf__score-field:last-child {
    border-right: 0;
  }

  .ielts-trf__score-field .ielts-trf__field-label {
    font-size: 7px;
    padding: 2px 3px;
    text-align: center;
    min-height: 22px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    text-align: center;
    line-height: 1.15;
  }

  /* ── Administrator ── */
  .ielts-trf__admin-row {
    display: flex;
    gap: 0;
    border: 1px solid ${BORDER};
    margin-bottom: 0;
    min-height: 108px;
    margin-top: 10px;
  }

  .ielts-trf__comments {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-right: 1px solid ${BORDER};
    background: rgba(255, 255, 255, 0.35);
  }

  .ielts-trf__comments .ielts-trf__field-label {
    padding: 3px 5px;
    font-weight: 700;
  }

  .ielts-trf__comments-box {
    flex: 1;
    min-height: 72px;
    border-top: 1px solid ${BORDER};
    background: rgba(255, 255, 255, 0.5);
  }

  .ielts-trf__stamps {
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    background: rgba(255, 255, 255, 0.35);
  }

  .ielts-trf__stamp-box {
    width: 118px;
    border-right: 1px solid ${BORDER};
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
  }

  .ielts-trf__stamp-box:last-child {
    border-right: 0;
  }

  .ielts-trf__stamp-box-label {
    display: block;
    font-size: 7px;
    font-weight: 400;
    color: ${LABEL};
    text-align: center;
    padding: 3px 4px 2px;
    line-height: 1.15;
  }

  .ielts-trf__stamp-box-inner {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px 8px;
    min-height: 86px;
    border-top: 1px solid ${BORDER};
  }

  /** Rectangular ink-style centre stamp */
  .ielts-trf__centre-stamp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 3px;
    width: 100%;
    max-width: 104px;
    min-height: 78px;
    padding: 8px 10px 10px;
    border: 2px solid #2a2a2a;
    font-size: 6.5px;
    font-weight: 700;
    line-height: 1.2;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.9);
  }

  .ielts-trf__centre-stamp-logo {
    display: block;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    flex-shrink: 0;
    object-fit: contain;
    background: #fff;
  }

  .ielts-trf__centre-stamp-line1 {
    font-size: 6px;
    letter-spacing: 0.04em;
    line-height: 1.2;
    word-break: break-word;
  }

  .ielts-trf__centre-stamp-line2 {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.06em;
    margin-top: 1px;
  }

  /** Circular validation seal */
  .ielts-trf__validation-stamp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 78px;
    height: 78px;
    border: 2px double #1a1a1a;
    border-radius: 50%;
    text-align: center;
    padding: 8px 6px 10px;
    background: rgba(255, 255, 255, 0.95);
  }

  .ielts-trf__validation-stamp-centre {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.06em;
    line-height: 1;
  }

  .ielts-trf__validation-stamp-ring {
    margin-top: 5px;
    font-size: 4.8px;
    font-weight: 700;
    letter-spacing: 0.14em;
    line-height: 1.15;
    text-align: center;
  }

  /* ── Signature row ── */
  .ielts-trf__sign-row {
    display: flex;
    align-items: flex-end;
    gap: 0;
    border: 1px solid ${BORDER};
    border-top: 0;
    padding: 0;
  }

  .ielts-trf__signature {
    flex: 1;
    padding-bottom: 4px;
  }

  .ielts-trf__signature .ielts-trf__field-label {
    padding: 3px 5px 0;
  }

  .ielts-trf__signature-line {
    min-height: 28px;
    padding: 2px 8px 4px;
    display: flex;
    align-items: flex-end;
  }

  .ielts-trf__signature-script {
    font-family: 'Brush Script MT', 'Segoe Script', cursive;
    font-size: 18px;
    color: #1a1a6e;
    line-height: 1;
  }

  .ielts-trf__issued-date {
    width: 120px;
    flex-shrink: 0;
    border-left: 1px solid ${BORDER};
  }

  .ielts-trf__issued-date .ielts-trf__field-value {
    min-height: 32px;
  }

  /* ── TRF number ── */
  .ielts-trf__trf-number-row {
    display: flex;
    align-items: stretch;
    border: 1px solid ${BORDER};
    border-top: 0;
    margin-bottom: 14px;
  }

  .ielts-trf__trf-number-row .ielts-trf__field-label {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-right: 1px solid ${BORDER};
    white-space: nowrap;
    font-size: 7.5px;
  }

  .ielts-trf__trf-number {
    flex: 1;
    border-top: 0 !important;
    min-height: 26px;
    font-size: 11px;
    letter-spacing: 0.06em;
  }

  /* ── Partner logos (official TRF footer) ── */
  .ielts-trf__partners {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 4px 10px;
    border-top: 1px solid ${BORDER};
    margin-top: 2px;
  }

  /** British Council wordmark + 2×2 dots */
  .ielts-trf__partner--bc {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .ielts-trf__bc-mark {
    display: grid;
    grid-template-columns: 5px 5px;
    gap: 4px;
    line-height: 0;
  }

  .ielts-trf__bc-mark span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #002855;
  }

  .ielts-trf__partner-bc-name {
    font-size: 10px;
    font-weight: 700;
    color: #002855;
    letter-spacing: 0.02em;
    line-height: 1.05;
  }

  /** IDP IELTS Australia */
  .ielts-trf__partner--idp {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
    min-width: 100px;
  }

  .ielts-trf__idp-wordmark {
    font-size: 26px;
    font-weight: 300;
    letter-spacing: -0.04em;
    line-height: 0.85;
    color: #e42313;
    font-family: Arial, Helvetica, sans-serif;
    text-transform: lowercase;
  }

  .ielts-trf__idp-sub {
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${TEXT};
  }

  /** Cambridge English */
  .ielts-trf__partner--cambridge {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    max-width: 44%;
    min-width: 0;
  }

  .ielts-trf__cambridge-crest {
    flex-shrink: 0;
    width: 36px;
    height: 40px;
    border: 1.5px solid #7a9949;
    border-radius: 2px;
    background: linear-gradient(160deg, #f9faf5 0%, #e8eeda 48%, #d4dfb8 100%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  }

  .ielts-trf__cambridge-text {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    line-height: 1.1;
  }

  .ielts-trf__cambridge-line1 {
    font-size: 8.5px;
    font-weight: 800;
    color: #3d4e1f;
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }

  .ielts-trf__cambridge-line2 {
    font-size: 8px;
    font-weight: 600;
    color: #556b2f;
  }

  .ielts-trf__cambridge-line3 {
    font-size: 6px;
    font-weight: 400;
    color: ${TEXT};
    margin-top: 2px;
  }

  .ielts-trf__verify-footer {
    margin: 6px 0 0;
    font-size: 7px;
    line-height: 1.38;
    color: ${TEXT};
    text-align: center;
  }

  .ielts-trf__mock-disclaimer {
    margin: 8px 0 0;
    font-size: 6.5px;
    color: #888;
    text-align: center;
    font-style: italic;
  }

  @media print {
    .ielts-trf {
      max-width: none;
      width: 100%;
      border: none;
      padding: 0;
      font-size: 9px;
      box-shadow: none;
    }

    .ielts-trf__ref-row {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .ielts-trf__scores-row {
      grid-template-columns: repeat(6, 1fr);
    }

    .ielts-trf__row--3 {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .ielts-trf__row--photo-row {
      grid-template-columns: 1fr 112px;
    }

    .ielts-trf__row--1 {
      grid-template-columns: 1fr;
    }

    .ielts-trf__admin-row {
      flex-direction: row;
    }

    .ielts-trf__partners {
      flex-direction: row;
    }

    .ielts-trf__field-value--shaded {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background: ${SHADE} !important;
    }

    .ielts-trf__mock-disclaimer {
      display: block;
    }
  }

  @media (max-width: 640px) {
    .ielts-trf {
      padding: 12px;
      font-size: 8px;
    }

    .ielts-trf__logo {
      font-size: 28px;
    }

    .ielts-trf__ref-row,
    .ielts-trf__scores-row {
      grid-template-columns: 1fr;
    }

    .ielts-trf__ref-row .ielts-trf__field,
    .ielts-trf__score-field {
      border-right: 0;
      border-bottom: 1px solid ${BORDER};
    }

    .ielts-trf__row--3 {
      grid-template-columns: 1fr;
    }

    .ielts-trf__row--photo-row {
      grid-template-columns: 1fr;
    }

    .ielts-trf__name-column {
      border-right: none;
      border-bottom: 1px solid ${BORDER};
    }

    .ielts-trf__photo {
      width: 100%;
      border-top: 0;
    }

    .ielts-trf__photo-inner {
      min-height: 100px;
    }

    .ielts-trf__admin-row {
      flex-direction: column;
    }

    .ielts-trf__comments {
      border-right: none;
      border-bottom: 1px solid ${BORDER};
    }

    .ielts-trf__stamps {
      flex-direction: row;
      justify-content: stretch;
    }

    .ielts-trf__stamp-box {
      flex: 1;
      width: auto;
    }

    .ielts-trf__partners {
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
    }

    .ielts-trf__partner--cambridge {
      max-width: 100%;
    }
  }
`
