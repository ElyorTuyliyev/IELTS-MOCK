import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import type { HTMLAttributes } from 'react'

import {
  DayBadge,
  Fallback,
  MainLine,
  MetaColumn,
  Root,
  WeekdayRow,
  type DateDisplaySize,
} from './DateDisplay.style'

export type DateDisplayProps = {
  /** ISO string, `YYYY-MM-DD`, timestamp, or `Date` */
  value: string | Date | null | undefined
  size?: DateDisplaySize
  /** Passed to `toLocaleDateString` (e.g. `'uz'`, `'en-US'`) */
  locale?: string | string[]
  /** Shown when value is missing or not parseable */
  emptyLabel?: string
  /** Visually hide the calendar icon in the weekday row */
  hideIcon?: boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

function parseCalendarDate(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const trimmed = value.trim()
  if (!trimmed) return null

  const m = trimmed.match(ISO_DATE_ONLY)
  if (m) {
    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])
    const local = new Date(y, mo - 1, d, 12, 0, 0, 0)
    return Number.isNaN(local.getTime()) ? null : local
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function DateDisplay({
  value,
  size = 'md',
  locale,
  emptyLabel = '—',
  hideIcon = false,
  className,
  ...rest
}: DateDisplayProps) {
  const date = value == null || value === '' ? null : parseCalendarDate(value instanceof Date ? value : String(value))

  if (!date) {
    return (
      <Root
        $size={size}
        role="group"
        aria-label={emptyLabel}
        className={['date-display', 'date-display--empty', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <Fallback>{emptyLabel}</Fallback>
      </Root>
    )
  }

  const loc = locale ?? undefined
  const day = date.toLocaleDateString(loc, { day: 'numeric' })
  const weekday = date.toLocaleDateString(loc, { weekday: 'short' })
  const month = date.toLocaleDateString(loc, { month: 'short' })
  const year = date.toLocaleDateString(loc, { year: 'numeric' })

  const iconSize = size === 'sm' ? 14 : 16

  const ariaLabel = date.toLocaleDateString(loc, { dateStyle: 'full' })

  return (
    <Root
      $size={size}
      role="group"
      aria-label={ariaLabel}
      className={['date-display', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <DayBadge $size={size} aria-hidden>
        {day}
      </DayBadge>
      <MetaColumn>
        <WeekdayRow>
          {!hideIcon ? (
            <CalendarTodayRoundedIcon sx={{ fontSize: iconSize, opacity: 0.72 }} aria-hidden />
          ) : null}
          <span>{weekday}</span>
        </WeekdayRow>
        <MainLine>
          {month} {year}
        </MainLine>
      </MetaColumn>
    </Root>
  )
}
