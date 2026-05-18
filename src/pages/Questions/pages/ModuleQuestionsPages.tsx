import type { QuestionType } from '../QuestionsPage.constants'
import { QuestionsPage } from './QuestionsPage'

function ModuleQuestionsPage({ module }: { module: QuestionType }) {
  return <QuestionsPage fixedModule={module} />
}

export function ListeningQuestionsPage() {
  return <ModuleQuestionsPage module="Listening" />
}

export function ReadingQuestionsPage() {
  return <ModuleQuestionsPage module="Reading" />
}

export function WritingQuestionsPage() {
  return <ModuleQuestionsPage module="Writing" />
}

export function SpeakingQuestionsPage() {
  return <ModuleQuestionsPage module="Speaking" />
}
