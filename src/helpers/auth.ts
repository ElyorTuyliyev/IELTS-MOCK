import { USER_ROLES, type UserRole } from '../store/slices/authSlice'

export function toUserRole(role: string | null): UserRole | null {
  if (!role) return null
  const allowedRoles = Object.values(USER_ROLES)
  return allowedRoles.includes(role as UserRole) ? (role as UserRole) : null
}
