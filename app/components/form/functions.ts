import { QuestionType } from "@/types";

export  function answersInitialisation(type: QuestionType) {
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
          correctAnswer: "",
        };
      case "TRUE_FALSE":
        return {
          isTrue: true,
        };
    }
  }