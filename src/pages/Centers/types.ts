export type FindAllCentersQueryResponse = {
  findAllCenters: Array<{
    _id: string
    name: string
    manager?: string | null
    address: string
    phone: string
    email: string
    logo?: string | null
    establishedAt?: string | null
    createdAt: string
    updatedAt: string
  }>
}

export type DeleteCenterMutationResponse = {
  removeCenter: boolean | null
}

export type DeleteCenterMutationVariables = {
  _id: string
}

export type CreateCenterMutationResponse = {
  createCenter: {
    _id: string
    name: string
  } | null
}

export type CreateCenterMutationVariables = {
  name: string
  manager: string
  address: string
  phone: string
  email: string
  password: string
  logo: string
  establishedAt: string
}

export type EditableCenter = {
  id: string
  name: string
  manager: string
  email: string
  phone: string
  address: string
  logo: string
  establishedAt?: string
}

export type MappedCenterRow = EditableCenter
