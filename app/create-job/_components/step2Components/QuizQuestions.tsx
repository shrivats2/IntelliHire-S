"use client";
import useCreateJob from "@/store/useCreateJob";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Cross, Ticket, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditQuestionModal from "./EditQuestion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface QuestionType {
  quiz_id: number;
  question: String;
  quiz_question_options: [];
}

const QuizQuestions = ({ updateQuizQuestion }: any) => {
  const quiz_questions = useCreateJob((state) => state.questions_added);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(
    null
  );
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const deleteQ = useCreateJob((state) => state.deleteQuestion);

  const handleEdit = (question: any) => {
    setSelectedQuestion(question);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedQuestion(null);
    setOpen(false);
  };

  const handleDelete = (question: any) => {
    setSelectedQuestion(question);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (selectedQuestion !== null && "quiz_id" in selectedQuestion) {
      deleteQ(selectedQuestion.quiz_id);
    }
    setDeleteConfirmationOpen(false);
    toast.success("Question deleted successfully");
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };
  return (
    <div className="flex flex-col gap-5 mt-5">
      {quiz_questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Question {index + 1} :</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary p-2 rounded-lg flex flex-wrap break-all border-2 border-green-600 font-bold">
              {question.question}
            </div>
            <div className="flex flex-col gap-3 mt-5">
              {question.quiz_question_options?.map(
                (option: any, optionIndex: number) => (
                  <div
                    key={optionIndex}
                    className="bg-secondary p-2 rounded-lg"
                  >
                    {option.answer ? (
                      <div className="flex gap-4">
                        <div className="text-green break-all">
                          {option.option}
                        </div>
                        <Check
                          className="bg-[#00800054] rounded-full"
                          color="green"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="text-red break-all">
                          {option.option}
                        </div>
                        <X
                          className="bg-[#ff000038] rounded-full"
                          color="red"
                        />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button variant="outline" onClick={() => handleEdit(question)}>
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(question)}
              variant="ghost"
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
      {selectedQuestion && (
        <EditQuestionModal
          question={selectedQuestion}
          open={open}
          onClose={handleClose}
        />
      )}

      <AlertDialog open={deleteConfirmationOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden" variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizQuestions;
