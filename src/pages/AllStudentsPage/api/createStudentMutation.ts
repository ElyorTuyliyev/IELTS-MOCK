import { gql } from "@apollo/client";

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String
    $centerId: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      centerId: $centerId
      role: "student"
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
