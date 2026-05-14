import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { Badge, Box, IconButton, Typography } from '@mui/material'
import { Button } from '../../common/Button'
import { useToast } from '../../common/Toast'
import { useAppSelector } from '../../../store/hooks'
import { selectAuthToken, selectUserName, selectUserRole } from '../../../store'
import { ROUTES_PATH } from '../../../routes/paths'
import { USER_ROLES, type UserRole } from '../../../store/slices/authSlice'
import { useNotifications } from '../../../features/notifications'
import { isMongoObjectId } from '../../../helpers'
import { HeaderRoot } from './Header.style'

type JwtPayload = {
  firstName?: string | null
  lastName?: string | null
  role?: string | null
  centerId?: string | null
  id?: string | null
}

function decodeJwtPayload(authToken: string | null): JwtPayload | null {
  if (!authToken) {
    return null
  }

  const parts = authToken.split('.')
  if (parts.length < 2) {
    return null
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as JwtPayload
  } catch {
    return null
  }
}

function buildStudentInviteUrl(authToken: string | null, role: UserRole | null): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = `${origin}${ROUTES_PATH.studentLeadJoin}`
  const payload = decodeJwtPayload(authToken)

  if (role === USER_ROLES.center) {
    const centerId = payload?.centerId ?? payload?.id ?? null
    if (centerId && isMongoObjectId(centerId)) {
      return `${base}?centerId=${encodeURIComponent(centerId)}`
    }
  }

  return base
}

export function Header() {
  const navigate = useNavigate()
  const userName = useAppSelector(selectUserName)
  const authToken = useAppSelector(selectAuthToken)
  const userRole = useAppSelector(selectUserRole)
  const { unreadCount: notificationUnreadCount } = useNotifications()
  const toast = useToast()

  const tokenPayload = useMemo(() => decodeJwtPayload(authToken), [authToken])
  const tokenName = (() => {
    if (!tokenPayload) {
      return null
    }
    const fullName = `${tokenPayload.firstName ?? ''} ${tokenPayload.lastName ?? ''}`.trim()
    return fullName || null
  })()
  const greetingName = userName?.trim() || tokenName || 'Tahsan'

  const inviteUrl = useMemo(
    () => buildStudentInviteUrl(authToken, userRole),
    [authToken, userRole],
  )

  const showInviteStudents =
    userRole === USER_ROLES.center || userRole === USER_ROLES.superAdmin

  const handleCopyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      window.prompt('Copy invite link:', inviteUrl)
    }
    toast.success('Invite link copied to clipboard. Share it with students.')
  }, [inviteUrl, toast])

  return (
    <HeaderRoot className="content__topbar">
      <Box component="header" className="content__hero">
        <Box className="content__hero-copy">
          <Typography component="h1" className="content__title">
            Good Mornings, {greetingName}
          </Typography>
          <Typography component="p" className="content__meta">
            Exam Date: 29 Jan, 2025
          </Typography>
        </Box>

        <Box className="content__actions">
          {showInviteStudents ? (
            <Button
              type="button"
              className="content__invite-button"
              variant="text"
              onClick={handleCopyInviteLink}
            >
              Invite Students
            </Button>
          ) : null}
          <Badge
            className="content__notification-badge"
            badgeContent={
              notificationUnreadCount > 99 ? '99+' : notificationUnreadCount
            }
            color="error"
            invisible={notificationUnreadCount < 1}
            overlap="rectangular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <IconButton
              className="content__icon-button"
              aria-label="Notifications"
              onClick={() => navigate(ROUTES_PATH.notifications)}
            >
              <NotificationsOutlinedIcon className="content__notification-icon" fontSize="small" />
            </IconButton>
          </Badge>
        </Box>
      </Box>
    </HeaderRoot>
  )
}
