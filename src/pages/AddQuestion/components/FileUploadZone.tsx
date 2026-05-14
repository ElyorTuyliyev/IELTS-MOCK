import { memo, type ChangeEvent } from "react";
import { Box } from "@mui/material";

function FileUploadTrayIcon() {
  return (
    <svg
      className="add-question-form__file-trigger-svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3v12M7 8l5-5 5 5M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FileUploadZoneProps = {
  inputId: string;
  accept: string;
  hint: string;
  selectedFileName: string | null;
  onChangeFile: (file: File | null) => void;
};

export const FileUploadZone = memo(function FileUploadZone({
  inputId,
  accept,
  hint,
  selectedFileName,
  onChangeFile,
}: FileUploadZoneProps) {
  return (
    <Box className="add-question-form__file-zone">
      <input
        id={inputId}
        className="add-question-form__file-input-hidden"
        type="file"
        accept={accept}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChangeFile(event.target.files?.[0] ?? null)
        }
      />
      <label
        htmlFor={inputId}
        className="add-question-form__file-trigger"
        aria-label="Fayl tanlash"
      >
        <span className="add-question-form__file-trigger-icon-wrap" aria-hidden>
          <FileUploadTrayIcon />
        </span>
        {selectedFileName ? (
          <span className="add-question-form__file-trigger-filename" title={selectedFileName}>
            {selectedFileName}
          </span>
        ) : (
          <span className="add-question-form__file-trigger-placeholder">No file selected</span>
        )}
        <span className="add-question-form__file-trigger-hint">{hint}</span>
      </label>
    </Box>
  );
});
