'use client'

import { Task, QuickNote, Article, Flashcard } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, FileText, BookOpen, Brain, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardProps {
  tasks: Task[]
  notes: QuickNote[]
  articles: Article[]
  flashcards: Flashcard[]
  onNavigate: (view: string) => void
}

export function Dashboard({ tasks, notes, articles, flashcards, onNavigate }: DashboardProps) {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'archived')
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high')
  const unreadArticles = articles.filter((a) => !a.isRead)
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate) return false
    const today = new Date()
    const due = new Date(t.dueDate)
    return due.toDateString() === today.toDateString()
  })

  const stats = [
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: CheckSquare,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Quick Notes',
      value: notes.length,
      icon: FileText,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Unread Articles',
      value: unreadArticles.length,
      icon: BookOpen,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Flashcards',
      value: flashcards.length,
      icon: Brain,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your learning progress overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-colors hover:border-primary/50"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn('rounded-lg p-3', stat.bgColor)}>
                  <Icon className={cn('h-6 w-6', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Urgent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Priority Tasks</CardTitle>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentTasks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No urgent tasks. Great job!
              </p>
            ) : (
              urgentTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        task.priority === 'urgent' ? 'bg-destructive' : 'bg-warning'
                      )}
                    />
                    <span className="text-sm font-medium">{task.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Due Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-primary" />
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueToday.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No tasks due today.
              </p>
            ) : (
              dueToday.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <span className="text-sm font-medium">{task.title}</span>
                  <Badge
                    variant={task.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Notes</CardTitle>
            <button
              onClick={() => onNavigate('notes')}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{note.title}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {note.type.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{note.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Articles Read</span>
                  <span className="font-medium">
                    {articles.filter((a) => a.isRead).length}/{articles.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${articles.length ? (articles.filter((a) => a.isRead).length / articles.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-chart-2 transition-all"
                    style={{
                      width: `${tasks.length ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Cards Reviewed</span>
                  <span className="font-medium">
                    {flashcards.filter((f) => f.reviewCount > 0).length}/{flashcards.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-chart-4 transition-all"
                    style={{
                      width: `${flashcards.length ? (flashcards.filter((f) => f.reviewCount > 0).length / flashcards.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
