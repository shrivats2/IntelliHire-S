"use client";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const buttonStyle = {
  "--clr": "#FF44CC",
  marginTop: "20px",
  marginBottom: "20px",
};
interface BasicFitQuestionsProps {
  params: {
    jobid: string;
  };
}
const BasicFitQuestions = ({ params }: BasicFitQuestionsProps) => {
  const user = useAuthStore((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<
    { id: string; answer_index: number }[]
  >([]);
  const router = useRouter();
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${params.jobid}/assessment/job-fit`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((res) => {
        setQuestions(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          router.push(`/job/${params.jobid}/assessment`);
        }
      });
  }, [mounted]);

  const handleChange = (questionId: any, answerIndex: any) => {
    const updatedAnswers: { id: string; answer_index: number }[] = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (a: any) => a.id === questionId
    );

    if (existingAnswerIndex !== -1) {
      updatedAnswers[existingAnswerIndex].answer_index = answerIndex;
    } else {
      updatedAnswers.push({ id: questionId, answer_index: answerIndex });
    }
    setAnswers(updatedAnswers);
  };

  const handleClick = () => {
    const isEveryQuestionAnswered = questions.every((ques: any) => {
      return answers.some((a: any) => a.id === ques.id);
    });

    if (!isEveryQuestionAnswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const body = {
      answers,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${params.jobid}/assessment/job-fit`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.is_passed) {
          router.push(`/job/${params.jobid}/assessment`);
        } else {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.detail ||
            "An error occured submitting the test"
        );
      });
  };

  return (
    <div>
      <div className="flex justify-center m-3">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text ">
          Basic Fit Questions
        </h1>
      </div>
      <div>
        <div className="flex justify-center m-3">
          <h2 className="text-2xl font-semibold bg-gradient-to-b from-primary/60 to-[#00ff5e] text-transparent bg-clip-text">
            Please answer the following questions to the best of your knowledge.
          </h2>
        </div>
        <div className="flex flex-col gap-8 m-5">
          {questions.map((ques: any, index) => {
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Question {index + 1} :</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-2 rounded-lg flex flex-wrap break-all border-2 border-green-600 font-bold">
                    {ques.question}
                  </div>
                  <div className="flex flex-col gap-3 mt-5">
                    <RadioGroup
                      onValueChange={(e: any) => {
                        handleChange(ques.id, parseInt(e, 10));
                      }}
                      name={ques.id.toString()}
                      className="flex flex-col space-y-1 "
                    >
                      {ques.choices?.map((option: any, optionIndex: number) => {
                        const uniqueId = uuidv4();
                        return (
                          <div
                            className="flex items-center space-x-2"
                            key={optionIndex}
                          >
                            <RadioGroupItem
                              className="cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                              value={optionIndex.toString()}
                              id={uniqueId}
                            />
                            <Label
                              className="cursor-pointer bg-secondary p-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
                              htmlFor={uniqueId}
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center p-5">
        <Button onClick={handleClick}>Submit</Button>
      </div>
    </div>
  );
};

export default BasicFitQuestions;
