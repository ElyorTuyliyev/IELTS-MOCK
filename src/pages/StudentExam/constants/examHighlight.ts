export const EXAM_HIGHLIGHT_COLORS = ['yellow', 'green', 'blue', 'red'] as const

export type ExamHighlightColor = (typeof EXAM_HIGHLIGHT_COLORS)[number]

/** Applied automatically when the user selects text (Cambridge-style). */
export const EXAM_HIGHLIGHT_DEFAULT_COLOR: ExamHighlightColor = 'yellow'

export const EXAM_HIGHLIGHT_LABELS: Record<ExamHighlightColor, string> = {
  yellow: 'Yellow highlight',
  green: 'Green highlight',
  blue: 'Blue highlight',
  red: 'Red highlight',
}
