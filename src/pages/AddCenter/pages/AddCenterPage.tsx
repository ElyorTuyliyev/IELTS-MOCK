import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { Button } from '../../../components/common/Button'
import { Layout } from '../../../components/layout'
import { ROUTES_PATH } from '../../../routes'
import { AddCenterForm } from '../components'
import { useAddCenterForm } from '../hooks/useAddCenterForm'
import { AddCenterPageRoot } from './AddCenterPage.style'

export function AddCenterPage() {
  const form = useAddCenterForm()

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
                {form.isViewMode ? 'View Center' : form.isEditMode ? 'Update Center' : 'Add New Center'}
              </Typography>
              <Typography component="p" className="add-center-page__description">
                {form.isViewMode
                  ? 'Review branch profile, contact details, and manager information.'
                  : form.isEditMode
                    ? 'Update branch profile, contact details, and manager information.'
                    : 'Create a new branch profile with its core contact details and manager ownership.'}
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.center}
              className="add-center-page__back"
              variant="secondary"
            >
              Back to centers
            </Button>
          </Box>

          <AddCenterForm
            isViewMode={form.isViewMode}
            isEditMode={form.isEditMode}
            isSaving={form.isSaving}
            centerName={form.centerName}
            address={form.address}
            logoDataUrl={form.logoDataUrl}
            logoFileName={form.logoFileName}
            managerName={form.managerName}
            phone={form.phone}
            email={form.email}
            password={form.password}
            confirmPassword={form.confirmPassword}
            onCenterNameChange={form.setCenterName}
            onAddressChange={form.setAddress}
            onManagerNameChange={form.setManagerName}
            onPhoneChange={form.setPhone}
            onEmailChange={form.setEmail}
            onPasswordChange={form.setPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            onLogoFileChange={form.handleLogoFileChange}
            onSave={form.handleSaveCenter}
          />
        </Box>
      </AddCenterPageRoot>
    </Layout>
  )
}
