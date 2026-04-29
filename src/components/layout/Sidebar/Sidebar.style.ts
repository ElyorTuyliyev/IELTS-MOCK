import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SidebarRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);

  .sidebar__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #d6dbeb;
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .sidebar__brand-logo {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    color: #ffffff;
    font-size: 1.5rem;
  }

  .sidebar__brand-title {
    display: block;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
  }

  .sidebar__brand-text {
    display: block;
    margin-top: 4px;
    color: #64748b;
    font-size: 0.875rem;
  }

  .sidebar__utility-button {
    margin-left: auto;
    width: 40px;
    height: 40px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
  }

  .sidebar__search {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 48px;
    gap: 8px;
  }

  .sidebar__search-input .MuiOutlinedInput-root {
    min-height: 48px;
    border-radius: 14px;
    background: #ffffff;
  }

  .sidebar__search-button {
    width: 48px;
    height: 48px;
    border: 1px solid #d8def0;
    border-radius: 14px;
    background: #ffffff;
    color: #0f172a;
  }

  .sidebar__nav {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 24px;
  }

  .sidebar__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sidebar__section-title {
    margin: 0;
    color: #475569;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .sidebar__list,
  .sidebar__sublist {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .sidebar__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sidebar__link,
  .sidebar__sublink {
    justify-content: flex-start;
    width: 100%;
    color: #1e293b;
    text-transform: none;
  }

  .sidebar__link {
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
  }

  .sidebar__link--active {
    background: #f3e8ff;
    border-color: #d8b4fe;
  }

  .sidebar__link-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: 1px solid #dbe2f1;
    border-radius: 10px;
    background: #ffffff;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .sidebar__link-arrow,
  .sidebar__profile-arrow {
    margin-left: auto;
  }

  .sidebar__link-arrow {
    transition: transform 0.2s ease;
  }

  .sidebar__link-arrow--expanded {
    transform: rotate(180deg);
  }

  .sidebar__sublist {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    padding-left: 18px;
  }

  .sidebar__sublink {
    min-height: 36px;
    padding: 8px 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    color: #475569;
  }

  .sidebar__sublink--active {
    border-color: #ddd6fe;
    background: #f7f1ff;
    color: #111827;
  }

  .sidebar__sublink-dot {
    width: 8px;
    height: 8px;
    margin-right: 12px;
    border-radius: 50%;
    background: #a78bfa;
  }

  .sidebar__profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 1px solid #d8def0;
    border-radius: 16px;
    background: #ffffff;
  }

  .sidebar__profile-avatar {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #c084fc 100%);
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .sidebar__profile-copy {
    display: flex;
    align-items: center;
    min-width: 0;
    text-align: left;
  }

  .sidebar__profile-name {
    display: block;
    font-weight: 700;
    color: #0f172a;
  }

  .sidebar__logout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    border-radius: 14px;
    border: 1px solid #fecaca;
    color: #b91c1c;
    background: #fff7f7;
    text-transform: none;
    font-weight: 700;
  }

  .sidebar__logout-icon {
    font-size: 0.95rem;
    line-height: 1;
  }
`
