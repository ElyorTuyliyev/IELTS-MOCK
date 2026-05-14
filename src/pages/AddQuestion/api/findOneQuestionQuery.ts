import { gql } from "@apollo/client";

export const FIND_ONE_QUESTION_QUERY = gql`
  query FindOneQuestion($_id: ID!) {
    findOneQuestion(_id: $_id) {
      _id
      title
      instruction
      sourceMaterial
      passageHtml
      questionsHtml
      explanation
      question
      type
      examId
      centerId
      partId
      groupId
      ieltsModule
      listeningPart
      placementNumber
      answerKey
      listeningAudio
      speakingAudio
      supportingImage
      options {
        title
        isCorrectAnswer
        key
      }
    }
  }
`;
