import { Question, SingleQuestionAnswer } from "@/types";
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
  data: SingleQuestionAnswer,
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
