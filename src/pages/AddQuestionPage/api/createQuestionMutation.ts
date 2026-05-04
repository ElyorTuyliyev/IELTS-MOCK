import { gql } from "@apollo/client";

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      _id
      examId
      title
      instruction
      stem
      sourceMaterial
      explanation
      listeningAudio
      speakingAudio
      supportingImage
      question
      type
      ieltsModule
      partId
      placementNumber
      options {
        title
        isCorrectAnswer
        key
      }
    }
  }
`;
