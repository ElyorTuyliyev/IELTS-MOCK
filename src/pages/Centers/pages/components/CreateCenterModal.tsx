import { memo, type ChangeEvent } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { c } from '../../../../theme'
import { Button } from '../../../../components/common/Button'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput } from '../../../components/common/PhoneInput'

type CreateCenterModalProps = {
  open: boolean
  isCreating: boolean
  centerName: string
  email: string
  phone: string
  address: string
  managerName: string
  password: string
  confirmPassword: string
  logoDataUrl: string
  logoFileName: string
  onCenterNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onAddressChange: (value: string) => void
  onManagerNameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onLogoFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onClose: () => void
}

export const CreateCenterModal = memo(function CreateCenterModal({
  open,
  isCreating,
  centerName,
  email,
  phone,
  address,
  managerName,
  password,
  confirmPassword,
  logoDataUrl,
  logoFileName,
  onCenterNameChange,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  onManagerNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onLogoFileChange,
  onSave,
  onClose,
}: CreateCenterModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '20px', overflow: 'hidden' } },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '22px 24px',
        }}
      >
        <Typography sx={{ fontSize: '36px', fontWeight: 700 }}>Add Center</Typography>
        <IconButton onClick={onClose} aria-label="Close center modal">
          <span style={{ fontSize: 28, lineHeight: 1 }}>×</span>
        </IconButton>
      </Box>

      <DialogContent sx={{ borderTop: `1px solid ${c.neutral[500]}`, p: '20px 24px 24px' }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <TextField
            label="Center Name"
            value={centerName}
            onChange={(e) => onCenterNameChange(e.target.value)}
          />
          <TextField
            label="Gmail"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <PhoneInput
            label="Phone Number"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
          <TextField
            label="Manager Name"
            value={managerName}
            onChange={(e) => onManagerNameChange(e.target.value)}
          />
          <PasswordTextField
            label="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <PasswordTextField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
          />

          <Box sx={{ mt: 0.5 }}>
            <Typography sx={{ mb: 1, fontWeight: 600, color: c.text.primary }}>Logo</Typography>
            <Box
              component="label"
              htmlFor="center-logo-upload"
              sx={{
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                gap: 1.5,
                minHeight: 190,
                px: 2,
                border: `1px dashed ${c.border.soft}`,
                borderRadius: '18px',
                backgroundColor: c.background.muted,
                cursor: 'pointer',
              }}
            >
              <input
                id="center-logo-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onLogoFileChange}
              />
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '14px',
                  background: c.indigo.bg,
                  display: 'grid',
                  placeItems: 'center',
                  color: c.indigo.main,
                  fontSize: 28,
                }}
              >
                🖼
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: c.slate[900] }}>
                Click or Drop your logo here, or{' '}
                <Box component="span" sx={{ color: c.primary.main }}>
                  Browse
                </Box>
              </Typography>
              <Typography sx={{ fontSize: 14, color: c.text.secondary }}>
                Recommended image size: 1080 × 780 pixels
              </Typography>
              <Typography sx={{ fontSize: 14, color: c.text.secondary, mt: -1 }}>
                Accepted image formats: JPG, PNG.
              </Typography>
            </Box>

            {logoFileName && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {logoFileName}
              </Typography>
            )}

            {logoDataUrl && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Logo preview
                </Typography>
                <Box
                  component="img"
                  src={logoDataUrl}
                  alt="Selected center logo preview"
                  sx={{
                    width: 110,
                    height: 110,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: `1px solid ${c.border.medium}`,
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button
              variant="secondary"
              onClick={onClose}
              sx={{ minWidth: 120, borderRadius: '12px' }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isCreating}
              sx={{
                minWidth: 140,
                borderRadius: '12px',
                background: c.gradient.primary,
              }}
            >
              {isCreating ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
})
