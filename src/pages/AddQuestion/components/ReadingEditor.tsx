import { memo } from "react";
import { Box } from "@mui/material";

import { RichTextEditor } from "../../../components/common/RichTextEditor/RichTextEditor";
import { EMPTY_HTML } from "../utils";
import type { ReadingPartContent, ReadingPartEntry } from "../types";

type ReadingEditorProps = {
  entries: ReadingPartEntry[];
  contents: ReadingPartContent[];
  onPassageChange: (index: number, html: string) => void;
  onQuestionsChange: (index: number, html: string) => void;
};

export const ReadingEditor = memo(function ReadingEditor({
  entries,
  contents,
  onPassageChange,
  onQuestionsChange,
}: ReadingEditorProps) {
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
              <label className="add-question-form__label">Passage text</label>
              <RichTextEditor
                value={contents[index]?.passage ?? EMPTY_HTML}
                onChange={(val) => onPassageChange(index, val)}
                priorQuestionHtml={contents
                  .slice(0, index)
                  .flatMap((part) => [part?.passage ?? '', part?.questions ?? ''])}
              />
              <Box sx={{ height: 10 }} />
              <label className="add-question-form__label">Questions</label>
              <RichTextEditor
                value={contents[index]?.questions ?? EMPTY_HTML}
                onChange={(val) => onQuestionsChange(index, val)}
                priorQuestionHtml={[
                  ...contents
                    .slice(0, index)
                    .flatMap((part) => [part?.passage ?? '', part?.questions ?? '']),
                  contents[index]?.passage ?? '',
                ]}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
});
