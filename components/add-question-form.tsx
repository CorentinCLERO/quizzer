import React from "react";
import MultiSelect from "./multiselect";
import { useQuestionContext } from "./providers/question-provider";
import { Input } from "./ui/input";
import AnswersForm from "./answers-form";

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

function AddQuestionForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  const changeValue = (valueType: string, value: string) => {
    if (valueType === "hint" && value === "") {
      setQuestionToAdd((prev) => ({ ...prev, hint: undefined }));
      return;
    }
    setQuestionToAdd((prev) => ({ ...prev, [valueType]: value }));
  };

  return (
    <>
      <div>Type :</div>
      <MultiSelect
        defaultValue={questionToAdd.type}
        name="Select the type of question"
        values={questionTypes}
        onChange={(e) => changeValue("type", e)}
      />
      <div>Difficulty :</div>
      <MultiSelect
        defaultValue={questionToAdd.difficulty}
        name="Select the difficulty level"
        values={difficultyLevels}
        onChange={(e) => changeValue("difficulty", e)}
      />
      <Input
        type="text"
        placeholder="Question"
        onChange={(e) => changeValue("text", e.target.value)}
        value={questionToAdd.question}
      />
      <Input
        type="text"
        placeholder="Hint"
        onChange={(e) => changeValue("hint", e.target.value)}
        value={questionToAdd.hint}
      />
      <AnswersForm/>
    </>
  );
}

export default AddQuestionForm;
