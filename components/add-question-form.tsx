import React from "react";
import MultiSelect from "./multiselect";
import { useQuestionContext } from "./providers/question-provider";
import { Input } from "./ui/input";
import AnswersForm from "./answers-form";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ExplanationForm from "./explanation-form";
import { Combobox } from "./combobox";

const questionTypes = [
  { value: "SINGLE_CHOICE", label: "Single choice" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "TRUE_FALSE", label: "True/False" },
  { value: "TEXT", label: "Complete text" },
  { value: "MATCHING", label: "Matching items" },
  { value: "ORDERING", label: "Ordering" },
];

const difficultyLevels = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const frameworks = [
  {
    name: "next.js",
  },
  {
    name: "sveltekit",
  },
  {
    name: "nuxt.js",
  },
  {
    name: "remix",
  },
  {
    name: "astro",
  },
];

function AddQuestionForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  const changeValue = (valueType: string, value: string) => {
    setQuestionToAdd((prev) => ({ ...prev, [valueType]: value }));
  };

  const addCategorie = (item: { name: string }) => {
    setQuestionToAdd((prev) => ({
      ...prev,
      category: item,
    }));
  };

  return (
    <>
      <div>
        Type :
        <MultiSelect
          defaultValue={questionToAdd.type}
          name="Select the type of question"
          values={questionTypes}
          onChange={(e) => changeValue("type", e)}
        />
      </div>
      <div className="flex flex-col">
        Category :
        <Combobox
          title="Search a category..."
          value={questionToAdd.category?.name}
          items={
            questionToAdd.category?.name?.length > 0 &&
            !frameworks.some((f) => f.name === questionToAdd.category.name)
              ? [...frameworks, questionToAdd.category]
              : frameworks
          }
          onCreate={addCategorie}
        />
      </div>
      <div>
        Difficulty :
        <MultiSelect
          defaultValue={questionToAdd.difficulty}
          name="Select the difficulty level"
          values={difficultyLevels}
          onChange={(e) => changeValue("difficulty", e)}
        />
      </div>
      <Textarea
        placeholder="Question"
        onChange={(e) => changeValue("text", e.target.value)}
        value={questionToAdd.question}
      />
      <AnswersForm />
      <Input
        type="text"
        placeholder="Hint"
        onChange={(e) => changeValue("hint", e.target.value)}
        value={questionToAdd.hint}
      />
      <ExplanationForm />
      <Button onClick={() => console.log(questionToAdd)}>
        Create question
      </Button>
    </>
  );
}

export default AddQuestionForm;
