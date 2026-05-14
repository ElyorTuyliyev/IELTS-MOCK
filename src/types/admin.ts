export type ManagedAdmin = {
  id: string
  fullName: string
  email: string
  scope: string
  password: string
  createdAt: string
}

export type CreateAdminMutationResponse = {
  createAdmin: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    role: string | null
    centerId?: string | null
  } | null
}

export type CreateAdminMutationVariables = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  centerName: string
  centerAddress: string
  centerPhone: string
  centerLogo?: string
  centerEstablishedAt?: string
}

export type FindAllUsersQueryResponse = {
  findAllUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
    phone: string
    role?: string | null
    centerId?: string | null
    createdAt: string
  }>
}
