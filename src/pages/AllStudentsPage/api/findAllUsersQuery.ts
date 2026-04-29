import { gql } from "@apollo/client";

export const FIND_ALL_USERS_QUERY = gql`
  query FindAllUsers {
    findAllUsers {
      _id
      firstName
      lastName
      email
      birthday
      gender
      phone
      role
      centerId
      createdAt
    }
  }
`;
