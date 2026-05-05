import { gql } from "@apollo/client";

export const FIND_ALL_QUESTIONS_QUERY = gql`
  query FindAllQuestions {
    findAllQuestions {
      _id
      title
      question
      type
      examId
      partId
      ieltsModule
      listeningPart
      listeningAudio
      speakingAudio
      supportingImage
      options {
        title
        isCorrectAnswer
      }
    }
  }
`;
