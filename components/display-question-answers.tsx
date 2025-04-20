import { answersStateType, selectedIndexType } from "@/app/quiz/start/page";
import { Question, SingleChoiceAnswers } from "@/types";
import React from "react";
import { Button } from "./ui/button";

function DisplayQuestionAnswers({
  question,
  answersState,
  selectedIndex,
  setSelectedIndex,
}: {
  question: Question;
  answersState: answersStateType;
  selectedIndex: selectedIndexType;
  setSelectedIndex: React.Dispatch<React.SetStateAction<selectedIndexType>>;
}) {
  if (question.type === "SINGLE_CHOICE") {
    return (
      <div className="space-y-3">
        {question.type === "SINGLE_CHOICE" &&
          (question.answers as SingleChoiceAnswers[]).map(
            (answer: SingleChoiceAnswers, index: number) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full text-left justify-start h-auto py-3 px-4 ${
                  answersState !== null && answersState.index === index
                    ? answersState.questionAnswer === undefined // loading
                      ? "!bg-gray-500"
                      : (
                          answersState.questionAnswer as SingleChoiceAnswers[]
                        ).find(
                          (answerState) => answerState.text === answer.text
                        )?.isCorrect === true
                      ? "!bg-green-500"
                      : (
                          answersState.questionAnswer as SingleChoiceAnswers[]
                        ).find(
                          (answerState) => answerState.text === answer.text
                        )?.isCorrect === false
                      ? "!bg-red-500"
                      : ""
                    : ""
                } ${
                  answersState === null &&
                  selectedIndex === index &&
                  "!bg-white text-black"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {answer.text}
              </Button>
            )
          )}
      </div>
    );
  }
}

export default DisplayQuestionAnswers;
