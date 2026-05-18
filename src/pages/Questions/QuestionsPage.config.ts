import type { QuestionType } from './QuestionsPage.constants'

export const MODULE_PAGE_META: Record<
  QuestionType,
  { title: string; subtitle: string }
> = {
  Listening: {
    title: 'Listening Questions',
    subtitle: 'Manage listening question groups and audio-based tasks.',
  },
  Reading: {
    title: 'Reading Questions',
    subtitle: 'Manage reading passages and comprehension questions.',
  },
  Writing: {
    title: 'Writing Questions',
    subtitle: 'Manage writing prompts and task types.',
  },
  Speaking: {
    title: 'Speaking Questions',
    subtitle: 'Manage speaking prompts and audio responses.',
  },
}
