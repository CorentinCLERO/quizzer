"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Question,
  SingleQuestionAnswer,
  SingleChoiceAnswers,
  QuestionAnswers,
} from "@/types";
import { CircleHelp, Loader2 } from "lucide-react";
import ExplanationDrawer from "@/components/explanation-drawer";
import DisplayQuestionAnswers from "@/components/display-question-answers";

async function fetchQuestion(
  params: URLSearchParams | null
): Promise<Question> {
  const apiUrl = `/api/questions/quiz?${params?.toString()}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

async function fetchQuestionHint({
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

async function fetchQuestionExplanation({
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

export type answersStateType = {
  questionAnswer: QuestionAnswers | undefined;
  index: number;
} | null;

export type selectedIndexType = number | number[] | null;

async function postAnswer(
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

export default function QuizStartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersState, setAnswerState] = useState<answersStateType>(null);
  const [selectedIndex, setSelectedIndex] = useState<selectedIndexType>(null);

  const queryClient = useQueryClient();

  const {
    data: question,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quizQuestion", searchParams?.toString()],
    queryFn: () => fetchQuestion(searchParams),
  });

  const { data: questionHint, isLoading: hintIsLoading } = useQuery({
    queryKey: ["quizQuestionHint", question?.id],
    queryFn: () => fetchQuestionHint({ id: question?.id ?? "" }),
    enabled: showHint,
    staleTime: 3_600_000,
  });

  const { data: questionExplanation, isLoading: explanationIsLoading } =
    useQuery({
      queryKey: ["quizQuestionExplanation", question?.id],
      queryFn: () => fetchQuestionExplanation({ id: question?.id ?? "" }),
      enabled: showExplanation,
      staleTime: 3_600_000,
    });

  const mutation = useMutation({
    mutationFn: async (data: SingleQuestionAnswer) =>
      question
        ? postAnswer(data, question.id, question.type, !questionHint)
        : Promise.reject("No question available"),
  });

  useEffect(() => {
    if (isError) {
      toast.error((error as Error).message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No questions found</h2>
        <p className="mb-6">Try different filters to find questions.</p>
        <Button onClick={() => router.push("/quiz")}>Back to Quiz Setup</Button>
      </div>
    );
  }

  const handleAnswer = async (answer: SingleChoiceAnswers) => {
    if (answersState) return;
    setAnswerState({
      questionAnswer: undefined,
      index: selectedIndex as number,
    });
    const { data }: { data: QuestionAnswers } = await mutation.mutateAsync(
      answer
    );
    setAnswerState({ questionAnswer: data, index: selectedIndex as number });
  };

  const moveToNextQuestion = async () => {
    setShowExplanation(false);
    setShowHint(false);
    await refetch();
    queryClient.removeQueries({
      queryKey: ["quizQuestionExplanation", question?.id],
    });
    queryClient.removeQueries({
      queryKey: ["quizQuestionHint", question?.id],
    });
    setAnswerState(null);
    setSelectedIndex(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-4 flex-1 flex flex-col">
      <div className="flex justify-between mb-4">
        <span>
          {question.type
            .split("_")
            .map(
              (t) =>
                t.charAt(0).toUpperCase() + String(t).slice(1).toLowerCase()
            )
            .join(" ")}
        </span>
        <span>
          {question.difficulty.charAt(0).toUpperCase() +
            String(question.difficulty).slice(1).toLowerCase()}
        </span>
      </div>
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <DisplayQuestionAnswers
        question={question}
        answersState={answersState}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      {!answersState && (
        <div className="space-y-4">
          <Button
            onClick={() => setShowHint((prev) => !prev)}
            variant="secondary"
          >
            <CircleHelp /> Hint
          </Button>
          {showHint &&
            (hintIsLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div>{questionHint}</div>
            ))}
        </div>
      )}
      {answersState && (
        <ExplanationDrawer
          explanation={questionExplanation}
          setShowExplanation={setShowExplanation}
          loading={explanationIsLoading}
        />
      )}
      {answersState && (
        <div className="pb-6 items-end flex flex-1">
          <Button className="w-full" onClick={moveToNextQuestion}>
            Next Question
          </Button>
        </div>
      )}
      {!answersState && selectedIndex !== null && (
        <div className="pb-6 items-end flex flex-1">
          <Button
            className="w-full"
            onClick={() =>
              handleAnswer(
                (question.answers as SingleChoiceAnswers[])[
                  selectedIndex as number
                ]
              )
            }
          >
            Validate
          </Button>
        </div>
      )}
    </div>
  );
}
