"use client";

import React from "react";
import AddQuestionTanstackForm from "@/app/components/form/AddQuestionTanstackForm";

function AddQuestionPage() {
  return (
    <div className="flex flex-col gap-5 m-5">
      <h1 className="flex justify-center text-2xl font-bold">
        Add a question 2
      </h1>
      <AddQuestionTanstackForm />
    </div>
  );
}

export default AddQuestionPage;
