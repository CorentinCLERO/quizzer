import React from 'react';
import MultiSelect from './multiselect';
import { useQuestionContext } from './contex/questionProvider';

const questionTypes = [
  { value: 'SINGLE_CHOICE', label: 'Single choice' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'TEXT', label: 'Complete text' },
  { value: 'MATCHING', label: 'Matching items' },
  { value: 'ORDERING', label: 'Ordering' },
];

const difficultyLevels = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

function AddQuestionForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  const changeValue = (valueType: string, value: string) => {
    setQuestionToAdd(prev => ({ ...prev, [valueType]: value }));
  };

  return (
    <>
      <MultiSelect defaultValue={questionToAdd.type} name="Select the type of question" values={questionTypes} onChange={(e) => changeValue("type", e)}/>
      <MultiSelect defaultValue={questionToAdd.difficulty} name="Select the difficulty level" values={difficultyLevels} onChange={(e) => changeValue("difficulty", e)}/>
    </>
  );
}

export default AddQuestionForm;