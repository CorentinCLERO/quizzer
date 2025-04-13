"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  type: string;
  answers: any; // Type depends on question type
  difficulty: string;
  explanation: {
    short: string;
    long: string;
    resources: string[];
  };
  hint: string;
}

async function fetchQuestions(params: URLSearchParams): Promise<Question[]> {
  const apiUrl = "/api/questions/quiz?" + params.toString();
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export default function QuizStartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const {
    data: questions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quizQuestions", searchParams.toString()],
    queryFn: () => fetchQuestions(searchParams),
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

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No questions found</h2>
        <p className="mb-6">Try different filters to find questions.</p>
        <Button onClick={() => router.push("/quiz")}>Back to Quiz Setup</Button>
      </div>
    );
  }

  const handleAnswer = (answer: any) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer,
    };
    setAnswers(updatedAnswers);

    // Logic to check correct answer would be here
    // This is simplified and would need to be adjusted based on question types

    setShowExplanation(true);
  };

  const moveToNextQuestion = () => {
    setShowExplanation(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      // Calculate final score
      // This would need actual logic based on correct answers
      const calculatedScore = Object.keys(answers).length;
      setScore(calculatedScore);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded dark:bg-blue-900 dark:text-blue-300">
              {question.type}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium py-1 px-2 rounded dark:bg-purple-900 dark:text-purple-300">
              {question.difficulty}
            </span>
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-4">{question.text}</h2>

          {/* This would need to be expanded based on the different question types */}
          <div className="space-y-3">
            {question.type === "SINGLE_CHOICE" &&
              question.answers.map((answer: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4"
                  onClick={() => handleAnswer(answer)}
                  disabled={showExplanation}
                >
                  {answer.text}
                </Button>
              ))}

            {/* Additional question type renderers would go here */}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Explanation</h3>
            <p>{question.explanation.short}</p>

            {question.explanation.long && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Detailed Explanation</h4>
                <p>{question.explanation.long}</p>
              </div>
            )}

            {question.explanation.resources?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Resources</h4>
                <ul className="list-disc pl-5">
                  {question.explanation.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button className="mt-4" onClick={moveToNextQuestion}>
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Quiz Complete!</h2>

        <div className="mb-6">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <p>out of {questions.length} questions</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowExplanation(false);
              setQuizComplete(false);
            }}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/quiz")}
            className="w-full"
          >
            New Quiz
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        {quizComplete ? renderResults() : renderQuestion()}
      </div>
    </div>
  );
}
