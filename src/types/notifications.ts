import type { UserRole } from '@/store/slices/authSlice'

export type NotificationCategory = 'exam' | 'student' | 'system' | 'payment' | 'result'

export type AppNotification = {
  id: string
  title: string
  message: string
  category: NotificationCategory
  createdAt: string
  read: boolean
  href?: string
}

export type NotificationTemplate = Omit<AppNotification, 'read'> & {
  audience: UserRole[]
  defaultRead?: boolean
}
