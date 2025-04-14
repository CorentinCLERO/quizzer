export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "SINGLE_CHOICE"
  | "TRUE_FALSE"
  | "TEXT"
  | "MATCHING"
  | "ORDERING";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Explanation {
  short: string;
  long?: string;
  resources?: string[];
}

export interface SingleChoiceAnswers {
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceAnswers {
  text: string;
  isCorrect: boolean;
}

export interface MatchingAnswers {
  left: string;
  right: string;
}

export interface OrderingAnswers {
  text: string;
  correctIndex: number;
}

export interface TextAnswers {
  correctAnswer: string;
  caseSensitive?: boolean;
  allowPartial?: boolean;
}

export interface TrueFalseAnswers {
  isTrue: boolean;
}

export type QuestionAnswers =
  | SingleChoiceAnswers[]
  | MultipleChoiceAnswers[]
  | MatchingAnswers[]
  | OrderingAnswers[]
  | TextAnswers
  | TrueFalseAnswers;

export type SingleQuestionAnswer =
  | SingleChoiceAnswers
  | MultipleChoiceAnswers
  | MatchingAnswers
  | OrderingAnswers
  | TextAnswers
  | TrueFalseAnswers;

export interface Question {
  id: string;
  text: string;
  explanation?: Explanation;
  answers: QuestionAnswers;
  difficulty: Difficulty;
  type: QuestionType;
  hint?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
}

export interface QuestionFormValues {
  text: string;
  explanation: {
    short: string;
    long: string;
    resources: string[];
  };
  answers: QuestionAnswers;
  difficulty: Difficulty;
  type: QuestionType;
  hint: string;
  category: {
    id?: string;
    name: string;
  };
  tags: Array<{
    id?: string;
    name: string;
  }>;
}
