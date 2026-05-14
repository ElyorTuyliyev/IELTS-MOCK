import { useCallback, useState, type MouseEvent, type ReactNode } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'

import { MoreIcon } from './MenuAction.icons'
import { MenuActionRoot } from './MenuAction.style'

export type MenuActionItem = {
  id: string
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

export type MenuActionProps = {
  menuId: string
  ariaLabel: string
  items: MenuActionItem[]
  className?: string
}

export function MenuAction({ menuId, ariaLabel, items, className }: MenuActionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleItemClick = useCallback(
    (onClick: () => void) => {
      handleClose()
      onClick()
    },
    [handleClose],
  )

  return (
    <MenuActionRoot className={className}>
      <IconButton
        className="menu-action__trigger"
        aria-label={ariaLabel}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
      >
        <MoreIcon />
      </IconButton>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            className: 'menu-action__menu',
            elevation: 0,
            sx: {
              minWidth: 'unset',
              width: 'max-content',
            },
          },
          list: { className: 'menu-action__menu-list' },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            className={`menu-action__menu-item${
              item.variant === 'danger' ? ' menu-action__menu-item--danger' : ''
            }`}
            onClick={() => handleItemClick(item.onClick)}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </MenuActionRoot>
  )
}

export function MenuActionCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Box className={className ? `menu-action__cell ${className}` : 'menu-action__cell'}>
      {children}
    </Box>
  )
}
