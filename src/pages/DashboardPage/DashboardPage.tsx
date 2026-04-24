import type { CSSProperties } from 'react'

import { Box, Button, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { DashboardPageRoot } from './DashboardPage.style'

const statCards = [
  {
    title: 'Need to grade',
    value: '87%',
    delta: '↗ +4.56%',
    detail: 'yearly student exam test online system',
    icon: '◔',
    accent: '#7c3aed',
    softAccent: 'rgba(124, 58, 237, 0.12)',
    type: 'ring' as const,
  },
  {
    title: 'New Active student',
    value: '536',
    delta: '↗ +6.354%',
    detail: 'student growth within this month',
    icon: '◌',
    accent: '#8b5cf6',
    softAccent: 'rgba(139, 92, 246, 0.12)',
    type: 'bars' as const,
    bars: [34, 46, 42, 16, 38, 24, 58, 36, 12, 22, 26, 18, 44, 50],
  },
  {
    title: 'Questions',
    value: '64',
    delta: '↘ +2.56%',
    detail: 'yearly student exam test online system monthly time remaining',
    icon: '?',
    accent: '#38b2ac',
    softAccent: 'rgba(56, 178, 172, 0.12)',
    type: 'wave' as const,
    pills: [34, 22, 48, 30, 16, 40, 22, 12, 18, 40],
  },
]

const chartData = [
  { month: 'Jan', bars: 22, line: 10 },
  { month: 'Feb', bars: 30, line: 12 },
  { month: 'Mar', bars: 14, line: 11 },
  { month: 'Apr', bars: 14, line: 10 },
  { month: 'May', bars: 26, line: 16 },
  { month: 'Jun', bars: 34, line: 22 },
  { month: 'Jul', bars: 36, line: 27 },
  { month: 'Aug', bars: 24, line: 21 },
  { month: 'Sep', bars: 17, line: 12 },
  { month: 'Oct', bars: 15, line: 10 },
  { month: 'Nov', bars: 22, line: 16 },
  { month: 'Dec', bars: 40, line: 15 },
]

const averageResults = [
  {
    subject: 'Mathematic',
    segments: [
      { color: '#7c3aed', width: '24%' },
      { color: '#5cc0b8', width: '22%' },
      { color: '#f4c84f', width: '12%' },
      { color: '#eb8d34', width: '32%' },
      { color: '#edf1f7', width: '10%', empty: true },
    ],
  },
  {
    subject: 'English 1',
    segments: [
      { color: '#7c3aed', width: '38%' },
      { color: '#5cc0b8', width: '8%' },
      { color: '#f4c84f', width: '30%' },
      { color: '#eb8d34', width: '18%' },
      { color: '#edf1f7', width: '6%', empty: true },
    ],
  },
  {
    subject: 'Science 2',
    segments: [
      { color: '#7c3aed', width: '9%' },
      { color: '#5cc0b8', width: '36%' },
      { color: '#f4c84f', width: '24%' },
      { color: '#eb8d34', width: '18%' },
      { color: '#edf1f7', width: '13%', empty: true },
    ],
  },
  {
    subject: 'Economics',
    segments: [
      { color: '#7c3aed', width: '24%' },
      { color: '#5cc0b8', width: '16%' },
      { color: '#f4c84f', width: '28%' },
      { color: '#eb8d34', width: '8%' },
      { color: '#edf1f7', width: '24%', empty: true },
    ],
  },
]

const tableRows = [
  {
    name: 'Tahsan Khan',
    initials: 'TK',
    avatarGradient: 'linear-gradient(135deg, #7c3aed 0%, #f472d0 100%)',
    totalScore: '16.7%',
    totalStyle: {
      background: '#fff3e8',
      border: '#ffd7ba',
      color: '#ea580c',
    },
    reasoning: '50% (1/2)',
    miniBars: [8, 12, 16],
    time: '00:53',
    analysis: 4,
    analysisText: '100%',
    startDate: 'Jan 20, 2025',
    generic: '0% (0/2)',
    genericStyle: {
      background: '#fff1fd',
      border: '#f5c2f0',
      color: '#ef5ad7',
    },
  },
  {
    name: 'Anwar Hussen',
    initials: 'AH',
    avatarGradient: 'linear-gradient(135deg, #38b2ac 0%, #7dd3fc 100%)',
    totalScore: '19.7%',
    totalStyle: {
      background: '#ecfeff',
      border: '#c7f9f7',
      color: '#0f766e',
    },
    reasoning: '100% (2/2)',
    miniBars: [10, 14, 18],
    time: '01:00',
    analysis: 0,
    analysisText: '00%',
    startDate: 'Jan 20, 2025',
    generic: '0% (0/2)',
    genericStyle: {
      background: '#f0f9ff',
      border: '#bfdbfe',
      color: '#60a5fa',
    },
  },
  {
    name: 'Hasan Khan',
    initials: 'HK',
    avatarGradient: 'linear-gradient(135deg, #fb923c 0%, #facc15 100%)',
    totalScore: '13.7%',
    totalStyle: {
      background: '#fff8e7',
      border: '#fde68a',
      color: '#ca8a04',
    },
    reasoning: '0% (0/2)',
    miniBars: [6, 10, 14],
    time: '01:01',
    analysis: 2,
    analysisText: '50%',
    startDate: 'Jan 20, 2025',
    generic: '0% (0/2)',
    genericStyle: {
      background: '#fff7ed',
      border: '#fdba74',
      color: '#f97316',
    },
  },
]

const legendItems = [
  { label: 'Easy questions', color: '#7c3aed', soft: 'rgba(124, 58, 237, 0.12)' },
  { label: 'Medium questions', color: '#5cc0b8', soft: 'rgba(92, 192, 184, 0.12)' },
  { label: 'Difficult questions', color: '#f4c84f', soft: 'rgba(244, 200, 79, 0.12)' },
  { label: 'Hard', color: '#eb8d34', soft: 'rgba(235, 141, 52, 0.12)' },
]

function getLineSegmentStyle(start: number, end: number): CSSProperties {
  const startPx = start * 7
  const endPx = end * 7
  const delta = endPx - startPx
  const width = Math.sqrt(58 ** 2 + delta ** 2)
  const angle = Math.atan2(delta, 58) * (180 / Math.PI)

  return {
    ['--start-height' as string]: `${startPx}px`,
    ['--angle' as string]: `${-angle}deg`,
    width: `${width}px`,
  }
}

export function DashboardPage() {
  return (
    <Layout>
      <DashboardPageRoot>
        <Box className="dashboard-screen">
          <Box className="dashboard-screen__stats">
            {statCards.map((card) => (
              <Box
                key={card.title}
                className="dashboard-stat"
                sx={
                  {
                    '--accent': card.accent,
                    '--soft-accent': card.softAccent,
                    '--delta-color': card.title === 'Questions' ? '#f08a34' : '#5bc8bd',
                  } as CSSProperties
                }
              >
                <Box className="dashboard-stat__header">
                  <Box>
                    <Typography component="p" className="dashboard-stat__eyebrow">
                      {card.title}
                    </Typography>

                    <Box className="dashboard-stat__value-row">
                      <Typography component="h2" className="dashboard-stat__value">
                        {card.value}
                      </Typography>
                      {card.title === 'Need to grade' ? (
                        <Typography component="span" className="dashboard-stat__suffix">
                          Grade
                        </Typography>
                      ) : null}
                    </Box>

                    <Typography component="span" className="dashboard-stat__delta">
                      {card.delta}
                    </Typography>
                  </Box>

                  <Box className="dashboard-stat__visual">
                    {card.type === 'ring' ? (
                      <Box className="dashboard-stat__ring">
                        <Typography component="span" className="dashboard-stat__ring-value">
                          87%
                        </Typography>
                      </Box>
                    ) : null}

                    {card.type === 'bars' ? (
                      <Box className="dashboard-stat__badge">👥</Box>
                    ) : null}
                  </Box>
                </Box>

                {card.type === 'bars' ? (
                  <Box className="dashboard-stat__sparkbars">
                    {card.bars?.map((bar, index) => (
                      <Box
                        key={`${card.title}-${bar}-${index}`}
                        className="dashboard-stat__sparkbar"
                        sx={
                          {
                            '--bar-height': `${bar + 10}px`,
                            '--bar-opacity': index % 3 === 0 ? 1 : 0.42,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </Box>
                ) : null}

                {card.type === 'wave' ? (
                  <Box className="dashboard-stat__wave">
                    {card.pills?.map((pill, index) => (
                      <Box
                        key={`${card.title}-${pill}-${index}`}
                        className="dashboard-stat__wave-pill"
                        sx={
                          {
                            '--pill-height': `${pill + 6}px`,
                            '--pill-opacity': index % 2 === 0 ? 1 : 0.82,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </Box>
                ) : null}

                <Box className="dashboard-stat__footer">
                  <Box className="dashboard-stat__footer-icon">{card.icon}</Box>
                  <Typography component="p" className="dashboard-stat__footer-text">
                    {card.detail}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="dashboard-screen__analytics">
            <Box className="dashboard-screen__panel dashboard-line-chart">
              <Box className="dashboard-screen__panel-head">
                <Box>
                  <Typography component="h2" className="dashboard-screen__panel-title">
                    Exam Taken Times
                  </Typography>
                  <Typography component="p" className="dashboard-screen__panel-subtitle">
                    Taken records of last Years
                  </Typography>
                </Box>

                <Button className="dashboard-screen__panel-action" variant="outlined">
                  🗓 Monthly
                </Button>
              </Box>

              <Box className="dashboard-line-chart__legend">
                <Box className="dashboard-line-chart__legend-item">
                  <Box
                    className="dashboard-line-chart__legend-dot"
                    sx={
                      {
                        '--legend-color': '#7c3aed',
                        '--legend-soft': 'rgba(124, 58, 237, 0.12)',
                      } as CSSProperties
                    }
                  />
                  <span>Active Exams</span>
                </Box>
                <Box className="dashboard-line-chart__legend-item">
                  <Box
                    className="dashboard-line-chart__legend-dot"
                    sx={
                      {
                        '--legend-color': '#d9cbff',
                        '--legend-soft': 'rgba(217, 203, 255, 0.22)',
                      } as CSSProperties
                    }
                  />
                  <span>Active Exam Takers</span>
                </Box>
              </Box>

              <Box className="dashboard-line-chart__canvas">
                {[40, 30, 20, 10].map((value, index) => (
                  <Box
                    key={value}
                    className="dashboard-line-chart__grid-line"
                    sx={{ top: `${18 + index * 56}px` }}
                  />
                ))}

                {[40, 30, 20, 10, 0].map((value, index) => (
                  <Box
                    key={`label-${value}`}
                    className="dashboard-line-chart__y-label"
                    sx={{ top: `${18 + index * 56}px` }}
                  >
                    {value}
                  </Box>
                ))}

                <Box className="dashboard-line-chart__columns">
                  {chartData.map((item, index) => (
                    <Box key={item.month} className="dashboard-line-chart__month">
                      <Box
                        className="dashboard-line-chart__bar"
                        sx={
                          {
                            '--bar-height': `${item.bars * 7}px`,
                          } as CSSProperties
                        }
                      />
                      {index < chartData.length - 1 ? (
                        <Box
                          className="dashboard-line-chart__line-segment"
                          sx={getLineSegmentStyle(item.line, chartData[index + 1].line)}
                        />
                      ) : null}
                      <Box
                        className="dashboard-line-chart__point"
                        sx={
                          {
                            '--point-height': `${item.line * 7}px`,
                          } as CSSProperties
                        }
                      />
                      <Typography component="span" className="dashboard-line-chart__month-label">
                        {item.month}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box className="dashboard-screen__panel dashboard-average">
              <Box className="dashboard-screen__panel-head">
                <Box>
                  <Typography component="h2" className="dashboard-screen__panel-title">
                    Average Results For Test Questions
                  </Typography>
                </Box>
              </Box>

              <Box className="dashboard-average__legend">
                {legendItems.map((item) => (
                  <Box key={item.label} className="dashboard-average__legend-item">
                    <Box
                      className="dashboard-average__legend-dot"
                      sx={
                        {
                          '--legend-color': item.color,
                          '--legend-soft': item.soft,
                        } as CSSProperties
                      }
                    />
                    <span>{item.label}</span>
                  </Box>
                ))}
              </Box>

              <Box className="dashboard-average__rows">
                {averageResults.map((row) => (
                  <Box key={row.subject} className="dashboard-average__row">
                    <Typography component="span" className="dashboard-average__subject">
                      {row.subject}
                    </Typography>

                    <Box className="dashboard-average__track">
                      {row.segments.map((segment, index) => (
                        <Box
                          key={`${row.subject}-${segment.color}-${index}`}
                          className={`dashboard-average__segment${
                            segment.empty ? ' dashboard-average__segment--empty' : ''
                          }`}
                          sx={
                            {
                              '--segment-color': segment.color,
                              '--segment-width': segment.width,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box className="dashboard-average__scale">
                <Typography component="span" className="dashboard-average__scale-title">
                  Pass Mark :
                </Typography>
                <Box className="dashboard-average__ticks">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="dashboard-table">
            <Box className="dashboard-table__head">
              <Typography component="h2" className="dashboard-table__title">
                Browse test results
              </Typography>

              <Button className="dashboard-table__action" variant="outlined">
                ✉ Send certificates
              </Button>
            </Box>

            <Box className="dashboard-table__header">
              <Box className="dashboard-table__checkbox" />
              <span>Name</span>
              <span>Total score</span>
              <span>Score Reasoning</span>
              <span>Time</span>
              <span>Score Analysis</span>
              <span>Start Date</span>
              <span>Score Generic</span>
              <span>Action</span>
            </Box>

            {tableRows.map((row) => (
              <Box key={row.name} className="dashboard-table__row">
                <Box className="dashboard-table__checkbox" />

                <Box className="dashboard-table__name">
                  <Box
                    className="dashboard-table__avatar"
                    sx={
                      {
                        '--avatar-gradient': row.avatarGradient,
                      } as CSSProperties
                    }
                  >
                    {row.initials}
                  </Box>
                  <Typography component="p" className="dashboard-table__name-text">
                    {row.name}
                  </Typography>
                </Box>

                <Box
                  className="dashboard-table__pill"
                  sx={
                    {
                      '--pill-bg': row.totalStyle.background,
                      '--pill-border': row.totalStyle.border,
                      '--pill-color': row.totalStyle.color,
                    } as CSSProperties
                  }
                >
                  {row.totalScore}
                </Box>

                <Box className="dashboard-table__reasoning">
                  <Box className="dashboard-table__reasoning-bars">
                    {row.miniBars.map((bar, index) => (
                      <Box
                        key={`${row.name}-mini-${index}`}
                        className="dashboard-table__reasoning-bar"
                        sx={
                          {
                            '--mini-height': `${bar}px`,
                            '--mini-opacity': index === 2 ? 1 : 0.55,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </Box>
                  <span>{row.reasoning}</span>
                </Box>

                <span className="dashboard-table__time">{row.time}</span>

                <Box className="dashboard-table__analysis">
                  <Box className="dashboard-table__analysis-bars">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Box
                        key={`${row.name}-analysis-${index}`}
                        className={`dashboard-table__analysis-bar${
                          index < row.analysis ? ' dashboard-table__analysis-bar--filled' : ''
                        }`}
                      />
                    ))}
                  </Box>
                  <span className="dashboard-table__analysis-text">{row.analysisText}</span>
                </Box>

                <span className="dashboard-table__date">{row.startDate}</span>

                <Box
                  className="dashboard-table__pill"
                  sx={
                    {
                      '--pill-bg': row.genericStyle.background,
                      '--pill-border': row.genericStyle.border,
                      '--pill-color': row.genericStyle.color,
                    } as CSSProperties
                  }
                >
                  {row.generic}
                </Box>

                <Box className="dashboard-table__actions">
                  <Button className="dashboard-table__icon-button" variant="outlined">
                    🗑
                  </Button>
                  <Button className="dashboard-table__icon-button" variant="outlined">
                    ✎
                  </Button>
                  <Button className="dashboard-table__icon-button" variant="outlined">
                    ⋯
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </DashboardPageRoot>
    </Layout>
  )
}
