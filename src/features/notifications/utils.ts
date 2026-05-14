import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

import { c } from '../../theme'
import type { NotificationCategory } from '@/types/notifications'

export const NOTIFICATION_CATEGORY_ICONS: Record<NotificationCategory, SvgIconComponent> = {
  exam: AssignmentOutlinedIcon,
  student: PeopleOutlinedIcon,
  system: InfoOutlinedIcon,
  payment: PaymentOutlinedIcon,
  result: EmojiEventsOutlinedIcon,
}

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  exam: 'Exam',
  student: 'Student',
  system: 'System',
  payment: 'Payment',
  result: 'Result',
}

export const NOTIFICATION_CATEGORY_STYLES: Record<
  NotificationCategory,
  { iconBg: string; iconColor: string; badgeBg: string; badgeColor: string; accent: string }
> = {
  exam: {
    iconBg: `linear-gradient(135deg, ${c.primary.tintStrong} 0%, ${c.primary.tintBorder} 100%)`,
    iconColor: c.primary.dark,
    badgeBg: c.primary.tintStrong,
    badgeColor: c.primary.main,
    accent: c.primary.light,
  },
  student: {
    iconBg: `linear-gradient(135deg, ${c.info.bgMuted} 0%, ${c.info.border} 100%)`,
    iconColor: c.info.dark,
    badgeBg: c.info.bg,
    badgeColor: c.info.main,
    accent: c.info.light,
  },
  system: {
    iconBg: `linear-gradient(135deg, ${c.slate[200]} 0%, ${c.slate[300]} 100%)`,
    iconColor: c.text.muted,
    badgeBg: c.background.subtle,
    badgeColor: c.text.secondary,
    accent: c.text.disabled,
  },
  payment: {
    iconBg: `linear-gradient(135deg, ${c.success.bgLight} 0%, ${c.success.border} 100%)`,
    iconColor: c.success.darker,
    badgeBg: c.success.bgSoft,
    badgeColor: c.success.main,
    accent: c.success.main,
  },
  result: {
    iconBg: `linear-gradient(135deg, ${c.warning.bg} 0%, ${c.warning.highlightStrong} 100%)`,
    iconColor: c.warning.main,
    badgeBg: c.warning.bgSoft,
    badgeColor: c.warning.main,
    accent: c.warning.bright,
  },
}

export function formatNotificationTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMinutes < 1) {
    return 'Just now'
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`
  }
  if (diffHours < 24) {
    return `${diffHours} hr ago`
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
