export { IELTS_BAND_SCORES, IELTS_BAND_SCORE_OPTIONS, IELTS_DESCRIPTOR_BANDS } from './bandScores'
export type { IeltsDescriptorBand } from './bandScores'
export {
  areAllCategoriesSelected,
  computeOverallBand,
  formatBandScore,
  getCategoryDescriptor,
  getDescriptorBand,
} from './utils'
export {
  WRITING_TASK_1_CONFIG,
  WRITING_TASK_2_CONFIG,
  WRITING_TASK_CONFIGS,
  IELTS_WRITING_BAND_DESCRIPTORS,
} from './writingDescriptors'
export {
  SPEAKING_CONFIG,
  IELTS_SPEAKING_BAND_DESCRIPTORS,
} from './speakingDescriptors'

export type {
  IeltsCategoryDefinition,
  IeltsModuleDescriptorConfig,
  IeltsTaskDescriptorConfig,
  IeltsWritingCategoryKey,
  IeltsSpeakingCategoryKey,
  IeltsWritingTaskType,
  IeltsSpeakingTaskType,
} from '@/types/ieltsEvaluation'
