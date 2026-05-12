import { gql } from '@apollo/client'

export const UPDATE_QUESTION_MUTATION = gql`
  mutation UpdateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      _id
      title
      examId
      partId
      instruction
      sourceMaterial
      passageHtml
      questionsHtml
      explanation
      listeningAudio
      speakingAudio
      supportingImage
      question
      type
      ieltsModule
      listeningPart
      placementNumber
      answerKey
      options {
        title
        isCorrectAnswer
        key
      }
    }
  }
`
