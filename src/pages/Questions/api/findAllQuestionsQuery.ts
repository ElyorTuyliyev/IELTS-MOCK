import { gql } from "@apollo/client";

export const FIND_ALL_QUESTIONS_QUERY = gql`
  query FindAllQuestions {
    findAllQuestions {
      part {
        _id
        partNumber
        title
        description
        topic
        wordCount
        timeLimit
        sampleAnswer
        audio
        file
        moduleId
      }
      questions {
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
        options {
          title
          isCorrectAnswer
        }
      }
    }
  }
`;

export type GroupedQuestionItem = {
  part: {
    _id: string
    partNumber: number
    title: string
    description?: string | null
    topic?: string | null
    wordCount?: number | null
    timeLimit?: number | null
    sampleAnswer?: string | null
    audio?: string | null
    file?: string | null
    moduleId: string
  } | null
  questions: Array<{
    _id: string
    title?: string | null
    instruction?: string | null
    sourceMaterial?: string | null
    passageHtml?: string | null
    questionsHtml?: string | null
    explanation?: string | null
    question: string
    type: string
    examId?: string | null
    centerId?: string | null
    partId?: string | null
    groupId?: string | null
    ieltsModule?: string | null
    listeningPart?: string | null
    placementNumber?: number | null
    answerKey?: string | null
    listeningAudio?: string | null
    speakingAudio?: string | null
    options?: Array<{
      title: string
      isCorrectAnswer: boolean
    }> | null
  }>
}

export type FindAllQuestionsResponse = {
  findAllQuestions: GroupedQuestionItem[]
}

export function flattenGroupedQuestions(groups: GroupedQuestionItem[]) {
  return groups.flatMap((g) => g.questions)
}
