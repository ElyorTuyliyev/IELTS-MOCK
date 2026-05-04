import { useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

import { Layout } from "../../components/layout";
import { RichTextEditor } from "../../components/common/RichTextEditor/RichTextEditor";
import { graphqlUrl } from "../../graphql/client";
import { selectAuthToken } from "../../store";
import { useAppSelector } from "../../store/hooks";
import { AddQuestionPageRoot } from "./AddQuestionPage.style";
import { CREATE_QUESTION_MUTATION } from "./api/createQuestionMutation";
import { FIND_ALL_EXAMS_FOR_QUESTION_QUERY } from "./api/findAllExamsForQuestionQuery";
import {
  IELTS_MODULE_OPTIONS,
  QUESTION_TEMPLATES,
  type AnswerMode,
  type IeltsModule,
} from "./AddQuestionPage.constants";

type ExamItem = {
  _id: string;
  title: string;
};

type FindAllExamsResponse = {
  findAllExams: ExamItem[];
};

const EMPTY_HTML = "<p></p>";
const uploadEndpoint = `${graphqlUrl.replace(/\/graphql$/, "")}/files/upload`;

function isHtmlEmpty(value: string) {
  const normalized = value
    .replace(/<p><\/p>/g, "")
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return normalized.length === 0;
}

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

function FileUploadZone({
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
}

export function AddQuestionPage() {
  const authToken = useAppSelector(selectAuthToken);
  const { data: examsData } = useQuery<FindAllExamsResponse>(
    FIND_ALL_EXAMS_FOR_QUESTION_QUERY,
  );
  const [createQuestion, { loading: isSaving }] = useMutation(
    CREATE_QUESTION_MUTATION,
  );

  const [selectedModule, setSelectedModule] = useState<IeltsModule>("Listening");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    QUESTION_TEMPLATES[0]?.id ?? "",
  );
  const [selectedExamId, setSelectedExamId] = useState("");
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("45");
  const [instruction, setInstruction] = useState(EMPTY_HTML);
  const [stem, setStem] = useState(EMPTY_HTML);
  const [sourceMaterial, setSourceMaterial] = useState(EMPTY_HTML);
  const [explanation, setExplanation] = useState(EMPTY_HTML);
  const [acceptedAnswers, setAcceptedAnswers] = useState("");
  const [listeningAudioFile, setListeningAudioFile] = useState<File | null>(null);
  const [speakingAudioFile, setSpeakingAudioFile] = useState<File | null>(null);
  const [supportingImageFile, setSupportingImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const listeningFileInputId = useId();
  const speakingFileInputId = useId();
  const supportingImageInputId = useId();

  const exams = examsData?.findAllExams ?? [];
  const selectedTemplate = useMemo(
    () =>
      QUESTION_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
      QUESTION_TEMPLATES[0],
    [selectedTemplateId],
  );
  const answerMode: AnswerMode = selectedTemplate.answerMode;

  useEffect(() => {
    if (!selectedExamId && exams.length > 0) {
      setSelectedExamId(exams[0]._id);
    }
  }, [exams, selectedExamId]);

  const listeningAudioPreviewUrl = useMemo(
    () => (listeningAudioFile ? URL.createObjectURL(listeningAudioFile) : null),
    [listeningAudioFile],
  );

  useEffect(() => {
    if (!listeningAudioPreviewUrl) return;
    return () => {
      URL.revokeObjectURL(listeningAudioPreviewUrl);
    };
  }, [listeningAudioPreviewUrl]);

  const uploadAsset = async (file: File | null) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : undefined,
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`File upload failed (${response.status})`);
    }
    return (await response.json()) as string;
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setAcceptedAnswers("");
    setErrors([]);
    setSuccess(null);
  };

  const handleCreateQuestion = async () => {
    const nextErrors: string[] = [];
    setSuccess(null);

    if (!selectedExamId) nextErrors.push("IELTS mock test tanlang.");
    if (!title.trim()) nextErrors.push("Question title required.");
    if (isHtmlEmpty(instruction)) nextErrors.push("Instruction required.");
    if (isHtmlEmpty(stem)) nextErrors.push("Question stem required.");
    if (isHtmlEmpty(sourceMaterial)) nextErrors.push("Source material required.");
    if (selectedModule === "Listening" && !listeningAudioFile) {
      nextErrors.push("Listening audio required.");
    }
    if (selectedModule === "Speaking" && !speakingAudioFile) {
      nextErrors.push("Speaking audio required.");
    }
    if (
      (selectedModule === "Reading" || selectedModule === "Writing") &&
      !supportingImageFile
    ) {
      nextErrors.push("Supporting image required for Reading/Writing.");
    }
    if (answerMode === "text") {
      const variants = acceptedAnswers
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      if (variants.length === 0) {
        nextErrors.push("Accepted answers required for text template.");
      }
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const [uploadedListeningAudio, uploadedSpeakingAudio, uploadedSupportingImage] =
        await Promise.all([
          uploadAsset(listeningAudioFile),
          uploadAsset(speakingAudioFile),
          uploadAsset(supportingImageFile),
        ]);

      const optionsPayload =
        answerMode === "text"
          ? acceptedAnswers
              .split("|")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item, index) => ({
                title: item,
                key: `V${index + 1}`,
                isCorrectAnswer: true,
              }))
          : [];

      await createQuestion({
        variables: {
          input: {
            examId: selectedExamId,
            title: title.trim(),
            instruction,
            stem,
            sourceMaterial,
            explanation,
            listeningAudio: uploadedListeningAudio,
            speakingAudio: uploadedSpeakingAudio,
            supportingImage: uploadedSupportingImage,
            question: `${title.trim()}\n\n${stem}`,
            type:
              answerMode === "multiple"
                ? "multiselect"
                : "input",
            ieltsModule: selectedModule,
            placementNumber:
              Number.isFinite(Number(timeLimit)) && Number(timeLimit) > 0
                ? Number(timeLimit)
                : null,
            options: optionsPayload,
          },
        },
      });

      setErrors([]);
      setSuccess("Question muvaffaqiyatli yaratildi.");
    } catch (error: any) {
      setErrors([error?.message ?? "Question create failed."]);
    }
  };

  return (
    <Layout>
      <AddQuestionPageRoot>
        <Box className="add-question-page">
          <Box className="add-question-page__hero">
            <Box className="add-question-page__panel add-question-page__rail">
              <Box className="add-question-page__rail-head">
                <Typography component="h1" className="add-question-page__rail-title">
                  IELTS Question Templates
                </Typography>
                <Typography component="p" className="add-question-page__rail-copy">
                  Tozalangan create form: template tanlang va savol yarating.
                </Typography>
              </Box>
              <Box className="add-question-page__module-list">
                {QUESTION_TEMPLATES.filter((t) => t.module === selectedModule).map((template) => (
                  <Button
                    key={template.id}
                    className={`add-question-page__module-card${
                      template.id === selectedTemplateId
                        ? " add-question-page__module-card--active"
                        : ""
                    }`}
                    variant="text"
                    onClick={() => handleTemplateChange(template.id)}
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

            <Box className="add-question-page__panel add-question-page__workspace">
              <Box className="add-question-form">
                <Box className="add-question-card">
                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">IELTS mock test</label>
                      <TextField
                        select
                        fullWidth
                        value={selectedExamId}
                        onChange={(event) => setSelectedExamId(event.target.value)}
                      >
                        {exams.map((examItem) => (
                          <MenuItem key={examItem._id} value={examItem._id}>
                            {examItem.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">Question title</label>
                      <TextField
                        fullWidth
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Listening map labeling question"
                      />
                    </Box>
                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">IELTS module</label>
                      <TextField
                        select
                        fullWidth
                        value={selectedModule}
                        onChange={(event) => {
                          const module = event.target.value as IeltsModule;
                          setSelectedModule(module);
                          const moduleTemplates = QUESTION_TEMPLATES.filter(
                            (template) => template.module === module,
                          );
                          if (moduleTemplates[0]) {
                            setSelectedTemplateId(moduleTemplates[0].id);
                          }
                        }}
                      >
                        {IELTS_MODULE_OPTIONS.map((moduleItem) => (
                          <MenuItem key={moduleItem} value={moduleItem}>
                            {moduleItem}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">Suggested time (seconds)</label>
                      <TextField
                        fullWidth
                        value={timeLimit}
                        onChange={(event) => setTimeLimit(event.target.value)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box className="add-question-card">
                  <Box className="add-question-form__grid">
                    {selectedModule === "Listening" ? (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">Listening audio</label>
                        <FileUploadZone
                          inputId={listeningFileInputId}
                          accept="audio/*"
                          hint="Supported: MP3, WAV, M4A, AAC, OGG"
                          selectedFileName={listeningAudioFile?.name ?? null}
                          onChangeFile={setListeningAudioFile}
                        />
                        {listeningAudioPreviewUrl ? (
                          <Box
                            className="add-question-form__audio-preview"
                            component="figure"
                            aria-label="Listening audio preview"
                          >
                            <audio controls preload="metadata" src={listeningAudioPreviewUrl} />
                          </Box>
                        ) : null}
                      </Box>
                    ) : null}
                    {selectedModule === "Speaking" ? (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">Speaking audio</label>
                        <FileUploadZone
                          inputId={speakingFileInputId}
                          accept="audio/*"
                          hint="Supported: MP3, WAV, M4A, AAC, OGG"
                          selectedFileName={speakingAudioFile?.name ?? null}
                          onChangeFile={setSpeakingAudioFile}
                        />
                      </Box>
                    ) : null}
                    {selectedModule === "Reading" || selectedModule === "Writing" ? (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">Supporting image</label>
                        <FileUploadZone
                          inputId={supportingImageInputId}
                          accept="image/*"
                          hint="Supported: PNG, JPG, WebP, GIF"
                          selectedFileName={supportingImageFile?.name ?? null}
                          onChangeFile={setSupportingImageFile}
                        />
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                <Box className="add-question-card">
                  <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                    <label className="add-question-form__label">Instruction</label>
                    <RichTextEditor value={instruction} onChange={setInstruction} />
                  </Box>
                  <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                    <label className="add-question-form__label">Question stem</label>
                    <RichTextEditor value={stem} onChange={setStem} />
                  </Box>
                  <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                    <label className="add-question-form__label">Source material</label>
                    <RichTextEditor value={sourceMaterial} onChange={setSourceMaterial} />
                  </Box>
                  <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                    <label className="add-question-form__label">Explanation</label>
                    <RichTextEditor value={explanation} onChange={setExplanation} />
                  </Box>
                </Box>

                {answerMode === "text" ? (
                  <Box className="add-question-card">
                    <Box className="add-question-form__field add-question-form__field--span-4">
                      <label className="add-question-form__label">
                        Accepted answers (`|` bilan ajrating)
                      </label>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={acceptedAnswers}
                        onChange={(event) => setAcceptedAnswers(event.target.value)}
                        placeholder="answer one | answer two"
                      />
                    </Box>
                  </Box>
                ) : null}

                {errors.length > 0 ? (
                  <Box className="add-question-form__publish-errors">
                    <Typography
                      component="p"
                      className="add-question-form__publish-errors-title"
                    >
                      Resolve these:
                    </Typography>
                    <Box component="ul" className="add-question-form__publish-errors-list">
                      {errors.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </Box>
                  </Box>
                ) : null}

                {success ? (
                  <Box className="add-question-form__publish-errors">
                    <Typography
                      component="p"
                      className="add-question-form__publish-errors-title"
                    >
                      {success}
                    </Typography>
                  </Box>
                ) : null}

                <Box className="add-question-form__footer">
                  <Typography component="p" className="add-question-form__footer-copy">
                    Clean recreate form — direct backend save.
                  </Typography>
                  <Box className="add-question-form__footer-actions">
                    <Button
                      className="add-question-form__primary"
                      variant="contained"
                      onClick={handleCreateQuestion}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Create Question"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </AddQuestionPageRoot>
    </Layout>
  );
}
