// Model Types for Knowledge Hub

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'archived'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ArticlePriority = 'low' | 'medium' | 'high'

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date // For trash functionality
}

export interface QuickNote {
  id: string
  title: string
  content: string
  type: 'diary' | 'vlog-idea' | 'work-review' | 'learning-note'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  title: string
  url: string
  source: string
  summary?: string
  tags: string[]
  priority: ArticlePriority
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DailyReview {
  id: string
  date: Date
  whatLearned: string
  challenges: string
  actionItems: string[]
  followUpReminders: string[]
  createdAt: Date
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  tags: string[]
  lastReviewed?: Date
  reviewCount: number
  createdAt: Date
}

export interface ScrapedArticle {
  title: string
  url: string
  content: string
  source: string
  publishedDate?: string
  author?: string
}

// Default Tags
export const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'JavaScript', color: '#f7df1e' },
  { id: '2', name: 'Algorithm', color: '#00d4aa' },
  { id: '3', name: 'Work Project', color: '#3b82f6' },
  { id: '4', name: 'AI', color: '#a855f7' },
  { id: '5', name: 'Review', color: '#f97316' },
  { id: '6', name: 'To Read', color: '#ef4444' },
  { id: '7', name: 'To Practice', color: '#22c55e' },
  { id: '8', name: 'TypeScript', color: '#3178c6' },
  { id: '9', name: 'React', color: '#61dafb' },
  { id: '10', name: 'Backend', color: '#68a063' },
]
