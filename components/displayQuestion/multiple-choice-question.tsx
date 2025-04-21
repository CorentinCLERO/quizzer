import { MultipleChoiceAnswers, Question } from "@/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  QueryObserverResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchQuestionExplanation,
  fetchQuestionHint,
  postAnswer,
} from "./function";
import { CircleHelp, Loader2 } from "lucide-react";
import ExplanationDrawer from "../explanation-drawer";

type MultipleChoiceAnswersWithoutResponse = { text: string };

function MultipleChoiceQuestion({
  question,
  refetch,
}: {
  question: Question;
  refetch: () => Promise<QueryObserverResult<Question, Error>>;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersState, setAnswerState] = useState<{
    questionAnswers: MultipleChoiceAnswers[] | undefined;
  } | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    MultipleChoiceAnswersWithoutResponse[]
  >([]);

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
    mutationFn: async (data: MultipleChoiceAnswersWithoutResponse[]) =>
      question
        ? postAnswer(data, question.id, question.type, !questionHint)
        : Promise.reject("No question available"),
  });

  const handleAnswer = async () => {
    if (answersState) return;
    setAnswerState({ questionAnswers: undefined });
    const { data }: { data: MultipleChoiceAnswers[] } =
      await mutation.mutateAsync(selectedAnswers);
    setAnswerState({ questionAnswers: data });
  };

  const queryClient = useQueryClient();

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
    setSelectedAnswers([]);
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

      <div className="space-y-3">
        {(question.answers as MultipleChoiceAnswers[]).map(
          (answer: MultipleChoiceAnswers, index: number) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full text-left justify-start h-auto py-3 px-4 ${
                answersState !== null &&
                selectedAnswers
                  ?.map((questionAnswer) => questionAnswer.text)
                  .includes(answer.text)
                  ? answersState.questionAnswers === undefined // loading
                    ? "!bg-gray-500"
                    : (
                        answersState.questionAnswers as MultipleChoiceAnswers[]
                      ).find((answerState) => answerState.text === answer.text)
                        ?.isCorrect === true
                    ? "!bg-green-500"
                    : (
                        answersState.questionAnswers as MultipleChoiceAnswers[]
                      ).find((answerState) => answerState.text === answer.text)
                        ?.isCorrect === false
                    ? "!bg-red-500"
                    : ""
                  : `${
                      answersState?.questionAnswers?.find(
                        (questionAnswer) => questionAnswer.text === answer.text
                      )?.isCorrect && "!border-green-500"
                    }`
              } ${
                answersState === null &&
                selectedAnswers &&
                selectedAnswers
                  .map((questionAnswer) => questionAnswer.text)
                  .includes(answer.text) &&
                "!bg-white text-black"
              }`}
              onClick={() => {
                if (answersState) return;
                setSelectedAnswers((prev) => {
                  if (prev?.find((p) => p.text === answer.text)) {
                    return prev.filter((p) => p.text !== answer.text);
                  } else {
                    return [...prev, answer];
                  }
                });
              }}
            >
              {answer.text}
            </Button>
          )
        )}
      </div>
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
      {!answersState && selectedAnswers !== null && (
        <div className="pb-6 items-end flex flex-1">
          <Button className="w-full" onClick={() => handleAnswer()}>
            Validate
          </Button>
        </div>
      )}
    </div>
  );
}

export default MultipleChoiceQuestion;
