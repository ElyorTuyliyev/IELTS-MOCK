export type IeltsWritingTaskType = 'writing-task-1' | 'writing-task-2'
export type IeltsSpeakingTaskType = 'speaking'

export type IeltsWritingCategoryKey =
  | 'taskAchievement'
  | 'taskResponse'
  | 'coherenceAndCohesion'
  | 'lexicalResource'
  | 'grammaticalRangeAndAccuracy'

export type IeltsSpeakingCategoryKey =
  | 'fluencyAndCoherence'
  | 'lexicalResource'
  | 'grammaticalRangeAndAccuracy'
  | 'pronunciation'

export type IeltsCategoryDefinition = {
  key: string
  label: string
}

export type IeltsModuleDescriptorConfig = {
  taskType: string
  title: string
  categories: IeltsCategoryDefinition[]
  descriptors: Record<string, Record<number, string>>
}

/** @deprecated Use IeltsModuleDescriptorConfig */
export type IeltsTaskDescriptorConfig = IeltsModuleDescriptorConfig

export type ModuleEvaluationFormState = {
  categoryScores: Partial<Record<string, number | null>>
  feedback: string
}

export type WritingTaskEvaluationFormState = ModuleEvaluationFormState

export type WritingTaskEvaluationData = {
  taskType: IeltsWritingTaskType
  categoryScores: Record<string, number>
  overallBand: number
  tutorFeedback: string
  evaluatedAt: string
}

export type WritingEvaluationPayload = {
  task1?: WritingTaskEvaluationData
  task2?: WritingTaskEvaluationData
  savedAt?: string
}

export type SpeakingEvaluationData = {
  taskType: IeltsSpeakingTaskType
  categoryScores: Record<string, number>
  overallBand: number
  tutorFeedback: string
  evaluatedAt: string
}

export type SpeakingEvaluationPayload = {
  speaking?: SpeakingEvaluationData
  savedAt?: string
}
