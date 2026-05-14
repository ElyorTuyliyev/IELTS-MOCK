import { memo } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput } from '../../../components/common/PhoneInput'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

type AddAdminModalProps = {
  open: boolean
  isCreating: boolean
  fullName: string
  email: string
  phone: string
  centerName: string
  centerAddress: string
  centerPhone: string
  centerLogo: string
  centerEstablishedAt: string
  password: string
  confirmPassword: string
  onFullNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onCenterNameChange: (value: string) => void
  onCenterAddressChange: (value: string) => void
  onCenterPhoneChange: (value: string) => void
  onCenterLogoChange: (value: string) => void
  onCenterEstablishedAtChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSave: () => void
  onClose: () => void
}

export const AddAdminModal = memo(function AddAdminModal({
  open,
  isCreating,
  fullName,
  email,
  phone,
  centerName,
  centerAddress,
  centerPhone,
  centerLogo,
  centerEstablishedAt,
  password,
  confirmPassword,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onCenterNameChange,
  onCenterAddressChange,
  onCenterPhoneChange,
  onCenterLogoChange,
  onCenterEstablishedAtChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSave,
  onClose,
}: AddAdminModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="admin-modal"
      slotProps={{
        paper: {
          className: 'admin-modal__paper',
        },
        backdrop: {
          className: 'admin-modal__backdrop',
        },
      }}
    >
      <Box className="admin-modal__header">
        <Typography component="h2" className="admin-modal__title">
          Add Admin
        </Typography>

        <IconButton
          className="admin-modal__close"
          aria-label="Close add admin modal"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className="admin-modal__body">
        <Box className="admin-modal__intro">
          <Box className="admin-modal__intro-card">
            <Typography component="p" className="admin-modal__eyebrow">
              Access creation
            </Typography>
            <Typography component="h3" className="admin-modal__intro-title">
              Create a new platform admin
            </Typography>
            <Typography component="p" className="admin-modal__intro-text">
              Fill in identity, responsibility scope, and secure password.
              This admin will appear in the control table immediately.
            </Typography>

            <Box className="admin-modal__rules">
              <Box className="admin-modal__rule-chip">Unique email</Box>
              <Box className="admin-modal__rule-chip">Min 6 chars</Box>
              <Box className="admin-modal__rule-chip">Super-admin managed</Box>
            </Box>
          </Box>

          <Box className="admin-modal__preview">
            <Box className="admin-modal__preview-avatar">
              {(fullName.trim()[0] ?? 'A').toUpperCase()}
            </Box>
            <Typography component="p" className="admin-modal__preview-name">
              {fullName.trim() || 'New Admin'}
            </Typography>
            <Typography component="p" className="admin-modal__preview-email">
              {email.trim() || 'admin@company.com'}
            </Typography>
            <Box className="admin-modal__preview-badge">
              {centerName.trim() || 'Center will be created'}
            </Box>
          </Box>
        </Box>

        <Box className="admin-modal__grid">
          <Box className="admin-modal__field">
            <label className="admin-modal__label">Full name</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              placeholder="Enter full name"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Email</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Phone</label>
            <PhoneInput
              fullWidth
              className="admin-modal__control"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field admin-modal__field--full">
            <label className="admin-modal__label">Center name</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              placeholder="Center name"
              value={centerName}
              onChange={(event) => onCenterNameChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field admin-modal__field--full">
            <label className="admin-modal__label">Center address</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              placeholder="Center address"
              value={centerAddress}
              onChange={(event) => onCenterAddressChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Center phone</label>
            <PhoneInput
              fullWidth
              className="admin-modal__control"
              value={centerPhone}
              onChange={(event) => onCenterPhoneChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Center establishedAt</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              placeholder="2026-01-01T00:00:00.000Z"
              value={centerEstablishedAt}
              onChange={(event) => onCenterEstablishedAtChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field admin-modal__field--full">
            <label className="admin-modal__label">Center logo (optional)</label>
            <TextField
              fullWidth
              className="admin-modal__control"
              placeholder="https://example.com/logo.png"
              value={centerLogo}
              onChange={(event) => onCenterLogoChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Password</label>
            <PasswordTextField
              fullWidth
              className="admin-modal__control"
              placeholder="Enter password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </Box>

          <Box className="admin-modal__field">
            <label className="admin-modal__label">Confirm password</label>
            <PasswordTextField
              fullWidth
              className="admin-modal__control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      <Box className="admin-modal__footer">
        <Button className="admin-modal__cancel" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="admin-modal__save"
          variant="primary"
          onClick={onSave}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Add Admin'}
        </Button>
      </Box>
    </Dialog>
  )
})
