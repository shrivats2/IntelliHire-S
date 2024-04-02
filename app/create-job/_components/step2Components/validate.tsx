import { z, ZodError } from "zod";

const questionOptionSchema = z.object({
  option: z.string().refine((val) => val.trim() !== "", {
    message: "Option cannot have an empty description.",
  }),
  answer: z.boolean(),
});

const questionSchema = z.object({
  question: z.string().refine((val) => val.trim() !== "", {
    message: "Question cannot have an empty description.",
  }),
  quiz_question_options: z.array(questionOptionSchema),
  quiz_id: z.string(),
});

export const validateQuestion = (questionData: any) => {
  try {
    questionSchema.parse(questionData);

    const hasAnswer = questionData.quiz_question_options.some(
      (option: any) => option.answer === true
    );

    const hasOneCorrectAnswer = () => {
      const correctAnswers = questionData.quiz_question_options.filter(
        (option: any) => option.answer === true
      ).length;
      return correctAnswers === 1;
    };

    if (!hasAnswer) {
      return "Please select at least one option as the answer";
    }
    if (!hasOneCorrectAnswer()) {
      return "Question cannot have more than one correct answer";
    }

    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      if (firstError && firstError.path[0] === "quiz_question_options") {
        return firstError.message;
      }
    }
    return "Invalid question data";
  }
};
