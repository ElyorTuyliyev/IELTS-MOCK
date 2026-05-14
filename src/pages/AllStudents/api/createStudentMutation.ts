import { gql } from "@apollo/client";

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent(
    $firstName: String!
    $lastName: String!
    $email: String!
    $birthday: DateTime
    $gender: String
    $password: String!
    $phone: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      birthday: $birthday
      gender: $gender
      password: $password
      phone: $phone
    ) {
      _id
      firstName
      lastName
      email
      birthday
      gender
      phone
      role
      centerId
    }
  }
`;