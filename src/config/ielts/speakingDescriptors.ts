import type { IeltsModuleDescriptorConfig } from '@/types/ieltsEvaluation'

import { IELTS_SPEAKING_BAND_DESCRIPTORS } from './speakingBandDescriptors.constants'

const SPEAKING_CATEGORY_LABEL_TO_KEY: Record<string, string> = {
  'Fluency and Coherence': 'fluencyAndCoherence',
  'Lexical Resource': 'lexicalResource',
  'Grammatical Range and Accuracy': 'grammaticalRangeAndAccuracy',
  Pronunciation: 'pronunciation',
}

function toNumericBandDescriptors(
  raw: Record<string, string>,
): Record<number, string> {
  return Object.fromEntries(
    Object.entries(raw).map(([band, text]) => [Number(band), text]),
  )
}

function buildSpeakingConfig(): IeltsModuleDescriptorConfig {
  const speakingDescriptors = IELTS_SPEAKING_BAND_DESCRIPTORS.speaking
  const descriptors: Record<string, Record<number, string>> = {}

  for (const [label, bands] of Object.entries(speakingDescriptors)) {
    const categoryKey = SPEAKING_CATEGORY_LABEL_TO_KEY[label]
    if (!categoryKey) continue
    descriptors[categoryKey] = toNumericBandDescriptors(bands)
  }

  return {
    taskType: 'speaking',
    title: 'IELTS Speaking',
    categories: [
      { key: 'fluencyAndCoherence', label: 'Fluency and Coherence' },
      { key: 'lexicalResource', label: 'Lexical Resource' },
      { key: 'grammaticalRangeAndAccuracy', label: 'Grammatical Range and Accuracy' },
      { key: 'pronunciation', label: 'Pronunciation' },
    ],
    descriptors,
  }
}

export const SPEAKING_CONFIG = buildSpeakingConfig()

export { IELTS_SPEAKING_BAND_DESCRIPTORS } from './speakingBandDescriptors.constants'
