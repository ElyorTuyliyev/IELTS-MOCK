import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { ROUTES_PATH } from '../../routes'
import { AddCenterPageRoot } from './AddCenterPage.style'

const centerTypeOptions = ['Flagship', 'Branch', 'Franchise']
const statusOptions = ['Draft', 'Active', 'Opening Soon']

export function AddCenterPage() {
  const [centerName, setCenterName] = useState('')
  const [city, setCity] = useState('Tashkent')
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [managerName, setManagerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [teacherCapacity, setTeacherCapacity] = useState('12')
  const [studentCapacity, setStudentCapacity] = useState('240')
  const [roomCount, setRoomCount] = useState('8')
  const [centerType, setCenterType] = useState('Branch')
  const [status, setStatus] = useState('Draft')

  const summary = useMemo(
    () => [
      { label: 'Type', value: centerType },
      { label: 'Rooms planned', value: roomCount || '0' },
      { label: 'Student capacity', value: studentCapacity || '0' },
    ],
    [centerType, roomCount, studentCapacity],
  )

  return (
    <Layout>
      <AddCenterPageRoot>
        <Box className="add-center-page">
          <Box className="add-center-page__hero">
            <Box>
              <Typography component="p" className="add-center-page__eyebrow">
                Center setup
              </Typography>
              <Typography component="h1" className="add-center-page__title">
                Add New Center
              </Typography>
              <Typography component="p" className="add-center-page__description">
                Create a new branch profile with its core contact details,
                manager ownership, and starting capacity. You can connect this
                form to your GraphQL mutation later without changing the layout.
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.center}
              className="add-center-page__back"
              variant="outlined"
            >
              Back to centers
            </Button>
          </Box>

          <Box component="form" className="add-center-form">
            <Box className="add-center-form__section">
              <Box className="add-center-form__section-header">
                <Typography component="h2" className="add-center-form__section-title">
                  Basic information
                </Typography>
                <Typography component="p" className="add-center-form__section-text">
                  Main branch identity and location details.
                </Typography>
              </Box>

              <Box className="add-center-form__grid">
                <TextField
                  label="Center name"
                  value={centerName}
                  onChange={(event) => setCenterName(event.target.value)}
                />
                <TextField
                  select
                  label="Center type"
                  value={centerType}
                  onChange={(event) => setCenterType(event.target.value)}
                >
                  {centerTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <TextField
                  label="District"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                />
                <TextField
                  className="add-center-form__field--full"
                  label="Full address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </Box>
            </Box>

            <Box className="add-center-form__section">
              <Box className="add-center-form__section-header">
                <Typography component="h2" className="add-center-form__section-title">
                  Contact and management
                </Typography>
                <Typography component="p" className="add-center-form__section-text">
                  Person in charge and the branch communication channel.
                </Typography>
              </Box>

              <Box className="add-center-form__grid">
                <TextField
                  label="Branch manager"
                  value={managerName}
                  onChange={(event) => setManagerName(event.target.value)}
                />
                <TextField
                  label="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                  select
                  label="Launch status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Box className="add-center-form__section">
              <Box className="add-center-form__section-header">
                <Typography component="h2" className="add-center-form__section-title">
                  Capacity planning
                </Typography>
                <Typography component="p" className="add-center-form__section-text">
                  Set starting rooms, teachers, and student load for the branch.
                </Typography>
              </Box>

              <Box className="add-center-form__grid">
                <TextField
                  label="Teacher capacity"
                  type="number"
                  value={teacherCapacity}
                  onChange={(event) => setTeacherCapacity(event.target.value)}
                />
                <TextField
                  label="Student capacity"
                  type="number"
                  value={studentCapacity}
                  onChange={(event) => setStudentCapacity(event.target.value)}
                />
                <TextField
                  label="Rooms count"
                  type="number"
                  value={roomCount}
                  onChange={(event) => setRoomCount(event.target.value)}
                />
              </Box>

              <Box className="add-center-form__summary">
                {summary.map((item) => (
                  <Box key={item.label} className="add-center-form__summary-card">
                    <Typography component="span" className="add-center-form__summary-label">
                      {item.label}
                    </Typography>
                    <Typography component="span" className="add-center-form__summary-value">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box className="add-center-form__actions">
              <Typography component="p" className="add-center-form__actions-copy">
                Current state is UI-ready. Hook this form to create-center mutation
                when backend schema is available.
              </Typography>

              <Box className="add-center-form__buttons">
                <Button
                  component={Link}
                  to={ROUTES_PATH.center}
                  className="add-center-form__cancel"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button className="add-center-form__submit" variant="contained">
                  Save Center
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </AddCenterPageRoot>
    </Layout>
  )
}
