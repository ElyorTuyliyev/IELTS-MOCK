import { createContext, useContext } from 'react'

import type { AppNotification } from '@/types/notifications'

export type NotificationsContextValue = {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
