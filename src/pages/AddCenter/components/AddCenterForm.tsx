import { Link } from 'react-router-dom'
import { Box, TextField, Typography } from '@mui/material'
import type { ChangeEvent } from 'react'

import { Button } from '../../../components/common/Button'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput } from '../../../components/common/PhoneInput'
import { ROUTES_PATH } from '../../../routes'
import { c } from '../../../theme'

type AddCenterFormProps = {
  isViewMode: boolean
  isEditMode: boolean
  isSaving: boolean
  centerName: string
  address: string
  logoDataUrl: string
  logoFileName: string
  managerName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  onCenterNameChange: (value: string) => void
  onAddressChange: (value: string) => void
  onManagerNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onLogoFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
}

export function AddCenterForm({
  isViewMode,
  isEditMode,
  isSaving,
  centerName,
  address,
  logoDataUrl,
  logoFileName,
  managerName,
  phone,
  email,
  password,
  confirmPassword,
  onCenterNameChange,
  onAddressChange,
  onManagerNameChange,
  onPhoneChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onLogoFileChange,
  onSave,
}: AddCenterFormProps) {
  return (
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
            onChange={(event) => onCenterNameChange(event.target.value)}
            disabled={isViewMode}
          />
          <TextField
            className="add-center-form__field--full"
            label="Address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            disabled={isViewMode}
          />
          <TextField
            className="add-center-form__field--full"
            type="file"
            label="Logo file"
            disabled={isViewMode}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                accept: 'image/*',
              },
            }}
            onChange={onLogoFileChange}
          />
          {logoFileName ? (
            <Typography component="p" className="add-center-form__section-text">
              Selected file: {logoFileName}
            </Typography>
          ) : null}
          {logoDataUrl ? (
            <Box className="add-center-form__field--full">
              <Typography component="p" className="add-center-form__section-text">
                Logo preview
              </Typography>
              <Box
                component="img"
                src={logoDataUrl}
                alt="Selected center logo preview"
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: `1px solid ${c.border.medium}`,
                  mt: 1,
                }}
              />
            </Box>
          ) : null}
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
            label="Manager name"
            value={managerName}
            onChange={(event) => onManagerNameChange(event.target.value)}
            disabled={isViewMode}
          />
          <PhoneInput
            label="Phone number"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            disabled={isViewMode}
          />
          <TextField
            label="Gmail"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={isViewMode}
          />
          <PasswordTextField
            label={isEditMode ? 'New password (optional)' : 'Password'}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            disabled={isViewMode}
          />
          <PasswordTextField
            label={isEditMode ? 'Confirm new password' : 'Confirm password'}
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            disabled={isViewMode}
          />
        </Box>
      </Box>

      <Box className="add-center-form__actions">
        <Typography component="p" className="add-center-form__actions-copy">
          Use Save to persist your changes.
        </Typography>

        <Box className="add-center-form__buttons">
          <Button
            component={Link}
            to={ROUTES_PATH.center}
            className="add-center-form__cancel"
            variant="secondary"
          >
            {isViewMode ? 'Back' : 'Cancel'}
          </Button>
          {isViewMode ? null : (
            <Button
              className="add-center-form__submit"
              variant="primary"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Update Center' : 'Save Center'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
