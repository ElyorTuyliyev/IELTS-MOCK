import { gql } from "@apollo/client";

export const CREATE_CENTER_MUTATION = gql`
  mutation CreateCenter(
    $name: String!
    $address: String!
    $phone: String!
    $email: String!
    $password: String!
    $logo: String!
    $establishedAt: DateTime!
  ) {
    createCenter(
      name: $name
      address: $address
      phone: $phone
      email: $email
      password: $password
      logo: $logo
      establishedAt: $establishedAt
    ) {
      _id
      name
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
