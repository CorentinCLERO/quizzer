export type QuestionType = 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'TEXT' | 'MATCHING' | 'ORDERING'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface Explanation {
  short: string
  long?: string
  resources?: string[]
}

export interface MultipleChoiceAnswers {
  options: Array<{
    text: string
    isCorrect: boolean
  }>
}

export interface SingleChoiceAnswers {
  options: Array<{
    text: string
    isCorrect: boolean
  }>
}

export interface MatchingAnswers {
  pairs: Array<{
    left: string
    right: string
  }>
}

export interface OrderingAnswers {
  items: {
    text: string
    correctIndex: number
  }[]
}

export interface TextAnswers {
  correctAnswers: string[]
  caseSensitive?: boolean
  allowPartial?: boolean
}

export type QuestionAnswers = 
  | { type: 'MULTIPLE_CHOICE'; data: MultipleChoiceAnswers }
  | { type: 'SINGLE_CHOICE'; data: SingleChoiceAnswers }
  | { type: 'MATCHING'; data: MatchingAnswers }
  | { type: 'ORDERING'; data: OrderingAnswers }
  | { type: 'TEXT'; data: TextAnswers }
  | { type: 'TRUE_FALSE'; data: { isTrue: boolean } }

export interface Question {
  id: number
  text: string
  explanation?: Explanation
  answers: QuestionAnswers
  difficulty: Difficulty
  type: QuestionType
  hint?: string
  createdAt: Date
  updatedAt: Date
}