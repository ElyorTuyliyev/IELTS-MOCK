import { memo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Button } from "../../../components/common/Button";

import type { AnswerMode } from "../AddQuestionPage.constants";

type FormFooterProps = {
  answerMode: AnswerMode;
  acceptedAnswers: string;
  errors: string[];
  isBusy: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
  onAcceptedAnswersChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const FormFooter = memo(function FormFooter({
  answerMode,
  acceptedAnswers,
  errors,
  isBusy,
  isEditMode,
  isSubmitDisabled,
  onAcceptedAnswersChange,
  onSubmit,
  onCancel,
}: FormFooterProps) {
  return (
    <>
      {answerMode === "text" && (
        <Box className="add-question-card">
          <Box className="add-question-form__field add-question-form__field--span-4">
            <label className="add-question-form__label">
              Accepted answers (separate with `|`)
            </label>
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={acceptedAnswers}
              onChange={(e) => onAcceptedAnswersChange(e.target.value)}
              placeholder="answer one | answer two"
            />
          </Box>
        </Box>
      )}

      {errors.length > 0 && (
        <Box className="add-question-form__publish-errors">
          <Typography component="p" className="add-question-form__publish-errors-title">
            Resolve these:
          </Typography>
          <Box component="ul" className="add-question-form__publish-errors-list">
            {errors.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </Box>
        </Box>
      )}

      <Box className="add-question-form__footer">
        <Typography component="p" className="add-question-form__footer-copy">
          Clean recreate form — direct backend save.
        </Typography>
        <Box className="add-question-form__footer-actions">
          <Button
            className="add-question-form__secondary"
            variant="secondary"
            onClick={onCancel}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            className="add-question-form__primary"
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
          >
            {isBusy ? "Saving..." : isEditMode ? "Update Question" : "Save Question"}
          </Button>
        </Box>
      </Box>
    </>
  );
});
