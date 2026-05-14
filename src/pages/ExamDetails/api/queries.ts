import { gql } from '@apollo/client'

export const FIND_ALL_USERS_QUERY = gql`
  query FindAllUsers {
    findAllUsers {
      _id
      firstName
      lastName
      role
    }
  }
`

export const CREATE_STUDENT_EXAM_MUTATION = gql`
  mutation CreateStudentExam($input: CreateStudentExamInput!) {
    createStudentExam(input: $input) {
      _id
      studentId
      examId
    }
  }
`

export const START_STUDENT_EXAM_MUTATION = gql`
  mutation StartStudentExam($_id: ID!) {
    startStudentExam(_id: $_id) {
      _id
      isReleased
    }
  }
`

export const END_STUDENT_EXAM_MUTATION = gql`
  mutation EndStudentExam($_id: ID!) {
    endStudentExam(_id: $_id) {
      _id
      isCompleted
      completedAt
    }
  }
`

export const REMOVE_STUDENT_EXAM_MUTATION = gql`
  mutation RemoveStudentExam($_id: ID!) {
    removeStudentExam(_id: $_id)
  }
`

export const ASSIGN_QUESTIONS_MUTATION = gql`
  mutation AssignQuestionsToStudentExam($input: AssignQuestionsInput!) {
    assignQuestionsToStudentExam(input: $input) {
      _id
      questionIds
    }
  }
`

export const INITIALIZE_RANDOM_QUESTIONS_MUTATION = gql`
  mutation InitializeRandomQuestionsForStudentExam($_id: ID!) {
    initializeRandomQuestionsForStudentExam(_id: $_id) {
      _id
      questionIds
    }
  }
`

export const FIND_ALL_STUDENT_EXAMS_QUERY = gql`
  query FindAllStudentExams {
    findAllStudentExams {
      _id
      studentId
      examId
      startedAt
      completedAt
      isCompleted
      isReleased
      questionIds
      listeningScore
      readingScore
      writingScore
      totalScore
    }
  }
`
