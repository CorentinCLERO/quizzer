'use client';

import { QuestionProvider } from '@/components/providers/question-provider';
import React from 'react';
import AddQuestionTanstackForm from '@/components/form/AddQuestionTanstackForm';

function AddQuestionPage() {
  return (
    <QuestionProvider>
      <div className='flex flex-col gap-5 m-5'>
        <h1 className='flex justify-center text-2xl font-bold'>Add a question 2</h1>
        <AddQuestionTanstackForm />
      </div>
    </QuestionProvider>
  );
}

export default AddQuestionPage;