import { Box, type ReactNode } from '@mui/material'

export function MoreIcon() {
  return (
    <Box component="svg" viewBox="0 0 24 24" className="menu-action__more-icon" aria-hidden>
      <circle cx="12" cy="5" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="19" r="1.8" fill="currentColor" />
    </Box>
  )
}

function MenuLineIcon({ children }: { children: ReactNode }) {
  return (
    <Box component="span" className="menu-action__item-icon" aria-hidden>
      <Box
        component="svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </Box>
    </Box>
  )
}

export function ViewActionIcon() {
  return (
    <MenuLineIcon>
      <path d="M8 4h8l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M16 4v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </MenuLineIcon>
  )
}

export function EditActionIcon() {
  return (
    <MenuLineIcon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </MenuLineIcon>
  )
}

export function DeleteActionIcon() {
  return (
    <MenuLineIcon>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </MenuLineIcon>
  )
}
