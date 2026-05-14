import { memo } from "react";
import { Box } from "@mui/material";

import { RichTextEditor } from "../../../components/common/RichTextEditor/RichTextEditor";
import { EMPTY_HTML } from "../utils";
import type { ListeningPartEntry } from '@/types/addQuestion'

type ListeningEditorProps = {
  entries: ListeningPartEntry[];
  contents: string[];
  onPartChange: (index: number, html: string) => void;
};

export const ListeningEditor = memo(function ListeningEditor({
  entries,
  contents,
  onPartChange,
}: ListeningEditorProps) {
  return (
    <Box className="add-question-card">
      <Box className="add-question-form__field add-question-form__field--span-4">
        <label className="add-question-form__label">
          Question content ({entries.length} {entries.length === 1 ? 'part' : 'parts'})
        </label>
        <Box className="add-question-form__grid">
          {entries.map((entry, index) => (
            <Box
              key={entry.key}
              className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
            >
              <label className="add-question-form__label">{entry.label}</label>
              <RichTextEditor
                value={contents[index] ?? EMPTY_HTML}
                onChange={(val) => onPartChange(index, val)}
                priorQuestionHtml={contents.slice(0, index)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
});
