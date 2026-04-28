// Controller/Store for Knowledge Hub (MVC Pattern)
import { Task, QuickNote, Article, DailyReview, Flashcard, Tag, DEFAULT_TAGS } from './types'

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// Sample Data for Demo
export const sampleTasks: Task[] = [
  {
    id: generateId(),
    title: 'Complete React Performance Optimization Article',
    description: 'Read and summarize the article about React memo, useMemo, and useCallback',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    tags: ['React', 'JavaScript'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Practice Binary Search Algorithm',
    description: 'Solve 5 LeetCode problems on binary search',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tags: ['Algorithm', 'To Practice'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Review AI SDK Documentation',
    status: 'todo',
    priority: 'high',
    tags: ['AI', 'To Read'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Write TypeScript Utility Types Summary',
    status: 'completed',
    priority: 'low',
    tags: ['TypeScript'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
]

export const sampleNotes: QuickNote[] = [
  {
    id: generateId(),
    title: 'Today\'s Learning - State Management',
    content: 'Discovered that Zustand is much simpler than Redux for small to medium projects. Key takeaway: start simple, scale when needed.',
    type: 'learning-note',
    tags: ['React', 'JavaScript'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Vlog Idea: Building a Second Brain',
    content: 'Create a video about how I organize my learning materials and notes. Show the workflow from consuming content to creating actionable tasks.',
    type: 'vlog-idea',
    tags: ['Review'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'Work Review - Sprint 23',
    content: 'Completed the API refactoring ahead of schedule. Need to improve estimation for frontend tasks. Team collaboration was excellent this sprint.',
    type: 'work-review',
    tags: ['Work Project'],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
]

export const sampleArticles: Article[] = [
  {
    id: generateId(),
    title: 'Understanding React Server Components',
    url: 'https://react.dev/reference/rsc/server-components',
    source: 'React.dev',
    summary: 'Deep dive into RSC architecture and how it changes the way we think about React applications.',
    tags: ['React', 'JavaScript'],
    priority: 'high',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'The Complete Guide to LLM Fine-tuning',
    url: 'https://medium.com/ai-guide',
    source: 'Medium',
    summary: 'Comprehensive guide covering LORA, QLoRA, and full fine-tuning approaches.',
    tags: ['AI', 'To Read'],
    priority: 'high',
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    title: 'TypeScript 5.5 New Features',
    url: 'https://devblogs.microsoft.com/typescript',
    source: 'Microsoft DevBlogs',
    tags: ['TypeScript'],
    priority: 'medium',
    isRead: true,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
]

export const sampleFlashcards: Flashcard[] = [
  {
    id: generateId(),
    question: 'What is the difference between useMemo and useCallback in React?',
    answer: 'useMemo caches the result of a computation, while useCallback caches the function itself. useMemo returns a memoized value, useCallback returns a memoized callback.',
    tags: ['React', 'JavaScript'],
    reviewCount: 3,
    lastReviewed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    question: 'What is the time complexity of binary search?',
    answer: 'O(log n) - Binary search divides the search interval in half with each comparison, making it logarithmic.',
    tags: ['Algorithm'],
    reviewCount: 5,
    lastReviewed: new Date(),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned. It "closes over" those variables.',
    tags: ['JavaScript'],
    reviewCount: 0,
    createdAt: new Date(),
  },
]

export const sampleReview: DailyReview = {
  id: generateId(),
  date: new Date(),
  whatLearned: 'Explored React Server Components and understood the hydration process better. Also learned about streaming SSR.',
  challenges: 'Had difficulty understanding the data flow between server and client components initially.',
  actionItems: [
    'Build a small project using RSC',
    'Read the Next.js App Router documentation',
    'Practice with streaming responses',
  ],
  followUpReminders: [
    'Review RSC concepts in 3 days',
    'Check for new RSC patterns in community',
  ],
  createdAt: new Date(),
}

export { DEFAULT_TAGS }
export type { Tag }
