import { memo } from "react";
import { Box, Typography } from "@mui/material";
import { Button } from "../../../components/common/Button";

import { QUESTION_TEMPLATES, type IeltsModule } from "../AddQuestionPage.constants";

type TemplateSidebarProps = {
  isEditMode: boolean;
  selectedModule: IeltsModule;
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
};

export const TemplateSidebar = memo(function TemplateSidebar({
  isEditMode,
  selectedModule,
  selectedTemplateId,
  onTemplateChange,
}: TemplateSidebarProps) {
  const templates = QUESTION_TEMPLATES.filter((t) => t.module === selectedModule);

  return (
    <Box className="add-question-page__panel add-question-page__rail">
      <Box className="add-question-page__rail-head">
        <Typography component="h1" className="add-question-page__rail-title">
          {isEditMode ? "Edit Question" : "IELTS Question Templates"}
        </Typography>
        <Typography component="p" className="add-question-page__rail-copy">
          {isEditMode
            ? "Update the details and save."
            : "Select a template and create a question."}
        </Typography>
      </Box>
      <Box className="add-question-page__module-list">
        {templates.map((template) => (
          <Button
            key={template.id}
            className={`add-question-page__module-card${
              template.id === selectedTemplateId
                ? " add-question-page__module-card--active"
                : ""
            }`}
            variant="text"
            onClick={() => onTemplateChange(template.id)}
          >
            <span className="add-question-page__module-eyebrow">{template.module}</span>
            <span className="add-question-page__module-title">{template.title}</span>
            <span className="add-question-page__module-description">
              {template.description}
            </span>
          </Button>
        ))}
      </Box>
    </Box>
  );
});
