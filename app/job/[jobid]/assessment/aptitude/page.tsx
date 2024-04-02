"use client";

import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useUserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface QuizProps {
  params: {
    jobid: string;
  };
}
const Quiz = ({ params }: QuizProps) => {
  const [questions, setQuestions] = useState([]);
  const user = useAuthStore((state) => state.user);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30000);
  const id = params.jobid;
  const [data, setData] = useState<any | []>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job/${id}/assessment/aptitude`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );
        const initialData = response.data.data.map((question: any) => ({
          id: question.id,
          answer_index: null, // Initially, no answer is selected
        }));
        setData(initialData);
        setQuestions(response.data.data);
      } catch (error: any) {
        console.error("Error fetching questions:", error.message);
        if (error.response.status === 400) {
          router.push(`/job/${id}/assessment`);
        }
        if (error.response.status === 307) {
          router.push(error.response.data.redirect_url);
        }
      }
    };

    fetchQuestions();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      handleNextQuestion();
    }
  }, [secondsLeft]);

  const handleAnswerSelection = (
    questionId: string,
    selectedChoice: number
  ) => {
    const updatedData = data.map((item: any) => {
      if (item.id === questionId) {
        return { ...item, answer_index: selectedChoice };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSecondsLeft(30);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit: any = async () => {
    try {
      const payload = { answers: data };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${id}/assessment/aptitude`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      router.push(`/job/${id}/assessment`);
    } catch (error: any) {
      if (error.response.status == 400) {
        toast.info("Already attempted this part .");
        router.push(`/job/${id}/assessment`);
      }
      console.error("Error posting data:", error);
    }
  };

  const currentQuestion: { question: string; id: string; choices: [] } =
    questions[currentQuestionIndex];

  return (
    <>
      <div className="nine" style={{ padding: "40px" }}>
        <h1>
          Skill Assessment
          <span>Unlock Your Potential: Discover, Develop, Excel!</span>
        </h1>
      </div>
      <div className="quiz-container">
        <div className="timer">
          <svg
            style={{ width: "40px", height: "40px" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
              clipRule="evenodd"
            />
          </svg>

          <span className="timer-left">
            Time left ~
            <span
              className="timer"
              style={{ color: "red", fontStyle: "oblique", fontSize: "20px" }}
            >
              {secondsLeft} seconds
            </span>
          </span>
        </div>
        {currentQuestion && (
          <div key={currentQuestion.id} className="question-container">
            <h3 className="question">
              Q{currentQuestionIndex + 1}-{currentQuestion.question}
            </h3>
            <ul className="choices">
              {currentQuestion.choices.map((choice, index) => (
                <li key={index} className="choice">
                  <input
                    type="radio"
                    id={choice}
                    name={currentQuestion.id}
                    value={choice}
                    onChange={() =>
                      handleAnswerSelection(currentQuestion.id, index)
                    }
                  />
                  <label htmlFor={choice}>{choice}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <Button className="next-button" onClick={handleNextQuestion}>
            Next
          </Button>
        ) : (
          <Button className="submit-button" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </>
  );
};

export default Quiz;
