import { gql } from "@apollo/client";

export const CREATE_CENTER_MUTATION = gql`
  mutation CreateCenter(
    $name: String!
    $manager: String!
    $address: String!
    $phone: String!
    $email: String!
    $password: String!
    $logo: String!
    $establishedAt: DateTime!
  ) {
    createCenter(
      name: $name
      manager: $manager
      address: $address
      phone: $phone
      email: $email
      password: $password
      logo: $logo
      establishedAt: $establishedAt
    ) {
      _id
      name
      manager
      address
      phone
      email
      logo
      establishedAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ADMIN_MUTATION = CREATE_CENTER_MUTATION