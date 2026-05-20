import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Alert, Box, Typography } from '@mui/material'

import { c, tokens } from '../../../theme'
import { Layout } from '../../../components/layout'
import { Select } from '../../../components/common/Select'
import { FIND_ALL_EXAMS_QUERY } from '../../CreateExam/api/findAllExamsQuery'
import { FIND_ALL_QUESTIONS_QUERY, type FindAllQuestionsResponse, type GroupedQuestionItem } from '../../Questions/api/findAllQuestionsQuery'
import { selectAuthToken, selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import {
  STUDENT_DASHBOARD_STATS_QUERY,
  type StudentDashboardStatsResponse,
} from '../api/studentDashboardStatsQuery'
import { DashboardPageRoot } from './DashboardPage.style'
import { StudentDashboardPage } from './StudentDashboardPage'

const ME_CENTER_CREDITS_QUERY = gql`
  query MeCenterCredits {
    meCenter {
      availableExamCredits
    }
  }
`

type ChartRow = { monthLabel: string; yearLabel: string; bars: number; line: number }

function parseMonthKey(ym: string): { monthLabel: string; yearLabel: string } {
  const parts = ym.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  if (!y || !m) {
    return { monthLabel: ym, yearLabel: '' }
  }

  const date = new Date(y, m - 1, 1)
  return {
    monthLabel: date.toLocaleDateString('en-US', { month: 'short' }),
    yearLabel: String(y),
  }
}

const CHART_TICK_TOP_PX = [18, 74, 130, 186, 242] as const
const CHART_CONTENT_TOP_PX = 18
const CHART_CANVAS_HEIGHT_PX = 280
const CHART_CANVAS_PADDING_BOTTOM_PX = 84
const CHART_COLUMN_HEIGHT_PX =
  CHART_CANVAS_HEIGHT_PX - CHART_CONTENT_TOP_PX - CHART_CANVAS_PADDING_BOTTOM_PX

type ChartScale = {
  yMax: number
  ticks: number[]
}

function buildChartScale(maxValue: number): ChartScale {
  if (maxValue <= 0) {
    return { yMax: 10, ticks: [10, 8, 5, 2, 0] }
  }

  const padded = Math.ceil(maxValue * 1.15)
  const magnitude = 10 ** Math.floor(Math.log10(padded))
  const normalized = padded / magnitude
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  const yMax = nice * magnitude

  const ticks = [0, 1, 2, 3, 4].map((index) =>
    Math.round((yMax * (4 - index)) / 4),
  )

  return { yMax, ticks }
}

function tickValueToBottomPx(value: number, scale: ChartScale) {
  const clamped = Math.max(0, Math.min(value, scale.yMax))
  const valuesAsc = [...scale.ticks].reverse()
  const bottomsAsc = CHART_TICK_TOP_PX.map(
    (top) => CHART_COLUMN_HEIGHT_PX - (top - CHART_CONTENT_TOP_PX),
  ).reverse()

  for (let index = 0; index < valuesAsc.length - 1; index += 1) {
    const low = valuesAsc[index]
    const high = valuesAsc[index + 1]
    if (clamped <= high) {
      const ratio = high === low ? 0 : (clamped - low) / (high - low)
      return bottomsAsc[index] + ratio * (bottomsAsc[index + 1] - bottomsAsc[index])
    }
  }

  return bottomsAsc[bottomsAsc.length - 1]
}

function getLineSegmentStyle(
  startValue: number,
  endValue: number,
  scale: ChartScale,
): CSSProperties {
  const startBottom = tickValueToBottomPx(startValue, scale)
  const endBottom = tickValueToBottomPx(endValue, scale)
  const delta = endBottom - startBottom
  const width = Math.sqrt(58 ** 2 + delta ** 2)
  const angle = Math.atan2(delta, 58) * (180 / Math.PI)

  return {
    ['--line-bottom' as string]: `${startBottom - 1.5}px`,
    ['--angle' as string]: `${-angle}deg`,
    width: `${width}px`,
  }
}

const MOCK_CHART_ROWS: ChartRow[] = [
  { monthLabel: 'Jan', yearLabel: '2025', bars: 22, line: 10 },
  { monthLabel: 'Feb', yearLabel: '2025', bars: 30, line: 12 },
  { monthLabel: 'Mar', yearLabel: '2025', bars: 14, line: 11 },
  { monthLabel: 'Apr', yearLabel: '2025', bars: 14, line: 10 },
  { monthLabel: 'May', yearLabel: '2025', bars: 26, line: 16 },
  { monthLabel: 'Jun', yearLabel: '2025', bars: 34, line: 22 },
  { monthLabel: 'Jul', yearLabel: '2025', bars: 36, line: 27 },
  { monthLabel: 'Aug', yearLabel: '2025', bars: 24, line: 21 },
  { monthLabel: 'Sep', yearLabel: '2025', bars: 17, line: 12 },
  { monthLabel: 'Oct', yearLabel: '2025', bars: 15, line: 10 },
  { monthLabel: 'Nov', yearLabel: '2025', bars: 22, line: 16 },
  { monthLabel: 'Dec', yearLabel: '2025', bars: 40, line: 15 },
]

const DEFAULT_STUDENT_SPARK = [34, 46, 42, 16, 38, 24, 58, 36, 12, 22, 26, 18, 44, 50]

const averageResults = [
  {
    subject: 'Mathematics',
    segments: [
      { color: c.chart.easy, width: '24%' },
      { color: c.chart.medium, width: '22%' },
      { color: c.chart.difficult, width: '12%' },
      { color: c.chart.hard, width: '32%' },
      { color: c.chart.empty, width: '10%', empty: true },
    ],
  },
  {
    subject: 'English 1',
    segments: [
      { color: c.chart.easy, width: '38%' },
      { color: c.chart.medium, width: '8%' },
      { color: c.chart.difficult, width: '30%' },
      { color: c.chart.hard, width: '18%' },
      { color: c.chart.empty, width: '6%', empty: true },
    ],
  },
  {
    subject: 'Science 2',
    segments: [
      { color: c.chart.easy, width: '9%' },
      { color: c.chart.medium, width: '36%' },
      { color: c.chart.difficult, width: '24%' },
      { color: c.chart.hard, width: '18%' },
      { color: c.chart.empty, width: '13%', empty: true },
    ],
  },
  {
    subject: 'Economics',
    segments: [
      { color: c.chart.easy, width: '24%' },
      { color: c.chart.medium, width: '16%' },
      { color: c.chart.difficult, width: '28%' },
      { color: c.chart.hard, width: '8%' },
      { color: c.chart.empty, width: '24%', empty: true },
    ],
  },
]

const legendItems = [
  { label: 'Easy questions', color: c.chart.easy, soft: tokens.rgba.primary_12 },
  { label: 'Medium questions', color: c.chart.medium, soft: tokens.rgba.chartMedium_12 },
  { label: 'Difficult questions', color: c.chart.difficult, soft: tokens.rgba.chartDifficult_12 },
  { label: 'Hard', color: c.chart.hard, soft: tokens.rgba.chartHard_12 },
]

type QuestionsCountResponse = FindAllQuestionsResponse

type QuestionModuleType = 'Listening' | 'Reading' | 'Writing' | 'Speaking'

function resolveIeltsModule(q: GroupedQuestionItem['questions'][number]): QuestionModuleType {
  const modules: QuestionModuleType[] = ['Listening', 'Reading', 'Writing', 'Speaking']
  const stored = q.ieltsModule?.trim()
  if (stored && modules.includes(stored as QuestionModuleType)) {
    return stored as QuestionModuleType
  }
  if (q.listeningAudio?.trim()) return 'Listening'
  if (q.speakingAudio?.trim()) return 'Speaking'
  if (q.questionsHtml?.trim()) return 'Reading'
  const hasOptions = (q.options?.length ?? 0) > 0
  return q.type === 'input' && !hasOptions ? 'Writing' : 'Listening'
}

function getCenterIdFromToken(token: string | null): string | null {
  if (!token) {
    return null
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const payload = JSON.parse(atob(padded)) as { centerId?: string | null }
    return payload.centerId ?? null
  } catch {
    return null
  }
}

function buildQuestionModuleStats(groups: GroupedQuestionItem[] | undefined) {
  const allQuestions = (groups ?? []).flatMap((group) => group.questions)
  const groupMap = new Map<string, QuestionModuleType>()

  for (const question of allQuestions) {
    const module = resolveIeltsModule(question)
    const examKey = question.examId?.trim() || 'pool'
    const groupId = question.groupId?.trim() || `legacy::${examKey}::${module}`
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, module)
    }
  }

  const rows = Array.from(groupMap.values())
  const countByModule = (module: QuestionModuleType) =>
    rows.filter((rowModule) => rowModule === module).length

  return {
    total: rows.length,
    listening: countByModule('Listening'),
    reading: countByModule('Reading'),
    writing: countByModule('Writing'),
  }
}

export function AdminDashboardPage() {
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

  const { data: examsData } = useQuery<{
    findAllExams: Array<{ _id: string; centerId?: string | null }>
  }>(FIND_ALL_EXAMS_QUERY, {
    skip: !loadStudentStats,
  })

  const { data: meCenterData } = useQuery<{
    meCenter?: { availableExamCredits?: number } | null
  }>(ME_CENTER_CREDITS_QUERY, {
    skip: !token || role !== USER_ROLES.center,
  })

  const stats = statsData?.studentDashboardStats
  const availableExamCredits = meCenterData?.meCenter?.availableExamCredits ?? 0
  const actorCenterId = useMemo(() => getCenterIdFromToken(token), [token])

  const examCount = useMemo(() => {
    const exams = examsData?.findAllExams ?? []
    if (role === USER_ROLES.center && actorCenterId) {
      return exams.filter((exam) => exam.centerId === actorCenterId).length
    }
    return exams.length
  }, [actorCenterId, examsData?.findAllExams, role])

  const aggregatedMonthly = useMemo(() => {
    if (!stats?.centers?.length) {
      return null
    }

    const keys = stats.centers[0].monthlyNewStudents.map((row) => row.month)

    return keys.map((month) => {
      const { monthLabel, yearLabel } = parseMonthKey(month)
      return {
        key: month,
        monthLabel,
        yearLabel,
        bars: stats.centers.reduce((sum, center) => {
          const row = center.monthlyNewStudents.find((m) => m.month === month)
          return sum + (row?.count ?? 0)
        }, 0),
      }
    })
  }, [stats])

  const chartPoints: ChartRow[] = useMemo(() => {
    if (!aggregatedMonthly?.length) {
      return MOCK_CHART_ROWS
    }

    if (chartPeriod === 'monthly') {
      return aggregatedMonthly.map((row) => ({
        monthLabel: row.monthLabel,
        yearLabel: row.yearLabel,
        bars: row.bars,
        line: row.bars,
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
        monthLabel: '',
        yearLabel: year,
        bars,
        line: bars,
      }))
  }, [aggregatedMonthly, chartPeriod])

  const chartScale = useMemo(() => {
    const maxBars = Math.max(0, ...chartPoints.map((point) => point.bars))
    return buildChartScale(maxBars)
  }, [chartPoints])

  const chartZeroBottomPx = useMemo(
    () => tickValueToBottomPx(0, chartScale),
    [chartScale],
  )

  const monthlyStudentRows = useMemo(() => {
    if (!aggregatedMonthly?.length) {
      return null
    }

    return aggregatedMonthly.map((row) => ({
      label: `${row.monthLabel} ${row.yearLabel}`.trim(),
      count: row.bars,
    }))
  }, [aggregatedMonthly])

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

  const questionModuleStats = useMemo(
    () => (questionsData ? buildQuestionModuleStats(questionsData.findAllQuestions) : undefined),
    [questionsData],
  )

  const questionModuleBars = useMemo(() => {
    const stats = questionModuleStats ?? { listening: 16, reading: 12, writing: 8 }
    const items = [
      { key: 'listening', label: 'Listening', count: stats.listening },
      { key: 'reading', label: 'Reading', count: stats.reading },
      { key: 'writing', label: 'Writing', count: stats.writing },
    ]
    const maxCount = Math.max(1, ...items.map((item) => item.count))

    return items.map((item) => ({
      ...item,
      height: Math.round(14 + (item.count / maxCount) * 50),
    }))
  }, [questionModuleStats])

  const totalStudentsValue =
    loadStudentStats && stats ? String(stats.totals.totalStudents) : loadStudentStats ? '…' : '—'

  const newStudentValue =
    loadStudentStats && stats ? String(stats.totals.newStudentsThisMonth) : loadStudentStats ? '…' : '—'

  const examsValue = loadStudentStats
    ? examsData
      ? String(examCount)
      : '…'
    : '—'

  return (
    <Layout>
      <DashboardPageRoot>
        <Box className="dashboard-screen">
          {role === USER_ROLES.center ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Available exam credits: <strong>{availableExamCredits}</strong>
            </Alert>
          ) : null}
          <Box className="dashboard-screen__stats">
            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': c.chart.easy,
                  '--soft-accent': tokens.rgba.primary_12,
                  '--delta-color': c.chart.delta,
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    Total students
                  </Typography>
                  <Box className="dashboard-stat__value-row">
                    <Typography component="h2" className="dashboard-stat__value">
                      {totalStudentsValue}
                    </Typography>
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    {loadStudentStats && stats
                      ? `${stats.totals.newStudentsThisMonth} joined this month`
                      : 'All registered students'}
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__badge">👥</Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__sparkbars">
                {studentSparkBars.map((bar, index) => (
                  <Box
                    key={`total-spark-${bar}-${index}`}
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
                <Box className="dashboard-stat__footer-icon">◔</Box>
                <Typography component="p" className="dashboard-stat__footer-text">
                  {role === USER_ROLES.superAdmin
                    ? 'Students registered across all centers'
                    : 'Students registered at your center'}
                </Typography>
              </Box>
            </Box>

            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': c.primary.light,
                  '--soft-accent': tokens.rgba.primaryLight_12,
                  '--delta-color': newStudentDelta.down ? c.chart.deltaDown : c.chart.delta,
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
                  '--accent': c.chart.medium,
                  '--soft-accent': tokens.rgba.chartMedium_12,
                  '--delta-color': c.chart.delta,
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    Exams
                  </Typography>
                  <Box className="dashboard-stat__value-row">
                    <Typography component="h2" className="dashboard-stat__value">
                      {examsValue}
                    </Typography>
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    {role === USER_ROLES.center ? 'Exams at your center' : 'Exams in the system'}
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__badge">📝</Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__footer">
                <Box className="dashboard-stat__footer-icon">◌</Box>
                <Typography component="p" className="dashboard-stat__footer-text">
                  Mock exams you can schedule and assign to students
                </Typography>
              </Box>
            </Box>

            <Box
              className="dashboard-stat"
              sx={
                {
                  '--accent': c.teal.main,
                  '--soft-accent': tokens.rgba.teal_12,
                  '--delta-color': c.chart.deltaDown,
                } as CSSProperties
              }
            >
              <Box className="dashboard-stat__header">
                <Box>
                  <Typography component="p" className="dashboard-stat__eyebrow">
                    Questions
                  </Typography>
                  <Box className="dashboard-stat__module-grid">
                    {questionModuleBars.map((item) => (
                      <Box key={item.key} className="dashboard-stat__module-item">
                        <Typography component="p" className="dashboard-stat__module-count">
                          {questionModuleStats != null ? String(item.count) : loadStudentStats ? '…' : '—'}
                        </Typography>
                        <Typography component="p" className="dashboard-stat__module-label">
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography component="span" className="dashboard-stat__delta">
                    {questionModuleStats != null
                      ? `${questionModuleStats.total} total`
                      : '↘ +2.56%'}
                  </Typography>
                </Box>
                <Box className="dashboard-stat__visual">
                  <Box className="dashboard-stat__badge">?</Box>
                </Box>
              </Box>
              <Box className="dashboard-stat__module-bars">
                {questionModuleBars.map((item, index) => (
                  <Box key={item.key} className="dashboard-stat__module-bar-wrap">
                    <Box
                      className="dashboard-stat__module-bar"
                      sx={
                        {
                          '--bar-height': `${item.height}px`,
                          '--bar-opacity': index === 1 ? 0.88 : 1,
                        } as CSSProperties
                      }
                    />
                    <Typography component="span" className="dashboard-stat__module-bar-label">
                      {item.label}
                    </Typography>
                  </Box>
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

                <Select
                  size="sm"
                  value={chartPeriod}
                  className="dashboard-screen__period-select"
                  onChange={(event) =>
                    setChartPeriod(event.target.value as 'monthly' | 'yearly')
                  }
                  slotProps={{
                    select: { displayEmpty: true },
                    htmlInput: { 'aria-label': 'Chart period' },
                  }}
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
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
                        '--legend-color': c.chart.easy,
                        '--legend-soft': tokens.rgba.primary_12,
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
                        '--legend-color': c.chart.pinkSoft,
                        '--legend-soft': tokens.rgba.primaryLight_22,
                      } as CSSProperties
                    }
                  />
                  <span>Trend (line)</span>
                </Box>
              </Box>

              <Box className="dashboard-line-chart__canvas">
                {chartScale.ticks.slice(0, -1).map((value, index) => (
                  <Box
                    key={`grid-${value}`}
                    className="dashboard-line-chart__grid-line"
                    sx={{ top: `${18 + index * 56}px` }}
                  />
                ))}

                {chartScale.ticks.map((value, index) => (
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
                    <Box key={`${item.yearLabel}-${item.monthLabel}-${index}`} className="dashboard-line-chart__month">
                      <Box
                        className="dashboard-line-chart__bar"
                        sx={
                          {
                            '--bar-bottom': `${chartZeroBottomPx}px`,
                            '--bar-height': `${Math.max(0, tickValueToBottomPx(item.bars, chartScale) - chartZeroBottomPx)}px`,
                          } as CSSProperties
                        }
                      />
                      {index < chartPoints.length - 1 ? (
                        <Box
                          className="dashboard-line-chart__line-segment"
                          sx={getLineSegmentStyle(
                            item.line,
                            chartPoints[index + 1].line,
                            chartScale,
                          )}
                        />
                      ) : null}
                      <Box
                        className="dashboard-line-chart__point"
                        sx={
                          {
                            '--point-bottom': `${tickValueToBottomPx(item.line, chartScale) - 5}px`,
                          } as CSSProperties
                        }
                      />
                      <Box className="dashboard-line-chart__month-labels">
                        {item.monthLabel ? (
                          <Typography component="span" className="dashboard-line-chart__month-label">
                            {item.monthLabel}
                          </Typography>
                        ) : null}
                        {item.yearLabel ? (
                          <Typography component="span" className="dashboard-line-chart__year-label">
                            {item.yearLabel}
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {monthlyStudentRows ? (
                <Box className="dashboard-line-chart__month-table">
                  <Typography component="h3" className="dashboard-line-chart__month-table-title">
                    Students per month
                  </Typography>
                  <Box className="dashboard-line-chart__month-table-head">
                    <span>Month</span>
                    <span>New students</span>
                  </Box>
                  {monthlyStudentRows.map((row) => (
                    <Box key={row.label} className="dashboard-line-chart__month-table-row">
                      <span>{row.label}</span>
                      <strong>{row.count}</strong>
                    </Box>
                  ))}
                </Box>
              ) : null}
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

export function DashboardPage() {
  const role = useAppSelector(selectUserRole)

  if (role === USER_ROLES.student) {
    return <StudentDashboardPage />
  }

  return <AdminDashboardPage />
}
