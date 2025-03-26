import { SingleChoiceAnswers } from "@/types";
import { useQuestionContext } from "./providers/question-provider";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

export default function AnswersForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  const changeSingleChoiceValue = (
    valueType: string,
    value: string | boolean,
    index: number
  ) => {
    if (valueType === "text")
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: prev.answers.map(
          (answer: SingleChoiceAnswers, answerIndex: number) =>
            answerIndex === index ? { ...answer, text: value } : answer
        ),
      }));
    else if (valueType === "isCorrect" && value === true)
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: prev.answers.map(
          (answer: SingleChoiceAnswers, answerIndex: number) =>
            answerIndex === index
              ? { ...answer, isCorrect: true }
              : { ...answer, isCorrect: false }
        ),
      }));
  };

  if (questionToAdd.type === "SINGLE_CHOICE") {
    const singleChoiceAnswers = questionToAdd.answers as SingleChoiceAnswers[];
    return (
      <>
        {singleChoiceAnswers.map(
          (answer: SingleChoiceAnswers, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <Input
                type="text"
                placeholder={`Answer ${index + 1}`}
                onChange={(e) => {
                  changeSingleChoiceValue("text", e.target.value, index);
                }}
                value={answer.text}
              />
              <Switch
                id={`answer${index}`}
                checked={answer.isCorrect}
                onCheckedChange={(e) =>
                  changeSingleChoiceValue("isCorrect", e.valueOf(), index)
                }
              />
            </div>
          )
        )}
        <Button />
      </>
    );
  }
}
