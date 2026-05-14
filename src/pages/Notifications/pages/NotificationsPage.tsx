import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import {
  formatNotificationTime,
  NOTIFICATION_CATEGORY_ICONS,
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_STYLES,
  useNotifications,
} from '../../../features/notifications'
import { useAppSelector } from '../../../store/hooks'
import { selectUserRole } from '../../../store'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { NotificationsPageRoot } from './NotificationsPage.style'

type NotificationFilter = 'all' | 'unread'

export function NotificationsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const userRole = useAppSelector(selectUserRole)
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading, error } =
    useNotifications()
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const isStudent = userRole === USER_ROLES.student
  const readCount = notifications.length - unreadCount

  const visibleNotifications = useMemo(() => {
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    if (filter === 'unread') {
      return sorted.filter((item) => !item.read)
    }

    return sorted
  }, [filter, notifications])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error, toast])

  const handleOpenNotification = async (id: string, href?: string) => {
    await markAsRead(id)
    if (href) {
      navigate(href)
    }
  }

  return (
    <Layout>
      <NotificationsPageRoot>
        <Box className="notifications-page">
          <Box className="notifications-page__hero">
            <Box className="notifications-page__hero-icon" aria-hidden="true">
              <NotificationsNoneOutlinedIcon />
            </Box>
            <Box className="notifications-page__hero-copy">
              <Typography component="h1" className="notifications-page__title">
                Notifications
              </Typography>
              <Typography component="p" className="notifications-page__subtitle">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread update${unreadCount === 1 ? '' : 's'} waiting for you.`
                  : 'You are all caught up. No new updates right now.'}
              </Typography>
            </Box>
          </Box>

          <Box className="notifications-page__stats">
            <Box className="notifications-page__stat notifications-page__stat--total">
              <span className="notifications-page__stat-value">{notifications.length}</span>
              <span className="notifications-page__stat-label">Total</span>
            </Box>
            <Box className="notifications-page__stat notifications-page__stat--unread">
              <span className="notifications-page__stat-value">{unreadCount}</span>
              <span className="notifications-page__stat-label">Unread</span>
            </Box>
            <Box className="notifications-page__stat notifications-page__stat--read">
              <span className="notifications-page__stat-value">{readCount}</span>
              <span className="notifications-page__stat-label">Read</span>
            </Box>
          </Box>

          <Box className="notifications-page__panel">
            <Box className="notifications-page__toolbar">
              <Box className="notifications-page__filters">
                <Button
                  className={`notifications-page__filter${
                    filter === 'all' ? ' notifications-page__filter--active' : ''
                  }`}
                  variant="text"
                  onClick={() => setFilter('all')}
                >
                  All
                  <span className="notifications-page__filter-count">{notifications.length}</span>
                </Button>
                <Button
                  className={`notifications-page__filter${
                    filter === 'unread' ? ' notifications-page__filter--active' : ''
                  }`}
                  variant="text"
                  onClick={() => setFilter('unread')}
                >
                  Unread
                  <span className="notifications-page__filter-count">{unreadCount}</span>
                </Button>
              </Box>

              {unreadCount > 0 ? (
                <Button
                  className="notifications-page__mark-all"
                  variant="secondary"
                  startIcon={<DoneAllOutlinedIcon />}
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              ) : null}
            </Box>

            {loading && visibleNotifications.length === 0 ? (
              <Box className="notifications-page__loading">
                <CircularProgress size={28} />
              </Box>
            ) : visibleNotifications.length > 0 ? (
              <Box className="notifications-page__list">
                {visibleNotifications.map((item) => {
                  const Icon = NOTIFICATION_CATEGORY_ICONS[item.category]
                  const categoryStyle = NOTIFICATION_CATEGORY_STYLES[item.category]

                  return (
                    <Box
                      key={item.id}
                      component="button"
                      type="button"
                      className={`notifications-page__item${
                        item.read ? '' : ' notifications-page__item--unread'
                      }`}
                      onClick={() => handleOpenNotification(item.id, item.href)}
                      style={{ '--accent-color': categoryStyle.accent } as React.CSSProperties}
                    >
                      {!item.read ? <span className="notifications-page__accent" /> : null}

                      <Box
                        className="notifications-page__icon"
                        style={{
                          background: categoryStyle.iconBg,
                          color: categoryStyle.iconColor,
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="notifications-page__icon-svg" fontSize="small" />
                      </Box>

                      <Box className="notifications-page__content">
                        <Box className="notifications-page__item-head">
                          <Typography component="h2" className="notifications-page__item-title">
                            {item.title}
                          </Typography>
                          <span
                            className="notifications-page__badge"
                            style={{
                              background: categoryStyle.badgeBg,
                              color: categoryStyle.badgeColor,
                            }}
                          >
                            {NOTIFICATION_CATEGORY_LABELS[item.category]}
                          </span>
                        </Box>
                        <Typography component="p" className="notifications-page__message">
                          {item.message}
                        </Typography>
                        <span className="notifications-page__time">
                          {formatNotificationTime(item.createdAt)}
                        </span>
                      </Box>

                      <Box className="notifications-page__meta">
                        {!item.read ? (
                          <span className="notifications-page__pill">New</span>
                        ) : null}
                        {item.href ? (
                          <ChevronRightOutlinedIcon className="notifications-page__chevron" />
                        ) : null}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            ) : (
              <Box className="notifications-page__empty">
                <Box className="notifications-page__empty-icon" aria-hidden="true">
                  <NotificationsNoneOutlinedIcon />
                </Box>
                <Typography component="h2">No notifications here</Typography>
                <Typography component="p">
                  {filter === 'unread'
                    ? 'Unread notifications will appear in this list.'
                    : isStudent
                      ? 'Exam assignments, reminders, and result updates will show up here.'
                      : 'New updates about exams, students, and payments will show up here.'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </NotificationsPageRoot>
    </Layout>
  )
}
