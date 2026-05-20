/**
 * Official IELTS Writing band descriptors (Updated May 2023).
 * Source: IELTS Writing Band Descriptors PDF.
 */
export const IELTS_WRITING_BAND_DESCRIPTORS = {
  task1: {
    'Task Achievement': {
      '9': 'All the requirements of the task are fully and appropriately satisfied.',
      '8': 'The response covers all the requirements of the task appropriately, relevantly and sufficiently.',
      '7': 'The response covers the requirements of the task.',
      '6': 'The response focuses on the requirements of the task and an appropriate format is used.',
      '5': 'The response generally addresses the requirements of the task.',
      '4': 'The response is an attempt to address the task.',
      '3': 'The response does not address the requirements of the task.',
      '2': 'The content barely relates to the task.',
      '1': 'Responses of 20 words or fewer are rated at Band 1.',
      '0': 'Candidate did not attempt the question or response is invalid.',
    },
    'Coherence and Cohesion': {
      '9': 'The message can be followed effortlessly.',
      '8': 'The message can be followed with ease.',
      '7': 'Information and ideas are logically organised and there is a clear progression throughout the response.',
      '6': 'Information and ideas are generally arranged coherently and there is a clear overall progression.',
      '5': 'Organisation is evident but is not wholly logical.',
      '4': 'Information and ideas are evident but not arranged coherently.',
      '3': 'There is no apparent logical organisation.',
      '2': 'There is little evidence of control of organisational features.',
      '1': 'The writing fails to communicate any message.',
      '0': 'No valid response.',
    },
    'Lexical Resource': {
      '9': 'A wide range of vocabulary is used accurately and appropriately.',
      '8': 'A wide resource is fluently and flexibly used to convey precise meanings.',
      '7': 'The resource is sufficient to allow some flexibility and precision.',
      '6': 'The resource is generally adequate and appropriate for the task.',
      '5': 'The resource is limited but minimally adequate for the task.',
      '4': 'The resource is limited and inadequate for or unrelated to the task.',
      '3': 'The resource is inadequate.',
      '2': 'The resource is extremely limited.',
      '1': 'No resource is apparent except for a few isolated words.',
      '0': 'No valid response.',
    },
    'Grammatical Range and Accuracy': {
      '9': 'A wide range of structures within the scope of the task is used with full flexibility and control.',
      '8': 'A wide range of structures within the scope of the task is flexibly and accurately used.',
      '7': 'A variety of complex structures is used with some flexibility and accuracy.',
      '6': 'A mix of simple and complex sentence forms is used but flexibility is limited.',
      '5': 'The range of structures is limited and rather repetitive.',
      '4': 'A very limited range of structures is used.',
      '3': 'Sentence forms are attempted, but errors in grammar and punctuation predominate.',
      '2': 'There is little or no evidence of sentence forms.',
      '1': 'No rateable language is evident.',
      '0': 'No valid response.',
    },
  },
  task2: {
    'Task Response': {
      '9': 'The prompt is appropriately addressed and explored in depth.',
      '8': 'The prompt is appropriately and sufficiently addressed.',
      '7': 'The main parts of the prompt are appropriately addressed.',
      '6': 'The main parts of the prompt are addressed.',
      '5': 'The main parts of the prompt are incompletely addressed.',
      '4': 'The prompt is tackled in a minimal way.',
      '3': 'No part of the prompt is adequately addressed.',
      '2': 'The content is barely related to the prompt.',
      '1': 'Responses of 20 words or fewer are rated at Band 1.',
      '0': 'Candidate did not attempt the question or response is invalid.',
    },
    'Coherence and Cohesion': {
      '9': 'The message can be followed effortlessly.',
      '8': 'The message can be followed with ease.',
      '7': 'Information and ideas are logically organised.',
      '6': 'Information and ideas are generally arranged coherently.',
      '5': 'Organisation is evident but is not wholly logical.',
      '4': 'Information and ideas are evident but not arranged coherently.',
      '3': 'There is no apparent logical organisation.',
      '2': 'There is little evidence of control of organisational features.',
      '1': 'The writing fails to communicate any message.',
      '0': 'No valid response.',
    },
    'Lexical Resource': {
      '9': 'A wide range of vocabulary is used accurately and appropriately.',
      '8': 'A wide resource is fluently and flexibly used to convey precise meanings.',
      '7': 'The resource is sufficient to allow some flexibility and precision.',
      '6': 'The resource is generally adequate and appropriate for the task.',
      '5': 'The resource is limited but minimally adequate for the task.',
      '4': 'The resource is limited and inadequate for or unrelated to the task.',
      '3': 'The resource is inadequate.',
      '2': 'The resource is extremely limited.',
      '1': 'No resource is apparent except for a few isolated words.',
      '0': 'No valid response.',
    },
    'Grammatical Range and Accuracy': {
      '9': 'A wide range of structures is used with full flexibility and control.',
      '8': 'A wide range of structures is flexibly and accurately used.',
      '7': 'A variety of complex structures is used with some flexibility and accuracy.',
      '6': 'A mix of simple and complex sentence forms is used but flexibility is limited.',
      '5': 'The range of structures is limited and rather repetitive.',
      '4': 'A very limited range of structures is used.',
      '3': 'Sentence forms are attempted, but errors in grammar and punctuation predominate.',
      '2': 'There is little or no evidence of sentence forms.',
      '1': 'No rateable language is evident.',
      '0': 'No valid response.',
    },
  },
} as const

export type IeltsWritingBandDescriptors = typeof IELTS_WRITING_BAND_DESCRIPTORS

export type IeltsWritingDescriptorTaskKey = keyof IeltsWritingBandDescriptors

export type IeltsWritingDescriptorCategoryLabel =
  | keyof IeltsWritingBandDescriptors['task1']
  | keyof IeltsWritingBandDescriptors['task2']
