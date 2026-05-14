import { memo, useId } from "react";
import { Box } from "@mui/material";

import type { IeltsModule } from "../AddQuestionPage.constants";
import { FileUploadZone } from "./FileUploadZone";

const AUDIO_HINT = "Supported: MP3, WAV, M4A, AAC, OGG";

type AudioUploadSectionProps = {
  selectedModule: IeltsModule;
  listeningAudioFileName: string | null;
  speakingAudioFileName: string | null;
  listeningAudioPreviewSrc: string | null;
  speakingAudioPreviewSrc: string | null;
  onListeningFileChange: (file: File | null) => void;
  onSpeakingFileChange: (file: File | null) => void;
};

export const AudioUploadSection = memo(function AudioUploadSection({
  selectedModule,
  listeningAudioFileName,
  speakingAudioFileName,
  listeningAudioPreviewSrc,
  speakingAudioPreviewSrc,
  onListeningFileChange,
  onSpeakingFileChange,
}: AudioUploadSectionProps) {
  const listeningInputId = useId();
  const speakingInputId = useId();

  if (selectedModule !== "Listening" && selectedModule !== "Speaking") {
    return null;
  }

  return (
    <Box className="add-question-card">
      <Box className="add-question-form__grid">
        {selectedModule === "Listening" && (
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
        )}
        {selectedModule === "Speaking" && (
          <Box className="add-question-form__field add-question-form__field--span-2">
            <label className="add-question-form__label">Speaking audio</label>
            <FileUploadZone
              inputId={speakingInputId}
              accept="audio/*"
              hint={AUDIO_HINT}
              selectedFileName={speakingAudioFileName}
              onChangeFile={onSpeakingFileChange}
            />
            {speakingAudioPreviewSrc && (
              <Box
                className="add-question-form__audio-preview"
                component="figure"
                aria-label="Speaking audio preview"
              >
                <audio controls preload="metadata" src={speakingAudioPreviewSrc} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
});
