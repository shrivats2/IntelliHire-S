"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MessageCircleQuestion, Plus, Sparkles } from "lucide-react";
import AddOptions from "./step2Components/AddOptions";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useCreateJob from "@/store/useCreateJob";
import QuizQuestions from "./step2Components/QuizQuestions";
import { validateQuestion } from "./step2Components/validate";
import { toast } from "sonner";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";

const initialState = {
  question: "",
  quiz_question_options: [],
};

const Step2 = () => {
  const user = useAuthStore((state) => state.user);
  const [questionData, setQuestionData] = useState(initialState);
  const addQuestions = useCreateJob((state) => state.setQuestions);
  const [loading, setLoading] = useState(false);

  const desc = useCreateJob((state) => state.job_description);
  const allQuestions = useCreateJob((state) => state.questions_added);
  const questionsOnly = allQuestions
    .filter((item) => item.question)
    .map((item) => item.question);

  const setQuestion = useCreateJob((state) => state.setQuestions);

  const handleSubmit = () => {
    // e.preventDefault();

    // if (questions.length >= 10) {
    //   setOpenDialog(true);
    //   return;
    // }

    const newQuestionData = {
      ...questionData,
      quiz_id: uuidv4(),
    };

    const validationError = validateQuestion(newQuestionData);
    if (validationError) {
      toast.error(`${validationError}`);
      return;
    }

    setQuestionData(initialState);
    addQuestions([newQuestionData]);
  };

  const handleClick = async () => {
    try {
      setLoading(true);

      const cleanText = desc.replace(/<\/?[^>]+(>|$)/g, "");
      const requestData = {
        job_description: cleanText,
        exclude_ques: questionsOnly,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prompt/job-fit`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      const generatedQuestions = JSON.parse(
        response.data.data
      ).quiz_questions.map((question: any) => ({
        ...question,
        quiz_id: uuidv4(),
      }));

      setQuestion(generatedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error(
        "Unable to generate questions at the moment. Please consider adding questions manually."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-8">
      <div className="flex justify-center m-5">
        <button
          onClick={handleClick}
          className="btn "
          type="button"
          disabled={loading}
        >
          <div className="txt">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Sparkles color="white" />
                Generate Questions
              </>
            )}
          </div>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
      </div>
      <div className="bg-muted/50 border rounded-lg py-12 flex flex-col justify-center">
        <div className="flex flex-col items-center w-full gap-3">
          <Label
            className="text-4xl font-bold ml-4 flex items-baseline flex-wrap"
            htmlFor="question"
          >
            <MessageCircleQuestion />
            &nbsp;
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Add &nbsp;
            </span>
            Question
          </Label>
          <Input
            value={questionData.question}
            onChange={(e) =>
              setQuestionData((prevState) => ({
                ...prevState,
                question: e.target.value,
              }))
            }
            className="w-[90%] border-green-600"
            type="text"
            id="question"
            placeholder="Question"
          />
        </div>
        <div className="ml-[15px] sm:ml-[35px] md:ml-[45px] lg:ml-[45px] xl:ml-[65px] 2xl:ml-[65px]">
          <AddOptions
            questionData={questionData}
            setQuestionData={setQuestionData}
          />
          <Button
            onClick={handleSubmit}
            className="mt-5 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <Plus />
            Add Question
          </Button>
        </div>
      </div>
      <QuizQuestions />
    </div>
  );
};

export default Step2;
