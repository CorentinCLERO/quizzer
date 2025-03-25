'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Difficulty, Explanation, QuestionAnswers } from '@/types';
import { QuestionType } from '@prisma/client';

interface QuestionForm {
  text: string;
  explanation?: Explanation;
  answers: QuestionAnswers;
  difficulty: Difficulty;
  type: QuestionType;
  hint?: string;
}

interface QuestionContextProps {
  questionToAdd: QuestionForm;
  setQuestionToAdd: React.Dispatch<React.SetStateAction<QuestionForm>>;
}

const QuestionContext = createContext<QuestionContextProps | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questionToAdd, setQuestionToAdd] = useState<QuestionForm>({
    text: '',
    explanation: {
      short: '',
      long: '',
      resources: [],
    },
    answers: {} as QuestionAnswers,
    difficulty: 'MEDIUM',
    type: '' as QuestionType,
    hint: '',
  });

  return (
    <QuestionContext.Provider value={{ questionToAdd, setQuestionToAdd }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestionContext must be used within a QuestionProvider');
  }
  return context;
};