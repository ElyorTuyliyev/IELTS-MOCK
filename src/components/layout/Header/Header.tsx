import { Box, Button, IconButton, Typography } from '@mui/material'
import { HeaderRoot } from './Header.style'

const team = ['TA', 'SN', 'AR', '10+']

export function Header() {
  return (
    <HeaderRoot className="content__topbar">
      <Box component="header" className="content__hero">
        <Box className="content__hero-copy">
          <Typography component="h1" className="content__title">
            Good Mornings, Tahsan
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
