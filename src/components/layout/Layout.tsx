import type { ReactNode } from 'react'
import { Box } from '@mui/material'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { LayoutRoot } from './Layout.style'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <LayoutRoot className="dashboard">
      <Sidebar />

      <Box className="dashboard__content content">
        <Header />
        <Box component="main" className="content__main">
          {children}
        </Box>
      </Box>
    </LayoutRoot>
  )
}
