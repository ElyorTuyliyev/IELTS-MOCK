import { gql } from "@apollo/client";

export const GET_ALL_CENTERS_QUERY = gql`
  query GetAllCenters {
    findAllCenters {
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
