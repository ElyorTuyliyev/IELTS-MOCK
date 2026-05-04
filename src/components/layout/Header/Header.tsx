import { useCallback, useMemo, useState } from 'react'
import { Box, Button, IconButton, Snackbar, Typography } from '@mui/material'
import { useAppSelector } from '../../../store/hooks'
import { selectAuthToken, selectUserName, selectUserRole } from '../../../store'
import { ROUTES_PATH } from '../../../routes/paths'
import { USER_ROLES, type UserRole } from '../../../store/slices/authSlice'
import { HeaderRoot } from './Header.style'

const team = ['TA', 'SN', 'AR', '10+']

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

const MONGO_OBJECT_ID_RE = /^[a-f0-9]{24}$/i

function buildStudentInviteUrl(authToken: string | null, role: UserRole | null): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = `${origin}${ROUTES_PATH.studentLeadJoin}`
  const payload = decodeJwtPayload(authToken)

  if (role === USER_ROLES.center) {
    const centerId = payload?.centerId ?? payload?.id ?? null
    if (centerId && MONGO_OBJECT_ID_RE.test(centerId)) {
      return `${base}?centerId=${encodeURIComponent(centerId)}`
    }
  }

  return base
}

export function Header() {
  const userName = useAppSelector(selectUserName)
  const authToken = useAppSelector(selectAuthToken)
  const userRole = useAppSelector(selectUserRole)
  const [copyOpen, setCopyOpen] = useState(false)

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
    setCopyOpen(true)
  }, [inviteUrl])

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
          <IconButton className="content__icon-button" aria-label="Messages">
            ✉
          </IconButton>
          <IconButton className="content__icon-button" aria-label="Notifications">
            🔔
          </IconButton>

          <Box className="content__team" aria-label="Team">
            {team.map((member) => (
              <Box key={member} component="span" className="content__team-member">
                {member}
              </Box>
            ))}
          </Box>

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
        </Box>
      </Box>

      <Snackbar
        open={copyOpen}
        autoHideDuration={4000}
        onClose={() => setCopyOpen(false)}
        message="Invite link copied to clipboard. Share it with students."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </HeaderRoot>
  )
}
