import { Box, Button, IconButton, Typography } from '@mui/material'
import { useAppSelector } from '../../../store/hooks'
import { selectAuthToken, selectUserName } from '../../../store'
import { HeaderRoot } from './Header.style'

const team = ['TA', 'SN', 'AR', '10+']

export function Header() {
  const userName = useAppSelector(selectUserName)
  const authToken = useAppSelector(selectAuthToken)
  const tokenName = (() => {
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
      const payload = JSON.parse(atob(padded)) as {
        firstName?: string | null
        lastName?: string | null
      }
      const fullName = `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim()
      return fullName || null
    } catch {
      return null
    }
  })()
  const greetingName = userName?.trim() || tokenName || 'Tahsan'

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

          <Button className="content__invite-button" variant="text">
            Invite Students
          </Button>
        </Box>
      </Box>
    </HeaderRoot>
  )
}
