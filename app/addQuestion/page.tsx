"use client";

import React from "react";
import AddQuestionTanstackForm from "@/components/form/AddQuestionTanstackForm";
import { useQuery } from "@tanstack/react-query";

export type Labels = {
  categories: {
    id: string;
    name: string;
  }[],
  tags: {
    id: string;
    name: string;
  }[]
}

async function fetchLabels(): Promise<Labels> {
  const response = await fetch("/api/questions/labels");
  return response.json();
}

function AddQuestionPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: labelsData, isLoading, error } = useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
  });

  return (
    <div className="flex flex-col gap-5 m-5">
      <h1 className="flex justify-center text-2xl font-bold">
        Add a question
      </h1>
      {labelsData && <AddQuestionTanstackForm labelsData={labelsData} />}
    </div>
  );
}

export default AddQuestionPage;
