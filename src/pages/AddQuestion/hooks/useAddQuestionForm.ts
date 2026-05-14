import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { InternalRefetchQueryDescriptor } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { selectAuthToken } from "../../../store";
import { useAppSelector } from "../../../store/hooks";
import { useToast } from "../../../components/common/Toast";
import { ROUTES_PATH } from "../../../routes/paths";
import { QUESTION_TEMPLATES, type IeltsModule } from "../AddQuestionPage.constants";
import { CREATE_QUESTION_MUTATION } from "../api/createQuestionMutation";
import { FIND_ALL_MODULES_FOR_QUESTION_QUERY, type FindAllModulesResponse } from "../api/findAllModulesForQuestionQuery";
import { FIND_ALL_EXAMS_FOR_QUESTION_QUERY } from "../api/findAllExamsForQuestionQuery";
import { FIND_ALL_PARTS_FOR_QUESTION_QUERY } from "../api/findAllPartsForQuestionQuery";
import { FIND_ONE_QUESTION_QUERY } from "../api/findOneQuestionQuery";
import { UPDATE_QUESTION_MUTATION } from "../../Questions/api/updateQuestionMutation";
import { FIND_ALL_QUESTIONS_QUERY, type FindAllQuestionsResponse, flattenGroupedQuestions } from "../../Questions/api/findAllQuestionsQuery";
import type {
  CreateQuestionMutationResponse,
  ExamItem,
  FindAllExamsResponse,
  FindAllPartsResponse,
  FindOneQuestionQueryData,
  LoadedQuestion,
  PartItem,
  ReadingPartContent,
  UpdateQuestionMutationData,
} from '@/types/addQuestion'
import {
  buildPartContentBlock,
  buildPartLabel,
  EMPTY_HTML,
  extractAnswerKeyFromHtml,
  extractOptionsFromHtml,
  isHtmlEmpty,
  LISTENING_PART_LABELS,
  parseBaseTitleFromStoredTitle,
  READING_PART_LABELS,
  resolveMediaUrl,
  resolveTemplateIdFromType,
  stripLeadingPartHeading,
  uploadEndpoint,
  validateModule,
  WRITING_PART_LABELS,
} from "../utils";
import { getMutationErrorMessage, type ApolloMutationResultLike } from "../../../helpers";

const STABLE_EMPTY_EXAMS: ExamItem[] = [];
const STABLE_EMPTY_PARTS: PartItem[] = [];

/** API / DB module `type` (listening, …) vs UI IELTS modul nomi */
function apiModuleTypeMatches(
  apiType: string | null | undefined,
  uiModule: IeltsModule,
): boolean {
  const raw = apiType != null ? String(apiType).trim().toLowerCase() : "";
  if (!raw) return false;
  return raw === uiModule.trim().toLowerCase();
}

/** Reading/Writing: catalog `partId` → slot; else title ` — Part…`; finally group order */
function resolveSiblingForPartSlot(
  siblings: LoadedQuestion[],
  slotIndex: number,
  moduleParts: PartItem[],
  entryLabel?: string,
): LoadedQuestion | undefined {
  if (siblings.length === 0) return undefined;

  if (moduleParts.length > 0) {
    const byPart = siblings.find((s) => {
      if (!s.partId) return false;
      const idx = moduleParts.findIndex((p) => String(p._id) === String(s.partId));
      return idx === slotIndex;
    });
    if (byPart) return byPart;
  }

  if (entryLabel) {
    const suffix = ` — ${entryLabel}`;
    const byTitle = siblings.find((s) => String(s.title ?? "").endsWith(suffix));
    if (byTitle) return byTitle;
  }

  const ordered = [...siblings].sort((a, b) => {
    const pa = Number(a.placementNumber) || 0;
    const pb = Number(b.placementNumber) || 0;
    if (pa !== pb) return pa - pb;
    return String(a._id).localeCompare(String(b._id));
  });
  return ordered[slotIndex];
}

function resolveListeningSiblingForSlot(
  siblings: LoadedQuestion[],
  slotIndex: number,
  entryLabel: string,
): LoadedQuestion | undefined {
  if (siblings.length === 0) return undefined;

  const byListeningPart = siblings.find((s) => {
    const raw = String(s.listeningPart ?? "").trim();
    if (!raw) return false;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 && n - 1 === slotIndex;
  });
  if (byListeningPart) return byListeningPart;

  if (entryLabel) {
    const suffix = ` — ${entryLabel}`;
    const byTitle = siblings.find((s) => String(s.title ?? "").endsWith(suffix));
    if (byTitle) return byTitle;
  }

  const ordered = [...siblings].sort((a, b) => String(a._id).localeCompare(String(b._id)));
  return ordered[slotIndex];
}

/** Edit mode: DB placement — listeningPart, then title, `Part N`, then catalog `buildPartLabel` */
function listeningHydrationSlot(sib: LoadedQuestion, partsForExam: PartItem[]): number {
  const rawLp = String(sib.listeningPart ?? "").trim();
  if (rawLp) {
    const n = Number.parseInt(rawLp, 10);
    if (Number.isFinite(n) && n > 0) {
      return Math.min(LISTENING_PART_LABELS.length, n) - 1;
    }
  }
  const title = String(sib.title ?? "");
  for (let i = 0; i < partsForExam.length; i++) {
    const p = partsForExam[i];
    if (!p) continue;
    const lbl = buildPartLabel(p);
    if (title.endsWith(` — ${lbl}`)) return i;
  }
  const idx = LISTENING_PART_LABELS.findIndex((lbl) => title.endsWith(` — ${lbl}`));
  if (idx >= 0) return idx;
  return 0;
}

function readingWritingHydrationSlot(
  sib: LoadedQuestion,
  partsForExam: PartItem[],
  fallbackLabels: readonly string[],
): number {
  if (sib.partId && partsForExam.length > 0) {
    const idx = partsForExam.findIndex((p) => String(p._id) === String(sib.partId));
    if (idx >= 0) return Math.min(idx, fallbackLabels.length - 1);
  }
  const title = String(sib.title ?? "");
  for (let i = 0; i < partsForExam.length; i++) {
    const p = partsForExam[i];
    if (!p) continue;
    const lbl = buildPartLabel(p);
    if (title.endsWith(` — ${lbl}`)) return Math.min(i, fallbackLabels.length - 1);
  }
  for (let i = 0; i < fallbackLabels.length; i++) {
    const lbl = fallbackLabels[i];
    if (lbl && title.endsWith(` — ${lbl}`)) return i;
  }
  return 0;
}

export function useAddQuestionForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams<{ questionId?: string }>();
  const questionId = params.questionId?.trim() || undefined;
  const isEditMode = Boolean(questionId);

  const authToken = useAppSelector(selectAuthToken);

  // ── Queries ──
  // Exams — hydrate only for legacy questions with examId
  const { data: examsData } = useQuery<FindAllExamsResponse>(FIND_ALL_EXAMS_FOR_QUESTION_QUERY);
  const { data: modulesData } = useQuery<FindAllModulesResponse>(
    FIND_ALL_MODULES_FOR_QUESTION_QUERY,
  );
  const { data: partsData } = useQuery<FindAllPartsResponse>(FIND_ALL_PARTS_FOR_QUESTION_QUERY);
  const {
    data: oneQuestionData,
    loading: oneQuestionLoading,
    error: oneQuestionError,
  } = useQuery<FindOneQuestionQueryData>(FIND_ONE_QUESTION_QUERY, {
    variables: { _id: questionId ?? "" },
    skip: !questionId,
  });

  const { data: allQuestionsData } = useQuery<FindAllQuestionsResponse>(
    FIND_ALL_QUESTIONS_QUERY,
    { skip: !isEditMode },
  );

  const [createQuestion, { loading: isSaving }] = useMutation<CreateQuestionMutationResponse>(
    CREATE_QUESTION_MUTATION,
  );
  const [updateQuestion, { loading: isUpdating }] = useMutation<UpdateQuestionMutationData>(
    UPDATE_QUESTION_MUTATION,
  );

  // ── Form state ──
  const [selectedModule, setSelectedModule] = useState<IeltsModule>("Listening");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    QUESTION_TEMPLATES[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("45");
  const [instruction, setInstruction] = useState(EMPTY_HTML);
  const [listeningPartContents, setListeningPartContents] = useState<string[]>(
    () => Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML),
  );
  const [readingPartContents, setReadingPartContents] = useState<ReadingPartContent[]>(
    () =>
      Array.from({ length: READING_PART_LABELS.length }, () => ({
        passage: EMPTY_HTML,
        questions: EMPTY_HTML,
      })),
  );
  const [writingPartContents, setWritingPartContents] = useState<string[]>(
    () => Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML),
  );
  const [sourceMaterial, setSourceMaterial] = useState(EMPTY_HTML);
  const [explanation, setExplanation] = useState(EMPTY_HTML);
  const [acceptedAnswers, setAcceptedAnswers] = useState("");
  const [listeningAudioFile, setListeningAudioFile] = useState<File | null>(null);
  const [speakingAudioFile, setSpeakingAudioFile] = useState<File | null>(null);
  const [supportingImageFile, setSupportingImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [existingListeningAudio, setExistingListeningAudio] = useState<string | null>(null);
  const [existingSpeakingAudio, setExistingSpeakingAudio] = useState<string | null>(null);
  const [existingSupportingImage, setExistingSupportingImage] = useState<string | null>(null);
  const [, setEditPartSlotIndex] = useState<number | null>(null);

  // ── Stable references (FIX: unstable `exams` / `parts` fallback) ──
  const exams = useMemo(() => {
    const all = examsData?.findAllExams ?? STABLE_EMPTY_EXAMS
    return all.filter((exam) => exam.isActive && !exam.isCompleted)
  }, [examsData?.findAllExams])
  const modules = useMemo(
    () => modulesData?.findAllModules ?? [],
    [modulesData?.findAllModules],
  );
  const allParts = partsData?.findAllParts ?? STABLE_EMPTY_PARTS;

  // ── Derived values ──
  const selectedTemplate = useMemo(
    () =>
      QUESTION_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? QUESTION_TEMPLATES[0],
    [selectedTemplateId],
  );

  const answerMode = selectedTemplate.answerMode;

  const selectedModuleId = useMemo(() => {
    const fromList = modules.find((x) => apiModuleTypeMatches(x.type, selectedModule));
    if (fromList) return fromList._id;

    const fromPart = allParts.find((p) => apiModuleTypeMatches(p.moduleType, selectedModule));
    return fromPart?.moduleId ?? null;
  }, [modules, selectedModule, allParts]);

  const selectedModuleParts = useMemo(() => {
    if (!selectedModuleId) return [];
    return allParts
      .filter((p) => String(p.moduleId) === String(selectedModuleId))
      .sort((a, b) => a.partNumber - b.partNumber);
  }, [allParts, selectedModuleId]);

  const listeningPartEntries = useMemo(
    () =>
      LISTENING_PART_LABELS.map((fallback, i) => {
        const part = selectedModuleParts[i];
        return {
          key: part?._id ?? `fallback-part-${i + 1}`,
          label: part ? buildPartLabel(part) : fallback,
          partId: part?._id ?? null,
          content: listeningPartContents[i] ?? EMPTY_HTML,
        };
      }),
    [listeningPartContents, selectedModuleParts],
  );

  const readingPartEntries = useMemo(
    () =>
      READING_PART_LABELS.map((fallback, i) => {
        const part = selectedModuleParts[i];
        return {
          key: part?._id ?? `reading-fallback-part-${i + 1}`,
          label: part ? buildPartLabel(part) : fallback,
          partId: part?._id ?? null,
          content: readingPartContents[i] ?? { passage: EMPTY_HTML, questions: EMPTY_HTML },
        };
      }),
    [readingPartContents, selectedModuleParts],
  );

  const writingPartEntries = useMemo(
    () =>
      WRITING_PART_LABELS.map((fallback, i) => {
        const part = selectedModuleParts[i];
        return {
          key: part?._id ?? `writing-fallback-part-${i + 1}`,
          label: part ? buildPartLabel(part) : fallback,
          partId: part?._id ?? null,
          content: writingPartContents[i] ?? EMPTY_HTML,
        };
      }),
    [selectedModuleParts, writingPartContents],
  );

  const siblingQuestions = useMemo(() => {
    if (!isEditMode || !oneQuestionData?.findOneQuestion) return [];
    const q = oneQuestionData.findOneQuestion;
    const gid = q.groupId?.trim();
    const allFlat = flattenGroupedQuestions(allQuestionsData?.findAllQuestions ?? []);
    if (gid) {
      return allFlat.filter((s) => s.groupId?.trim() === gid);
    }
    const mod = validateModule(q.ieltsModule ?? "Listening");
    const qEx = q.examId?.trim() ?? "";
    if (!qEx) {
      const base = parseBaseTitleFromStoredTitle(q.title);
      return allFlat.filter((s) => {
        if (validateModule(s.ieltsModule ?? "Listening") !== mod) return false;
        if (String(s._id) === String(q._id)) return true;
        if (!base) return false;
        return parseBaseTitleFromStoredTitle(s.title) === base;
      });
    }
    return allFlat.filter((s) => {
      if (validateModule(s.ieltsModule ?? "Listening") !== mod) return false;
      const sEx = s.examId?.trim() ?? "";
      return Boolean(sEx && String(sEx) === String(qEx));
    });
  }, [isEditMode, oneQuestionData, allQuestionsData]);

  // ── Edit-mode hydration ──
  const editHydrationKeyRef = useRef("");
  useEffect(() => {
    editHydrationKeyRef.current = "";
  }, [questionId]);

  useEffect(() => {
    if (!questionId || !oneQuestionData?.findOneQuestion) return;
    const q = oneQuestionData.findOneQuestion;
    if (String(q._id) !== String(questionId)) return;

    /** If `findAllQuestions` is slow, siblingIds stay empty → key never changes and parts never hydrate */
    const siblingIdsKey = siblingQuestions
      .map((s) => String(s._id))
      .sort()
      .join(",");
    const hydrationKey = `${questionId}|${q._id}|${siblingIdsKey}`;
    if (editHydrationKeyRef.current === hydrationKey) return;

    const examItem = q.examId?.trim()
      ? exams.find((e) => String(e._id) === String(q.examId))
      : null;

    if (q.examId?.trim()) {
      if (exams.length === 0) return;
      if (!examItem) return;
    }

    editHydrationKeyRef.current = hydrationKey;

    const module = validateModule(q.ieltsModule ?? "Listening");
    const moduleIdFilter =
      examItem?.moduleId ??
      modules.find((m) => apiModuleTypeMatches(m.type, module))?._id ??
      allParts.find((p) => apiModuleTypeMatches(p.moduleType, module))?.moduleId ??
      null;
    const partsForExam =
      moduleIdFilter != null
        ? allParts
            .filter((p) => String(p.moduleId) === String(moduleIdFilter))
            .sort((a, b) => a.partNumber - b.partNumber)
        : [];

    setSelectedModule(module);
    setSelectedTemplateId(resolveTemplateIdFromType(module, q.type));
    setTitle(parseBaseTitleFromStoredTitle(q.title));
    setTimeLimit(
      q.placementNumber != null && q.placementNumber > 0 ? String(q.placementNumber) : "45",
    );
    setExistingListeningAudio(q.listeningAudio?.trim() || null);
    setExistingSpeakingAudio(q.speakingAudio?.trim() || null);
    setExistingSupportingImage(
      module === "Reading" ? null : q.supportingImage?.trim() || null,
    );
    setListeningAudioFile(null);
    setSpeakingAudioFile(null);
    setSupportingImageFile(null);
    setInstruction(q.instruction?.trim() ? (q.instruction ?? EMPTY_HTML) : EMPTY_HTML);
    setSourceMaterial(q.sourceMaterial?.trim() ? (q.sourceMaterial ?? EMPTY_HTML) : EMPTY_HTML);
    setExplanation(q.explanation?.trim() ? (q.explanation ?? EMPTY_HTML) : EMPTY_HTML);

    const makeEmptyListening = () =>
      Array.from({ length: LISTENING_PART_LABELS.length }, () => EMPTY_HTML);
    const makeEmptyReading = () =>
      Array.from({ length: READING_PART_LABELS.length }, () => ({
        passage: EMPTY_HTML,
        questions: EMPTY_HTML,
      }));
    const makeEmptyWriting = () =>
      Array.from({ length: WRITING_PART_LABELS.length }, () => EMPTY_HTML);

    if (module === "Listening") {
      setEditPartSlotIndex(null);
      const filled = makeEmptyListening();
      for (const sib of siblingQuestions) {
        const slot = listeningHydrationSlot(sib, partsForExam);
        const passage = stripLeadingPartHeading(String(sib.passageHtml ?? sib.sourceMaterial ?? ""));
        if (passage) filled[slot] = passage;
      }
      setListeningPartContents(filled);
      setReadingPartContents(makeEmptyReading());
      setWritingPartContents(makeEmptyWriting());
    } else if (module === "Reading") {
      setEditPartSlotIndex(null);
      const filled = makeEmptyReading();
      for (const sib of siblingQuestions) {
        const slot = readingWritingHydrationSlot(sib, partsForExam, READING_PART_LABELS);
        const passageInner = stripLeadingPartHeading(String(sib.passageHtml ?? ""));
        const questionsInner = String(sib.questionsHtml ?? EMPTY_HTML);
        filled[slot] = {
          passage: passageInner || EMPTY_HTML,
          questions: questionsInner || EMPTY_HTML,
        };
      }
      setReadingPartContents(filled);
      setListeningPartContents(makeEmptyListening());
      setWritingPartContents(makeEmptyWriting());
    } else if (module === "Writing") {
      setEditPartSlotIndex(null);
      const filled = makeEmptyWriting();
      for (const sib of siblingQuestions) {
        const slot = readingWritingHydrationSlot(sib, partsForExam, WRITING_PART_LABELS);
        const passage = stripLeadingPartHeading(String(sib.passageHtml ?? sib.sourceMaterial ?? ""));
        if (passage) filled[slot] = passage;
      }
      setWritingPartContents(filled);
      setListeningPartContents(makeEmptyListening());
      setReadingPartContents(makeEmptyReading());
    } else {
      setEditPartSlotIndex(null);
      setListeningPartContents(makeEmptyListening());
      setReadingPartContents(makeEmptyReading());
      setWritingPartContents(makeEmptyWriting());
    }
  }, [questionId, oneQuestionData, exams, modules, allParts, siblingQuestions]);

  // ── Audio blob URLs (FIX: create + cleanup in same effect) ──
  const listeningBlobUrl = useMemo(
    () => (listeningAudioFile ? URL.createObjectURL(listeningAudioFile) : null),
    [listeningAudioFile],
  );
  useEffect(() => {
    return () => {
      if (listeningBlobUrl) URL.revokeObjectURL(listeningBlobUrl);
    };
  }, [listeningBlobUrl]);

  const speakingBlobUrl = useMemo(
    () => (speakingAudioFile ? URL.createObjectURL(speakingAudioFile) : null),
    [speakingAudioFile],
  );
  useEffect(() => {
    return () => {
      if (speakingBlobUrl) URL.revokeObjectURL(speakingBlobUrl);
    };
  }, [speakingBlobUrl]);

  const listeningAudioPreviewSrc =
    listeningBlobUrl ??
    (isEditMode && existingListeningAudio ? resolveMediaUrl(existingListeningAudio) : null);

  const speakingAudioPreviewSrc =
    speakingBlobUrl ??
    (isEditMode && existingSpeakingAudio ? resolveMediaUrl(existingSpeakingAudio) : null);

  // ── Actions ──
  const uploadAsset = useCallback(
    async (file: File | null) => {
      if (!file) return null;
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        body: formData,
      });
      if (!response.ok) throw new Error(`File upload failed (${response.status})`);

      const raw = await response.text();
      const trimmed = raw.trim();
      if (!trimmed) throw new Error("File upload returned empty response.");

      if (trimmed.startsWith("/") || trimmed.startsWith("uploads/")) return trimmed;

      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (typeof parsed === "string") return parsed;
        if (parsed && typeof parsed === "object" && "path" in parsed) {
          const pathValue = (parsed as { path?: unknown }).path;
          if (typeof pathValue === "string") return pathValue;
        }
      } catch {
        /* fall through */
      }

      throw new Error("Unexpected upload response format.");
    },
    [authToken],
  );

  const handleTemplateChange = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    setAcceptedAnswers("");
    setErrors([]);
  }, []);

  const handleModuleChange = useCallback((module: IeltsModule) => {
    setSelectedModule(module);
    const moduleTemplates = QUESTION_TEMPLATES.filter((t) => t.module === module);
    if (moduleTemplates[0]) {
      setSelectedTemplateId(moduleTemplates[0].id);
    }
  }, []);

  const setListeningPartContent = useCallback((index: number, html: string) => {
    setListeningPartContents((cur) => cur.map((c, i) => (i === index ? html : c)));
  }, []);

  const setReadingPartPassage = useCallback((index: number, html: string) => {
    setReadingPartContents((cur) =>
      cur.map((row, i) => (i === index ? { ...row, passage: html } : row)),
    );
  }, []);

  const setReadingPartQuestions = useCallback((index: number, html: string) => {
    setReadingPartContents((cur) =>
      cur.map((row, i) => (i === index ? { ...row, questions: html } : row)),
    );
  }, []);

  const setWritingPartContent = useCallback((index: number, html: string) => {
    setWritingPartContents((cur) => cur.map((c, i) => (i === index ? html : c)));
  }, []);

  // ── Submit handler ──
  const handleSubmit = useCallback(async () => {
    const nextErrors: string[] = [];

    if (
      selectedModule !== "Listening" &&
      selectedModule !== "Reading" &&
      selectedModule !== "Writing" &&
      isHtmlEmpty(instruction)
    ) {
      nextErrors.push("Instruction required.");
    }

    if (selectedModule === "Listening") {
      const missing = listeningPartEntries.filter((e) => isHtmlEmpty(e.content));
      if (missing.length > 0) {
        nextErrors.push(`Listening part content required: ${missing.map((e) => e.label).join(", ")}.`);
      }
      if (!listeningAudioFile && !existingListeningAudio?.trim()) {
        nextErrors.push("Listening audio required.");
      }
    } else if (selectedModule === "Reading") {
      const missing = readingPartEntries.filter(
        (e) => isHtmlEmpty(e.content.passage) || isHtmlEmpty(e.content.questions),
      );
      if (missing.length > 0) {
        nextErrors.push(`Reading part text/questions required: ${missing.map((e) => e.label).join(", ")}.`);
      }
    } else if (selectedModule === "Writing") {
      const missing = writingPartEntries.filter((e) => isHtmlEmpty(e.content));
      if (missing.length > 0) {
        nextErrors.push(`Writing part content required: ${missing.map((e) => e.label).join(", ")}.`);
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

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      toast.error(nextErrors.join(" "));
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

      const refetch = [{ query: FIND_ALL_QUESTIONS_QUERY }];
      const trimmedTitle = title.trim();
      const questionType =
        answerMode === "multiple" ? "multiselect" : answerMode === "single" ? "option" : "input";

      if (isEditMode && questionId) {
        const listeningUrl = uploadedListeningAudio ?? existingListeningAudio ?? null;
        const speakingUrl = uploadedSpeakingAudio ?? existingSpeakingAudio ?? null;
        const imageUrl = uploadedSupportingImage ?? existingSupportingImage ?? null;

        if (selectedModule === "Listening") {
          for (let i = 0; i < listeningPartEntries.length; i++) {
            const entry = listeningPartEntries[i];
            if (!entry) continue;
            const sib = resolveListeningSiblingForSlot(siblingQuestions, i, entry.label);
            if (!sib) continue;
            const isLast = i === listeningPartEntries.length - 1;
            await executeUpdate({
              updateQuestion,
              questionId: sib._id,
              title: `${trimmedTitle} — ${entry.label}`,
              question: `${trimmedTitle} (${entry.label})`,
              sourceMaterial: buildPartContentBlock(entry.label, entry.content),
              passageHtml: buildPartContentBlock(entry.label, entry.content),
              questionsHtml: null,
              instruction: null,
              explanation: null,
              listeningAudio: listeningUrl,
              speakingAudio: null,
              supportingImage: null,
              type: "input",
              ieltsModule: selectedModule,
              listeningPart: String(i + 1),
              partId: entry.partId ?? undefined,
              placementNumber: normalizedPlacement ?? undefined,
              optionsSource: entry.content,
              refetch: isLast ? refetch : [],
            });
          }
        } else if (selectedModule === "Reading") {
          for (let i = 0; i < readingPartEntries.length; i++) {
            const entry = readingPartEntries[i];
            if (!entry) continue;
            const sib = resolveSiblingForPartSlot(
              siblingQuestions,
              i,
              selectedModuleParts,
              entry.label,
            );
            if (!sib) continue;
            const isLast = i === readingPartEntries.length - 1;
            await executeUpdate({
              updateQuestion,
              questionId: sib._id,
              title: `${trimmedTitle} — ${entry.label}`,
              question: `${trimmedTitle} (${entry.label})`,
              sourceMaterial: `${buildPartContentBlock(entry.label, entry.content.passage)}${entry.content.questions}`,
              passageHtml: buildPartContentBlock(entry.label, entry.content.passage),
              questionsHtml: entry.content.questions,
              instruction: null,
              explanation: null,
              listeningAudio: null,
              speakingAudio: null,
              supportingImage: null,
              type: questionType,
              ieltsModule: selectedModule,
              partId: entry.partId ?? undefined,
              placementNumber: normalizedPlacement ?? undefined,
              optionsSource: entry.content.questions,
              refetch: isLast ? refetch : [],
            });
          }
        } else if (selectedModule === "Writing") {
          for (let i = 0; i < writingPartEntries.length; i++) {
            const entry = writingPartEntries[i];
            if (!entry) continue;
            const sib = resolveSiblingForPartSlot(
              siblingQuestions,
              i,
              selectedModuleParts,
              entry.label,
            );
            if (!sib) continue;
            const isLast = i === writingPartEntries.length - 1;
            await executeUpdate({
              updateQuestion,
              questionId: sib._id,
              title: `${trimmedTitle} — ${entry.label}`,
              question: `${trimmedTitle} (${entry.label})`,
              sourceMaterial: buildPartContentBlock(entry.label, entry.content),
              passageHtml: buildPartContentBlock(entry.label, entry.content),
              questionsHtml: null,
              instruction: null,
              explanation: null,
              listeningAudio: null,
              speakingAudio: null,
              supportingImage: null,
              type: questionType,
              ieltsModule: selectedModule,
              partId: entry.partId ?? undefined,
              placementNumber: normalizedPlacement ?? undefined,
              optionsSource: entry.content,
              refetch: isLast ? refetch : [],
            });
          }
        } else {
          const savedPartId = oneQuestionData?.findOneQuestion?.partId;
          await executeUpdate({
            updateQuestion,
            questionId,
            title: trimmedTitle,
            question: trimmedTitle,
            instruction,
            sourceMaterial,
            passageHtml: sourceMaterial,
            questionsHtml: null,
            explanation,
            listeningAudio: listeningUrl,
            speakingAudio: speakingUrl,
            supportingImage: imageUrl,
            type: questionType,
            ieltsModule: selectedModule,
            partId: savedPartId ?? undefined,
            placementNumber: normalizedPlacement ?? undefined,
            optionsSource: sourceMaterial,
            refetch,
          });
        }

        setErrors([]);
        toast.success('Question updated successfully.');
        navigate(ROUTES_PATH.allQuestions);
        return;
      }

      // ── Create mode ──
      const newGroupId = crypto.randomUUID();

      if (selectedModule === "Listening") {
        await createPartQuestions({
          entries: listeningPartEntries.map((e, i) => ({
            label: e.label,
            partId: e.partId,
            content: e.content,
            listeningPart: String(i + 1),
          })),
          createQuestion,
          trimmedTitle,
          type: "input",
          ieltsModule: selectedModule,
          listeningAudio: uploadedListeningAudio,
          placementNumber: normalizedPlacement,
          groupId: newGroupId,
        });
      } else if (selectedModule === "Reading") {
        await createPartQuestions({
          entries: readingPartEntries.map((e) => ({
            label: e.label,
            partId: e.partId,
            content: `${buildPartContentBlock(e.label, e.content.passage)}${e.content.questions}`,
            passageHtml: buildPartContentBlock(e.label, e.content.passage),
            questionsHtml: e.content.questions,
            optionsSource: e.content.questions,
          })),
          createQuestion,
          trimmedTitle,
          type: questionType,
          ieltsModule: selectedModule,
          placementNumber: normalizedPlacement,
          groupId: newGroupId,
        });
      } else if (selectedModule === "Writing") {
        await createPartQuestions({
          entries: writingPartEntries.map((e) => ({
            label: e.label,
            partId: e.partId,
            content: e.content,
          })),
          createQuestion,
          trimmedTitle,
          type: questionType,
          ieltsModule: selectedModule,
          placementNumber: normalizedPlacement,
          groupId: newGroupId,
        });
      } else {
        const result = await createQuestion({
          variables: {
            input: {
              title: trimmedTitle,
              instruction,
              sourceMaterial,
              passageHtml: sourceMaterial,
              questionsHtml: null,
              explanation,
              listeningAudio: uploadedListeningAudio,
              speakingAudio: uploadedSpeakingAudio,
              supportingImage: uploadedSupportingImage,
              question: trimmedTitle,
              type: questionType,
              ieltsModule: selectedModule,
              placementNumber: normalizedPlacement,
              options: extractOptionsFromHtml(sourceMaterial),
              answerKey: extractAnswerKeyFromHtml(sourceMaterial),
            },
          },
        });
        const createMsg = getMutationErrorMessage(result as ApolloMutationResultLike);
        if (createMsg) throw new Error(createMsg);
        if (!result.data?.createQuestion?._id) throw new Error("Create Question failed.");
      }

      setErrors([]);
      toast.success('Question created successfully.');
      navigate(ROUTES_PATH.allQuestions);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Question save failed.";
      setErrors([message]);
      toast.error(message);
    }
  }, [
    selectedModule,
    instruction,
    isEditMode,
    listeningPartEntries,
    listeningAudioFile,
    existingListeningAudio,
    readingPartEntries,
    writingPartEntries,
    speakingAudioFile,
    existingSpeakingAudio,
    sourceMaterial,
    uploadAsset,
    supportingImageFile,
    timeLimit,
    title,
    answerMode,
    questionId,
    updateQuestion,
    existingSupportingImage,
    oneQuestionData,
    explanation,
    createQuestion,
    navigate,
    siblingQuestions,
    selectedModuleParts,
    toast,
  ]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES_PATH.allQuestions);
  }, [navigate]);

  return {
    // identity
    isEditMode,
    questionId,

    // form state
    selectedModule,
    selectedTemplateId,
    title,
    timeLimit,
    instruction,
    sourceMaterial,
    explanation,
    acceptedAnswers,
    listeningPartContents,
    readingPartContents,
    writingPartContents,
    listeningAudioFile,
    speakingAudioFile,
    errors,

    // derived
    answerMode,
    selectedTemplate,
    listeningPartEntries,
    readingPartEntries,
    writingPartEntries,
    listeningAudioPreviewSrc,
    speakingAudioPreviewSrc,
    isSaving,
    isUpdating,
    oneQuestionLoading,
    oneQuestionError: oneQuestionError ?? null,
    oneQuestionFound: oneQuestionData?.findOneQuestion != null,

    // actions
    setTitle,
    setTimeLimit,
    setInstruction,
    setSourceMaterial,
    setExplanation,
    setAcceptedAnswers,
    setListeningAudioFile,
    setSpeakingAudioFile,
    setSupportingImageFile,
    setListeningPartContent,
    setReadingPartPassage,
    setReadingPartQuestions,
    setWritingPartContent,
    handleTemplateChange,
    handleModuleChange,
    handleSubmit,
    handleCancel,
  };
}

// ── Internal helpers to reduce duplication in submit handler ──

type ExecuteUpdateParams = {
  updateQuestion: ReturnType<typeof useMutation<UpdateQuestionMutationData>>[0];
  questionId: string;
  title: string;
  question: string;
  instruction: string | null;
  sourceMaterial: string;
  passageHtml: string;
  questionsHtml: string | null;
  explanation: string | null;
  listeningAudio: string | null;
  speakingAudio: string | null;
  supportingImage: string | null;
  type: string;
  ieltsModule: string;
  listeningPart?: string;
  partId?: string;
  placementNumber?: number;
  optionsSource?: string;
  refetch: InternalRefetchQueryDescriptor[];
};

async function executeUpdate(params: ExecuteUpdateParams) {
  const optionsHtml = params.optionsSource ?? params.sourceMaterial;
  const result = await params.updateQuestion({
    ...(params.refetch.length > 0 && {
      refetchQueries: params.refetch,
      awaitRefetchQueries: true,
    }),
    variables: {
      input: {
        _id: params.questionId,
        title: params.title,
        instruction: params.instruction,
        sourceMaterial: params.sourceMaterial,
        passageHtml: params.passageHtml,
        questionsHtml: params.questionsHtml,
        explanation: params.explanation,
        listeningAudio: params.listeningAudio,
        speakingAudio: params.speakingAudio,
        supportingImage: params.supportingImage,
        question: params.question,
        type: params.type,
        ieltsModule: params.ieltsModule,
        ...(params.listeningPart != null && { listeningPart: params.listeningPart }),
        ...(params.partId != null && { partId: params.partId }),
        ...(params.placementNumber != null && { placementNumber: params.placementNumber }),
        options: extractOptionsFromHtml(optionsHtml),
        answerKey: extractAnswerKeyFromHtml(optionsHtml),
      },
    },
  });

  const errMsg = getMutationErrorMessage(result as ApolloMutationResultLike);
  if (errMsg) throw new Error(errMsg);
  if (!result.data?.updateQuestion?._id) throw new Error('Question was not updated.');
}

type CreatePartEntry = {
  label: string;
  partId: string | null;
  content: string;
  listeningPart?: string;
  passageHtml?: string;
  questionsHtml?: string;
  optionsSource?: string;
};

type CreatePartQuestionsParams = {
  entries: CreatePartEntry[];
  createQuestion: ReturnType<typeof useMutation<CreateQuestionMutationResponse>>[0];
  trimmedTitle: string;
  type: string;
  ieltsModule: string;
  listeningAudio?: string | null;
  placementNumber: number | null;
  groupId: string;
};

async function createPartQuestions(params: CreatePartQuestionsParams) {
  const results = await Promise.all(
    params.entries.map((entry) => {
      const contentHtml = entry.passageHtml
        ? entry.content
        : buildPartContentBlock(entry.label, entry.content);
      const optionsHtml = entry.optionsSource ?? entry.content;
      return params.createQuestion({
        variables: {
          input: {
            title: `${params.trimmedTitle} — ${entry.label}`,
            instruction: null,
            sourceMaterial: contentHtml,
            passageHtml: entry.passageHtml ?? contentHtml,
            questionsHtml: entry.questionsHtml ?? null,
            explanation: null,
            listeningAudio: params.listeningAudio ?? null,
            speakingAudio: null,
            supportingImage: null,
            question: `${params.trimmedTitle} (${entry.label})`,
            type: params.type,
            ieltsModule: params.ieltsModule,
            groupId: params.groupId,
            ...(entry.listeningPart != null && { listeningPart: entry.listeningPart }),
            ...(entry.partId != null && { partId: entry.partId }),
            ...(params.placementNumber != null && { placementNumber: params.placementNumber }),
            options: extractOptionsFromHtml(optionsHtml),
            answerKey: extractAnswerKeyFromHtml(optionsHtml),
          },
        },
      });
    }),
  );

  const failed = results.find((r) => {
    const rr = r as ApolloMutationResultLike & typeof r;
    return (
      Boolean(rr.error) ||
      (rr.errors?.length ?? 0) > 0 ||
      !r.data?.createQuestion?._id
    );
  });
  const partErr = failed ? getMutationErrorMessage(failed as ApolloMutationResultLike) : null;
  if (partErr) throw new Error(partErr);
  if (failed) throw new Error('One of the part questions failed to save.');
}

export type UseAddQuestionFormReturn = ReturnType<typeof useAddQuestionForm>;
