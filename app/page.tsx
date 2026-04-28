'use client'

import { useState } from 'react'
import { Task, QuickNote, Article, DailyReview, Flashcard } from '@/lib/types'
import {
  sampleTasks,
  sampleNotes,
  sampleArticles,
  sampleFlashcards,
  sampleReview,
  generateId,
} from '@/lib/store'
import { Sidebar } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { TasksView } from '@/components/tasks-view'
import { NotesView } from '@/components/notes-view'
import { ArticlesView } from '@/components/articles-view'
import { DailyReviewView } from '@/components/daily-review-view'
import { FlashcardsView } from '@/components/flashcards-view'
import { WebScraperView } from '@/components/web-scraper-view'

type View = 'dashboard' | 'tasks' | 'notes' | 'articles' | 'review' | 'flashcards' | 'scraper'

export default function KnowledgeHub() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // State for all data (MVC - Model layer managed via React state)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [notes, setNotes] = useState<QuickNote[]>(sampleNotes)
  const [articles, setArticles] = useState<Article[]>(sampleArticles)
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards)
  const [review, setReview] = useState<DailyReview | null>(sampleReview)
  const [customTags, setCustomTags] = useState<string[]>([])

  // Controller functions
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const handleSaveArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArticle: Article = {
      ...articleData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setArticles((prev) => [newArticle, ...prev])
  }

  const handleAddCustomTag = (tag: string) => {
    if (!customTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag])
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            notes={notes}
            articles={articles}
            flashcards={flashcards}
            onNavigate={(view) => setCurrentView(view as View)}
          />
        )
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onTasksChange={setTasks}
            customTags={customTags}
            onAddCustomTag={handleAddCustomTag}
          />
        )
      case 'notes':
        return (
          <NotesView
            notes={notes}
            onNotesChange={setNotes}
            customTags={customTags}
            onAddCustomTag={handleAddCustomTag}
          />
        )
      case 'articles':
        return (
          <ArticlesView
            articles={articles}
            onArticlesChange={setArticles}
            customTags={customTags}
            onAddCustomTag={handleAddCustomTag}
          />
        )
      case 'review':
        return (
          <DailyReviewView
            review={review}
            onReviewChange={setReview}
            onCreateTask={handleCreateTask}
          />
        )
      case 'flashcards':
        return (
          <FlashcardsView
            flashcards={flashcards}
            onFlashcardsChange={setFlashcards}
            customTags={customTags}
            onAddCustomTag={handleAddCustomTag}
          />
        )
      case 'scraper':
        return <WebScraperView onSaveArticle={handleSaveArticle} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  )
}
