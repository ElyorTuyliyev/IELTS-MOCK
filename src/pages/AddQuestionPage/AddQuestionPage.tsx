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
import { FIND_ALL_PARTS_FOR_QUESTION_QUERY } from "./api/findAllPartsForQuestionQuery";
import {
  IELTS_MODULE_OPTIONS,
  QUESTION_TEMPLATES,
  type AnswerMode,
  type IeltsModule,
} from "./AddQuestionPage.constants";

type ExamItem = {
  _id: string;
  title: string;
  moduleId?: string | null;
};

type FindAllExamsResponse = {
  findAllExams: ExamItem[];
};

type PartItem = {
  _id: string;
  partNumber: number;
  title: string;
  moduleId: string;
};

type FindAllPartsResponse = {
  findAllParts: PartItem[];
};

type CreateQuestionMutationResponse = {
  createQuestion: {
    _id: string;
    listeningPart?: string | null;
  };
};

const EMPTY_HTML = "<p></p>";
const LISTENING_PART_LABELS = ["Part 1", "Part 2", "Part 3", "Part 4"] as const;
const READING_PART_LABELS = ["Part 1", "Part 2", "Part 3"] as const;
const WRITING_PART_LABELS = ["Part 1", "Part 2"] as const;
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

function buildListeningPartStem(partLabel: string, html: string) {
  return `<h3>${partLabel}</h3>${html}`;
}

function buildPartLabel(part: PartItem) {
  const title = part.title?.trim();
  if (title) {
    return `Part ${part.partNumber}: ${title}`;
  }
  return `Part ${part.partNumber}`;
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
  const { data: partsData } = useQuery<FindAllPartsResponse>(
    FIND_ALL_PARTS_FOR_QUESTION_QUERY,
  );
  const [createQuestion, { loading: isSaving }] = useMutation<CreateQuestionMutationResponse>(
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
  const [listeningPartStems, setListeningPartStems] = useState<string[]>(
    Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML),
  );
  const [readingPartStems, setReadingPartStems] = useState<string[]>(
    Array.from({ length: READING_PART_LABELS.length }, () => EMPTY_HTML),
  );
  const [writingPartStems, setWritingPartStems] = useState<string[]>(
    Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML),
  );
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
  const selectedExam = useMemo(
    () => exams.find((examItem) => examItem._id === selectedExamId) ?? null,
    [exams, selectedExamId],
  );
  const selectedModuleId = useMemo(() => {
    if (!selectedExam) {
      return null;
    }
    return selectedExam.moduleId ?? null;
  }, [selectedExam, selectedModule]);
  const selectedModuleParts = useMemo(() => {
    const moduleId = selectedModuleId;
    if (!moduleId) {
      return [];
    }
    return (partsData?.findAllParts ?? [])
      .filter((part) => String(part.moduleId) === String(moduleId))
      .sort((left, right) => left.partNumber - right.partNumber);
  }, [partsData?.findAllParts, selectedModuleId]);
  const listeningPartEntries = useMemo(
    () =>
      LISTENING_PART_LABELS.map((fallbackLabel, index) => {
        const part = selectedModuleParts[index];
        return {
          key: part?._id ?? `fallback-part-${index + 1}`,
          label: part ? buildPartLabel(part) : fallbackLabel,
          partId: part?._id ?? null,
          stem: listeningPartStems[index] ?? EMPTY_HTML,
        };
      }),
    [listeningPartStems, selectedModuleParts],
  );
  const readingPartEntries = useMemo(
    () =>
      READING_PART_LABELS.map((fallbackLabel, index) => {
        const part = selectedModuleParts[index];
        return {
          key: part?._id ?? `reading-fallback-part-${index + 1}`,
          label: part ? buildPartLabel(part) : fallbackLabel,
          partId: part?._id ?? null,
          stem: readingPartStems[index] ?? EMPTY_HTML,
        };
      }),
    [readingPartStems, selectedModuleParts],
  );
  const writingPartEntries = useMemo(
    () =>
      WRITING_PART_LABELS.map((fallbackLabel, index) => {
        const part = selectedModuleParts[index];
        return {
          key: part?._id ?? `writing-fallback-part-${index + 1}`,
          label: part ? buildPartLabel(part) : fallbackLabel,
          partId: part?._id ?? null,
          stem: writingPartStems[index] ?? EMPTY_HTML,
        };
      }),
    [selectedModuleParts, writingPartStems],
  );

  useEffect(() => {
    if (selectedModule !== "Listening") {
      return;
    }
    const expectedCount = LISTENING_PART_LABELS.length;
    setListeningPartStems((current) => {
      if (current.length === expectedCount) {
        return current;
      }
      if (current.length > expectedCount) {
        return current.slice(0, expectedCount);
      }
      return [...current, ...Array.from({ length: expectedCount - current.length }, () => EMPTY_HTML)];
    });
  }, [selectedModule, selectedModuleParts]);

  useEffect(() => {
    if (selectedModule !== "Writing") {
      return;
    }
    const expectedCount = WRITING_PART_LABELS.length;
    setWritingPartStems((current) => {
      if (current.length === expectedCount) {
        return current;
      }
      if (current.length > expectedCount) {
        return current.slice(0, expectedCount);
      }
      return [...current, ...Array.from({ length: expectedCount - current.length }, () => EMPTY_HTML)];
    });
  }, [selectedModule, selectedModuleParts]);

  useEffect(() => {
    if (selectedModule !== "Reading") {
      return;
    }
    const expectedCount = READING_PART_LABELS.length;
    setReadingPartStems((current) => {
      if (current.length === expectedCount) {
        return current;
      }
      if (current.length > expectedCount) {
        return current.slice(0, expectedCount);
      }
      return [...current, ...Array.from({ length: expectedCount - current.length }, () => EMPTY_HTML)];
    });
  }, [selectedModule, selectedModuleParts]);

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

    const raw = await response.text();
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new Error("File upload returned empty response.");
    }

    // Backend ba'zan plain text (`/uuid.ext`), ba'zan JSON (`"/uuid.ext"`) qaytaradi.
    if (trimmed.startsWith("/") || trimmed.startsWith("uploads/")) {
      return trimmed;
    }

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed === "object" && "path" in parsed) {
        const pathValue = (parsed as { path?: unknown }).path;
        if (typeof pathValue === "string") return pathValue;
      }
    } catch {
      // fall through to friendly error below
    }

    throw new Error("Unexpected upload response format.");
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setAcceptedAnswers("");
    setErrors([]);
    setSuccess(null);
  };

  const resolvedStem = selectedModule === "Listening" ? EMPTY_HTML : stem;

  const handleCreateQuestion = async () => {
    const nextErrors: string[] = [];
    setSuccess(null);

    if (!selectedExamId) nextErrors.push("IELTS exam tanlang.");
    if (!title.trim()) nextErrors.push("Question title required.");
    if (selectedModule !== "Listening" && selectedModule !== "Reading" && isHtmlEmpty(instruction)) {
      nextErrors.push("Instruction required.");
    }
    if (selectedModule === "Listening") {
        const missingParts = listeningPartEntries.filter((entry) => isHtmlEmpty(entry.stem));
      if (missingParts.length > 0) {
        nextErrors.push(
            `Listening part stem required: ${missingParts.map((entry) => entry.label).join(", ")}.`,
        );
      }
    } else if (selectedModule === "Reading") {
      const missingReadingParts = readingPartEntries.filter((entry) => isHtmlEmpty(entry.stem));
      if (missingReadingParts.length > 0) {
        nextErrors.push(
          `Reading part stem required: ${missingReadingParts.map((entry) => entry.label).join(", ")}.`,
        );
      }
    } else if (selectedModule === "Writing") {
      const missingWritingParts = writingPartEntries.filter((entry) => isHtmlEmpty(entry.stem));
      if (missingWritingParts.length > 0) {
        nextErrors.push(
          `Writing part stem required: ${missingWritingParts.map((entry) => entry.label).join(", ")}.`,
        );
      }
    } else if (isHtmlEmpty(resolvedStem)) {
      nextErrors.push("Question stem required.");
    }
    if (selectedModule !== "Listening" && selectedModule !== "Reading" && isHtmlEmpty(sourceMaterial)) {
      nextErrors.push("Source material required.");
    }
    if (selectedModule === "Listening" && !listeningAudioFile) {
      nextErrors.push("Listening audio required.");
    }
    if (selectedModule === "Speaking" && !speakingAudioFile) {
      nextErrors.push("Speaking audio required.");
    }
    if (selectedModule === "Reading" && !supportingImageFile) {
      nextErrors.push("Supporting image required for Reading.");
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

      const optionsPayload: Array<{ title: string; key: string; isCorrectAnswer: boolean }> = [];
      const normalizedPlacement =
        Number.isFinite(Number(timeLimit)) && Number(timeLimit) > 0
          ? Number(timeLimit)
          : null;

      if (selectedModule === "Listening") {
        const partResults = await Promise.all(
          listeningPartEntries.map(({ label, stem: partStem, partId }) =>
            createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  stem: buildListeningPartStem(label, partStem),
                  sourceMaterial: null,
                  explanation,
                  listeningAudio: uploadedListeningAudio,
                  speakingAudio: null,
                  supportingImage: null,
                  question: `${title.trim()} (${label})\n\n${buildListeningPartStem(label, partStem)}`,
                  type: "input",
                  ieltsModule: selectedModule,
                  listeningPart: label,
                  partId,
                  placementNumber: normalizedPlacement,
                  options: optionsPayload,
                },
              },
            }),
          ),
        );

        const failedResult = partResults.find(
          (result) => result.error || !result.data?.createQuestion?._id,
        );
        if (failedResult?.error) {
          throw new Error(failedResult.error.message);
        }
        if (failedResult && !failedResult.data?.createQuestion?._id) {
          throw new Error("Listening part savollaridan biri saqlanmadi.");
        }
      } else if (selectedModule === "Reading") {
        const partResults = await Promise.all(
          readingPartEntries.map(({ label, stem: partStem, partId }) =>
            createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  stem: buildListeningPartStem(label, partStem),
                  sourceMaterial: null,
                  explanation: null,
                  listeningAudio: null,
                  speakingAudio: null,
                  supportingImage: uploadedSupportingImage,
                  question: `${title.trim()} (${label})\n\n${buildListeningPartStem(label, partStem)}`,
                  type:
                    answerMode === "multiple"
                      ? "multiselect"
                      : "input",
                  ieltsModule: selectedModule,
                  partId,
                  placementNumber: normalizedPlacement,
                  options: optionsPayload,
                },
              },
            }),
          ),
        );

        const failedResult = partResults.find(
          (result) => result.error || !result.data?.createQuestion?._id,
        );
        if (failedResult?.error) {
          throw new Error(failedResult.error.message);
        }
        if (failedResult && !failedResult.data?.createQuestion?._id) {
          throw new Error("Reading part savollaridan biri saqlanmadi.");
        }
      } else if (selectedModule === "Writing") {
        const partResults = await Promise.all(
          writingPartEntries.map(({ label, stem: partStem, partId }) =>
            createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  stem: buildListeningPartStem(label, partStem),
                  sourceMaterial: null,
                  explanation: null,
                  listeningAudio: null,
                  speakingAudio: null,
                  supportingImage: null,
                  question: `${title.trim()} (${label})\n\n${buildListeningPartStem(label, partStem)}`,
                  type:
                    answerMode === "multiple"
                      ? "multiselect"
                      : "input",
                  ieltsModule: selectedModule,
                  partId,
                  placementNumber: normalizedPlacement,
                  options: optionsPayload,
                },
              },
            }),
          ),
        );

        const failedResult = partResults.find(
          (result) => result.error || !result.data?.createQuestion?._id,
        );
        if (failedResult?.error) {
          throw new Error(failedResult.error.message);
        }
        if (failedResult && !failedResult.data?.createQuestion?._id) {
          throw new Error("Writing part savollaridan biri saqlanmadi.");
        }
      } else {
        const mutationResult = await createQuestion({
          variables: {
            input: {
              examId: selectedExamId,
              title: title.trim(),
              instruction,
              stem: resolvedStem,
              sourceMaterial,
              explanation,
              listeningAudio: uploadedListeningAudio,
              speakingAudio: uploadedSpeakingAudio,
              supportingImage: uploadedSupportingImage,
              question: `${title.trim()}\n\n${resolvedStem}`,
              type:
                answerMode === "multiple"
                  ? "multiselect"
                  : "input",
              ieltsModule: selectedModule,
              placementNumber: normalizedPlacement,
              options: optionsPayload,
            },
          },
        });

        if (mutationResult.error) {
          throw new Error(mutationResult.error.message);
        }

        if (!mutationResult.data?.createQuestion?._id) {
          throw new Error("Create Question so‘rovi muvaffaqiyatsiz tugadi.");
        }
      }

      setErrors([]);
      setSuccess(
        selectedModule === "Listening"
          ? `Listening part savollari (${listeningPartEntries.length} ta) muvaffaqiyatli yaratildi.`
          : selectedModule === "Reading"
            ? `Reading part savollari (${readingPartEntries.length} ta) muvaffaqiyatli yaratildi.`
            : selectedModule === "Writing"
              ? `Writing part savollari (${writingPartEntries.length} ta) muvaffaqiyatli yaratildi.`
          : "Question muvaffaqiyatli yaratildi.",
      );
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
                  Template tanlang va savol yarating.
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
                      <label className="add-question-form__label">IELTS exam</label>
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
                      <label className="add-question-form__label">Question title / name</label>
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
                    {selectedModule === "Reading" ? (
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

                {selectedModule === "Listening" ? (
                  <Box className="add-question-card">
                    <Box className="add-question-form__field add-question-form__field--span-4">
                      <label className="add-question-form__label">
                        Question stem ({listeningPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {listeningPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <RichTextEditor
                              value={listeningPartStems[index] ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setListeningPartStems((current) =>
                                  current.map((item, idx) => (idx === index ? nextValue : item)),
                                )
                              }
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ) : selectedModule === "Reading" ? (
                  <Box className="add-question-card">
                    <Box className="add-question-form__field add-question-form__field--span-4">
                      <label className="add-question-form__label">
                        Question stem ({readingPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {readingPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <RichTextEditor
                              value={readingPartStems[index] ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setReadingPartStems((current) =>
                                  current.map((item, idx) => (idx === index ? nextValue : item)),
                                )
                              }
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ) : selectedModule === "Writing" ? (
                  <Box className="add-question-card">
                    <Box className="add-question-form__field add-question-form__field--span-4">
                      <label className="add-question-form__label">
                        Question stem ({writingPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {writingPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <RichTextEditor
                              value={writingPartStems[index] ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setWritingPartStems((current) =>
                                  current.map((item, idx) => (idx === index ? nextValue : item)),
                                )
                              }
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ) : (
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
                )}

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
