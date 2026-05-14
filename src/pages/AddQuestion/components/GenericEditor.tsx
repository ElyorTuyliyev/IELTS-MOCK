import { memo } from "react";
import { Box } from "@mui/material";

import { RichTextEditor } from "../../../components/common/RichTextEditor/RichTextEditor";

type GenericEditorProps = {
  instruction: string;
  sourceMaterial: string;
  explanation: string;
  onInstructionChange: (html: string) => void;
  onSourceMaterialChange: (html: string) => void;
  onExplanationChange: (html: string) => void;
};

export const GenericEditor = memo(function GenericEditor({
  instruction,
  sourceMaterial,
  explanation,
  onInstructionChange,
  onSourceMaterialChange,
  onExplanationChange,
}: GenericEditorProps) {
  return (
    <Box className="add-question-card">
      <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
        <label className="add-question-form__label">Instruction</label>
        <RichTextEditor value={instruction} onChange={onInstructionChange} />
      </Box>
      <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
        <label className="add-question-form__label">Source material</label>
        <RichTextEditor value={sourceMaterial} onChange={onSourceMaterialChange} />
      </Box>
      <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
        <label className="add-question-form__label">Explanation</label>
        <RichTextEditor value={explanation} onChange={onExplanationChange} />
      </Box>
    </Box>
  );
});
