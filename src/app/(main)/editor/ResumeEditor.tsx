"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSaveResume from "./useAutoSaveResume";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}
const ResumeEditor = ({ resumeToEdit }: ResumeEditorProps) => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {},
  );

  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);
  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;
  //Looks for the step parameter in the URL. If step is not found, it defaults to the first step

  function setStep(key: string) {
    //key comes from breadcrumb page
    //this function Update the step parameter in the URL without refreshing the page.
    const newSearchParams = new URLSearchParams(searchParams); //copy the previous search params

    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`); //we could have used userouter to push to url but this way is much faster becuase router makes a request to server which takes a moment
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        isSaving={isSaving} //useAutoSaveResume where it takes 1500ms to check if there are any changes
      />
    </div>
  );
};

export default ResumeEditor;
