'use client';

import { QuestionProvider } from '@/components/providers/question-provider';
import AddQuestionForm from '@/components/add-question-form';
import React from 'react';

function AddQuestionPage() {
  return (
    <QuestionProvider>
      <div className='flex flex-col gap-3 m-5'>
        <h1 className='flex justify-center mb-5 text-2xl font-bold'>Add a question</h1>
        <AddQuestionForm />
      </div>
    </QuestionProvider>
  );
}

export default AddQuestionPage;