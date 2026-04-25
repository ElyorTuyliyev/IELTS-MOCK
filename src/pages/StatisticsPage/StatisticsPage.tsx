import { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { StatisticsPageRoot } from './StatisticsPage.style'

const topCards = [
  { title: 'Exam statistics', value: '27', line: [30, 36, 28, 40, 22, 34, 31] },
  { title: 'Question statistics', value: '20', line: [22, 26, 35, 30, 21, 24, 28] },
  { title: 'Student statistics', value: '123', line: [16, 19, 22, 24, 21, 28, 33] },
  { title: 'Prize quiz statistics', value: '09', line: [24, 19, 30, 26, 34, 29, 31] },
]

const monthlyBars = [
  { month: 'Jan', a: 22, b: 30, c: 14 },
  { month: 'Feb', a: 26, b: 14, c: 20 },
  { month: 'Mar', a: 18, b: 28, c: 32 },
  { month: 'Apr', a: 16, b: 30, c: 40 },
  { month: 'May', a: 34, b: 24, c: 14 },
  { month: 'Jun', a: 12, b: 28, c: 37 },
  { month: 'Jul', a: 20, b: 22, c: 34 },
  { month: 'Aug', a: 22, b: 25, c: 40 },
  { month: 'Sep', a: 24, b: 34, c: 28 },
  { month: 'Oct', a: 24, b: 32, c: 22 },
  { month: 'Nov', a: 15, b: 28, c: 30 },
  { month: 'Dec', a: 22, b: 18, c: 26 },
]

const prizeRows = [
  { name: 'Exam Sphere', date: 'Jan 27, 2025', rate: '46%' },
  { name: 'Test Trek', date: 'Jan 27, 2025', rate: '53%' },
  { name: 'Eval Ease', date: 'Jan 27, 2025', rate: '72%' },
]

export function StatisticsPage() {
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '393b5a',
      },
      body: JSON.stringify({
        sessionId: '393b5a',
        runId: 'post-fix',
        hypothesisId: 'H26',
        location: 'StatisticsPage.tsx:useEffect[mount]',
        message: 'Statistics page rendered',
        data: {
          topCardsCount: topCards.length,
          monthlyBarsCount: monthlyBars.length,
          prizeRowsCount: prizeRows.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [])

  return (
    <Layout>
      <StatisticsPageRoot>
        <Box className="stats-page">
          <Box className="stats-page__hero-grid">
            {topCards.map((card) => (
              <Box key={card.title} className="stats-card">
                <Box className="stats-card__head">
                  <Typography component="p" className="stats-card__title">
                    {card.title}
                  </Typography>
                  <span>↗</span>
                </Box>
                <Typography component="p" className="stats-card__label">
                  Total {card.title.replace(' statistics', '')}
                </Typography>
                <Typography component="h2" className="stats-card__value">
                  {card.value}
                </Typography>
                <Box className="stats-card__sparkline">
                  {card.line.map((point, index) => (
                    <Box
                      key={`${card.title}-${index}`}
                      className="stats-card__sparkline-dot"
                      sx={{ height: `${point}px` }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="stats-page__chart-grid">
            <Box className="stats-panel">
              <Box className="stats-panel__head">
                <Typography component="h3">Question type percentage</Typography>
                <Button size="small" variant="outlined">
                  Last Years
                </Button>
              </Box>
              <Box className="stats-radar">
                <Box className="stats-radar__ring stats-radar__ring--one" />
                <Box className="stats-radar__ring stats-radar__ring--two" />
                <Box className="stats-radar__ring stats-radar__ring--three" />
                <Box className="stats-radar__shape stats-radar__shape--primary" />
                <Box className="stats-radar__shape stats-radar__shape--secondary" />
              </Box>
            </Box>

            <Box className="stats-panel">
              <Box className="stats-panel__head">
                <Typography component="h3">Question difficulty percentage</Typography>
                <Button size="small" variant="outlined">
                  Last Years
                </Button>
              </Box>
              <Box className="stats-bars">
                {monthlyBars.map((bar) => (
                  <Box key={bar.month} className="stats-bars__month">
                    <Box className="stats-bars__stack">
                      <Box className="stats-bars__segment stats-bars__segment--purple" sx={{ height: `${bar.a}px` }} />
                      <Box className="stats-bars__segment stats-bars__segment--mint" sx={{ height: `${bar.b}px` }} />
                      <Box className="stats-bars__segment stats-bars__segment--gold" sx={{ height: `${bar.c}px` }} />
                    </Box>
                    <span>{bar.month}</span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box className="stats-page__bottom-grid">
            <Box className="stats-panel">
              <Box className="stats-panel__head">
                <Typography component="h3">Certificates Statistics</Typography>
                <Button size="small" variant="text">
                  ...
                </Button>
              </Box>
              <Box className="stats-certificate">
                <Box className="stats-certificate__col">
                  <strong>30%</strong>
                  <span>Templates</span>
                  <Box className="stats-certificate__bar stats-certificate__bar--mint" />
                </Box>
                <Box className="stats-certificate__col">
                  <strong>20%</strong>
                  <span>Total issued</span>
                  <Box className="stats-certificate__bar stats-certificate__bar--pink" />
                </Box>
                <Box className="stats-certificate__col">
                  <strong>50%</strong>
                  <span>Exam takers</span>
                  <Box className="stats-certificate__bar stats-certificate__bar--purple" />
                </Box>
              </Box>
            </Box>

            <Box className="stats-panel">
              <Box className="stats-panel__head">
                <Typography component="h3">Analysis of prize quizzes</Typography>
                <Button size="small" variant="text">
                  ...
                </Button>
              </Box>
              <Box className="stats-prize">
                {prizeRows.map((row) => (
                  <Box key={row.name} className="stats-prize__row">
                    <span>{row.name}</span>
                    <span>{row.date}</span>
                    <strong>{row.rate}</strong>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box className="stats-panel">
              <Box className="stats-panel__head">
                <Typography component="h3">Signup statistics</Typography>
                <Button size="small" variant="outlined">
                  View more
                </Button>
              </Box>
              <Typography component="p" className="stats-signup__label">
                Number of people registered
              </Typography>
              <Typography component="h2" className="stats-signup__value">
                42,647.94
              </Typography>
              <Box className="stats-signup__bars">
                <Box className="stats-signup__bar stats-signup__bar--purple" />
                <Box className="stats-signup__bar stats-signup__bar--pink" />
                <Box className="stats-signup__bar stats-signup__bar--mint" />
              </Box>
            </Box>
          </Box>
        </Box>
      </StatisticsPageRoot>
    </Layout>
  )
}
