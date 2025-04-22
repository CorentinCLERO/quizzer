import { z } from "zod";

const SingleChoiceAnswersSchema = z.array(
  z.object({
    text: z.string().min(1, "Text cannot be empty."),
    isCorrect: z.boolean(),
  })
);

const MultipleChoiceAnswersSchema = z.array(
  z.object({
    text: z.string().min(1, "Text cannot be empty."),
    isCorrect: z.boolean(),
  })
);

const MatchingAnswersSchema = z.array(
  z.object({
    left: z.string().min(1, "Left side cannot be empty."),
    right: z.string().min(1, "Right side cannot be empty."),
  })
);

const OrderingAnswersSchema = z.array(
  z.object({
    text: z.string().min(1, "Text cannot be empty."),
    correctIndex: z.number(),
  })
);

const TextAnswersSchema = z.object({
  correctAnswer: z.string().min(1, "Correct answer cannot be empty."),
  caseSensitive: z.boolean().optional(),
  allowPartial: z.boolean().optional(),
});

const TrueFalseAnswersSchema = z.object({
  isTrue: z.boolean(),
});

export const AnswersSchema = z.union([
  SingleChoiceAnswersSchema,
  MultipleChoiceAnswersSchema,
  MatchingAnswersSchema,
  OrderingAnswersSchema,
  TextAnswersSchema,
  TrueFalseAnswersSchema,
]);