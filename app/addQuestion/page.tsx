"use client";

import React from "react";
import AddQuestionTanstackForm from "@/components/form/AddQuestionTanstackForm";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";

export type Labels = {
  categories: {
    id: string;
    name: string;
  }[];
  tags: {
    id: string;
    name: string;
  }[];
};

async function fetchLabels(): Promise<Labels> {
  const response = await fetch("/api/questions/labels");
  return response.json();
}

function AddQuestionPage() {
  const {
    data: labelsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
  });

  return (
    <div className="flex flex-col gap-5 m-5">
      <h1 className="flex justify-center text-2xl font-bold">Add a question</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        labelsData && <AddQuestionTanstackForm labelsData={labelsData} />
      )}
    </div>
  );
}

export default AddQuestionPage;
