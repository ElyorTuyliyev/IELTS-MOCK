import { useEffect } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";

import { Layout } from "../../../components/layout";
import { useToast } from "../../../components/common/Toast";
import { AddQuestionPageRoot } from "./AddQuestionPage.style";
import { useAddQuestionForm } from "../hooks/useAddQuestionForm";
import {
  TemplateSidebar,
  QuestionFormHeader,
  AudioUploadSection,
  ListeningEditor,
  ReadingEditor,
  WritingEditor,
  GenericEditor,
  FormFooter,
} from "../components";

export function AddQuestionPage() {
  const form = useAddQuestionForm();
  const toast = useToast();

  useEffect(() => {
    if (form.oneQuestionError?.message) {
      toast.error(form.oneQuestionError.message);
    }
  }, [form.oneQuestionError, toast]);

  const moduleEditor = (() => {
    switch (form.selectedModule) {
      case "Listening":
  return (
          <ListeningEditor
            entries={form.listeningPartEntries}
            contents={form.listeningPartContents}
            onPartChange={form.setListeningPartContent}
          />
        );
      case "Reading":
  return (
          <ReadingEditor
            entries={form.readingPartEntries}
            contents={form.readingPartContents}
            onPassageChange={form.setReadingPartPassage}
            onQuestionsChange={form.setReadingPartQuestions}
          />
        );
      case "Writing":
        return (
          <WritingEditor
            entries={form.writingPartEntries}
            contents={form.writingPartContents}
            onPartChange={form.setWritingPartContent}
          />
        );
      default:
        return (
          <GenericEditor
            instruction={form.instruction}
            sourceMaterial={form.sourceMaterial}
            explanation={form.explanation}
            onInstructionChange={form.setInstruction}
            onSourceMaterialChange={form.setSourceMaterial}
            onExplanationChange={form.setExplanation}
          />
        );
    }
  })();

  return (
    <Layout>
      <AddQuestionPageRoot>
        <Box className="add-question-page">
          <Box className="add-question-page__hero">
            <TemplateSidebar
              isEditMode={form.isEditMode}
              lockedModule={form.lockedModule}
              selectedModule={form.selectedModule}
              selectedTemplateId={form.selectedTemplateId}
              onTemplateChange={form.handleTemplateChange}
            />

            <Box className="add-question-page__panel add-question-page__workspace">
              <Box className="add-question-form">
                {form.isEditMode && form.oneQuestionLoading && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress aria-label="Loading question" />
                  </Box>
                )}
                {form.isEditMode && !form.oneQuestionLoading && !form.oneQuestionFound && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Question not found or access denied.
                  </Alert>
                )}
                <QuestionFormHeader
                  isEditMode={form.isEditMode}
                  moduleLocked={Boolean(form.lockedModule)}
                  title={form.title}
                  selectedModule={form.selectedModule}
                  timeLimit={form.timeLimit}
                  onTitleChange={form.setTitle}
                  onModuleChange={form.handleModuleChange}
                  onTimeLimitChange={form.setTimeLimit}
                />

                <AudioUploadSection
                  selectedModule={form.selectedModule}
                  listeningAudioFileName={form.listeningAudioFile?.name ?? null}
                  listeningAudioPreviewSrc={form.listeningAudioPreviewSrc}
                  onListeningFileChange={form.setListeningAudioFile}
                />

                {moduleEditor}

                <FormFooter
                  answerMode={form.answerMode}
                  acceptedAnswers={form.acceptedAnswers}
                  errors={form.errors}
                  isBusy={form.isSaving || form.isUpdating}
                  isEditMode={form.isEditMode}
                  isSubmitDisabled={
                    form.isSaving ||
                    form.isUpdating ||
                    (form.isEditMode && (form.oneQuestionLoading || !form.oneQuestionFound))
                  }
                  onAcceptedAnswersChange={form.setAcceptedAnswers}
                  onSubmit={form.handleSubmit}
                  onCancel={form.handleCancel}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </AddQuestionPageRoot>
    </Layout>
  );
}
