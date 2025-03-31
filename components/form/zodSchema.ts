import { z } from "zod";

const SingleChoiceAnswersSchema = z.array(
  z.object({
    text: z.string(),
    isCorrect: z.boolean(),
  })
);

const MultipleChoiceAnswersSchema = z.array(
  z.object({
    text: z.string(),
    isCorrect: z.boolean(),
  })
);

const MatchingAnswersSchema = z.array(
  z.object({
    left: z.string(),
    right: z.string(),
  })
);

const OrderingAnswersSchema = z.array(
  z.object({
    text: z.string(),
    correctIndex: z.number(),
  })
);

const TextAnswersSchema = z.object({
  correctAnswer: z.string(),
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