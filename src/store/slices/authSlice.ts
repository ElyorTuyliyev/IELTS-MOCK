import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const USER_ROLES = {
  admin: 'admin',
  centerAdmin: 'center_admin',
  superAdmin: 'super_admin',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

type AuthState = {
  token: string | null
  role: UserRole | null
}

const initialState: AuthState = {
  token: null,
  role: null,
}

type AuthPayload = {
  token: string | null
  role: UserRole | null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
    },
    setUserRole: (state, action: PayloadAction<UserRole | null>) => {
      state.role = action.payload
    },
    setAuthSession: (state, action: PayloadAction<AuthPayload>) => {
      state.token = action.payload.token
      state.role = action.payload.role
    },
    clearAuth: (state) => {
      state.token = null
      state.role = null
    },
  },
})

export const hasRequiredRole = (
  role: UserRole | null,
  allowedRoles: UserRole[],
) => {
  if (!role) {
    return false
  }

  return allowedRoles.includes(role)
}

export const { setAuthToken, setUserRole, setAuthSession, clearAuth } =
  authSlice.actions
export const authReducer = authSlice.reducer
