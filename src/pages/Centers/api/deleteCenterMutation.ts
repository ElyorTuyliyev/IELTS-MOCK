import { gql } from "@apollo/client";

export const REMOVE_CENTER_MUTATION = gql`
  mutation RemoveCenter($_id: ID!) {
    removeCenter(_id: $_id)
  }
`;
