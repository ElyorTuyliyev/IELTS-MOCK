import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'

import { useQuery } from '@apollo/client/react'
import { Alert, Box, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { FIND_ALL_QUESTIONS_QUERY } from '../QuestionsPage/api/findAllQuestionsQuery'
import { selectAuthToken, selectUserRole } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { USER_ROLES } from '../../store/slices/authSlice'
import {
  STUDENT_DASHBOARD_STATS_QUERY,
  type StudentDashboardStatsResponse,
} from './api/studentDashboardStatsQuery'
import { DashboardPageRoot } from './DashboardPage.style'

type ChartRow = { label: string; bars: number; line: number }

function formatMonthShort(ym: string): string {
  const parts = ym.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  if (!y || !m) {
    return ym
  }

  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const MOCK_CHART_ROWS: ChartRow[] = [
  { label: 'Jan', bars: 22, line: 10 },
  { label: 'Feb', bars: 30, line: 12 },
  { label: 'Mar', bars: 14, line: 11 },
  { label: 'Apr', bars: 14, line: 10 },
  { label: 'May', bars: 26, line: 16 },
  { label: 'Jun', bars: 34, line: 22 },
  { label: 'Jul', bars: 36, line: 27 },
  { label: 'Aug', bars: 24, line: 21 },
  { label: 'Sep', bars: 17, line: 12 },
  { label: 'Oct', bars: 15, line: 10 },
  { label: 'Nov', bars: 22, line: 16 },
  { label: 'Dec', bars: 40, line: 15 },
]

const DEFAULT_STUDENT_SPARK = [34, 46, 42, 16, 38, 24, 58, 36, 12, 22, 26, 18, 44, 50]

const averageResults = [
  {
    subject: 'Mathematics',
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

type QuestionsCountResponse = { findAllQuestions: { _id: string }[] }

export function DashboardPage() {
  const token = useAppSelector(selectAuthToken)
  const role = useAppSelector(selectUserRole)
  const loadStudentStats = Boolean(
    token && (role === USER_ROLES.superAdmin || role === USER_ROLES.center),
  )

  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const { data: statsData, error: statsError } = useQuery<
    StudentDashboardStatsResponse,
    Record<string, never>
  >(STUDENT_DASHBOARD_STATS_QUERY, {
    skip: !loadStudentStats,
  })

  const { data: questionsData } = useQuery<QuestionsCountResponse>(FIND_ALL_QUESTIONS_QUERY, {
    skip: !loadStudentStats,
  })

  const stats = statsData?.studentDashboardStats

  const aggregatedMonthly = useMemo(() => {
    if (!stats?.centers?.length) {
      return null
    }

    const keys = stats.centers[0].monthlyNewStudents.map((row) => row.month)

    return keys.map((month) => ({
      key: month,
      label: formatMonthShort(month),
      bars: stats.centers.reduce((sum, center) => {
        const row = center.monthlyNewStudents.find((m) => m.month === month)
        return sum + (row?.count ?? 0)
      }, 0),
    }))
  }, [stats])

  const chartPoints: ChartRow[] = useMemo(() => {
    if (!aggregatedMonthly?.length) {
      return MOCK_CHART_ROWS
    }

    if (chartPeriod === 'monthly') {
      return aggregatedMonthly.map((row) => ({
        label: row.label,
        bars: row.bars,
        line: Math.max(0, Math.round(row.bars * 0.72)),
      }))
    }

    const byYear = new Map<string, number>()
    for (const row of aggregatedMonthly) {
      const year = row.key.slice(0, 4)
      byYear.set(year, (byYear.get(year) ?? 0) + row.bars)
    }

    return [...byYear.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, bars]) => ({
        label: year,
        bars,
        line: Math.max(0, Math.round(bars * 0.75)),
      }))
  }, [aggregatedMonthly, chartPeriod])

  const yTop = useMemo(() => {
    const peak = Math.max(...chartPoints.map((p) => Math.max(p.bars, p.line)), 1)
    return Math.max(5, Math.ceil(peak / 5) * 5)
  }, [chartPoints])

  const yTicks = useMemo(
    () => [yTop, Math.round(yTop * 0.75), Math.round(yTop * 0.5), Math.round(yTop * 0.25), 0],
    [yTop],
  )

  const norm = (v: number) => (v / yTop) * 40

  const studentSparkBars = useMemo(() => {
    if (!aggregatedMonthly?.length) {
      return DEFAULT_STUDENT_SPARK
    }

    const vals = aggregatedMonthly.map((row) => row.bars)
    const maxVal = Math.max(1, ...vals)
    return vals.map((v) => Math.round(8 + (v / maxVal) * 46))
  }, [aggregatedMonthly])

  const newStudentDelta = useMemo(() => {
    if (!aggregatedMonthly || aggregatedMonthly.length < 2) {
      return { text: '↗ +6.35%', down: false }
    }

    const last = aggregatedMonthly[aggregatedMonthly.length - 1]?.bars ?? 0
    const prev = aggregatedMonthly[aggregatedMonthly.length - 2]?.bars ?? 0

    if (prev === 0) {
      return last === 0
        ? { text: '—', down: false }
        : { text: '↗ +100%', down: false }
    }

    const pct = Math.round(((last - prev) / prev) * 1000) / 10
    return {
      text: `${pct >= 0 ? '↗' : '↘'} ${pct >= 0 ? '+' : ''}${pct}%`,
      down: pct < 0,
    }
  }, [aggregatedMonthly])

  const questionsCount = questionsData?.findAllQuestions?.length
  const questionPills = useMemo(() => {
    const n = questionsCount ?? 64
    return Array.from({ length: 10 }, (_, i) => 18 + ((n * (i + 1) * 17) % 34))
  }, [questionsCount])

  const newStudentValue =
    loadStudentStats && stats ? String(stats.totals.newStudentsThisMonth) : loadStudentStats ? '…' : '—'

  return (
    <Layout>
      <DashboardPageRoot>
        <Box className="dashboard-screen">
          <Box className="dashboard-screen__stats">
            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': '#7c3aed',
                  '--soft-accent': 'rgba(124, 58, 237, 0.12)',
                  '--delta-color': '#5bc8bd',
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    Need to grade
                  </Typography>
                  <Box className="dashboard-stat__value-row">
                    <Typography component="h2" className="dashboard-stat__value">
                      87%
                    </Typography>
                    <Typography component="span" className="dashboard-stat__suffix">
                      Grade
                    </Typography>
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    ↗ +4.56%
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__ring">
                    <Typography component="span" className="dashboard-stat__ring-value">
                      87%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__footer">
                <Box className="dashboard-stat__footer-icon">◔</Box>
                <Typography component="p" className="dashboard-stat__footer-text">
                  yearly student exam test online system
                </Typography>
              </Box>
            </Box>

            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': '#8b5cf6',
                  '--soft-accent': 'rgba(139, 92, 246, 0.12)',
                  '--delta-color': newStudentDelta.down ? '#f08a34' : '#5bc8bd',
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    New students
                  </Typography>
                  <Box className="dashboard-stat__value-row">
                    <Typography component="h2" className="dashboard-stat__value">
                      {newStudentValue}
                    </Typography>
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    {newStudentDelta.text}
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__badge">👥</Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__sparkbars">
                {studentSparkBars.map((bar, index) => (
                  <Box
                    key={`spark-${bar}-${index}`}
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
              <Box className="dashboard-stat__footer">
                <Box className="dashboard-stat__footer-icon">◌</Box>
                <Typography component="p" className="dashboard-stat__footer-text">
                  {role === USER_ROLES.superAdmin
                    ? 'New students registered this month (all centers combined)'
                    : 'New students registered this month (your center)'}
                </Typography>
              </Box>
            </Box>

            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': '#38b2ac',
                  '--soft-accent': 'rgba(56, 178, 172, 0.12)',
                  '--delta-color': '#f08a34',
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    Questions
                  </Typography>
                  <Box className="dashboard-stat__value-row">
                    <Typography component="h2" className="dashboard-stat__value">
                      {questionsCount != null ? String(questionsCount) : loadStudentStats ? '…' : '64'}
                    </Typography>
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    {questionsCount != null ? '↑ total' : '↘ +2.56%'}
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__badge">?</Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__wave">
                {questionPills.map((pill, index) => (
                  <Box
                    key={`q-pill-${pill}-${index}`}
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
              <Box className="dashboard-stat__footer">
                <Box className="dashboard-stat__footer-icon">?</Box>
                <Typography component="p" className="dashboard-stat__footer-text">
                  Question bank for exams you can access
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="dashboard-screen__analytics">
            <Box className="dashboard-screen__panel dashboard-line-chart">
              <Box className="dashboard-screen__panel-head">
                <Box>
                  <Typography component="h2" className="dashboard-screen__panel-title">
                    New students over time
                  </Typography>
                  <Typography component="p" className="dashboard-screen__panel-subtitle">
                    {!loadStudentStats
                      ? 'Sample trend chart (live data for administrators and centers)'
                      : chartPeriod === 'monthly'
                        ? role === USER_ROLES.superAdmin
                          ? 'Last 12 months — new students across all centers'
                          : 'Last 12 months — new students at your center'
                        : role === USER_ROLES.superAdmin
                          ? 'Total new students aggregated by calendar year'
                          : 'New students at your center by calendar year'}
                  </Typography>
                </Box>

                <TextField
                  select
                  size="small"
                  value={chartPeriod}
                  className="dashboard-screen__period-select"
                  onChange={(event) =>
                    setChartPeriod(event.target.value as 'monthly' | 'yearly')
                  }
                  slotProps={{
                    select: { displayEmpty: true },
                    htmlInput: { 'aria-label': 'Chart period' },
                  }}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </TextField>
              </Box>

              {statsError && loadStudentStats ? (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                  Student statistics failed to load — the chart is showing sample data.
                </Alert>
              ) : null}

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
                  <span>New students (bars)</span>
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
                  <span>Trend (line)</span>
                </Box>
              </Box>

              <Box className="dashboard-line-chart__canvas">
                {yTicks.slice(0, -1).map((value, index) => (
                  <Box
                    key={`grid-${value}`}
                    className="dashboard-line-chart__grid-line"
                    sx={{ top: `${18 + index * 56}px` }}
                  />
                ))}

                {yTicks.map((value, index) => (
                  <Box
                    key={`ylabel-${value}`}
                    className="dashboard-line-chart__y-label"
                    sx={{ top: `${18 + index * 56}px` }}
                  >
                    {value}
                  </Box>
                ))}

                <Box className="dashboard-line-chart__columns">
                  {chartPoints.map((item, index) => (
                    <Box key={`${item.label}-${index}`} className="dashboard-line-chart__month">
                      <Box
                        className="dashboard-line-chart__bar"
                        sx={
                          {
                            '--bar-height': `${norm(item.bars) * 7}px`,
                          } as CSSProperties
                        }
                      />
                      {index < chartPoints.length - 1 ? (
                        <Box
                          className="dashboard-line-chart__line-segment"
                          sx={getLineSegmentStyle(
                            norm(item.line),
                            norm(chartPoints[index + 1].line),
                          )}
                        />
                      ) : null}
                      <Box
                        className="dashboard-line-chart__point"
                        sx={
                          {
                            '--point-height': `${norm(item.line) * 7}px`,
                          } as CSSProperties
                        }
                      />
                      <Typography component="span" className="dashboard-line-chart__month-label">
                        {item.label}
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
                  Pass mark:
                </Typography>
                <Box className="dashboard-average__ticks">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DashboardPageRoot>
    </Layout>
  )
}
