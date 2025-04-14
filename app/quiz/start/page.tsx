"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question, SingleQuestionAnswer, SingleChoiceAnswers } from "@/types";

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

export default function QuizStartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [answer, setAnswer] = useState<SingleQuestionAnswer>(
    {} as SingleQuestionAnswer
  );
  const [showHint, setShowHint] = useState(false);
  const [answersState, setAnswerState] = useState<{
    state: string;
    index: number;
  } | null>(null);

  const {
    data: question,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quizQuestion", searchParams?.toString()],
    queryFn: () => fetchQuestion(searchParams),
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

  const handleAnswer = (answer: SingleQuestionAnswer, index: number) => {
    setAnswer(answer);
    setAnswerState({ state: "loading", index });

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
          <div className="rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
              <span>{question.type}</span>
              <span>{question.difficulty}</span>
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
                        answersState?.state === "loading" &&
                        answersState?.index === index &&
                        "!bg-gray-500"
                      }`}
                      onClick={() => handleAnswer(answer, index)}
                    >
                      {answer.text}
                    </Button>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
