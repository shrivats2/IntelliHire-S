"use client";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperFooter,
  StepperItem,
  useStepper,
} from "@/components/ui/stepper";
import { useEffect, useState } from "react";
import Step1 from "./_components/step1";
import useCreateJob from "@/store/useCreateJob";
import "./_components/styles.css";
import { toast } from "sonner";
import Step2 from "./_components/step2";
import Step3 from "./_components/step3";
import Link from "next/link";
import useAuthStore from "@/store/useUserContext";
import { notFound, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const StepperDemo = () => {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };
  const steps = [
    {
      id: 0,
      label: "Add Job Decription",
      content: <Step1 />,
    },
    {
      id: 1,
      label: "Generate Basic Fit Questions",
      content: <Step2 />,
    },
    {
      id: 2,
      label: "Add Weights",
      content: <Step3 />,
    },
  ];
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps} labelOrientation={"vertical"}>
        {steps.map((step, index) => {
          return <StepperItem key={step.id}>{step.content}</StepperItem>;
        })}
        <StepperFooter>
          <MyStepperFooter />
        </StepperFooter>
      </Stepper>
    </div>
  );
};

function MyStepperFooter() {
  const {
    activeStep,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
    nextStep,
    prevStep,
    resetSteps,
    steps,
  } = useStepper();

  const title = useCreateJob((state) => state.job_title);
  const description = useCreateJob((state) => state.job_description);
  const questions = useCreateJob((state) => state.questions_added);
  const handleNext = () => {
    if (title === "" || description === "") {
      toast.error("Job Title and Description is required");
    } else if (questions.length === 0 && activeStep == 1) {
      toast.error("Add some questions for initial screening.");
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {activeStep === steps.length ? (
        <>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </>
      ) : (
        <>
          <Button disabled={isDisabledStep} onClick={prevStep}>
            Prev
          </Button>
          <Button className={isLastStep ? "hidden" : ""} onClick={handleNext}>
            {isLastStep ? "Post" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
    </div>
  );
}

const CreateJob = () => {
  const router = useRouter();
  const isUser = useAuthStore((state) => state.user);
  const [loading, setisLoading] = useState(true);
  useEffect(() => {
    setisLoading(false);
    if (
      loading === false &&
      isUser &&
      (isUser.access_token === "" || isUser.role === "applicant")
    ) {
      notFound();
      return;
    }
  }, [isUser]);
  return (
    isUser.access_token !== "" &&
    isUser.role !== "applicant" && (
      <>
        <Breadcrumb className="ml-5 mt-3">
          <BreadcrumbList>
            <BreadcrumbItem className="text-md">
              <BreadcrumbLink>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-md">
              <BreadcrumbLink>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-md">
              <BreadcrumbPage>
                <Link href="/create-job">Create-Job</Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="p-5 lg:p-10 xl:p-10 2xl:p-10">
          <div className="flex justify-center p-5 font-bold text-2xl">
            <h1 className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text text-4xl">
              Create a Job Posting
            </h1>
          </div>
          <div className="relative h-4 mb-7 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
          <StepperDemo />
        </div>
      </>
    )
  );
};

export default CreateJob;
