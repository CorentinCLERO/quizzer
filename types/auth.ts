import { User } from './users'

export interface Session {
  user: User
  expires: string
}

export interface AuthError {
  error: string
  status: number
  message: string
}