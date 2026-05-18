import { memo } from "react";
import { Box, TextField } from "@mui/material";

import { MenuItem, Select } from "../../../components/common/Select";

import { IELTS_MODULE_OPTIONS, type IeltsModule } from "../AddQuestionPage.constants";

type QuestionFormHeaderProps = {
  isEditMode: boolean;
  moduleLocked?: boolean;
  title: string;
  selectedModule: IeltsModule;
  timeLimit: string;
  onTitleChange: (title: string) => void;
  onModuleChange: (module: IeltsModule) => void;
  onTimeLimitChange: (time: string) => void;
};

export const QuestionFormHeader = memo(function QuestionFormHeader({
  isEditMode,
  moduleLocked = false,
  title,
  selectedModule,
  timeLimit,
  onTitleChange,
  onModuleChange,
  onTimeLimitChange,
}: QuestionFormHeaderProps) {
  return (
    <Box className="add-question-card">
      <Box className="add-question-form__grid">
        <Box className="add-question-form__field add-question-form__field--span-2">
          <label className="add-question-form__label">Question title / name</label>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Listening map labeling question"
          />
        </Box>
        <Box className="add-question-form__field">
          <label className="add-question-form__label">IELTS module</label>
          <Select
            fullWidth
            disabled={isEditMode || moduleLocked}
            value={selectedModule}
            onChange={(e) => onModuleChange(e.target.value as IeltsModule)}
          >
            {IELTS_MODULE_OPTIONS.map((mod) => (
              <MenuItem key={mod} value={mod}>
                {mod}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className="add-question-form__field">
          <label className="add-question-form__label">Suggested time (seconds)</label>
          <TextField
            fullWidth
            value={timeLimit}
            onChange={(e) => onTimeLimitChange(e.target.value)}
          />
        </Box>
      </Box>
    </Box>
  );
});
