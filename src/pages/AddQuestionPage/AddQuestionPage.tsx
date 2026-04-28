import { type ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { RichTextEditor } from "../../components/common/RichTextEditor/RichTextEditor";
import { Layout } from "../../components/layout";
import { ROUTES_PATH } from "../../routes";
import {
  BAND_OPTIONS,
  DIFFICULTY_OPTIONS,
  IELTS_MODULE_OPTIONS,
  PART_OPTIONS,
  QUESTION_TEMPLATES,
  STATUS_OPTIONS,
} from "./AddQuestionPage.constants";
import type {
  AnswerMode,
  IeltsModule,
  QuestionTemplate,
} from "./AddQuestionPage.constants";
import { AddQuestionPageRoot } from "./AddQuestionPage.style";

type AnswerOption = {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
};

const letterLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const emptyEditorValue = "<p></p>";

function isEffectivelyEmptyHtml(value: string): boolean {
  const normalized = value
    .replace(/<p><\/p>/g, "")
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return normalized.length === 0;
}

function createOption(label: string, text = ""): AnswerOption {
  return {
    id: `option-${label}`,
    label,
    text,
    isCorrect: label === "A",
  };
}

function createOptionsByTemplate(templateId: string): AnswerOption[] {
  if (templateId === "reading-tfng") {
    return [
      { id: "option-t", label: "A", text: "True", isCorrect: true },
      { id: "option-f", label: "B", text: "False", isCorrect: false },
      { id: "option-ng", label: "C", text: "Not Given", isCorrect: false },
    ];
  }

  return [
    createOption("A"),
    createOption("B"),
    createOption("C"),
    createOption("D"),
  ];
}

export function AddQuestionPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("listening-mcq");
  const [selectedModule, setSelectedModule] =
    useState<IeltsModule>("Listening");
  const [title, setTitle] = useState("");
  const [part, setPart] = useState(PART_OPTIONS.Listening[0]);
  const [bandTarget, setBandTarget] = useState("6.5");
  const [difficulty, setDifficulty] = useState("Core");
  const [status, setStatus] = useState("Draft");
  const [timeLimit, setTimeLimit] = useState("90");
  const [questionStem, setQuestionStem] = useState(emptyEditorValue);
  const [instruction, setInstruction] = useState(
    "<p>Choose the correct answer based on the recording.</p>",
  );
  const [sourceMaterial, setSourceMaterial] = useState(emptyEditorValue);
  const [teacherNote, setTeacherNote] = useState(emptyEditorValue);
  const [acceptedAnswers, setAcceptedAnswers] = useState("");
  const [explanation, setExplanation] = useState(emptyEditorValue);
  const [category, setCategory] = useState("IELTS Mock Test 01");
  const [tags, setTags] = useState("listening, mcq, part-1");
  const [alias, setAlias] = useState("Q-L1-001");
  const [scoreMode, setScoreMode] = useState<"band" | "raw">("raw");
  const [points, setPoints] = useState("1.0");
  const [followUp, setFollowUp] = useState("");
  const [sampleResponse, setSampleResponse] = useState("");
  const [listeningAudioFile, setListeningAudioFile] = useState<File | null>(
    null,
  );
  const [supportingImageFile, setSupportingImageFile] = useState<File | null>(
    null,
  );
  const [supportingImagePreviewUrl, setSupportingImagePreviewUrl] =
    useState("");
  const [speakingAudioFile, setSpeakingAudioFile] = useState<File | null>(null);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>(
    createOptionsByTemplate("listening-mcq"),
  );

  const selectedTemplate =
    QUESTION_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
    QUESTION_TEMPLATES[0];

  const answerMode: AnswerMode = selectedTemplate.answerMode;

  useEffect(() => {
    if (!supportingImageFile) {
      setSupportingImagePreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(supportingImageFile);
    setSupportingImagePreviewUrl(objectUrl);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "post-fix",
        hypothesisId: "H24",
        location: "AddQuestionPage.tsx:useEffect[supportingImagePreviewUrl]",
        message: "Supporting image preview URL created",
        data: {
          module: selectedModule,
          hasImage: true,
          imageName: supportingImageFile.name,
          previewUrlLength: objectUrl.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [supportingImageFile, selectedModule]);

  const handleTemplateSelect = (template: QuestionTemplate) => {
    setSelectedTemplateId(template.id);
    setSelectedModule(template.module);
    setPart(PART_OPTIONS[template.module][0]);
    setInstruction(
      template.answerMode === "essay"
        ? "<p>Write at least 150 words and organise your response clearly.</p>"
        : template.answerMode === "speaking"
          ? "<p>You have 1 minute to prepare and speak for up to 2 minutes.</p>"
          : template.answerMode === "text"
            ? "<p>Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.</p>"
            : "<p>Choose the correct answer based on the task requirements.</p>",
    );
    setAnswerOptions(createOptionsByTemplate(template.id));
    setQuestionStem(emptyEditorValue);
    setSourceMaterial(emptyEditorValue);
    setTeacherNote(emptyEditorValue);
    setExplanation(emptyEditorValue);
    setAcceptedAnswers("");
    setFollowUp("");
    setSampleResponse("");
    setListeningAudioFile(null);
    setSupportingImageFile(null);
    setSpeakingAudioFile(null);
    setPublishErrors([]);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H11",
        location: "AddQuestionPage.tsx:handleTemplateSelect",
        message: "Template switched and rich fields reset",
        data: {
          templateId: template.id,
          module: template.module,
          answerMode: template.answerMode,
          audioReset: true,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handleModuleChange = (module: IeltsModule) => {
    const moduleTemplate =
      QUESTION_TEMPLATES.find((template) => template.module === module) ??
      QUESTION_TEMPLATES[0];

    handleTemplateSelect(moduleTemplate);
  };

  const updateOption = (
    id: string,
    field: "text" | "isCorrect",
    value: string | boolean,
  ) => {
    setAnswerOptions((currentOptions) => {
      if (field === "isCorrect" && answerMode === "single" && value === true) {
        return currentOptions.map((option) => ({
          ...option,
          isCorrect: option.id === id,
        }));
      }

      return currentOptions.map((option) =>
        option.id === id ? { ...option, [field]: value } : option,
      );
    });
  };

  const addOption = () => {
    setAnswerOptions((currentOptions) => {
      const nextLabel =
        letterLabels[currentOptions.length] ?? `O${currentOptions.length + 1}`;
      return [...currentOptions, createOption(nextLabel)];
    });
  };

  const removeOption = (id: string) => {
    setAnswerOptions((currentOptions) => {
      if (currentOptions.length <= 2) {
        return currentOptions;
      }

      const nextOptions = currentOptions.filter((option) => option.id !== id);

      if (
        answerMode === "single" &&
        nextOptions.every((option) => !option.isCorrect)
      ) {
        return nextOptions.map((option, index) => ({
          ...option,
          isCorrect: index === 0,
        }));
      }

      return nextOptions;
    });
  };

  const handleQuestionStemChange = (nextValue: string) => {
    setQuestionStem(nextValue);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H12",
        location: "AddQuestionPage.tsx:handleQuestionStemChange",
        message: "Question stem rich text changed",
        data: {
          htmlLength: nextValue.length,
          hasFormattingTag:
            nextValue.includes("<strong>") ||
            nextValue.includes("<em>") ||
            nextValue.includes("<ul>") ||
            nextValue.includes("<ol>"),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handlePublishQuestion = () => {
    const validationSnapshot = {
      titleMissing: title.trim().length === 0,
      instructionMissing: isEffectivelyEmptyHtml(instruction),
      questionStemMissing: isEffectivelyEmptyHtml(questionStem),
      sourceMaterialMissing: isEffectivelyEmptyHtml(sourceMaterial),
      listeningAudioMissing:
        selectedModule === "Listening" && !listeningAudioFile,
      speakingAudioMissing: selectedModule === "Speaking" && !speakingAudioFile,
      visualMaterialMissing:
        (selectedModule === "Reading" || selectedModule === "Writing") &&
        !supportingImageFile,
      speakingFollowUpMissing:
        selectedModule === "Speaking" && followUp.trim().length === 0,
      writingSampleMissing:
        selectedModule === "Writing" && sampleResponse.trim().length === 0,
      readingAnswersMissing:
        selectedModule === "Reading" &&
        answerOptions.some((option) => option.text.trim().length === 0),
    };
    const nextPublishErrors: string[] = [];
    if (validationSnapshot.titleMissing)
      nextPublishErrors.push("Question title is required.");
    if (validationSnapshot.instructionMissing)
      nextPublishErrors.push("Instruction cannot be empty.");
    if (validationSnapshot.questionStemMissing)
      nextPublishErrors.push("Question stem cannot be empty.");
    if (validationSnapshot.sourceMaterialMissing)
      nextPublishErrors.push("Source material cannot be empty.");
    if (validationSnapshot.listeningAudioMissing)
      nextPublishErrors.push("Listening module requires an audio file.");
    if (validationSnapshot.speakingAudioMissing)
      nextPublishErrors.push("Speaking module requires an audio prompt file.");
    if (validationSnapshot.visualMaterialMissing)
      nextPublishErrors.push(
        "Reading/Writing modules require a supporting image.",
      );
    if (validationSnapshot.speakingFollowUpMissing)
      nextPublishErrors.push(
        "Speaking module requires examiner follow-up notes.",
      );
    if (validationSnapshot.writingSampleMissing)
      nextPublishErrors.push(
        "Writing module requires a sample high-band response.",
      );
    if (validationSnapshot.readingAnswersMissing)
      nextPublishErrors.push("Reading options must have text for all answers.");
    setPublishErrors(nextPublishErrors);

    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H17-H21",
        location: "AddQuestionPage.tsx:handlePublishQuestion",
        message: "Publish payload + module validation snapshot",
        data: {
          templateId: selectedTemplateId,
          module: selectedModule,
          titleLength: title.trim().length,
          instructionHtmlLength: instruction.length,
          questionStemHtmlLength: questionStem.length,
          sourceMaterialHtmlLength: sourceMaterial.length,
          explanationHtmlLength: explanation.length,
          answerOptionsCount: answerOptions.length,
          hasListeningAudio: Boolean(listeningAudioFile),
          listeningAudioName: listeningAudioFile?.name ?? null,
          listeningAudioSize: listeningAudioFile?.size ?? null,
          hasSupportingImage: Boolean(supportingImageFile),
          supportingImageName: supportingImageFile?.name ?? null,
          supportingImageSize: supportingImageFile?.size ?? null,
          hasSpeakingAudio: Boolean(speakingAudioFile),
          speakingAudioName: speakingAudioFile?.name ?? null,
          speakingAudioSize: speakingAudioFile?.size ?? null,
          validationSnapshot,
          blockedByValidation: nextPublishErrors.length > 0,
          validationErrorCount: nextPublishErrors.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handleListeningAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setListeningAudioFile(file);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H14",
        location: "AddQuestionPage.tsx:handleListeningAudioChange",
        message: "Listening audio selected",
        data: {
          hasFile: Boolean(file),
          fileName: file?.name ?? null,
          mimeType: file?.type ?? null,
          size: file?.size ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handleSupportingImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setSupportingImageFile(file);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H22",
        location: "AddQuestionPage.tsx:handleSupportingImageChange",
        message: "Supporting image selected",
        data: {
          module: selectedModule,
          hasFile: Boolean(file),
          fileName: file?.name ?? null,
          mimeType: file?.type ?? null,
          size: file?.size ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const handleSpeakingAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSpeakingAudioFile(file);
    fetch("http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "393b5a",
      },
      body: JSON.stringify({
        sessionId: "393b5a",
        runId: "pre-fix",
        hypothesisId: "H23",
        location: "AddQuestionPage.tsx:handleSpeakingAudioChange",
        message: "Speaking audio selected",
        data: {
          hasFile: Boolean(file),
          fileName: file?.name ?? null,
          mimeType: file?.type ?? null,
          size: file?.size ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  return (
    <Layout>
      <AddQuestionPageRoot>
        <Box className="add-question-page">
          <Box className="add-question-page__crumbs">
            <Link to={ROUTES_PATH.allQuestions}>Questions</Link>
            <span>›</span>
            <span className="add-question-page__crumb-current">
              New question
            </span>
          </Box>

          <Box className="add-question-page__hero">
            <Box className="add-question-page__panel add-question-page__rail">
              <Box className="add-question-page__rail-head">
                <Typography
                  component="h1"
                  className="add-question-page__rail-title"
                >
                  IELTS Question Templates
                </Typography>
                <Typography
                  component="p"
                  className="add-question-page__rail-copy"
                >
                  Pick the exact IELTS task type first. The editor adjusts
                  scoring, answer logic, and authoring fields to match that
                  task.
                </Typography>
              </Box>

              <Box className="add-question-page__module-list">
                {QUESTION_TEMPLATES.map((template) => (
                  <Button
                    key={template.id}
                    className={`add-question-page__module-card${
                      template.id === selectedTemplateId
                        ? " add-question-page__module-card--active"
                        : ""
                    }`}
                    variant="text"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <span className="add-question-page__module-eyebrow">
                      {template.module}
                    </span>
                    <span className="add-question-page__module-title">
                      {template.title}
                    </span>
                    <span className="add-question-page__module-description">
                      {template.description}
                    </span>
                  </Button>
                ))}
              </Box>
            </Box>

            <Box className="add-question-page__panel add-question-page__workspace">
              <Box className="add-question-page__workspace-header">
                <Box>
                  <Typography
                    component="h2"
                    className="add-question-page__workspace-title"
                  >
                    {selectedTemplate.module} · {selectedTemplate.title}
                  </Typography>
                  <Typography component="p" className="add-question-card__copy">
                    Build a question aligned to IELTS task design, answer
                    evaluation, and band-oriented review.
                  </Typography>
                </Box>

                <Box className="add-question-page__summary">
                  <span className="add-question-page__summary-chip">
                    {selectedModule}
                  </span>
                  <span className="add-question-page__summary-chip">
                    {selectedTemplate.title}
                  </span>
                  <span className="add-question-page__summary-chip">
                    Band {bandTarget}
                  </span>
                </Box>
              </Box>

              <Box className="add-question-builder">
                <Box className="add-question-builder__card add-question-builder__card--highlight">
                  <Typography
                    component="h3"
                    className="add-question-builder__title"
                  >
                    IELTS Fit
                  </Typography>
                  <Typography
                    component="p"
                    className="add-question-builder__copy"
                  >
                    Uses module-specific part structure and answer behaviour
                    instead of generic LMS question logic.
                  </Typography>
                </Box>

                <Box className="add-question-builder__card">
                  <Typography
                    component="h3"
                    className="add-question-builder__title"
                  >
                    Scoring
                  </Typography>
                  <Typography
                    component="p"
                    className="add-question-builder__copy"
                  >
                    Support raw marks for objective items and band-based
                    guidance for Writing and Speaking tasks.
                  </Typography>
                </Box>

                <Box className="add-question-builder__card">
                  <Typography
                    component="h3"
                    className="add-question-builder__title"
                  >
                    Source Control
                  </Typography>
                  <Typography
                    component="p"
                    className="add-question-builder__copy"
                  >
                    Keep transcript, passage, cue card, or task brief tied
                    directly to the authored item.
                  </Typography>
                </Box>

                <Box className="add-question-builder__card">
                  <Typography
                    component="h3"
                    className="add-question-builder__title"
                  >
                    Reviewer Notes
                  </Typography>
                  <Typography
                    component="p"
                    className="add-question-builder__copy"
                  >
                    Add answer rationale, acceptable variants, and examiner
                    guidance before publishing.
                  </Typography>
                </Box>
              </Box>

              <Box className="add-question-form">
                <Box className="add-question-card">
                  <Box className="add-question-card__head">
                    <Box>
                      <Typography
                        component="h3"
                        className="add-question-card__title"
                      >
                        Core Setup
                      </Typography>
                      <Typography
                        component="p"
                        className="add-question-card__copy"
                      >
                        Define where this question fits inside an IELTS exam
                        flow.
                      </Typography>
                    </Box>
                    <span className="add-question-card__badge">Required</span>
                  </Box>

                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">
                        Question title
                      </label>
                      <TextField
                        fullWidth
                        placeholder="e.g. Listening Part 2 map-labeling question"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        IELTS module
                      </label>
                      <TextField
                        select
                        fullWidth
                        value={selectedModule}
                        onChange={(event) =>
                          handleModuleChange(event.target.value as IeltsModule)
                        }
                      >
                        {IELTS_MODULE_OPTIONS.map((moduleOption) => (
                          <MenuItem key={moduleOption} value={moduleOption}>
                            {moduleOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        Part / task
                      </label>
                      <TextField
                        select
                        fullWidth
                        value={part}
                        onChange={(event) => setPart(event.target.value)}
                      >
                        {PART_OPTIONS[selectedModule].map((partOption) => (
                          <MenuItem key={partOption} value={partOption}>
                            {partOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        Band target
                      </label>
                      <TextField
                        select
                        fullWidth
                        value={bandTarget}
                        onChange={(event) => setBandTarget(event.target.value)}
                      >
                        {BAND_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        Difficulty
                      </label>
                      <TextField
                        select
                        fullWidth
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                      >
                        {DIFFICULTY_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">Status</label>
                      <TextField
                        select
                        fullWidth
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        Suggested time (seconds)
                      </label>
                      <TextField
                        fullWidth
                        value={timeLimit}
                        onChange={(event) => setTimeLimit(event.target.value)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box className="add-question-card">
                  <Box className="add-question-card__head">
                    <Box>
                      <Typography
                        component="h3"
                        className="add-question-card__title"
                      >
                        Media Attachments
                      </Typography>
                      <Typography
                        component="p"
                        className="add-question-card__copy"
                      >
                        Upload assets required for IELTS task delivery (audio
                        and visuals).
                      </Typography>
                    </Box>
                    <span className="add-question-card__badge">
                      Module specific
                    </span>
                  </Box>

                  <Box className="add-question-form__grid">
                    {(selectedModule === "Reading" ||
                      selectedModule === "Writing") && (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">
                          Supporting image (required for {selectedModule})
                        </label>
                        <TextField
                          fullWidth
                          type="file"
                          slotProps={{
                            htmlInput: {
                              accept: "image/*",
                            },
                          }}
                          onChange={handleSupportingImageChange}
                        />
                        {supportingImageFile && (
                          <Typography
                            component="p"
                            className="add-question-form__hint"
                          >
                            Selected image: {supportingImageFile.name} (
                            {Math.ceil(supportingImageFile.size / 1024)} KB)
                          </Typography>
                        )}
                        {selectedModule === "Reading" &&
                          supportingImagePreviewUrl && (
                            <Box className="add-question-form__image-preview">
                              <img
                                src={supportingImagePreviewUrl}
                                alt="Reading passage visual"
                              />
                            </Box>
                          )}
                      </Box>
                    )}

                    {selectedModule === "Listening" && (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">
                          Listening audio (required)
                        </label>
                        <TextField
                          fullWidth
                          type="file"
                          slotProps={{
                            htmlInput: {
                              accept: "audio/*",
                            },
                          }}
                          onChange={handleListeningAudioChange}
                        />
                        {listeningAudioFile && (
                          <Typography
                            component="p"
                            className="add-question-form__hint"
                          >
                            Selected audio: {listeningAudioFile.name} (
                            {Math.ceil(listeningAudioFile.size / 1024)} KB)
                          </Typography>
                        )}
                      </Box>
                    )}

                    {selectedModule === "Speaking" && (
                      <Box className="add-question-form__field add-question-form__field--span-2">
                        <label className="add-question-form__label">
                          Speaking prompt audio (required)
                        </label>
                        <TextField
                          fullWidth
                          type="file"
                          slotProps={{
                            htmlInput: {
                              accept: "audio/*",
                            },
                          }}
                          onChange={handleSpeakingAudioChange}
                        />
                        {speakingAudioFile && (
                          <Typography
                            component="p"
                            className="add-question-form__hint"
                          >
                            Selected audio: {speakingAudioFile.name} (
                            {Math.ceil(speakingAudioFile.size / 1024)} KB)
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box className="add-question-card">
                  <Box className="add-question-card__head">
                    <Box>
                      <Typography
                        component="h3"
                        className="add-question-card__title"
                      >
                        Prompt Design
                      </Typography>
                      <Typography
                        component="p"
                        className="add-question-card__copy"
                      >
                        Write the candidate-facing instruction, question stem,
                        and the exact IELTS source material the item depends on.
                      </Typography>
                    </Box>
                    <span className="add-question-card__badge">
                      {selectedTemplate.module} Authoring
                    </span>
                  </Box>

                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea add-question-form__textarea--short">
                      <label className="add-question-form__label">
                        {selectedTemplate.instructionLabel}
                      </label>
                      <RichTextEditor
                        value={instruction}
                        placeholder="Write concise candidate instructions that match IELTS wording."
                        onChange={setInstruction}
                      />
                    </Box>

                    <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                      <label className="add-question-form__label">
                        Question stem
                      </label>
                      <RichTextEditor
                        value={questionStem}
                        placeholder="Enter the exact question prompt shown to the candidate."
                        onChange={handleQuestionStemChange}
                      />
                    </Box>

                    <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea">
                      <label className="add-question-form__label">
                        {selectedTemplate.sourceLabel}
                      </label>
                      <RichTextEditor
                        value={sourceMaterial}
                        placeholder={selectedTemplate.sourcePlaceholder}
                        onChange={setSourceMaterial}
                      />
                    </Box>

                    <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea add-question-form__textarea--short">
                      <label className="add-question-form__label">
                        Teacher / reviewer note
                      </label>
                      <RichTextEditor
                        value={teacherNote}
                        placeholder="Add distractor rationale, paragraph references, or examiner guidance."
                        onChange={setTeacherNote}
                      />
                    </Box>
                  </Box>
                </Box>

                {(answerMode === "single" || answerMode === "multiple") && (
                  <Box className="add-question-card">
                    <Box className="add-question-card__head">
                      <Box>
                        <Typography
                          component="h3"
                          className="add-question-card__title"
                        >
                          Answer Options
                        </Typography>
                        <Typography
                          component="p"
                          className="add-question-card__copy"
                        >
                          Set answer choices and mark the correct option
                          {answerMode === "multiple" ? "s" : ""}.
                        </Typography>
                      </Box>
                      <span className="add-question-card__badge">
                        {answerMode === "single"
                          ? "Single answer"
                          : "Multiple answers"}
                      </span>
                    </Box>

                    <Box className="add-question-options">
                      {answerOptions.map((option) => (
                        <Box key={option.id} className="add-question-option">
                          <Box className="add-question-option__head">
                            <span className="add-question-option__label">
                              Option {option.label}
                            </span>
                            <Box className="add-question-form__toggle-row">
                              <FormControlLabel
                                className="add-question-option__correct"
                                control={
                                  <Checkbox
                                    checked={option.isCorrect}
                                    onChange={(event) =>
                                      updateOption(
                                        option.id,
                                        "isCorrect",
                                        event.target.checked,
                                      )
                                    }
                                  />
                                }
                                label="Correct"
                              />
                              <Button
                                className="add-question-option__remove"
                                variant="outlined"
                                onClick={() => removeOption(option.id)}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Box>

                          <TextField
                            fullWidth
                            placeholder={`Write answer option ${option.label}`}
                            value={option.text}
                            onChange={(event) =>
                              updateOption(
                                option.id,
                                "text",
                                event.target.value,
                              )
                            }
                          />
                        </Box>
                      ))}
                    </Box>

                    <Box className="add-question-form__action-row">
                      <Button
                        className="add-question-form__subaction"
                        variant="outlined"
                        onClick={addOption}
                      >
                        + Add answer option
                      </Button>
                      <Typography
                        component="p"
                        className="add-question-form__hint"
                      >
                        IELTS distractors should be plausible, concise, and
                        derived from the same source material.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {answerMode === "text" && (
                  <Box className="add-question-card">
                    <Box className="add-question-card__head">
                      <Box>
                        <Typography
                          component="h3"
                          className="add-question-card__title"
                        >
                          Accepted Answers
                        </Typography>
                        <Typography
                          component="p"
                          className="add-question-card__copy"
                        >
                          Define valid answer forms for gap-fill, notes, tables,
                          or form completion.
                        </Typography>
                      </Box>
                      <span className="add-question-card__badge">
                        Text answer
                      </span>
                    </Box>

                    <Box className="add-question-form__field add-question-form__textarea add-question-form__textarea--short">
                      <label className="add-question-form__label">
                        Accepted answers / spelling variants
                      </label>
                      <TextField
                        multiline
                        fullWidth
                        placeholder="e.g. library card | card number | card no."
                        value={acceptedAnswers}
                        onChange={(event) =>
                          setAcceptedAnswers(event.target.value)
                        }
                      />
                      <Typography
                        component="p"
                        className="add-question-form__hint"
                      >
                        Separate equivalent answers with `|` so reviewers can
                        check variants quickly.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {(answerMode === "essay" || answerMode === "speaking") && (
                  <Box className="add-question-card">
                    <Box className="add-question-card__head">
                      <Box>
                        <Typography
                          component="h3"
                          className="add-question-card__title"
                        >
                          Assessment Guidance
                        </Typography>
                        <Typography
                          component="p"
                          className="add-question-card__copy"
                        >
                          Add examiner-focused notes for band descriptors,
                          coverage, and expected response quality.
                        </Typography>
                      </Box>
                      <span className="add-question-card__badge">
                        {answerMode === "essay"
                          ? "Extended writing"
                          : "Spoken response"}
                      </span>
                    </Box>

                    <Box className="add-question-form__grid add-question-form__grid--compact">
                      <Box className="add-question-form__field add-question-form__textarea">
                        <label className="add-question-form__label">
                          Sample high-band response
                        </label>
                        <TextField
                          multiline
                          fullWidth
                          placeholder="Write a model answer outline or key response characteristics."
                          value={sampleResponse}
                          onChange={(event) =>
                            setSampleResponse(event.target.value)
                          }
                        />
                      </Box>

                      <Box className="add-question-form__field add-question-form__textarea">
                        <label className="add-question-form__label">
                          Examiner follow-up / band notes
                        </label>
                        <TextField
                          multiline
                          fullWidth
                          placeholder="Add scoring notes, likely errors, and follow-up prompts."
                          value={followUp}
                          onChange={(event) => setFollowUp(event.target.value)}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box className="add-question-card">
                  <Box className="add-question-card__head">
                    <Box>
                      <Typography
                        component="h3"
                        className="add-question-card__title"
                      >
                        Scoring And Review
                      </Typography>
                      <Typography
                        component="p"
                        className="add-question-card__copy"
                      >
                        Keep raw-score and band-review settings next to the
                        explanation.
                      </Typography>
                    </Box>
                    <span className="add-question-card__badge">
                      Review workflow
                    </span>
                  </Box>

                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">
                        Score mode
                      </label>
                      <Box className="add-question-form__toggle-row">
                        <Button
                          className={`add-question-form__toggle${
                            scoreMode === "raw"
                              ? " add-question-form__toggle--active"
                              : ""
                          }`}
                          variant="text"
                          onClick={() => setScoreMode("raw")}
                        >
                          Raw score
                        </Button>
                        <Button
                          className={`add-question-form__toggle${
                            scoreMode === "band"
                              ? " add-question-form__toggle--active"
                              : ""
                          }`}
                          variant="text"
                          onClick={() => setScoreMode("band")}
                        >
                          Band review
                        </Button>
                      </Box>
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">Points</label>
                      <TextField
                        fullWidth
                        value={points}
                        onChange={(event) => setPoints(event.target.value)}
                      />
                    </Box>

                    <Box className="add-question-form__field">
                      <label className="add-question-form__label">
                        Question alias
                      </label>
                      <TextField
                        fullWidth
                        value={alias}
                        onChange={(event) => setAlias(event.target.value)}
                      />
                    </Box>

                    <Box className="add-question-form__field add-question-form__field--span-4 add-question-form__textarea add-question-form__textarea--short">
                      <label className="add-question-form__label">
                        Feedback / answer rationale
                      </label>
                      <RichTextEditor
                        value={explanation}
                        placeholder="Explain why the answer is correct and what makes the distractors or common errors misleading."
                        onChange={setExplanation}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box className="add-question-card">
                  <Box className="add-question-card__head">
                    <Box>
                      <Typography
                        component="h3"
                        className="add-question-card__title"
                      >
                        Metadata
                      </Typography>
                      <Typography
                        component="p"
                        className="add-question-card__copy"
                      >
                        Keep IELTS collections, tags, and publishing data
                        organized for later filtering.
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">
                        Question category
                      </label>
                      <TextField
                        fullWidth
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                      />
                    </Box>

                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">
                        Question tags
                      </label>
                      <TextField
                        fullWidth
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                      />
                      <Typography
                        component="p"
                        className="add-question-form__hint"
                      >
                        Example: `reading, tfng, passage-2, band-7`
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="add-question-form__footer">
                  <Typography
                    component="p"
                    className="add-question-form__footer-copy"
                  >
                    Save as draft to continue refining IELTS wording,
                    distractors, transcript references, and scoring notes before
                    publishing.
                  </Typography>

                  <Box className="add-question-form__footer-actions">
                    <Button
                      className="add-question-form__secondary"
                      variant="outlined"
                    >
                      Save Draft
                    </Button>
                    <Button
                      className="add-question-form__primary"
                      variant="contained"
                      onClick={handlePublishQuestion}
                    >
                      Publish Question
                    </Button>
                  </Box>
                </Box>
                {publishErrors.length > 0 && (
                  <Box className="add-question-form__publish-errors">
                    <Typography
                      component="p"
                      className="add-question-form__publish-errors-title"
                    >
                      Resolve these before publishing:
                    </Typography>
                    <Box
                      component="ul"
                      className="add-question-form__publish-errors-list"
                    >
                      {publishErrors.map((errorMessage) => (
                        <li key={errorMessage}>{errorMessage}</li>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </AddQuestionPageRoot>
    </Layout>
  );
}
