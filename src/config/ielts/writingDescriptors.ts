import type {
  IeltsCategoryDefinition,
  IeltsModuleDescriptorConfig,
  IeltsWritingCategoryKey,
} from '@/types/ieltsEvaluation'

import { IELTS_WRITING_BAND_DESCRIPTORS } from './writingBandDescriptors.constants'

const CATEGORY_LABEL_TO_KEY: Record<string, IeltsWritingCategoryKey> = {
  'Task Achievement': 'taskAchievement',
  'Task Response': 'taskResponse',
  'Coherence and Cohesion': 'coherenceAndCohesion',
  'Lexical Resource': 'lexicalResource',
  'Grammatical Range and Accuracy': 'grammaticalRangeAndAccuracy',
}

function toNumericBandDescriptors(
  raw: Record<string, string>,
): Record<number, string> {
  return Object.fromEntries(
    Object.entries(raw).map(([band, text]) => [Number(band), text]),
  )
}

function buildTaskConfig(
  taskType: 'writing-task-1' | 'writing-task-2',
  title: string,
  taskKey: 'task1' | 'task2',
  categories: IeltsCategoryDefinition[],
): IeltsModuleDescriptorConfig {
  const taskDescriptors = IELTS_WRITING_BAND_DESCRIPTORS[taskKey]
  const descriptors = Object.fromEntries(
    Object.values(CATEGORY_LABEL_TO_KEY).map((key) => [key, {}]),
  ) as Record<IeltsWritingCategoryKey, Record<number, string>>

  for (const [label, bands] of Object.entries(taskDescriptors)) {
    const categoryKey = CATEGORY_LABEL_TO_KEY[label]
    if (!categoryKey) continue
    descriptors[categoryKey] = toNumericBandDescriptors(bands)
  }

  return {
    taskType,
    title,
    categories,
    descriptors,
  }
}

export const WRITING_TASK_1_CONFIG: IeltsModuleDescriptorConfig = buildTaskConfig(
  'writing-task-1',
  'IELTS Writing Task 1',
  'task1',
  [
    { key: 'taskAchievement', label: 'Task Achievement' },
    { key: 'coherenceAndCohesion', label: 'Coherence and Cohesion' },
    { key: 'lexicalResource', label: 'Lexical Resource' },
    { key: 'grammaticalRangeAndAccuracy', label: 'Grammatical Range and Accuracy' },
  ],
)

export const WRITING_TASK_2_CONFIG: IeltsModuleDescriptorConfig = buildTaskConfig(
  'writing-task-2',
  'IELTS Writing Task 2',
  'task2',
  [
    { key: 'taskResponse', label: 'Task Response' },
    { key: 'coherenceAndCohesion', label: 'Coherence and Cohesion' },
    { key: 'lexicalResource', label: 'Lexical Resource' },
    { key: 'grammaticalRangeAndAccuracy', label: 'Grammatical Range and Accuracy' },
  ],
)

export const WRITING_TASK_CONFIGS: Record<
  'writing-task-1' | 'writing-task-2',
  IeltsModuleDescriptorConfig
> = {
  'writing-task-1': WRITING_TASK_1_CONFIG,
  'writing-task-2': WRITING_TASK_2_CONFIG,
}

export { IELTS_WRITING_BAND_DESCRIPTORS } from './writingBandDescriptors.constants'
