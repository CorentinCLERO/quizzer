"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Difficulty, Explanation, QuestionAnswers } from "@/types";
import { QuestionType } from "@prisma/client";

interface QuestionForm {
  text: string;
  explanation?: Explanation;
  answers: QuestionAnswers;
  difficulty: Difficulty;
  type: QuestionType;
  hint?: string;
}

interface QuestionContextProps {
  questionToAdd: QuestionForm;
  setQuestionToAdd: React.Dispatch<React.SetStateAction<QuestionForm>>;
}

const QuestionContext = createContext<QuestionContextProps | undefined>(
  undefined
);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questionToAdd, setQuestionToAdd] = useState<QuestionForm>({
    text: "",
    explanation: {
      short: "",
      long: "",
      resources: [],
    },
    answers: answersInitialisation("SINGLE_CHOICE"),
    difficulty: "MEDIUM",
    type: "SINGLE_CHOICE",
    hint: "",
  });

  useEffect(() => {
    setQuestionToAdd(prev => ({
      ...prev,
      answers: answersInitialisation(questionToAdd.type),
    }));
  }, [questionToAdd.type])

  function answersInitialisation(type: QuestionType) {
    switch (type) {
      case "SINGLE_CHOICE":
        return [
          {
            text: "",
            isCorrect: true,
          },
          {
            text: "",
            isCorrect: false,
          },
        ];
      case "MULTIPLE_CHOICE":
        return [
          {
            text: "",
            isCorrect: true,
          },
          {
            text: "",
            isCorrect: true,
          },
        ];
      case "MATCHING":
        return [
          {
            left: "",
            right: "",
          },
        ];
      case "ORDERING":
        return [
          {
            text: "",
            correctIndex: 0,
          },
          {
            text: "",
            correctIndex: 1,
          },
        ];
      case "TEXT":
        return {
          correctAnswer: '',
        };
      case "TRUE_FALSE":
        return {
          isTrue: true,
        };
    }
  };

  return (
    <QuestionContext.Provider value={{ questionToAdd, setQuestionToAdd }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error(
      "useQuestionContext must be used within a QuestionProvider"
    );
  }
  return context;
};
