import { graphqlUrl } from "../../graphql/client";
import { IELTS_MODULE_OPTIONS, QUESTION_TEMPLATES, type IeltsModule } from "./AddQuestionPage.constants";
import type { AnswerKeyPayload, OptionsPayloadItem, PartItem } from '@/types/addQuestion'

export const EMPTY_HTML = "<p></p>";
export const LISTENING_PART_LABELS = ["Part 1", "Part 2", "Part 3", "Part 4"] as const;
export const READING_PART_LABELS = ["Part 1", "Part 2", "Part 3"] as const;
export const WRITING_PART_LABELS = ["Part 1", "Part 2"] as const;
export const uploadEndpoint = `${graphqlUrl.replace(/\/graphql$/, "")}/files/upload`;

const EMPTY_ARRAY: never[] = [];

export function stableEmptyArray<T>(): T[] {
  return EMPTY_ARRAY as T[];
}

export function isHtmlEmpty(value: string): boolean {
  const normalized = value
    .replace(/<p><\/p>/g, "")
    .replace(/<p><br><\/p>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return normalized.length === 0;
}

export function buildPartContentBlock(partLabel: string, html: string): string {
  return `<h3>${partLabel}</h3>${html}`;
}

export function buildPartLabel(part: PartItem): string {
  const title = part.title?.trim();
  if (title) {
    return `Part ${part.partNumber}: ${title}`;
  }
  return `Part ${part.partNumber}`;
}

export function resolveMediaUrl(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return value;
  const base = graphqlUrl.replace(/\/graphql$/, "");
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}

export function stripLeadingPartHeading(html: string): string {
  const trimmed = html.trim();
  const match = trimmed.match(/^<h3[^>]*>[\s\S]*?<\/h3>\s*/i);
  if (!match) return html;
  return trimmed.slice(match[0].length);
}

export function parseBaseTitleFromStoredTitle(storedTitle: string | null | undefined): string {
  const full = (storedTitle ?? "").trim();
  if (!full) return "";
  const sep = " — ";
  const idx = full.lastIndexOf(sep);
  if (idx === -1) return full;
  return full.slice(0, idx).trim() || full;
}

export function resolveTemplateIdFromType(module: IeltsModule, type: string): string {
  const forModule = QUESTION_TEMPLATES.filter((t) => t.module === module);
  if (type === "multiselect") {
    const multiple = forModule.find((t) => t.answerMode === "multiple");
    if (multiple) return multiple.id;
  }
  return forModule[0]?.id ?? QUESTION_TEMPLATES[0]?.id ?? "";
}

export function validateModule(raw: string): IeltsModule {
  const trimmed = raw.trim() as IeltsModule;
  return IELTS_MODULE_OPTIONS.includes(trimmed) ? trimmed : "Listening";
}

export function extractOptionsFromHtml(html: string): OptionsPayloadItem[] {
  if (!html?.trim()) return [];
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const options: OptionsPayloadItem[] = [];

    const groups = Array.from(doc.querySelectorAll('div[data-type="radio-group"]'));
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
      options.push({ title: answer, key: `blank-${id}`, isCorrectAnswer: true });
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
        /* malformed drag-drop data */
      }
    });

    return options;
  } catch {
    return [];
  }
}

export function extractAnswerKeyFromHtml(html: string): string | null {
  if (!html?.trim()) return null;
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const answerKey: AnswerKeyPayload = { radio: [], blank: [], dragDrop: [] };

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
        const selected = options.find((o) => o.value === checkedValue);
        if (!selected) return;
        answerKey.radio.push({ qid: `radio-${groupIndex + 1}`, correct: selected.label });
      } catch {
        /* malformed radio data */
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
          .filter((v) => v.length > 0);
        if (correct.length === 0) return;
        answerKey.dragDrop.push({ qid: `drag-${nodeIndex + 1}`, correct });
      } catch {
        /* malformed drag-drop data */
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
