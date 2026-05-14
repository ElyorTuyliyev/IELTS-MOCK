import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useMutation, useQuery } from '@apollo/client/react'

import { useAppSelector } from '../../store/hooks'
import { selectAuthToken } from '../../store'
import {
  FIND_MY_NOTIFICATIONS_QUERY,
  type FindMyNotificationsResponse,
} from '../../pages/Notifications/api/findMyNotificationsQuery'
import {
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_NOTIFICATION_AS_READ_MUTATION,
} from '../../pages/Notifications/api/notificationMutations'
import type { AppNotification, NotificationCategory } from './types'

type NotificationsContextValue = {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'exam',
  'student',
  'system',
  'payment',
  'result',
]

function normalizeCategory(value: string): NotificationCategory {
  if (NOTIFICATION_CATEGORIES.includes(value as NotificationCategory)) {
    return value as NotificationCategory
  }
  return 'system'
}

function mapNotification(record: FindMyNotificationsResponse['findMyNotifications'][number]): AppNotification {
  return {
    id: record._id,
    title: record.title,
    message: record.message,
    category: normalizeCategory(record.category),
    createdAt: record.createdAt,
    href: record.href ?? undefined,
    read: record.read,
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const authToken = useAppSelector(selectAuthToken)

  const { data, loading, error, refetch } = useQuery<FindMyNotificationsResponse>(
    FIND_MY_NOTIFICATIONS_QUERY,
    {
      skip: !authToken,
      fetchPolicy: 'cache-and-network',
    },
  )

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION)
  const [markAllNotificationsAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION)

  const notifications = useMemo(
    () => (data?.findMyNotifications ?? []).map(mapNotification),
    [data],
  )

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  )

  const handleRefetch = useCallback(async () => {
    await refetch()
  }, [refetch])

  const markAsRead = useCallback(
    async (id: string) => {
      await markNotificationAsRead({
        variables: { _id: id },
        refetchQueries: [{ query: FIND_MY_NOTIFICATIONS_QUERY }],
      })
    },
    [markNotificationAsRead],
  )

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead({
      refetchQueries: [{ query: FIND_MY_NOTIFICATIONS_QUERY }],
    })
  }, [markAllNotificationsAsRead])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error: error?.message ?? null,
      markAsRead,
      markAllAsRead,
      refetch: handleRefetch,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      markAsRead,
      markAllAsRead,
      handleRefetch,
    ],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
