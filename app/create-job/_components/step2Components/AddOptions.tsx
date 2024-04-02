"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Delete, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AddOptions = ({ questionData, setQuestionData }: any) => {
  const handleAddOption = () => {
    setQuestionData((prevState: any) => ({
      ...prevState,
      quiz_question_options: [
        ...prevState.quiz_question_options,
        { option: "", answer: false },
      ],
    }));
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = questionData.quiz_question_options.filter(
      (_: any, i: number) => i !== index
    );
    setQuestionData((prevState: any) => ({
      ...prevState,
      quiz_question_options: updatedOptions,
    }));

    console.log(questionData);
  };
  const handleOptionChange = (index: number, field: any, value: string) => {
    const updatedOptions = [...questionData.quiz_question_options];
    updatedOptions[index][field] = value;
    setQuestionData((prevState: any) => ({
      ...prevState,
      quiz_question_options: updatedOptions,
    }));
  };
  return (
    <div className="mt-5">
      {questionData.quiz_question_options?.map((opt: any, index: number) => {
        const id = uuidv4();
        return (
          <div key={index} className="mt-3 ">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                value={opt.option}
                onChange={(e) =>
                  handleOptionChange(index, "option", e.target.value)
                }
                type="text"
                placeholder={`Option ${index + 1}`}
              />
              <Checkbox
                checked={opt.answer || false}
                onCheckedChange={(checked: any) =>
                  handleOptionChange(index, "answer", checked)
                }
                id={`correct-answer ${id}`}
              />
              <label
                htmlFor={`correct-answer ${id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Correct
              </label>
              <Button
                variant="outline"
                size="icon"
                className="w-[50px] bg-muted/50 border"
                onClick={() => handleDeleteOption(index)}
              >
                <Trash2 className="m-2" color="red" />
              </Button>
            </div>
          </div>
        );
      })}
      <Button className="mt-3" onClick={handleAddOption} variant="outline">
        Add Option
      </Button>
    </div>
  );
};

export default AddOptions;
