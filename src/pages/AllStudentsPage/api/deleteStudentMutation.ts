import { gql } from "@apollo/client";

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($_id: ID!) {
    removeUser(_id: $_id)
  }
`;
