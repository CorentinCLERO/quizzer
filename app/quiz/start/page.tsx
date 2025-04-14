"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question, SingleQuestionAnswer, SingleChoiceAnswers } from "@/types";
import { BookOpenText, CircleHelp } from "lucide-react";

async function fetchQuestion(
  params: URLSearchParams | null
): Promise<Question> {
  const apiUrl = "/api/questions/quiz?" + params?.toString();
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

async function postAnswer(
  data: SingleQuestionAnswer,
  id: string,
  questionType: string
) {
  const response = await fetch(`/api/questions/quiz/${id}/${questionType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.warning("Failed to find the answer");
    throw new Error("Failed to find the answer");
  }

  return response.json();
}

export default function QuizStartPage() {
  const searchParams = useSearchParams();

  const {
    data: question,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quizQuestion", searchParams?.toString()],
    queryFn: () => fetchQuestion(searchParams),
  });

  const router = useRouter();
  const [answer, setAnswer] = useState<SingleQuestionAnswer>(
    {} as SingleQuestionAnswer
  );
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersState, setAnswerState] = useState<{
    state: string;
    index: number;
  } | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: SingleQuestionAnswer) =>
      question
        ? postAnswer(data, question.id, question.type)
        : Promise.reject("No question available"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] });
    },
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

  const handleAnswer = async (answer: SingleQuestionAnswer, index: number) => {
    setAnswer(answer);
    setAnswerState({ state: "loading", index });

    const { data } = await mutation.mutateAsync(answer);

    console.log(data);

    setAnswerState({ state: JSON.stringify(data.isCorrect), index });

    // Logic to check correct answer would be here
    // This is simplified and would need to be adjusted based on question types
  };

  // const moveToNextQuestion = () => {
  //   setShowExplanation(false);

  //   if (currentQuestion < questions.length - 1) {
  //     setCurrentQuestion(currentQuestion + 1);
  //   } else {
  //     setQuizComplete(true);
  //     // Calculate final score
  //     // This would need actual logic based on correct answers
  //     const calculatedScore = Object.keys(answers).length;
  //     setScore(calculatedScore);
  //   }
  // };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between mb-4">
              <span>
                {question.type
                  .split("_")
                  .map(
                    (t) =>
                      t.charAt(0).toUpperCase() +
                      String(t).slice(1).toLowerCase()
                  )
                  .join(" ")}
              </span>
              <span>
                {question.difficulty.charAt(0).toUpperCase() +
                  String(question.difficulty).slice(1).toLowerCase()}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-4">{question.text}</h2>

            <div className="space-y-3">
              {question.type === "SINGLE_CHOICE" &&
                (question.answers as SingleChoiceAnswers[]).map(
                  (answer: SingleChoiceAnswers, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full text-left justify-start h-auto py-3 px-4 ${
                        answersState?.index === index
                          ? answersState?.state === "loading"
                            ? "!bg-gray-500"
                            : answersState?.state === "true"
                            ? "!bg-green-500"
                            : answersState?.state === "false"
                            ? "!bg-red-500"
                            : ""
                          : ""
                      }`}
                      onClick={() => handleAnswer(answer, index)}
                    >
                      {answer.text}
                    </Button>
                  )
                )}
            </div>
            {question.hint && !answersState && (
              <div className="space-y-4">
                <Button onClick={() => setShowHint((prev) => !prev)}>
                  <CircleHelp /> Hint
                </Button>
                {showHint && <div>{question.hint}</div>}
              </div>
            )}
            {answersState && (
              <div className="flex justify-end">
                <Button onClick={() => setShowExplanation((prev) => !prev)}>
                  <BookOpenText /> Learn More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
