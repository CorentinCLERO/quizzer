export interface Category {
  id: number
  name: string
  description?: string
  createdAt: Date
}

export interface Tag {
  id: number
  name: string
  createdAt: Date
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}