import { gql } from "@apollo/client";

export const UPDATE_CENTER_MUTATION = gql`
  mutation UpdateCenter(
    $_id: ID!
    $name: String
    $address: String
    $phone: String
    $email: String
    $password: String
    $logo: String
    $establishedAt: DateTime
  ) {
    updateCenter(
      _id: $_id
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
