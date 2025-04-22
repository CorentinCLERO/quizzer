import { QuestionAnswers } from "./questions";

export type UserRole = "ADMIN" | "CREATOR" | "PARTICIPANT";

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAnswer {
  id: number;
  userId: number;
  questionId: number;
  answer: QuestionAnswers;
  //   MULTIPLE_CHOICE: { selectedOptions: number[] }
  //   MATCHING: { matches: { leftId: number, rightId: number }> }
  //   ORDERING: { order: number[] }
  //   TEXT: { text: string }
  //   SINGLE_CHOICE: { options: MultipleChoiceAnswer[] }
  //   TRUE_FALSE: { isTrue: boolean }
  // }
  isCorrect: boolean;
  createdAt: Date;
}
