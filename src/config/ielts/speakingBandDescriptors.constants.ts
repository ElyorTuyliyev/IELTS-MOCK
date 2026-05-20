/**
 * Official IELTS Speaking band descriptors.
 */
export const IELTS_SPEAKING_BAND_DESCRIPTORS = {
  speaking: {
    'Fluency and Coherence': {
      '9': 'Fluent with only very occasional repetition or self-correction.',
      '8': 'Fluent with only very occasional repetition or self-correction.',
      '7': 'Able to keep going and readily produce long turns without noticeable effort.',
      '6': 'Able to keep going and demonstrates a willingness to produce long turns.',
      '5': 'Usually able to keep going, but relies on repetition and self-correction.',
      '4': 'Unable to keep going without noticeable pauses.',
      '3': 'Frequent, sometimes long, pauses occur while candidate searches for words.',
      '2': 'Lengthy pauses before nearly every word.',
      '1': 'Speech is totally incoherent.',
      '0': 'Does not attend.',
    },
    'Lexical Resource': {
      '9': 'Total flexibility and precise use in all contexts.',
      '8': 'Wide resource, readily and flexibly used to discuss all topics and convey precise meaning.',
      '7': 'Resource flexibly used to discuss a variety of topics.',
      '6': 'Resource sufficient to discuss topics at length.',
      '5': 'Resource sufficient to discuss familiar and unfamiliar topics but there is limited flexibility.',
      '4': 'Resource sufficient for familiar topics but only basic meaning can be conveyed on unfamiliar topics.',
      '3': 'Resource limited to simple vocabulary used primarily to convey personal information.',
      '2': 'Very limited resource.',
      '1': 'No resource bar a few isolated words.',
      '0': 'Does not attend.',
    },
    'Grammatical Range and Accuracy': {
      '9': 'Structures are precise and accurate at all times.',
      '8': 'Wide range of structures, flexibly used.',
      '7': 'A range of structures flexibly used.',
      '6': 'Produces a mix of short and complex sentence forms.',
      '5': 'Basic sentence forms are fairly well controlled for accuracy.',
      '4': 'Can produce basic sentence forms and some short utterances are error-free.',
      '3': 'Basic sentence forms are attempted but grammatical errors are numerous.',
      '2': 'No evidence of basic sentence forms.',
      '1': 'No communication possible.',
      '0': 'Does not attend.',
    },
    Pronunciation: {
      '9': 'Uses a full range of phonological features to convey precise meaning.',
      '8': 'Uses a wide range of phonological features.',
      '7': 'Displays all the positive features of band 6 and some of band 8.',
      '6': 'Uses a range of phonological features, but control is variable.',
      '5': 'Displays all the positive features of band 4 and some of band 6.',
      '4': 'Uses some acceptable phonological features, but the range is limited.',
      '3': 'Displays some features of band 2 and some of band 4.',
      '2': 'Uses few acceptable phonological features.',
      '1': 'Can produce occasional individual words and phonemes.',
      '0': 'Does not attend.',
    },
  },
} as const

export type IeltsSpeakingBandDescriptors = typeof IELTS_SPEAKING_BAND_DESCRIPTORS
