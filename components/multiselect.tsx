import React from 'react';
import MultiSelect from './select-question-type';
import { useQuestionContext } from './contex/questionProvider';

const questionTypes = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
  { value: 'SINGLE_CHOICE', label: 'Single choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'TEXT', label: 'Complete text' },
  { value: 'MATCHING', label: 'Matching items' },
  { value: 'ORDERING', label: 'Ordering' },
];

function AddQuestionForm() {
  const { setQuestionToAdd } = useQuestionContext();

  const changeValue = (valueType: string, value: string) => {
    setQuestionToAdd(prev => ({ ...prev, [valueType]: value }));
  };
  return (
    <div>
      <MultiSelect name="Select the type of question" values={questionTypes} onChange={(e) => changeValue("type", e)}/>
    </div>
  );
}

export default AddQuestionForm;