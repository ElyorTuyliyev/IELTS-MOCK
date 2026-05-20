export type CreateStudentMutationResponse = {
  createUser: {
    _id: string
    firstName: string
    lastName: string
    email: string
    birthday?: string | null
    gender?: string | null
    phone?: string | null
    profilePhoto?: string | null
    role: string | null
    centerId?: string | null
    createdAt?: string
  } | null
}

export type CreateStudentMutationVariables = {
  firstName: string
  lastName: string
  email: string
  birthday?: string
  gender?: string
  profilePhoto?: string
  password: string
  phone?: string
  centerId?: string
}

export type UpdateStudentMutationResponse = {
  updateUser: {
    _id: string
    birthday?: string | null
    gender?: string | null
    role?: string | null
  } | null
}

export type UpdateStudentMutationVariables = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  birthday?: string
  gender?: string
  password?: string
  phone?: string
  profilePhoto?: string
  role?: string
  centerId?: string
}

export type DeleteStudentMutationResponse = {
  removeUser: boolean | null
}

export type DeleteStudentMutationVariables = {
  _id: string
}

export type FindAllUsersQueryResponse = {
  findAllUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
    birthday?: string | null
    gender?: string | null
    phone?: string | null
    profilePhoto?: string | null
    role?: string | null
    centerId?: string | null
    createdAt: string
  }>
}
