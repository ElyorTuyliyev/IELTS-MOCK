import { memo, useId } from "react";
import { Box } from "@mui/material";

import type { IeltsModule } from "../AddQuestionPage.constants";
import { FileUploadZone } from "./FileUploadZone";

const AUDIO_HINT = "Supported: MP3, WAV, M4A, AAC, OGG";

type AudioUploadSectionProps = {
  selectedModule: IeltsModule;
  listeningAudioFileName: string | null;
  listeningAudioPreviewSrc: string | null;
  onListeningFileChange: (file: File | null) => void;
};

export const AudioUploadSection = memo(function AudioUploadSection({
  selectedModule,
  listeningAudioFileName,
  listeningAudioPreviewSrc,
  onListeningFileChange,
}: AudioUploadSectionProps) {
  const listeningInputId = useId();

  if (selectedModule !== "Listening") {
    return null;
  }

  return (
    <Box className="add-question-card">
      <Box className="add-question-form__grid">
        <Box className="add-question-form__field add-question-form__field--span-2">
          <label className="add-question-form__label">Listening audio (required)</label>
          <FileUploadZone
            inputId={listeningInputId}
            accept="audio/*"
            hint={AUDIO_HINT}
            selectedFileName={listeningAudioFileName}
            onChangeFile={onListeningFileChange}
          />
          {listeningAudioPreviewSrc && (
            <Box
              className="add-question-form__audio-preview"
              component="figure"
              aria-label="Listening audio preview"
            >
              <audio controls preload="metadata" src={listeningAudioPreviewSrc} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});
