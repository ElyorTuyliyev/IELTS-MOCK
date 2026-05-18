import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

import { c } from '../../theme'
import { USER_ROLES, type UserRole } from '@/store/slices/authSlice'
import type { NotificationCategory } from '@/types/notifications'

export const NOTIFICATION_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.superAdmin]: 'Super Admin',
  [USER_ROLES.center]: 'Center',
  [USER_ROLES.student]: 'Student',
}

export function getNotificationRoleCopy(role: UserRole | null) {
  switch (role) {
    case USER_ROLES.superAdmin:
      return {
        title: 'Platform notifications',
        subtitle:
          'Billing, plan purchases, signup leads, and platform updates for super admins.',
        emptyAll:
          'Platform-wide updates about centers, payments, and signups will appear here.',
        emptyUnread: 'Unread platform updates will appear in this list.',
      }
    case USER_ROLES.center:
      return {
        title: 'Center notifications',
        subtitle:
          'Student signups, exams, credits, and plan updates for your center.',
        emptyAll:
          'Updates about your students, exams, and plan purchases will show up here.',
        emptyUnread: 'Unread center updates will appear in this list.',
      }
    case USER_ROLES.student:
      return {
        title: 'Your notifications',
        subtitle: 'Exam assignments, reminders, and results for your account.',
        emptyAll:
          'Exam assignments, reminders, and result updates will show up here.',
        emptyUnread: 'Unread exam and result updates will appear in this list.',
      }
    default:
      return {
        title: 'Notifications',
        subtitle: 'Updates for your account.',
        emptyAll: 'New updates will show up here.',
        emptyUnread: 'Unread notifications will appear in this list.',
      }
  }
}

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
