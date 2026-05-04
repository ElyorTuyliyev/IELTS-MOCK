import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $rememberMe: Boolean!
    $centerId: String
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      rememberMe: $rememberMe
      centerId: $centerId
    ) {
      _id
      firstName
      lastName
      email
      phone
      role
      token
    }
  }
`;
