export type UserRole = 'ADMIN' | 'CREATOR' | 'PARTICIPANT'

export interface User {
  id: number
  email: string
  name: string
  picture?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface MultipleChoiceAnswer {
  options: {
    text: string
    isCorrect: boolean
  }[]
}

export interface SingleChoiceAnswer {
  option: {
    text: string
    isCorrect: boolean
  }
}

export interface MatchingAnswer {
  pairs: {
    left: string
    right: string
  }[]
}

export interface OrderingAnswer {
  items: {
    text: string
    correctIndex: number
  }[]
}

export type QuestionAnswer =
  | { type: 'MULTIPLE_CHOICE'; data: MultipleChoiceAnswer }
  | { type: 'SINGLE_CHOICE'; data: SingleChoiceAnswer }
  | { type: 'MATCHING'; data: MatchingAnswer }
  | { type: 'ORDERING'; data: OrderingAnswer }
  | { type: 'TEXT'; data: { correctAnswers: string[] } }
  | { type: 'TRUE_FALSE'; data: { isTrue: boolean } }

export interface UserAnswer {
  id: number
  userId: number
  questionId: number
  answer: QuestionAnswer
  //   MULTIPLE_CHOICE: { selectedOptions: number[] }
  //   MATCHING: { matches: { leftId: number, rightId: number }> }
  //   ORDERING: { order: number[] }
  //   TEXT: { text: string }
  //   SINGLE_CHOICE: { options: MultipleChoiceAnswer[] }
  //   TRUE_FALSE: { isTrue: boolean }
  // }
  isCorrect: boolean
  createdAt: Date
}