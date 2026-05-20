import { useMemo, useState, type ReactNode } from 'react'
import { Box, TextField, Typography } from '@mui/material'

import { Button } from '@/components/common/Button'
import {
  areAllCategoriesSelected,
  computeOverallBand,
} from '@/config/ielts'
import type {
  IeltsModuleDescriptorConfig,
  ModuleEvaluationFormState,
} from '@/types/ieltsEvaluation'

import { CriteriaTable } from './CriteriaTable'
import { CriteriaTooltip } from './CriteriaTooltip'
import { OverallScoreCard } from './OverallScoreCard'
import { ScoreDropdown } from './ScoreDropdown'

type ModuleEvaluationSectionProps = {
  config: IeltsModuleDescriptorConfig
  formState: ModuleEvaluationFormState
  onChange: (next: ModuleEvaluationFormState) => void
  showValidation?: boolean
  /** Optional task prompt / student response block (writing essay or speaking tasks). */
  children?: ReactNode
  responseTitle?: string | null
  responsePromptHtml?: string | null
  studentResponse?: string | null
  emptyResponseLabel?: string
  feedbackPlaceholder?: string
}

export function ModuleEvaluationSection({
  config,
  formState,
  onChange,
  showValidation = false,
  children,
  responseTitle,
  responsePromptHtml,
  studentResponse,
  emptyResponseLabel = 'No response submitted yet.',
  feedbackPlaceholder = 'Detailed comments and feedback for the student...',
}: ModuleEvaluationSectionProps) {
  const [criteriaExpanded, setCriteriaExpanded] = useState(false)

  const categoryKeys = useMemo(
    () => config.categories.map((category) => category.key),
    [config.categories],
  )

  const overallBand = useMemo(
    () =>
      computeOverallBand(
        categoryKeys.map((key) => formState.categoryScores[key] ?? null),
      ),
    [categoryKeys, formState.categoryScores],
  )

  const isComplete = areAllCategoriesSelected(categoryKeys, formState.categoryScores)

  const updateCategoryScore = (key: string, value: number | null) => {
    onChange({
      ...formState,
      categoryScores: {
        ...formState.categoryScores,
        [key]: value,
      },
    })
  }

  const showResponseBlock =
    children != null ||
    responseTitle != null ||
    responsePromptHtml != null ||
    studentResponse != null

  return (
    <section className="ielts-eval__task-card" aria-label={config.title}>
      <div className="ielts-eval__task-header">
        <Typography className="ielts-eval__task-title">{config.title}</Typography>
        <OverallScoreCard overallBand={overallBand} />
      </div>

      {showResponseBlock ? (
        <div className="ielts-eval__essay-block">
          {children ?? (
            <>
              {responseTitle ? (
                <Typography className="review__question-title">{responseTitle}</Typography>
              ) : null}
              {responsePromptHtml ? (
                <Box
                  sx={{ mb: 1.5, fontSize: 14 }}
                  dangerouslySetInnerHTML={{ __html: responsePromptHtml }}
                />
              ) : null}
              <Box className="review__essay">
                {studentResponse?.trim() || emptyResponseLabel}
              </Box>
            </>
          )}
        </div>
      ) : null}

      <div className="ielts-eval__scores-grid">
        {config.categories.map((category) => {
          const selectedScore = formState.categoryScores[category.key] ?? null
          const hasError = showValidation && selectedScore == null

          return (
            <div key={category.key} className="ielts-eval__score-row">
              <div className="ielts-eval__score-label-row">
                <Typography className="ielts-eval__score-label">
                  {category.label}
                </Typography>
                <CriteriaTooltip
                  config={config}
                  categoryKey={category.key}
                  categoryLabel={category.label}
                  selectedScore={selectedScore}
                />
              </div>
              <ScoreDropdown
                id={`${config.taskType}-${category.key}`}
                value={selectedScore}
                onChange={(value) => updateCategoryScore(category.key, value)}
                error={hasError}
              />
            </div>
          )
        })}
      </div>

      {showValidation && !isComplete ? (
        <Typography className="ielts-eval__validation">
          Please select a band score for every category in {config.title}.
        </Typography>
      ) : null}

      <div className="ielts-eval__feedback">
        <Typography className="ielts-eval__feedback-label">Tutor feedback</Typography>
        <TextField
          className="review__textarea"
          multiline
          minRows={5}
          fullWidth
          value={formState.feedback}
          onChange={(event) =>
            onChange({
              ...formState,
              feedback: event.target.value,
            })
          }
          placeholder={feedbackPlaceholder}
        />
      </div>

      <div className="ielts-eval__criteria-toggle">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setCriteriaExpanded((open) => !open)}
          aria-expanded={criteriaExpanded}
        >
          {criteriaExpanded ? 'Hide Criteria' : 'Show Criteria'}
        </Button>
      </div>

      <CriteriaTable config={config} expanded={criteriaExpanded} />
    </section>
  )
}

export function getModuleOverallBand(
  config: IeltsModuleDescriptorConfig,
  formState: ModuleEvaluationFormState,
): number | null {
  const categoryKeys = config.categories.map((category) => category.key)
  return computeOverallBand(
    categoryKeys.map((key) => formState.categoryScores[key] ?? null),
  )
}

export function isModuleEvaluationComplete(
  config: IeltsModuleDescriptorConfig,
  formState: ModuleEvaluationFormState,
): boolean {
  const categoryKeys = config.categories.map((category) => category.key)
  return areAllCategoriesSelected(categoryKeys, formState.categoryScores)
}

/** @deprecated Use ModuleEvaluationSection */
export const WritingTaskEvaluationSection = ModuleEvaluationSection

/** @deprecated Use getModuleOverallBand */
export const getTaskOverallBand = getModuleOverallBand

/** @deprecated Use isModuleEvaluationComplete */
export const isTaskEvaluationComplete = isModuleEvaluationComplete
