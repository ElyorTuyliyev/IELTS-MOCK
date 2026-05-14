import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import { ROUTES_PATH } from '../../../routes/paths'
import { NotFoundPageRoot } from './NotFoundPage.style'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <NotFoundPageRoot>
      <Box className="not-found__card">
        <Typography className="not-found__code">404</Typography>
        <Typography className="not-found__title">Page Not Found</Typography>
        <Typography className="not-found__description">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box className="not-found__actions">
          <Button
            variant="primary"
            className="not-found__btn-home"
            onClick={() => navigate(ROUTES_PATH.dashboard)}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            className="not-found__btn-back"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </NotFoundPageRoot>
  )
}
