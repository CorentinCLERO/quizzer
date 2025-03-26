'use client';

import { QuestionProvider } from '@/components/contex/questionProvider';
import AddQuestionForm from '@/components/add-question-form';
import React from 'react';

function AddQuestionPage() {
  return (
    <QuestionProvider>
      <div className='flex flex-col gap-3'>
        <h1>Add a question :</h1>
        <AddQuestionForm />
      </div>
    </QuestionProvider>
  );
}

export default AddQuestionPage;