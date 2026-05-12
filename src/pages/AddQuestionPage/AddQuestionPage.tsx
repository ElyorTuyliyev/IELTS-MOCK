import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Box, Button, CircularProgress, MenuItem, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { Layout } from "../../components/layout";
import { RichTextEditor } from "../../components/common/RichTextEditor/RichTextEditor";
import { graphqlUrl } from "../../graphql/client";
import { selectAuthToken } from "../../store";
import { useAppSelector } from "../../store/hooks";
import { ROUTES_PATH } from "../../routes/paths";
import { AddQuestionPageRoot } from "./AddQuestionPage.style";
import { CREATE_QUESTION_MUTATION } from "./api/createQuestionMutation";
import { FIND_ALL_EXAMS_FOR_QUESTION_QUERY } from "./api/findAllExamsForQuestionQuery";
import { FIND_ALL_PARTS_FOR_QUESTION_QUERY } from "./api/findAllPartsForQuestionQuery";
import { FIND_ONE_QUESTION_QUERY } from "./api/findOneQuestionQuery";
import { UPDATE_QUESTION_MUTATION } from "../QuestionsPage/api/updateQuestionMutation";
import { FIND_ALL_QUESTIONS_QUERY } from "../QuestionsPage/api/findAllQuestionsQuery";
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

type UpdateQuestionMutationData = {
  updateQuestion: {
    _id: string;
  };
};

const EMPTY_HTML = "<p></p>";
const LISTENING_PART_LABELS = ["Part 1", "Part 2", "Part 3", "Part 4"] as const;
const READING_PART_LABELS = ["Part 1", "Part 2", "Part 3"] as const;
const WRITING_PART_LABELS = ["Part 1", "Part 2"] as const;
const uploadEndpoint = `${graphqlUrl.replace(/\/graphql$/, "")}/files/upload`;
type ReadingPartContent = { passage: string; questions: string };

function isHtmlEmpty(value: string) {
  const normalized = value
    .replace(/<p><\/p>/g, "")
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return normalized.length === 0;
}

function buildPartContentBlock(partLabel: string, html: string) {
  return `<h3>${partLabel}</h3>${html}`;
}

function buildPartLabel(part: PartItem) {
  const title = part.title?.trim();
  if (title) {
    return `Part ${part.partNumber}: ${title}`;
  }
  return `Part ${part.partNumber}`;
}

type OptionsPayloadItem = { title: string; key: string; isCorrectAnswer: boolean };
type AnswerKeyItem = { qid: string; correct: string | string[] };
type AnswerKeyPayload = {
  radio: AnswerKeyItem[];
  blank: AnswerKeyItem[];
  dragDrop: AnswerKeyItem[];
};

function extractOptionsFromHtml(html: string): OptionsPayloadItem[] {
  if (!html?.trim()) return [];
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const groups = Array.from(doc.querySelectorAll('div[data-type="radio-group"]'));
    const options: OptionsPayloadItem[] = [];

    groups.forEach((group, groupIndex) => {
      const optionsJson = group.getAttribute("data-options") ?? "[]";
      const checkedValue = group.getAttribute("data-checked-value") ?? "";

      let parsedOptions: Array<{ label: string; value: string }> = [];
      try {
        const parsed = JSON.parse(optionsJson) as unknown;
        if (Array.isArray(parsed)) {
          parsedOptions = parsed
            .map((item, index) => {
              if (item && typeof item === "object") {
                const typed = item as { label?: unknown; value?: unknown };
                return {
                  label: String(typed.label ?? "").trim(),
                  value: String(typed.value ?? index),
                };
              }
              return null;
            })
            .filter((item): item is { label: string; value: string } => Boolean(item && item.label));
        }
      } catch {
        parsedOptions = [];
      }

      parsedOptions.forEach((option, optionIndex) => {
        const safeKey = option.value || `${optionIndex + 1}`;
        options.push({
          title: option.label,
          key: `radio-${groupIndex + 1}-${safeKey}`,
          isCorrectAnswer: option.value === checkedValue,
        });
      });
    });

    const blankNodes = Array.from(doc.querySelectorAll('span[data-type="blank-answer"]'));
    blankNodes.forEach((node, index) => {
      const id = (node.getAttribute("data-id") ?? `Q${index + 1}`).trim() || `Q${index + 1}`;
      const answer = (node.getAttribute("data-answer") ?? "").trim();
      if (!answer) return;
      options.push({
        title: answer,
        key: `blank-${id}`,
        isCorrectAnswer: true,
      });
    });

    const dragDropNodes = Array.from(doc.querySelectorAll('div[data-type="drag-drop-fill"]'));
    dragDropNodes.forEach((node, nodeIndex) => {
      const gapsJson = node.getAttribute("data-gaps") ?? "[]";
      try {
        const parsed = JSON.parse(gapsJson) as unknown;
        if (!Array.isArray(parsed)) return;
        parsed.forEach((gap, gapIndex) => {
          if (!gap || typeof gap !== "object") return;
          const item = gap as { id?: unknown; answer?: unknown };
          const id = String(item.id ?? `Q${gapIndex + 1}`).trim() || `Q${gapIndex + 1}`;
          const answer = String(item.answer ?? "").trim();
          if (!answer) return;
          options.push({
            title: answer,
            key: `drag-${nodeIndex + 1}-${id}`,
            isCorrectAnswer: true,
          });
        });
      } catch {
        // Ignore malformed drag-drop data.
      }
    });

    return options;
  } catch {
    return [];
  }
}

function extractAnswerKeyFromHtml(html: string): string | null {
  if (!html?.trim()) return null;
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const answerKey: AnswerKeyPayload = {
      radio: [],
      blank: [],
      dragDrop: [],
    };

    const radioGroups = Array.from(doc.querySelectorAll('div[data-type="radio-group"]'));
    radioGroups.forEach((group, groupIndex) => {
      const optionsJson = group.getAttribute("data-options") ?? "[]";
      const checkedValue = (group.getAttribute("data-checked-value") ?? "").trim();
      if (!checkedValue) return;
      try {
        const parsed = JSON.parse(optionsJson) as unknown;
        if (!Array.isArray(parsed)) return;
        const options = parsed
          .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const typed = item as { label?: unknown; value?: unknown };
            return {
              label: String(typed.label ?? "").trim(),
              value: String(typed.value ?? index).trim(),
            };
          })
          .filter((item): item is { label: string; value: string } => Boolean(item && item.label));
        const selected = options.find((option) => option.value === checkedValue);
        if (!selected) return;
        answerKey.radio.push({
          qid: `radio-${groupIndex + 1}`,
          correct: selected.label,
        });
      } catch {
        // Ignore malformed radio data.
      }
    });

    const blankNodes = Array.from(doc.querySelectorAll('span[data-type="blank-answer"]'));
    blankNodes.forEach((node, index) => {
      const qid = (node.getAttribute("data-id") ?? `Q${index + 1}`).trim() || `Q${index + 1}`;
      const answer = (node.getAttribute("data-answer") ?? "").trim();
      if (!answer) return;
      answerKey.blank.push({ qid, correct: answer });
    });

    const dragDropNodes = Array.from(doc.querySelectorAll('div[data-type="drag-drop-fill"]'));
    dragDropNodes.forEach((node, nodeIndex) => {
      const gapsJson = node.getAttribute("data-gaps") ?? "[]";
      try {
        const parsed = JSON.parse(gapsJson) as unknown;
        if (!Array.isArray(parsed)) return;
        const correct = parsed
          .map((gap) => {
            if (!gap || typeof gap !== "object") return "";
            return String((gap as { answer?: unknown }).answer ?? "").trim();
          })
          .filter((value) => value.length > 0);
        if (correct.length === 0) return;
        answerKey.dragDrop.push({
          qid: `drag-${nodeIndex + 1}`,
          correct,
        });
      } catch {
        // Ignore malformed drag-drop data.
      }
    });

    if (
      answerKey.radio.length === 0 &&
      answerKey.blank.length === 0 &&
      answerKey.dragDrop.length === 0
    ) {
      return null;
    }
    return JSON.stringify(answerKey);
  } catch {
    return null;
  }
}

function resolveMediaUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  const base = graphqlUrl.replace(/\/graphql$/, "");
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

function stripLeadingPartHeading(html: string): string {
  const trimmed = html.trim();
  const match = trimmed.match(/^<h3[^>]*>[\s\S]*?<\/h3>\s*/i);
  if (!match) return html;
  return trimmed.slice(match[0].length);
}

function parseBaseTitleFromStoredTitle(storedTitle: string | null | undefined): string {
  const full = (storedTitle ?? "").trim();
  if (!full) return "";
  const sep = " — ";
  const idx = full.lastIndexOf(sep);
  if (idx === -1) return full;
  return full.slice(0, idx).trim() || full;
}

function resolveTemplateIdFromType(module: IeltsModule, type: string): string {
  const forModule = QUESTION_TEMPLATES.filter((template) => template.module === module);
  if (type === "multiselect") {
    const multiple = forModule.find((template) => template.answerMode === "multiple");
    if (multiple) return multiple.id;
  }
  return forModule[0]?.id ?? QUESTION_TEMPLATES[0]?.id ?? "";
}

type LoadedQuestion = {
  _id: string;
  title?: string | null;
  instruction?: string | null;
  sourceMaterial?: string | null;
  passageHtml?: string | null;
  questionsHtml?: string | null;
  explanation?: string | null;
  question: string;
  type: string;
  examId: string;
  partId?: string | null;
  ieltsModule?: string | null;
  listeningPart?: string | null;
  placementNumber?: number | null;
  answerKey?: string | null;
  listeningAudio?: string | null;
  speakingAudio?: string | null;
  supportingImage?: string | null;
};

type FindOneQuestionQueryData = {
  findOneQuestion: LoadedQuestion | null;
};

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
  const navigate = useNavigate();
  const params = useParams<{ questionId?: string }>();
  const questionId = params.questionId?.trim() || undefined;
  const isEditMode = Boolean(questionId);

  const authToken = useAppSelector(selectAuthToken);
  const { data: examsData } = useQuery<FindAllExamsResponse>(
    FIND_ALL_EXAMS_FOR_QUESTION_QUERY,
  );
  const { data: partsData } = useQuery<FindAllPartsResponse>(
    FIND_ALL_PARTS_FOR_QUESTION_QUERY,
  );
  const {
    data: oneQuestionData,
    loading: oneQuestionLoading,
    error: oneQuestionError,
  } = useQuery<FindOneQuestionQueryData>(FIND_ONE_QUESTION_QUERY, {
    variables: { _id: questionId ?? "" },
    skip: !questionId,
  });
  const [createQuestion, { loading: isSaving }] = useMutation<CreateQuestionMutationResponse>(
    CREATE_QUESTION_MUTATION,
  );
  const [updateQuestion, { loading: isUpdating }] = useMutation<UpdateQuestionMutationData>(
    UPDATE_QUESTION_MUTATION,
  );

  const [selectedModule, setSelectedModule] = useState<IeltsModule>("Listening");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    QUESTION_TEMPLATES[0]?.id ?? "",
  );
  const [selectedExamId, setSelectedExamId] = useState("");
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("45");
  const [instruction, setInstruction] = useState(EMPTY_HTML);
  const [listeningPartContents, setListeningPartContents] = useState<string[]>(
    Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML),
  );
  const [readingPartContents, setReadingPartContents] = useState<ReadingPartContent[]>(
    Array.from({ length: READING_PART_LABELS.length }, () => ({ passage: EMPTY_HTML, questions: EMPTY_HTML })),
  );
  const [writingPartContents, setWritingPartContents] = useState<string[]>(
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
  const [existingListeningAudio, setExistingListeningAudio] = useState<string | null>(null);
  const [existingSpeakingAudio, setExistingSpeakingAudio] = useState<string | null>(null);
  const [existingSupportingImage, setExistingSupportingImage] = useState<string | null>(null);
  const [editPartSlotIndex, setEditPartSlotIndex] = useState<number | null>(null);

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
          content: listeningPartContents[index] ?? EMPTY_HTML,
        };
      }),
    [listeningPartContents, selectedModuleParts],
  );
  const readingPartEntries = useMemo(
    () =>
      READING_PART_LABELS.map((fallbackLabel, index) => {
        const part = selectedModuleParts[index];
        return {
          key: part?._id ?? `reading-fallback-part-${index + 1}`,
          label: part ? buildPartLabel(part) : fallbackLabel,
          partId: part?._id ?? null,
          content:
            readingPartContents[index] ?? {
              passage: EMPTY_HTML,
              questions: EMPTY_HTML,
            },
        };
      }),
    [readingPartContents, selectedModuleParts],
  );
  const writingPartEntries = useMemo(
    () =>
      WRITING_PART_LABELS.map((fallbackLabel, index) => {
        const part = selectedModuleParts[index];
        return {
          key: part?._id ?? `writing-fallback-part-${index + 1}`,
          label: part ? buildPartLabel(part) : fallbackLabel,
          partId: part?._id ?? null,
          content: writingPartContents[index] ?? EMPTY_HTML,
        };
      }),
    [selectedModuleParts, writingPartContents],
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (selectedModule !== "Listening") {
      return;
    }
    const expectedCount = LISTENING_PART_LABELS.length;
    setListeningPartContents((current) => {
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
    setWritingPartContents((current) => {
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
    setReadingPartContents((current) => {
      if (current.length === expectedCount) {
        return current;
      }
      if (current.length > expectedCount) {
        return current.slice(0, expectedCount);
      }
      return [
        ...current,
        ...Array.from({ length: expectedCount - current.length }, () => ({
          passage: EMPTY_HTML,
          questions: EMPTY_HTML,
        })),
      ];
    });
  }, [selectedModule, selectedModuleParts]);

  useEffect(() => {
    if (!selectedExamId && exams.length > 0 && !questionId) {
      setSelectedExamId(exams[0]._id);
    }
  }, [exams, selectedExamId, questionId]);

  const editHydrationKeyRef = useRef<string>("");
  useEffect(() => {
    editHydrationKeyRef.current = "";
  }, [questionId]);

  useEffect(() => {
    if (!questionId || !oneQuestionData?.findOneQuestion) {
      return;
    }
    const q = oneQuestionData.findOneQuestion;
    if (String(q._id) !== String(questionId)) {
      return;
    }

    const examItem = exams.find((exam) => String(exam._id) === String(q.examId));
    const moduleIdFilter = examItem?.moduleId ?? null;
    const partsForExam =
      moduleIdFilter != null
        ? (partsData?.findAllParts ?? [])
            .filter((part) => String(part.moduleId) === String(moduleIdFilter))
            .sort((left, right) => left.partNumber - right.partNumber)
        : [];

    const hydrationKey = `${questionId}|${exams.length}|${(partsData?.findAllParts ?? []).length}`;
    if (editHydrationKeyRef.current === hydrationKey) {
      return;
    }
    editHydrationKeyRef.current = hydrationKey;

    const moduleRaw = (q.ieltsModule ?? "Listening").trim() as IeltsModule;
    const module: IeltsModule = IELTS_MODULE_OPTIONS.includes(moduleRaw) ? moduleRaw : "Listening";

    setSelectedExamId(String(q.examId));
    setSelectedModule(module);
    setSelectedTemplateId(resolveTemplateIdFromType(module, q.type));
    setTitle(parseBaseTitleFromStoredTitle(q.title));
    setTimeLimit(
      q.placementNumber != null && q.placementNumber > 0 ? String(q.placementNumber) : "45",
    );
    setExistingListeningAudio(q.listeningAudio?.trim() ? q.listeningAudio.trim() : null);
    setExistingSpeakingAudio(q.speakingAudio?.trim() ? q.speakingAudio.trim() : null);
    setExistingSupportingImage(q.supportingImage?.trim() ? q.supportingImage.trim() : null);
    setListeningAudioFile(null);
    setSpeakingAudioFile(null);
    setSupportingImageFile(null);
    setInstruction(q.instruction?.trim() ? (q.instruction ?? EMPTY_HTML) : EMPTY_HTML);
    setSourceMaterial(q.sourceMaterial?.trim() ? (q.sourceMaterial ?? EMPTY_HTML) : EMPTY_HTML);
    setExplanation(q.explanation?.trim() ? (q.explanation ?? EMPTY_HTML) : EMPTY_HTML);

    if (module === "Listening") {
      const n = Number.parseInt(String(q.listeningPart ?? "1"), 10);
      const slot =
        Number.isFinite(n) && n > 0 ? Math.min(LISTENING_PART_LABELS.length, n) - 1 : 0;
      setEditPartSlotIndex(slot);
      const passage = stripLeadingPartHeading(String(q.passageHtml ?? q.sourceMaterial ?? ""));
      setListeningPartContents((prev) =>
        prev.map((content, idx) => (idx === slot ? (passage || EMPTY_HTML) : content)),
      );
      setReadingPartContents(
        Array.from({ length: READING_PART_LABELS.length }, () => ({
          passage: EMPTY_HTML,
          questions: EMPTY_HTML,
        })),
      );
      setWritingPartContents(Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML));
    } else if (module === "Reading") {
      const byPartId = q.partId
        ? partsForExam.findIndex((part) => String(part._id) === String(q.partId))
        : -1;
      const slot = byPartId >= 0 ? byPartId : 0;
      setEditPartSlotIndex(slot);
      const passageInner = stripLeadingPartHeading(String(q.passageHtml ?? ""));
      const questionsInner = String(q.questionsHtml ?? EMPTY_HTML);
      setReadingPartContents((prev) =>
        prev.map((row, idx) =>
          idx === slot
            ? { passage: passageInner || EMPTY_HTML, questions: questionsInner || EMPTY_HTML }
            : row,
        ),
      );
      setListeningPartContents(Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML));
      setWritingPartContents(Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML));
    } else if (module === "Writing") {
      const byPartId = q.partId
        ? partsForExam.findIndex((part) => String(part._id) === String(q.partId))
        : -1;
      const slot = byPartId >= 0 ? byPartId : 0;
      setEditPartSlotIndex(slot);
      const passage = stripLeadingPartHeading(String(q.passageHtml ?? q.sourceMaterial ?? ""));
      setWritingPartContents((prev) =>
        prev.map((row, idx) => (idx === slot ? (passage || EMPTY_HTML) : row)),
      );
      setListeningPartContents(Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML));
      setReadingPartContents(
        Array.from({ length: READING_PART_LABELS.length }, () => ({
          passage: EMPTY_HTML,
          questions: EMPTY_HTML,
        })),
      );
    } else {
      setEditPartSlotIndex(null);
      setListeningPartContents(Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML));
      setReadingPartContents(
        Array.from({ length: READING_PART_LABELS.length }, () => ({
          passage: EMPTY_HTML,
          questions: EMPTY_HTML,
        })),
      );
      setWritingPartContents(Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML));
    }
  }, [questionId, oneQuestionData, exams, partsData?.findAllParts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const listeningBlobUrl = useMemo(
    () => (listeningAudioFile ? URL.createObjectURL(listeningAudioFile) : null),
    [listeningAudioFile],
  );

  useEffect(() => {
    if (!listeningBlobUrl) return;
    return () => {
      URL.revokeObjectURL(listeningBlobUrl);
    };
  }, [listeningBlobUrl]);

  const listeningAudioPreviewSrc =
    listeningBlobUrl ??
    (isEditMode && existingListeningAudio ? resolveMediaUrl(existingListeningAudio) : null);

  const speakingBlobUrl = useMemo(
    () => (speakingAudioFile ? URL.createObjectURL(speakingAudioFile) : null),
    [speakingAudioFile],
  );

  useEffect(() => {
    if (!speakingBlobUrl) return;
    return () => {
      URL.revokeObjectURL(speakingBlobUrl);
    };
  }, [speakingBlobUrl]);

  const speakingAudioPreviewSrc =
    speakingBlobUrl ??
    (isEditMode && existingSpeakingAudio ? resolveMediaUrl(existingSpeakingAudio) : null);

  const supportingBlobUrl = useMemo(
    () => (supportingImageFile ? URL.createObjectURL(supportingImageFile) : null),
    [supportingImageFile],
  );

  useEffect(() => {
    if (!supportingBlobUrl) return;
    return () => {
      URL.revokeObjectURL(supportingBlobUrl);
    };
  }, [supportingBlobUrl]);

  const supportingImagePreviewSrc =
    supportingBlobUrl ??
    (isEditMode && existingSupportingImage ? resolveMediaUrl(existingSupportingImage) : null);

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

  const handleCreateQuestion = async () => {
    const nextErrors: string[] = [];
    setSuccess(null);

    if (!selectedExamId) nextErrors.push("IELTS exam tanlang.");
    if (
      selectedModule !== "Listening" &&
      selectedModule !== "Reading" &&
      selectedModule !== "Writing" &&
      isHtmlEmpty(instruction)
    ) {
      nextErrors.push("Instruction required.");
    }
    if (selectedModule === "Listening") {
      if (isEditMode && questionId && editPartSlotIndex !== null) {
        const entry = listeningPartEntries[editPartSlotIndex];
        if (!entry || isHtmlEmpty(entry.content)) {
          nextErrors.push(
            `Listening part content required: ${entry?.label ?? "this part"}.`,
          );
        }
      } else if (!isEditMode) {
        const missingParts = listeningPartEntries.filter((entry) => isHtmlEmpty(entry.content));
        if (missingParts.length > 0) {
          nextErrors.push(
            `Listening part content required: ${missingParts.map((entry) => entry.label).join(", ")}.`,
          );
        }
      }
    } else if (selectedModule === "Reading") {
      if (isEditMode && questionId && editPartSlotIndex !== null) {
        const entry = readingPartEntries[editPartSlotIndex];
        if (
          !entry ||
          isHtmlEmpty(entry.content.passage) ||
          isHtmlEmpty(entry.content.questions)
        ) {
          nextErrors.push(
            `Reading part text/questions required: ${entry?.label ?? "this part"}.`,
          );
        }
      } else if (!isEditMode) {
        const missingReadingParts = readingPartEntries.filter(
          (entry) => isHtmlEmpty(entry.content.passage) || isHtmlEmpty(entry.content.questions),
        );
        if (missingReadingParts.length > 0) {
          nextErrors.push(
            `Reading part text/questions required: ${missingReadingParts.map((entry) => entry.label).join(", ")}.`,
          );
        }
      }
    } else if (selectedModule === "Writing") {
      if (isEditMode && questionId && editPartSlotIndex !== null) {
        const entry = writingPartEntries[editPartSlotIndex];
        if (!entry || isHtmlEmpty(entry.content)) {
          nextErrors.push(
            `Writing uchun quyidagi part(lar)da content yo‘q: ${entry?.label ?? "this part"}.`,
          );
        }
      } else if (!isEditMode) {
        const missingWritingParts = writingPartEntries.filter((entry) => isHtmlEmpty(entry.content));
        if (missingWritingParts.length > 0) {
          nextErrors.push(
            `Writing uchun quyidagi part(lar)da content yo‘q: ${missingWritingParts
              .map((entry) => entry.label)
              .join(", ")}.`,
          );
        }
      }
    }
    if (
      selectedModule !== "Listening" &&
      selectedModule !== "Reading" &&
      selectedModule !== "Writing" &&
      isHtmlEmpty(sourceMaterial)
    ) {
      nextErrors.push("Source material required.");
    }
    if (selectedModule === "Speaking" && !speakingAudioFile && !existingSpeakingAudio?.trim()) {
      nextErrors.push("Speaking audio required.");
    }
    if (
      selectedModule === "Reading" &&
      !supportingImageFile &&
      !existingSupportingImage?.trim()
    ) {
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

      const normalizedPlacement =
        Number.isFinite(Number(timeLimit)) && Number(timeLimit) > 0
          ? Number(timeLimit)
          : null;

      if (isEditMode && questionId) {
        const listeningUrl = uploadedListeningAudio ?? existingListeningAudio ?? null;
        const speakingUrl = uploadedSpeakingAudio ?? existingSpeakingAudio ?? null;
        const imageUrl = uploadedSupportingImage ?? existingSupportingImage ?? null;

        const refetch = [{ query: FIND_ALL_QUESTIONS_QUERY }];

        if (selectedModule === "Listening") {
          const slot = editPartSlotIndex ?? 0;
          const entry = listeningPartEntries[slot];
          if (!entry) {
            throw new Error("Listening part topilmadi.");
          }
          const { label, content: partContent, partId } = entry;
          const mutationResult = await updateQuestion({
            variables: {
              input: {
                _id: questionId,
                examId: selectedExamId,
                title: `${title.trim()} — ${label}`,
                instruction: null,
                sourceMaterial: buildPartContentBlock(label, partContent),
                passageHtml: buildPartContentBlock(label, partContent),
                questionsHtml: null,
                explanation: null,
                listeningAudio: listeningUrl,
                speakingAudio: null,
                supportingImage: null,
                question: `${title.trim()} (${label})`,
                type: "input",
                ieltsModule: selectedModule,
                listeningPart: String(slot + 1),
                partId: partId ?? undefined,
                placementNumber: normalizedPlacement ?? undefined,
                options: extractOptionsFromHtml(partContent),
                answerKey: extractAnswerKeyFromHtml(partContent),
              },
            },
            refetchQueries: refetch,
            awaitRefetchQueries: true,
          });
          if (mutationResult.error) {
            throw new Error(mutationResult.error.message);
          }
          if (!mutationResult.data?.updateQuestion?._id) {
            throw new Error("Savol yangilanmadi.");
          }
        } else if (selectedModule === "Reading") {
          const slot = editPartSlotIndex ?? 0;
          const entry = readingPartEntries[slot];
          if (!entry) {
            throw new Error("Reading part topilmadi.");
          }
          const { label, content, partId } = entry;
          const mutationResult = await updateQuestion({
            variables: {
              input: {
                _id: questionId,
                examId: selectedExamId,
                title: `${title.trim()} — ${label}`,
                instruction: null,
                sourceMaterial: `${buildPartContentBlock(label, content.passage)}${content.questions}`,
                passageHtml: buildPartContentBlock(label, content.passage),
                questionsHtml: content.questions,
                explanation: null,
                listeningAudio: null,
                speakingAudio: null,
                supportingImage: imageUrl,
                question: `${title.trim()} (${label})`,
                type: answerMode === "multiple" ? "multiselect" : "input",
                ieltsModule: selectedModule,
                partId: partId ?? undefined,
                placementNumber: normalizedPlacement ?? undefined,
                options: extractOptionsFromHtml(content.questions),
                answerKey: extractAnswerKeyFromHtml(content.questions),
              },
            },
            refetchQueries: refetch,
            awaitRefetchQueries: true,
          });
          if (mutationResult.error) {
            throw new Error(mutationResult.error.message);
          }
          if (!mutationResult.data?.updateQuestion?._id) {
            throw new Error("Savol yangilanmadi.");
          }
        } else if (selectedModule === "Writing") {
          const slot = editPartSlotIndex ?? 0;
          const entry = writingPartEntries[slot];
          if (!entry) {
            throw new Error("Writing part topilmadi.");
          }
          const { label, content: partContent, partId } = entry;
          const mutationResult = await updateQuestion({
            variables: {
              input: {
                _id: questionId,
                examId: selectedExamId,
                title: `${title.trim()} — ${label}`,
                instruction: null,
                sourceMaterial: buildPartContentBlock(label, partContent),
                passageHtml: buildPartContentBlock(label, partContent),
                questionsHtml: null,
                explanation: null,
                listeningAudio: null,
                speakingAudio: null,
                supportingImage: null,
                question: `${title.trim()} (${label})`,
                type: answerMode === "multiple" ? "multiselect" : "input",
                ieltsModule: selectedModule,
                partId: partId ?? undefined,
                placementNumber: normalizedPlacement ?? undefined,
                options: extractOptionsFromHtml(partContent),
                answerKey: extractAnswerKeyFromHtml(partContent),
              },
            },
            refetchQueries: refetch,
            awaitRefetchQueries: true,
          });
          if (mutationResult.error) {
            throw new Error(mutationResult.error.message);
          }
          if (!mutationResult.data?.updateQuestion?._id) {
            throw new Error("Savol yangilanmadi.");
          }
        } else {
          const savedPartId = oneQuestionData?.findOneQuestion?.partId;
          const mutationResult = await updateQuestion({
            variables: {
              input: {
                _id: questionId,
                examId: selectedExamId,
                title: title.trim(),
                instruction,
                sourceMaterial,
                passageHtml: sourceMaterial,
                questionsHtml: null,
                explanation,
                listeningAudio: listeningUrl,
                speakingAudio: speakingUrl,
                supportingImage: imageUrl,
                question: title.trim(),
                type: answerMode === "multiple" ? "multiselect" : "input",
                ieltsModule: selectedModule,
                partId: savedPartId ?? undefined,
                placementNumber: normalizedPlacement ?? undefined,
                options: extractOptionsFromHtml(sourceMaterial),
                answerKey: extractAnswerKeyFromHtml(sourceMaterial),
              },
            },
            refetchQueries: refetch,
            awaitRefetchQueries: true,
          });
          if (mutationResult.error) {
            throw new Error(mutationResult.error.message);
          }
          if (!mutationResult.data?.updateQuestion?._id) {
            throw new Error("Savol yangilanmadi.");
          }
        }

        setErrors([]);
        setSuccess("Question muvaffaqiyatli yangilandi.");
        navigate(ROUTES_PATH.allQuestions);
        return;
      }

      if (selectedModule === "Listening") {
        const partResults = await Promise.all(
          listeningPartEntries.map(({ label, content: partContent, partId }, index) => {
            return createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  sourceMaterial: buildPartContentBlock(label, partContent),
                  passageHtml: buildPartContentBlock(label, partContent),
                  questionsHtml: null,
                  explanation: null,
                  listeningAudio: uploadedListeningAudio,
                  speakingAudio: null,
                  supportingImage: null,
                  question: `${title.trim()} (${label})`,
                  type: "input",
                  ieltsModule: selectedModule,
                  listeningPart: String(index + 1),
                  partId,
                  placementNumber: normalizedPlacement,
                  options: extractOptionsFromHtml(partContent),
                  answerKey: extractAnswerKeyFromHtml(partContent),
                },
              },
            });
          }),
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
          readingPartEntries.map(({ label, content, partId }) =>
            createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  sourceMaterial: `${buildPartContentBlock(label, content.passage)}${content.questions}`,
                  passageHtml: buildPartContentBlock(label, content.passage),
                  questionsHtml: content.questions,
                  explanation: null,
                  listeningAudio: null,
                  speakingAudio: null,
                  supportingImage: uploadedSupportingImage,
                  question: `${title.trim()} (${label})`,
                  type:
                    answerMode === "multiple"
                      ? "multiselect"
                      : "input",
                  ieltsModule: selectedModule,
                  partId,
                  placementNumber: normalizedPlacement,
                  options: extractOptionsFromHtml(content.questions),
                  answerKey: extractAnswerKeyFromHtml(content.questions),
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
          writingPartEntries.map(({ label, content: partContent, partId }) =>
            createQuestion({
              variables: {
                input: {
                  examId: selectedExamId,
                  title: `${title.trim()} — ${label}`,
                  instruction: null,
                  sourceMaterial: buildPartContentBlock(label, partContent),
                  passageHtml: buildPartContentBlock(label, partContent),
                  questionsHtml: null,
                  explanation: null,
                  listeningAudio: null,
                  speakingAudio: null,
                  supportingImage: null,
                  question: `${title.trim()} (${label})`,
                  type:
                    answerMode === "multiple"
                      ? "multiselect"
                      : "input",
                  ieltsModule: selectedModule,
                  partId,
                  placementNumber: normalizedPlacement,
                  options: extractOptionsFromHtml(partContent),
                  answerKey: extractAnswerKeyFromHtml(partContent),
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
              sourceMaterial,
              passageHtml: sourceMaterial,
              questionsHtml: null,
              explanation,
              listeningAudio: uploadedListeningAudio,
              speakingAudio: uploadedSpeakingAudio,
              supportingImage: uploadedSupportingImage,
              question: title.trim(),
              type:
                answerMode === "multiple"
                  ? "multiselect"
                  : "input",
              ieltsModule: selectedModule,
              placementNumber: normalizedPlacement,
              options: extractOptionsFromHtml(sourceMaterial),
              answerKey: extractAnswerKeyFromHtml(sourceMaterial),
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
          ? "Listening question muvaffaqiyatli yaratildi."
          : selectedModule === "Reading"
            ? `Reading part savollari (${readingPartEntries.length} ta) muvaffaqiyatli yaratildi.`
            : selectedModule === "Writing"
              ? `Writing part savollari (${writingPartEntries.length} ta) muvaffaqiyatli yaratildi.`
          : "Question muvaffaqiyatli yaratildi.",
      );
      navigate(ROUTES_PATH.allQuestions);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Question create failed.";
      setErrors([message]);
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
                  {isEditMode ? "Savolni tahrirlash" : "IELTS Question Templates"}
                </Typography>
                <Typography component="p" className="add-question-page__rail-copy">
                  {isEditMode
                    ? "Ma’lumotlarni yangilab, saqlang."
                    : "Template tanlang va savol yarating."}
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
                {isEditMode && oneQuestionLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress aria-label="Loading question" />
                  </Box>
                ) : null}
                {isEditMode && !oneQuestionLoading && oneQuestionData?.findOneQuestion === null ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Savol topilmadi yoki kirish taqiqlangan.
                  </Alert>
                ) : null}
                {oneQuestionError ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {oneQuestionError.message}
                  </Alert>
                ) : null}
                <Box className="add-question-card">
                  <Box className="add-question-form__grid">
                    <Box className="add-question-form__field add-question-form__field--span-2">
                      <label className="add-question-form__label">IELTS exam</label>
                      <TextField
                        select
                        fullWidth
                        disabled={isEditMode}
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
                        disabled={isEditMode}
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
                        {listeningAudioPreviewSrc ? (
                          <Box
                            className="add-question-form__audio-preview"
                            component="figure"
                            aria-label="Listening audio preview"
                          >
                            <audio controls preload="metadata" src={listeningAudioPreviewSrc} />
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
                        {speakingAudioPreviewSrc ? (
                          <Box
                            className="add-question-form__audio-preview"
                            component="figure"
                            aria-label="Speaking audio preview"
                          >
                            <audio controls preload="metadata" src={speakingAudioPreviewSrc} />
                          </Box>
                        ) : null}
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
                        {supportingImagePreviewSrc ? (
                          <Box
                            component="figure"
                            sx={{ mt: 1, maxWidth: 360 }}
                            aria-label="Supporting image preview"
                          >
                            <Box
                              component="img"
                              src={supportingImagePreviewSrc}
                              alt=""
                              sx={{ width: "100%", height: "auto", borderRadius: 1 }}
                            />
                          </Box>
                        ) : null}
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                {selectedModule === "Listening" ? (
                  <Box className="add-question-card">
                    <Box className="add-question-form__field add-question-form__field--span-4">
                      <label className="add-question-form__label">
                        Question content ({listeningPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {listeningPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <RichTextEditor
                              value={listeningPartContents[index] ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setListeningPartContents((current) =>
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
                        Question content ({readingPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {readingPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <label className="add-question-form__label">Passage text</label>
                            <RichTextEditor
                              value={readingPartContents[index]?.passage ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setReadingPartContents((current) =>
                                  current.map((item, idx) =>
                                    idx === index ? { ...item, passage: nextValue } : item,
                                  ),
                                )
                              }
                            />
                            <Box sx={{ height: 10 }} />
                            <label className="add-question-form__label">Questions</label>
                            <RichTextEditor
                              value={readingPartContents[index]?.questions ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setReadingPartContents((current) =>
                                  current.map((item, idx) =>
                                    idx === index ? { ...item, questions: nextValue } : item,
                                  ),
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
                        Question content ({writingPartEntries.length} ta part)
                      </label>
                      <Box className="add-question-form__grid">
                        {writingPartEntries.map((entry, index) => (
                          <Box
                            key={entry.key}
                            className="add-question-form__field add-question-form__field--span-2 add-question-form__textarea"
                          >
                            <label className="add-question-form__label">{entry.label}</label>
                            <RichTextEditor
                              value={writingPartContents[index] ?? EMPTY_HTML}
                              onChange={(nextValue) =>
                                setWritingPartContents((current) =>
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
                      disabled={
                        isSaving ||
                        isUpdating ||
                        (isEditMode && (oneQuestionLoading || !oneQuestionData?.findOneQuestion))
                      }
                    >
                      {isSaving || isUpdating
                        ? "Saving..."
                        : isEditMode
                          ? "Update Question"
                          : "Save Question"}
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
