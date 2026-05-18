import {
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useLazyQuery, useMutation } from '@apollo/client/react'

import { tryGetGraphQLErrorMessage } from '../../helpers/graphql'
import { useAppSelector } from '../../store/hooks'
import { selectAuthToken, selectUserRole } from '../../store'
import {
  FIND_MY_NOTIFICATIONS_QUERY,
  type FindMyNotificationsResponse,
} from '../../pages/Notifications/api/findMyNotificationsQuery'
import {
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_NOTIFICATION_AS_READ_MUTATION,
} from '../../pages/Notifications/api/notificationMutations'
import { NotificationsContext } from './notificationsContext'
import type { AppNotification, NotificationCategory } from '@/types/notifications'

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
  const userRole = useAppSelector(selectUserRole)

  const [fetchNotifications, { data, loading, error, refetch }] =
    useLazyQuery<FindMyNotificationsResponse>(FIND_MY_NOTIFICATIONS_QUERY, {
      fetchPolicy: 'cache-and-network',
    })

  useEffect(() => {
    if (!authToken || !userRole) {
      return
    }

    void fetchNotifications()
  }, [authToken, userRole, fetchNotifications])

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION)
  const [markAllNotificationsAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION)

  const notifications = useMemo(
    () =>
      authToken && userRole
        ? (data?.findMyNotifications ?? []).map(mapNotification)
        : [],
    [authToken, userRole, data],
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
      error: tryGetGraphQLErrorMessage(error),
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
