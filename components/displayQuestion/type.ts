import { Difficulty, QuestionType } from "@/types";

export interface QuizQuestion {
  id: string;
  text: string;
  answers: QuizQuestionAnswers;
  difficulty: Difficulty;
  type: QuestionType;
}

interface SingleChoiceAnswers {
  text: string;
}

interface MultipleChoiceAnswers {
  text: string;
}

interface MatchingAnswers {
  left: string;
  right: string;
}

interface OrderingAnswers {
  text: string;
}

interface TextAnswers {
  correctAnswer: string;
  caseSensitive?: boolean;
  allowPartial?: boolean;
}

interface TrueFalseAnswers {
  isTrue: boolean;
}

export type QuizQuestionAnswers =
  | SingleChoiceAnswers
  | MultipleChoiceAnswers[]
  | MatchingAnswers[]
  | OrderingAnswers[]
  | TextAnswers
  | TrueFalseAnswers;
