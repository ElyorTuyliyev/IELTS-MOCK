import { memo, type ChangeEvent } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Button } from '../../../components/common/Button'
import { DateInput } from '../../../components/common/DateInput'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput } from '../../../components/common/PhoneInput'
import { Select } from '../../../components/common/Select'

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

type StudentFormModalProps = {
  open: boolean
  isEditing: boolean
  isBusy: boolean
  firstName: string
  lastName: string
  email: string
  birthday: string
  gender: string
  phone: string
  password: string
  photoDataUrl: string
  photoFileName: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onBirthdayChange: (value: string) => void
  onGenderChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onPhotoFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onClose: () => void
}

export const StudentFormModal = memo(function StudentFormModal({
  open,
  isEditing,
  isBusy,
  firstName,
  lastName,
  email,
  birthday,
  gender,
  phone,
  password,
  photoDataUrl,
  photoFileName,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onBirthdayChange,
  onGenderChange,
  onPhoneChange,
  onPasswordChange,
  onPhotoFileChange,
  onSave,
  onClose,
}: StudentFormModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="students-modal"
      slotProps={{
        paper: { className: 'students-modal__paper' },
        backdrop: { className: 'students-modal__backdrop' },
      }}
    >
      <Box className="students-modal__header">
        <Typography component="h2" className="students-modal__title">
          {isEditing ? 'Update Student' : 'Add Students'}
        </Typography>
        <IconButton
          className="students-modal__close"
          aria-label="Close add students modal"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className="students-modal__body">
        <Box className="students-modal__field">
          <label className="students-modal__label">First Name</label>
          <TextField
            fullWidth
            className="students-modal__control"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Last Name</label>
          <TextField
            fullWidth
            className="students-modal__control"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Gmail</label>
          <TextField
            fullWidth
            className="students-modal__control"
            type="email"
            placeholder="Enter gmail"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Birthday</label>
          <DateInput
            fullWidth
            className="students-modal__control"
            value={birthday}
            onChange={(e) => onBirthdayChange(e.target.value)}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Gender</label>
          <Select
            fullWidth
            className="students-modal__control"
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
            options={[
              { value: '', label: 'Select gender' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Profile Photo (certificate)</label>
          <label className="students-modal__upload" htmlFor="student-photo-upload">
            <input
              id="student-photo-upload"
              type="file"
              accept="image/*"
              className="students-modal__upload-input"
              onChange={onPhotoFileChange}
            />
            {photoDataUrl ? (
              <img
                src={photoDataUrl}
                alt="Student profile photo preview"
                className="students-modal__photo-preview"
              />
            ) : (
              <>
                <Box className="students-modal__upload-artwork" aria-hidden>
                  <svg viewBox="0 0 88 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="10" width="72" height="54" rx="8" stroke="currentColor" strokeWidth="2" />
                    <circle cx="34" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M16 56L34 40L48 52L62 36L72 48"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
                <Box className="students-modal__upload-content">
                  <Typography component="p" className="students-modal__upload-title">
                    Click or drop passport photo here, or <span>Browse</span>
                  </Typography>
                  <Typography component="p" className="students-modal__upload-copy">
                    JPG or PNG. Shown on the IELTS certificate.
                  </Typography>
                </Box>
              </>
            )}
          </label>
          {photoFileName ? (
            <Typography component="p" className="students-modal__upload-file">
              {photoFileName === 'existing-photo' ? 'Current photo on file' : `Selected: ${photoFileName}`}
            </Typography>
          ) : null}
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Phone</label>
          <PhoneInput
            fullWidth
            className="students-modal__control"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </Box>

        <Box className="students-modal__field">
          <label className="students-modal__label">Password</label>
          <PasswordTextField
            fullWidth
            className="students-modal__control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </Box>
      </DialogContent>

      <Box className="students-modal__footer">
        <Button className="students-modal__cancel" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="students-modal__save"
          variant="primary"
          onClick={onSave}
          disabled={isBusy}
        >
          {isBusy ? 'Saving...' : isEditing ? 'Update' : 'Save'}
        </Button>
      </Box>
    </Dialog>
  )
})
