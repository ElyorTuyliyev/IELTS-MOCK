import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
    login(email: $email, password: $password, rememberMe: $rememberMe) {
      role
      token
    }
  }
`;
