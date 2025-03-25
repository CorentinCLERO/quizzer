'use client';

import { QuestionProvider } from '@/components/contex/questionProvider';
import AddQuestionForm from '@/components/multiselect';
import React from 'react';

function AddQuestionPage() {
  return (
    <QuestionProvider>
      <div>
        <h1 className='my-2 mx-5'>Add a question :</h1>
        <AddQuestionForm />
      </div>
    </QuestionProvider>
  );
}

export default AddQuestionPage;