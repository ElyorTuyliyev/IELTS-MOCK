import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'
export const StudentMyExamsPageRoot = styled.div`
  .student-exams-page {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
  }

  .student-exams-page__title {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 800;
    color: ${c.text.primary};
  }

  .student-exams-page__subtitle {
    margin: 4px 0 0;
    color: ${c.text.secondary};
    font-size: 0.95rem;
  }

  .student-exams-page__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing(2)};
  }

  .student-exam-card {
    border: 1px solid ${c.border.default};
    border-radius: 18px;
    background: ${c.surface.default};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    box-shadow: 0 8px 24px ${tokens.rgba.slate900_04};
  }

  .student-exam-card__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: ${c.text.primary};
  }

  .student-exam-card__meta {
    margin: 0;
    color: ${c.text.secondary};
    font-size: 0.9rem;
  }

  .student-exam-card__status {
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .student-exam-card__status--active {
    background: ${c.success.bg};
    color: ${c.success.dark};
  }

  .student-exam-card__status--ended {
    background: ${c.background.subtle};
    color: ${c.text.muted};
  }

  .student-exam-card__status--draft {
    background: ${c.surface.default}7ed;
    color: ${c.orange.darker};
  }

  .student-exam-card__action.MuiButton-root {
    margin-top: auto;
    align-self: flex-start;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
  }

  .student-exams-page__empty {
    padding: 48px 24px;
    border: 1px dashed ${c.border.strong};
    border-radius: 18px;
    text-align: center;
    color: ${c.text.secondary};
  }
`
