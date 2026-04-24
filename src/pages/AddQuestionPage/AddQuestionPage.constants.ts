export type IeltsModule = 'Listening' | 'Reading' | 'Writing' | 'Speaking'

export type AnswerMode = 'single' | 'multiple' | 'text' | 'essay' | 'speaking'

export type QuestionTemplate = {
  id: string
  module: IeltsModule
  title: string
  description: string
  answerMode: AnswerMode
  instructionLabel: string
  sourceLabel: string
  sourcePlaceholder: string
}

export const IELTS_MODULE_OPTIONS: IeltsModule[] = [
  'Listening',
  'Reading',
  'Writing',
  'Speaking',
]

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'listening-mcq',
    module: 'Listening',
    title: 'Multiple Choice',
    description: 'Audio-based question with one best answer for Listening Part 1-4.',
    answerMode: 'single',
    instructionLabel: 'Candidate instruction',
    sourceLabel: 'Audio transcript or context',
    sourcePlaceholder:
      'Paste the listening transcript, scenario, speaker context, or audio notes here.',
  },
  {
    id: 'listening-form',
    module: 'Listening',
    title: 'Form Completion',
    description: 'Short answer or gap-fill item with accepted spelling variants.',
    answerMode: 'text',
    instructionLabel: 'Completion instruction',
    sourceLabel: 'Audio transcript or note form',
    sourcePlaceholder:
      'Provide the transcript excerpt or completion form that students will hear.',
  },
  {
    id: 'reading-tfng',
    module: 'Reading',
    title: 'True / False / Not Given',
    description: 'Classic IELTS Reading judgment item mapped to a passage.',
    answerMode: 'single',
    instructionLabel: 'Candidate instruction',
    sourceLabel: 'Passage excerpt',
    sourcePlaceholder:
      'Paste the reading passage or the exact paragraph range this question depends on.',
  },
  {
    id: 'reading-matching-headings',
    module: 'Reading',
    title: 'Matching Headings',
    description: 'Match headings to paragraphs for reading-skimming practice.',
    answerMode: 'single',
    instructionLabel: 'Candidate instruction',
    sourceLabel: 'Passage excerpt',
    sourcePlaceholder:
      'Paste the relevant passage paragraphs and identify which heading list is used.',
  },
  {
    id: 'writing-task-1',
    module: 'Writing',
    title: 'Task 1 Prompt',
    description: 'Academic chart/process/map or General letter prompt with band notes.',
    answerMode: 'essay',
    instructionLabel: 'Task instruction',
    sourceLabel: 'Visual / source brief',
    sourcePlaceholder:
      'Describe the chart, table, map, process diagram, or task brief the candidate will receive.',
  },
  {
    id: 'writing-task-2',
    module: 'Writing',
    title: 'Task 2 Essay',
    description: 'Opinion, discussion, or problem-solution essay prompt.',
    answerMode: 'essay',
    instructionLabel: 'Essay instruction',
    sourceLabel: 'Prompt context',
    sourcePlaceholder:
      'Provide the essay topic background, rubric, and position or discussion framing.',
  },
  {
    id: 'speaking-part-2',
    module: 'Speaking',
    title: 'Cue Card',
    description: 'Part 2 long-turn card with cue points and examiner prompts.',
    answerMode: 'speaking',
    instructionLabel: 'Candidate instruction',
    sourceLabel: 'Cue card context',
    sourcePlaceholder:
      'Add the cue card topic, preparation note, and any examiner guidance for follow-up.',
  },
]

export const BAND_OPTIONS = ['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0']

export const DIFFICULTY_OPTIONS = ['Foundation', 'Core', 'Advanced']

export const STATUS_OPTIONS = ['Draft', 'Review', 'Published']

export const PART_OPTIONS: Record<IeltsModule, string[]> = {
  Listening: ['Part 1', 'Part 2', 'Part 3', 'Part 4'],
  Reading: ['Passage 1', 'Passage 2', 'Passage 3'],
  Writing: ['Task 1', 'Task 2'],
  Speaking: ['Part 1', 'Part 2', 'Part 3'],
}
