import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const HeaderRoot = styled(Box)`
  padding: 22px 28px;
  border-bottom: 1px solid #e2e8f0;

  .content__hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .content__hero-copy {
    min-width: 0;
  }

  .content__title {
    margin: 0;
    font-size: clamp(1.8rem, 2vw, 2.2rem);
    font-weight: 700;
    color: #0f172a;
  }

  .content__meta {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 0.95rem;
  }

  .content__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .content__icon-button {
    width: 44px;
    height: 44px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
  }

  .content__team {
    display: flex;
    align-items: center;
    margin-left: 4px;
  }

  .content__team-member {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    margin-left: -8px;
    border: 2px solid #ffffff;
    border-radius: 999px;
    background: linear-gradient(135deg, #111827 0%, #7c3aed 100%);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .content__team-member:first-of-type {
    margin-left: 0;
  }

  .content__invite-button {
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
    font-weight: 600;
    text-transform: none;
  }
`
