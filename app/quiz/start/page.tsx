"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SingleChoiceQuestion from "@/components/displayQuestion/single-choice-question";
import { fetchQuestion } from "@/components/displayQuestion/function";
import MultipleChoiceQuestion from "@/components/displayQuestion/multiple-choice-question";

export default function QuizStartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: question,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quizQuestion", searchParams?.toString()],
    queryFn: () => fetchQuestion(searchParams),
  });

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

  switch (question.type) {
    case "SINGLE_CHOICE":
      return <SingleChoiceQuestion question={question} refetch={refetch} />;
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceQuestion question={question} refetch={refetch} />;
  }
}
