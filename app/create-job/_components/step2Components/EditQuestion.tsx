"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateJob from "@/store/useCreateJob";
import { ElementRef, useRef, useState } from "react";
import { validateQuestion } from "./validate";
import { toast } from "sonner";

export default function EditQuestionModal({ question, open, onClose }: any) {
  const [editedQuestion, setEditedQuestion] = useState(question);
  const updateQ = useCreateJob((state) => state.updateQuestion);

  //console.log(question);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setEditedQuestion({
      ...editedQuestion,
      [name]: value,
    });
  };

  const handleOptionChange = (
    index: number,
    optionName: any,
    optionValue: any
  ) => {
    const updatedOptions = [...editedQuestion.quiz_question_options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [optionName]: optionValue,
    };
    setEditedQuestion({
      ...editedQuestion,
      quiz_question_options: updatedOptions,
    });
  };

  const handleSave = () => {
    const validationError = validateQuestion(editedQuestion);
    if (validationError) {
      toast.error(`${validationError}`);
      return;
    }

    const body = { question: "", quiz_question_options: [] };
    if (question.question !== editedQuestion.question) {
      body.question = editedQuestion.question;
    }
    const mods: any = [];
    editedQuestion.quiz_question_options.forEach((opt: any, index: number) => {
      const edOption = question.quiz_question_options[index];
      if (opt.option !== edOption.option || opt.answer !== edOption.answer) {
        mods.push(opt);
      }
    });

    if (mods.length > 0) {
      body.quiz_question_options = mods;
    }

    updateQ(editedQuestion.quiz_id, editedQuestion);
    toast.success("Question updated successfully");
    onClose();
  };
  return (
    <Dialog key={question.quiz_id} open={open}>
      <DialogTrigger asChild>
        <Button className="hidden" variant="outline">
          Edit Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Make changes to question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <Label htmlFor="question" className="">
            Question
          </Label>
          <Input
            id="question"
            name="question"
            value={editedQuestion.question}
            onChange={handleInputChange}
            className=""
          />
        </div>
        {editedQuestion.quiz_question_options.map(
          (option: any, index: number) => (
            <div>
              <Label htmlFor={`option ${index + 1}`} className="text-right">
                Option {index + 1}
              </Label>
              <Input
                id={`option ${index + 1}`}
                value={option.option}
                className="col-span-3"
                onChange={(e) =>
                  handleOptionChange(index, "option", e.target.value)
                }
              />
              <div className="flex items- gap-2 mt-3">
                <Checkbox
                  checked={option.answer}
                  onCheckedChange={(checked: any) =>
                    handleOptionChange(index, "answer", checked)
                  }
                  id={`correct-answer ${index + 1}`}
                />
                <label
                  htmlFor={`correct-answer ${index + 1}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Correct
                </label>
              </div>
            </div>
          )
        )}

        <DialogFooter>
          <DialogClose onClick={onClose} asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSave} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
