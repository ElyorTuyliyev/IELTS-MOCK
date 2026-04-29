import { gql } from "@apollo/client";

export const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdmin(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String
    $centerName: String!
    $centerAddress: String!
    $centerPhone: String!
    $centerLogo: String
    $centerEstablishedAt: DateTime
  ) {
    createAdmin(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      centerName: $centerName
      centerAddress: $centerAddress
      centerPhone: $centerPhone
      centerLogo: $centerLogo
      centerEstablishedAt: $centerEstablishedAt
    ) {
      _id
      firstName
      lastName
      email
      phone
      role
      centerId
    }
  }
`;