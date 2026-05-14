import type { AnswerMode, IeltsModule } from "./AddQuestionPage.constants";

export type ExamItem = {
  _id: string
  title: string
  moduleId?: string | null
  isActive?: boolean
  isCompleted?: boolean
}

export type FindAllExamsResponse = {
  findAllExams: ExamItem[];
};

export type PartItem = {
  _id: string;
  partNumber: number;
  title: string;
  moduleId: string;
  /** Backend MODULES enum: listening, reading, writing, speaking */
  moduleType?: string | null;
};

export type FindAllPartsResponse = {
  findAllParts: PartItem[];
};

export type CreateQuestionMutationResponse = {
  createQuestion: {
    _id: string;
    listeningPart?: string | null;
  };
};

export type UpdateQuestionMutationData = {
  updateQuestion: {
    _id: string;
  };
};

export type ReadingPartContent = {
  passage: string;
  questions: string;
};

export type OptionsPayloadItem = {
  title: string;
  key: string;
  isCorrectAnswer: boolean;
};

export type AnswerKeyItem = {
  qid: string;
  correct: string | string[];
};

export type AnswerKeyPayload = {
  radio: AnswerKeyItem[];
  blank: AnswerKeyItem[];
  dragDrop: AnswerKeyItem[];
};

export type LoadedQuestion = {
  _id: string;
  title?: string | null;
  instruction?: string | null;
  sourceMaterial?: string | null;
  passageHtml?: string | null;
  questionsHtml?: string | null;
  explanation?: string | null;
  question: string;
  type: string;
  examId?: string | null;
  centerId?: string | null;
  partId?: string | null;
  groupId?: string | null;
  ieltsModule?: string | null;
  listeningPart?: string | null;
  placementNumber?: number | null;
  answerKey?: string | null;
  listeningAudio?: string | null;
  speakingAudio?: string | null;
  supportingImage?: string | null;
};

export type FindOneQuestionQueryData = {
  findOneQuestion: LoadedQuestion | null;
};

export type ListeningPartEntry = {
  key: string;
  label: string;
  partId: string | null;
  content: string;
};

export type ReadingPartEntry = {
  key: string;
  label: string;
  partId: string | null;
  content: ReadingPartContent;
};

export type WritingPartEntry = {
  key: string;
  label: string;
  partId: string | null;
  content: string;
};

export type AddQuestionFormState = {
  selectedModule: IeltsModule;
  selectedTemplateId: string;
  title: string;
  timeLimit: string;
  instruction: string;
  sourceMaterial: string;
  explanation: string;
  acceptedAnswers: string;
  listeningPartContents: string[];
  readingPartContents: ReadingPartContent[];
  writingPartContents: string[];
  listeningAudioFile: File | null;
  speakingAudioFile: File | null;
  supportingImageFile: File | null;
  errors: string[];
  existingListeningAudio: string | null;
  existingSpeakingAudio: string | null;
  existingSupportingImage: string | null;
  editPartSlotIndex: number | null;
};

export type AddQuestionFormActions = {
  setSelectedModule: (module: IeltsModule) => void;
  setSelectedTemplateId: (id: string) => void;
  setTitle: (title: string) => void;
  setTimeLimit: (time: string) => void;
  setInstruction: (html: string) => void;
  setSourceMaterial: (html: string) => void;
  setExplanation: (html: string) => void;
  setAcceptedAnswers: (text: string) => void;
  setListeningPartContent: (index: number, html: string) => void;
  setReadingPartPassage: (index: number, html: string) => void;
  setReadingPartQuestions: (index: number, html: string) => void;
  setWritingPartContent: (index: number, html: string) => void;
  setListeningAudioFile: (file: File | null) => void;
  setSpeakingAudioFile: (file: File | null) => void;
  setSupportingImageFile: (file: File | null) => void;
  handleTemplateChange: (templateId: string) => void;
  handleModuleChange: (module: IeltsModule) => void;
  handleSubmit: () => Promise<void>;
};

export type AddQuestionFormDerived = {
  isEditMode: boolean;
  questionId: string | undefined;
  answerMode: AnswerMode;
  listeningPartEntries: ListeningPartEntry[];
  readingPartEntries: ReadingPartEntry[];
  writingPartEntries: WritingPartEntry[];
  listeningAudioPreviewSrc: string | null;
  speakingAudioPreviewSrc: string | null;
  isSaving: boolean;
  isUpdating: boolean;
  oneQuestionLoading: boolean;
  oneQuestionError: Error | null;
  oneQuestionFound: boolean;
};
