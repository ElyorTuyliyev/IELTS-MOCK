import { gql } from "@apollo/client";

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent(
    $_id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $birthday: DateTime
    $gender: String
    $password: String
    $phone: String
    $role: String
    $centerId: String
  ) {
    updateUser(
      _id: $_id
      firstName: $firstName
      lastName: $lastName
      email: $email
      birthday: $birthday
      gender: $gender
      password: $password
      phone: $phone
      role: $role
      centerId: $centerId
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
