"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MultiCombobox } from "@/components/multiCombobox";
import { Combobox } from "@/components/combobox";
import MultiSelect from "@/components/multiselect";
import { difficultyLevels, questionTypes } from "@/components/form/constants";
import Loader from "@/components/loader/loader";
import { toast } from "sonner";
import { Labels } from "../addQuestion/page";

async function fetchLabels(): Promise<Labels> {
  const response = await fetch("/api/questions/labels");
  return response.json();
}

function QuizPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const {
    data: labelsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
  });

  if (isError) {
    toast.warning((error as Error).message);
  }

  const handleStartQuiz = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.append("categoryId", selectedCategory.id);
    }

    if (selectedTags.length > 0) {
      selectedTags.forEach((tag) => {
        params.append("tagIds", tag.id);
      });
    }

    if (selectedTypes.length > 0) {
      selectedTypes.forEach((type) => {
        params.append("types", type);
      });
    }

    if (selectedDifficulty) {
      params.append("difficulty", selectedDifficulty);
    }

    router.push(`/quiz/start?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create a Quiz</h1>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="max-w-md mx-auto rounded-lg shadow p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category (Optional)
              </label>
              <Combobox
                title="Select a category..."
                value={selectedCategory?.name || ""}
                items={labelsData?.categories || []}
                onCreate={(value) =>
                  setSelectedCategory(value as { id: string; name: string })
                }
                permitAdd={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (Optional)
              </label>
              <MultiCombobox
                title="Select tags..."
                values={selectedTags}
                items={labelsData?.tags || []}
                onCreate={(values) =>
                  setSelectedTags(values as { id: string; name: string }[])
                }
                permitAdd={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Question Types (Optional)
              </label>
              <MultiSelect
                name="Select question types"
                values={questionTypes}
                onChange={(selected) =>
                  setSelectedTypes(
                    Array.isArray(selected) ? selected : [selected]
                  )
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty (Optional)
              </label>
              <MultiSelect
                name="Select difficulty level"
                values={difficultyLevels}
                onChange={(selected) =>
                  setSelectedDifficulty(selected as string)
                }
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
