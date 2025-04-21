import { Question } from "@/types";
import { toast } from "sonner";

export async function fetchQuestion(
  params: URLSearchParams | null
): Promise<Question> {
  const apiUrl = `/api/questions/quiz?${params?.toString()}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function fetchQuestionHint({
  id,
}: {
  id: Question["id"];
}): Promise<Question["hint"]> {
  const apiUrl = `/api/questions/quiz/hint/${id}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function fetchQuestionExplanation({
  id,
}: {
  id: Question["id"];
}): Promise<Question["explanation"]> {
  const apiUrl = `/api/questions/quiz/explanation/${id}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function postAnswer(
  data: QuestionAnswers,
  id: Question["id"],
  questionType: Question["type"],
  asUseHint: boolean
) {
  const response = await fetch(`/api/questions/quiz/${id}/${questionType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: data, asUseHint }),
  });

  if (!response.ok) {
    toast.warning("Failed to find the answer");
    throw new Error("Failed to find the answer");
  }

  return response.json();
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

type QuestionAnswers =
  | SingleChoiceAnswers
  | MultipleChoiceAnswers[]
  | MatchingAnswers[]
  | OrderingAnswers[]
  | TextAnswers
  | TrueFalseAnswers;
