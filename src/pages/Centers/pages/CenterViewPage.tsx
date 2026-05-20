import { useQuery } from '@apollo/client/react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../../components/common/Button'
import { Layout } from '../../../components/layout'
import { formatShortDate } from '../../../helpers/dateFormat'
import { ROUTES_PATH } from '../../../routes/paths'
import { useToast } from '../../../components/common/Toast'
import type { FindOneCenterQueryResponse, FindOneCenterQueryVariables } from '@/types/centers'
import { GET_CENTER_BY_ID_QUERY } from '../api/getCenterByIdQuery'
import { CenterViewPageRoot } from './CenterViewPage.style'

function getCenterInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CenterViewPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const { centerId } = useParams<{ centerId: string }>()

  const { data, loading, error } = useQuery<
    FindOneCenterQueryResponse,
    FindOneCenterQueryVariables
  >(GET_CENTER_BY_ID_QUERY, {
    variables: { _id: centerId ?? '' },
    skip: !centerId,
  })

  const center = data?.findOneCenter ?? null

  const credits = center?.availableExamCredits ?? 0
  const manager = center?.manager?.trim() ? center.manager : 'No manager assigned'
  const isActive = credits > 0

  const contactRows = useMemo(() => {
    if (!center) return []
    return [
      {
        id: 'email',
        label: 'Email',
        value: center.email,
        href: `mailto:${center.email}`,
        iconClass: 'center-view__row-icon--email',
        Icon: EmailOutlinedIcon,
      },
      {
        id: 'phone',
        label: 'Phone',
        value: center.phone,
        href: `tel:${center.phone}`,
        iconClass: 'center-view__row-icon--phone',
        Icon: PhoneOutlinedIcon,
      },
      {
        id: 'address',
        label: 'Address',
        value: center.address,
        iconClass: 'center-view__row-icon--address',
        Icon: LocationOnOutlinedIcon,
      },
      {
        id: 'manager',
        label: 'Manager',
        value: manager,
        iconClass: 'center-view__row-icon--manager',
        Icon: PersonOutlineOutlinedIcon,
      },
    ]
  }, [center, manager])

  const timelineItems = useMemo(() => {
    if (!center) return []
    return [
      {
        label: 'Established',
        value: center.establishedAt ? formatShortDate(center.establishedAt) : '—',
      },
      {
        label: 'Account created',
        value: formatDateTime(center.createdAt),
      },
      {
        label: 'Last updated',
        value: formatDateTime(center.updatedAt),
      },
    ]
  }, [center])

  const handleGoBack = useCallback(() => {
    navigate(ROUTES_PATH.center)
  }, [navigate])

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message)
    }
  }, [error, toast])

  const showLoading = loading && !center
  const showNotFound = !loading && !center && !error

  return (
    <Layout>
      <CenterViewPageRoot>
        <Box className="center-view__topbar">
          <Button
            variant="secondary"
            className="center-view__back-btn"
            onClick={handleGoBack}
            startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            Back to centers
          </Button>
          {center ? (
            <Box className="center-view__breadcrumb" aria-label="Breadcrumb">
              <span>Centers</span>
              <span>/</span>
              <span>{center.name}</span>
            </Box>
          ) : null}
        </Box>

        {showLoading ? (
          <Box className="center-view__loading">
            <CircularProgress size={36} thickness={4} />
            <Typography className="center-view__loading-text">
              Loading center profile…
            </Typography>
          </Box>
        ) : showNotFound ? (
          <Box className="center-view__error">
            <Box className="center-view__error-icon" aria-hidden="true">
              <SearchOffOutlinedIcon />
            </Box>
            <Typography component="h2">Center not found</Typography>
            <Typography component="p">
              This center may have been removed or the link is invalid.
            </Typography>
            <Button variant="primary" onClick={handleGoBack}>
              Back to centers
            </Button>
          </Box>
        ) : center ? (
          <>
            <Box className="center-view__hero">
              <Box className="center-view__hero-inner">
                <Box className="center-view__avatar-wrap">
                  <Box className="center-view__avatar" aria-hidden="true">
                    {center.logo ? (
                      <Box component="img" src={center.logo} alt="" />
                    ) : (
                      getCenterInitials(center.name)
                    )}
                  </Box>
                  {isActive ? (
                    <Box className="center-view__avatar-badge" aria-label="Active center">
                      <CheckCircleOutlinedIcon />
                    </Box>
                  ) : null}
                </Box>

                <Box className="center-view__hero-content">
                  <Typography component="span" className="center-view__hero-label">
                    <BusinessOutlinedIcon sx={{ fontSize: 14 }} />
                    Center profile
                  </Typography>
                  <Typography component="h1" className="center-view__hero-title">
                    {center.name}
                  </Typography>
                  <Typography component="p" className="center-view__hero-manager">
                    Managed by <strong>{manager}</strong>
                  </Typography>

                  <Box className="center-view__chips">
                    <Box className="center-view__chip center-view__chip--credits">
                      <ConfirmationNumberOutlinedIcon />
                      {credits} exam credits
                    </Box>
                    <Box
                      className={`center-view__chip ${
                        isActive
                          ? 'center-view__chip--active'
                          : 'center-view__chip--inactive'
                      }`}
                    >
                      {isActive ? 'Active' : 'No credits'}
                    </Box>
                    {center.establishedAt ? (
                      <Box className="center-view__chip center-view__chip--date">
                        <EventOutlinedIcon />
                        Est. {formatShortDate(center.establishedAt)}
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="center-view__stats">
              <Box className="center-view__stat center-view__stat--credits">
                <Box className="center-view__stat-icon" aria-hidden="true">
                  <ConfirmationNumberOutlinedIcon />
                </Box>
                <Typography component="p" className="center-view__stat-label">
                  Exam credits
                </Typography>
                <Typography component="p" className="center-view__stat-value">
                  {credits}
                </Typography>
                <Typography component="p" className="center-view__stat-meta">
                  Available for student exams
                </Typography>
              </Box>

              <Box className="center-view__stat center-view__stat--established">
                <Box className="center-view__stat-icon" aria-hidden="true">
                  <CalendarMonthOutlinedIcon />
                </Box>
                <Typography component="p" className="center-view__stat-label">
                  Established
                </Typography>
                <Typography component="p" className="center-view__stat-value">
                  {center.establishedAt ? formatShortDate(center.establishedAt) : '—'}
                </Typography>
                <Typography component="p" className="center-view__stat-meta">
                  Branch opening date
                </Typography>
              </Box>

              <Box className="center-view__stat center-view__stat--member">
                <Box className="center-view__stat-icon" aria-hidden="true">
                  <EventOutlinedIcon />
                </Box>
                <Typography component="p" className="center-view__stat-label">
                  Member since
                </Typography>
                <Typography component="p" className="center-view__stat-value">
                  {formatShortDate(center.createdAt)}
                </Typography>
                <Typography component="p" className="center-view__stat-meta">
                  Account registration
                </Typography>
              </Box>
            </Box>

            <Box className="center-view__grid">
              <Box className="center-view__card">
                <Box className="center-view__card-head">
                  <Box>
                    <Typography component="h2" className="center-view__card-title">
                      Contact details
                    </Typography>
                    <Typography component="p" className="center-view__card-sub">
                      Reach this branch by email, phone, or visit address.
                    </Typography>
                  </Box>
                  <Box className="center-view__card-icon" aria-hidden="true">
                    <EmailOutlinedIcon />
                  </Box>
                </Box>

                <Box className="center-view__rows">
                  {contactRows.map((row) => (
                    <Box key={row.id} className="center-view__row">
                      <Box
                        className={`center-view__row-icon ${row.iconClass}`}
                        aria-hidden="true"
                      >
                        <row.Icon />
                      </Box>
                      <Box className="center-view__row-body">
                        <Typography component="span" className="center-view__row-label">
                          {row.label}
                        </Typography>
                        <Typography component="span" className="center-view__row-value">
                          {'href' in row && row.href ? (
                            <a href={row.href}>{row.value}</a>
                          ) : (
                            row.value
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box className="center-view__card">
                <Box className="center-view__card-head">
                  <Box>
                    <Typography component="h2" className="center-view__card-title">
                      Account timeline
                    </Typography>
                    <Typography component="p" className="center-view__card-sub">
                      Key dates for this center on the platform.
                    </Typography>
                  </Box>
                  <Box
                    className="center-view__card-icon center-view__card-icon--timeline"
                    aria-hidden="true"
                  >
                    <UpdateOutlinedIcon />
                  </Box>
                </Box>

                <Box className="center-view__timeline">
                  {timelineItems.map((item) => (
                    <Box key={item.label} className="center-view__timeline-item">
                      <Box className="center-view__timeline-dot" aria-hidden="true" />
                      <Box>
                        <Typography component="span" className="center-view__timeline-label">
                          {item.label}
                        </Typography>
                        <Typography component="span" className="center-view__timeline-value">
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {center.logo ? (
                <Box className="center-view__logo-card">
                  <Box
                    component="img"
                    src={center.logo}
                    alt={`${center.name} logo`}
                    className="center-view__logo-preview"
                  />
                  <Box className="center-view__logo-text">
                    <Typography component="h3">Center logo</Typography>
                    <Typography component="p">
                      Official branding image used across exams and student-facing materials.
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </>
        ) : null}
      </CenterViewPageRoot>
    </Layout>
  )
}
