import styled from '@emotion/styled'

export const SignUpPageRoot = styled.div`
  .sign-in-page {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
    min-height: 100vh;
    padding: 28px;
    background: #353b4c;
  }

  .sign-in-page__hero,
  .sign-in-page__form-section {
    min-width: 0;
  }

  .sign-in-page__hero {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 32px;
    padding: 34px 28px 28px;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 62%, rgba(159, 122, 234, 0.25), transparent 26%),
      linear-gradient(180deg, #f0ebff 0%, #f6f3ff 55%, #efecff 100%);
  }

  .sign-in-page__hero::before {
    content: '';
    position: absolute;
    inset: auto -4% 14% -8%;
    height: 280px;
    background:
      linear-gradient(rgba(145, 120, 230, 0.14) 1px, transparent 1px),
      linear-gradient(90deg, rgba(145, 120, 230, 0.14) 1px, transparent 1px);
    background-size: 52px 52px;
    transform: perspective(1000px) rotateX(78deg);
    transform-origin: top center;
    pointer-events: none;
  }

  .sign-in-page__brand {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    width: fit-content;
    color: #19161f;
    text-decoration: none;
  }

  .sign-in-page__brand-mark {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(180deg, #9d7cff 0%, #6b39ea 100%);
    color: #ffffff;
    box-shadow: 0 18px 32px rgba(111, 77, 221, 0.24);
  }

  .sign-in-page__brand-mark svg {
    width: 24px;
    height: 24px;
  }

  .sign-in-page__brand-name {
    font-size: 21px;
    font-weight: 700;
    color: #19161f;
  }

  .sign-in-page__hero-copy {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding-top: 8px;
    text-align: center;
  }

  .sign-in-page__hero-title {
    margin: 0;
    font-size: clamp(44px, 4.4vw, 64px);
    line-height: 1.14;
    letter-spacing: -0.04em;
    color: #09090f;
  }

  .sign-in-page__hero-text {
    max-width: 720px;
    margin: 26px auto 0;
    font-size: 18px;
    line-height: 1.65;
    color: #53596b;
  }

  .sign-in-page__visual {
    position: relative;
    z-index: 1;
    min-height: 520px;
    padding-top: 84px;
  }

  .sign-in-page__visual-shape {
    position: absolute;
    right: 4%;
    bottom: 24px;
    width: 160px;
    height: 92px;
    border-radius: 80px 80px 28px 28px;
    background: radial-gradient(circle at 30% 30%, rgba(189, 164, 255, 0.6), rgba(189, 164, 255, 0.16));
    transform: rotate(-28deg);
    filter: blur(1px);
  }

  .sign-in-page__chart-card {
    position: relative;
    width: min(100%, 700px);
    min-height: 420px;
    padding: 28px 24px 24px;
    margin: 110px auto 0;
    border: 1px solid rgba(209, 215, 235, 0.92);
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 28px 70px rgba(157, 128, 239, 0.2);
    backdrop-filter: blur(10px);
  }

  .sign-in-page__chart-card-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
  }

  .sign-in-page__card-title {
    margin: 0;
    font-size: 18px;
    line-height: 1.25;
    color: #181622;
  }

  .sign-in-page__card-subtitle {
    margin: 22px 0 0;
    font-size: 16px;
    color: #5e6374;
  }

  .sign-in-page__legend {
    display: flex;
    gap: 22px;
    flex-wrap: wrap;
    padding-top: 4px;
    font-size: 15px;
    color: #565c6e;
  }

  .sign-in-page__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .sign-in-page__legend-dot {
    display: inline-flex;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    box-shadow:
      inset 0 0 0 2px rgba(255, 255, 255, 0.72),
      0 0 0 5px rgba(117, 71, 239, 0.14);
  }

  .sign-in-page__legend-dot--primary {
    background: #7547ef;
  }

  .sign-in-page__legend-dot--muted {
    background: #c7b7f8;
    box-shadow:
      inset 0 0 0 2px rgba(255, 255, 255, 0.72),
      0 0 0 5px rgba(199, 183, 248, 0.22);
  }

  .sign-in-page__chart {
    position: relative;
    display: flex;
    align-items: end;
    gap: 24px;
    height: 280px;
    margin-top: 26px;
    padding: 0 18px 34px;
    color: #7a4df4;
  }

  .sign-in-page__chart::before {
    content: '';
    position: absolute;
    inset: 0 0 34px;
    border-radius: 20px;
    background:
      linear-gradient(rgba(203, 208, 228, 0.74) 1px, transparent 1px),
      linear-gradient(90deg, transparent 100%, transparent 100%);
    background-size: 100% 64px;
    background-position: left 6px;
    opacity: 0.9;
    pointer-events: none;
  }

  .sign-in-page__chart-bar {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 34px;
    border-radius: 18px 18px 0 0;
    background: linear-gradient(180deg, rgba(192, 176, 248, 0.72), rgba(225, 216, 255, 0.5));
  }

  .sign-in-page__chart svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 12px 18px rgba(122, 77, 244, 0.18));
  }

  .sign-in-page__floating-card {
    position: absolute;
    border: 1px solid rgba(212, 217, 235, 0.9);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18px 42px rgba(157, 128, 239, 0.18);
  }

  .sign-in-page__floating-card--top {
    top: 8px;
    right: 10%;
    width: min(100%, 330px);
    padding: 18px 18px 16px;
  }

  .sign-in-page__floating-card--bottom {
    left: clamp(-8px, 1vw, 18px);
    bottom: -12px;
    width: min(100%, 290px);
    padding: 18px 18px 14px;
  }

  .sign-in-page__floating-card--top::after {
    content: '';
    position: absolute;
    right: 20px;
    bottom: 18px;
    width: 100px;
    height: 48px;
    background:
      linear-gradient(130deg, transparent 10%, #67d7c6 11%, #67d7c6 18%, transparent 19%),
      linear-gradient(45deg, transparent 37%, #67d7c6 38%, #67d7c6 46%, transparent 47%),
      linear-gradient(145deg, transparent 59%, #67d7c6 60%, #67d7c6 66%, transparent 67%);
    opacity: 0.95;
  }

  .sign-in-page__floating-card--bottom::after {
    content: '';
    position: absolute;
    right: 18px;
    bottom: 20px;
    width: 112px;
    height: 52px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 10% 72%, #7a4df4 0 10px, transparent 11px),
      linear-gradient(135deg, transparent 12%, #7a4df4 13%, #7a4df4 17%, transparent 18%),
      linear-gradient(45deg, transparent 47%, #7a4df4 48%, #7a4df4 52%, transparent 53%),
      linear-gradient(135deg, transparent 70%, #7a4df4 71%, #7a4df4 75%, transparent 76%);
    opacity: 0.92;
  }

  .sign-in-page__floating-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .sign-in-page__floating-card-title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #191622;
  }

  .sign-in-page__floating-card-arrow {
    font-size: 26px;
    line-height: 1;
    color: #191622;
  }

  .sign-in-page__floating-card-label {
    margin: 18px 0 6px;
    font-size: 15px;
    color: #676d7d;
  }

  .sign-in-page__floating-card-value {
    font-size: 28px;
    line-height: 1;
    color: #14111b;
  }

  .sign-in-page__pagination {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .sign-in-page__pagination-dot {
    width: 18px;
    height: 8px;
    border-radius: 999px;
    background: #d8cbff;
    transition: width 180ms ease;
  }

  .sign-in-page__pagination-dot--active {
    width: 34px;
    background: #8a60f5;
  }

  .sign-in-page__form-section {
    display: grid;
    place-items: center;
    padding: 40px 32px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)),
      linear-gradient(180deg, #ffffff 0%, #fbf9ff 100%);
  }

  .sign-in-page__form-card {
    width: min(100%, 640px);
    padding: 46px 48px 42px;
    border: 1px solid #ebe6fb;
    border-radius: 30px;
    background:
      linear-gradient(180deg, rgba(222, 209, 255, 0.42) 0, rgba(255, 255, 255, 0) 140px),
      #ffffff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      0 18px 44px rgba(162, 134, 237, 0.12);
  }

  .sign-in-page__form-badge {
    display: grid;
    place-items: center;
    width: 94px;
    height: 94px;
    margin: 0 auto;
    border-radius: 999px;
    background:
      radial-gradient(circle at center, #854ff4 0 28px, transparent 29px),
      radial-gradient(circle at center, rgba(133, 79, 244, 0.14) 0 44px, transparent 45px),
      linear-gradient(rgba(189, 169, 243, 0.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(189, 169, 243, 0.18) 1px, transparent 1px);
    background-size: auto, auto, 28px 28px, 28px 28px;
    color: #ffffff;
  }

  .sign-in-page__form-badge svg {
    width: 24px;
    height: 24px;
  }

  .sign-in-page__form-title {
    margin: 34px 0 0;
    text-align: center;
    font-size: clamp(36px, 3.2vw, 54px);
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: #0d0c14;
  }

  .sign-in-page__form-subtitle {
    margin: 18px 0 0;
    text-align: center;
    font-size: 18px;
    color: #5a6071;
  }

  .sign-in-page__social-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 34px;
  }

  .sign-in-page__social-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 56px;
    border: 1px solid #dfe3ee;
    border-radius: 16px;
    background: #ffffff;
    color: #181622;
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
  }

  .sign-in-page__social-button svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .sign-in-page__divider {
    position: relative;
    margin: 28px 0 30px;
    text-align: center;
  }

  .sign-in-page__divider::before {
    content: '';
    position: absolute;
    inset: 50% 0 auto;
    border-top: 1px solid #e1e5f0;
  }

  .sign-in-page__divider-label {
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 0 14px;
    background: #ffffff;
    font-size: 15px;
    color: #6b7183;
  }

  .sign-in-page__field-group {
    display: grid;
    gap: 10px;
  }

  .sign-in-page__field-group + .sign-in-page__field-group {
    margin-top: 18px;
  }

  .sign-in-page__field-label {
    font-size: 16px;
    font-weight: 700;
    color: #1c1924;
  }

  .sign-in-page__field .MuiOutlinedInput-root {
    min-height: 58px;
    border-radius: 16px;
    background: #ffffff;
  }

  .sign-in-page__field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #9b78ff;
  }

  .sign-in-page__field-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    color: #606677;
  }

  .sign-in-page__field-icon svg {
    width: 100%;
    height: 100%;
  }

  .sign-in-page__form-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 14px;
  }

  .sign-in-page__checkbox-label {
    margin: 0;
    color: #555b6c;
  }

  .sign-in-page__checkbox-label .MuiCheckbox-root {
    color: #8154f4;
  }

  .sign-in-page__checkbox-label .MuiTypography-root {
    font-size: 15px;
  }

  .sign-in-page__forgot-link {
    font-size: 15px;
    font-weight: 700;
    color: #1f1929;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .sign-in-page__submit-button {
    min-height: 58px;
    margin-top: 28px;
    border-radius: 16px;
    background: linear-gradient(90deg, #7b48f0 0%, #9a69ff 48%, #7b48f0 100%);
    box-shadow: 0 18px 28px rgba(123, 72, 240, 0.24);
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    text-transform: none;
  }

  .sign-in-page__footer-text {
    margin: 26px 0 0;
    text-align: center;
    font-size: 16px;
    color: #5a6071;
  }

  .sign-in-page__footer-link {
    font-size: inherit;
    font-weight: 700;
    color: #8557f5;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 1200px) {
    .sign-in-page {
      grid-template-columns: minmax(0, 1fr);
    }

    .sign-in-page__hero {
      min-height: 860px;
    }
  }

  @media (max-width: 767px) {
    .sign-in-page {
      padding: 12px;
    }

    .sign-in-page__hero {
      min-height: auto;
      padding: 24px 18px;
    }

    .sign-in-page__hero-title {
      font-size: 34px;
    }

    .sign-in-page__hero-text {
      margin-top: 18px;
      font-size: 16px;
    }

    .sign-in-page__visual {
      min-height: 440px;
      padding-top: 48px;
    }

    .sign-in-page__chart-card {
      min-height: 360px;
      padding: 22px 16px 18px;
      margin-top: 96px;
    }

    .sign-in-page__chart-card-header {
      flex-direction: column;
    }

    .sign-in-page__card-subtitle {
      margin-top: 10px;
      font-size: 14px;
    }

    .sign-in-page__chart {
      gap: 12px;
      height: 230px;
      padding-inline: 10px;
    }

    .sign-in-page__chart-bar {
      max-width: 18px;
    }

    .sign-in-page__floating-card--top {
      right: 4%;
      width: 240px;
      padding: 16px;
    }

    .sign-in-page__floating-card--bottom {
      width: 220px;
      padding: 16px;
    }

    .sign-in-page__form-section {
      padding: 20px 14px 26px;
    }

    .sign-in-page__form-card {
      padding: 30px 18px 24px;
      border-radius: 24px;
    }

    .sign-in-page__form-title {
      margin-top: 24px;
      font-size: 34px;
    }

    .sign-in-page__social-actions {
      grid-template-columns: minmax(0, 1fr);
    }

    .sign-in-page__form-meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`
