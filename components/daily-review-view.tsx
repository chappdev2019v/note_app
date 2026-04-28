'use client'

import { useState } from 'react'
import { DailyReview, Task } from '@/lib/types'
import { generateId } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  ListTodo,
  Bell,
  Save,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DailyReviewViewProps {
  review: DailyReview | null
  onReviewChange: (review: DailyReview) => void
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function DailyReviewView({ review, onReviewChange, onCreateTask }: DailyReviewViewProps) {
  const [localReview, setLocalReview] = useState<DailyReview>(
    review || {
      id: generateId(),
      date: new Date(),
      whatLearned: '',
      challenges: '',
      actionItems: [],
      followUpReminders: [],
      createdAt: new Date(),
    }
  )
  const [newActionItem, setNewActionItem] = useState('')
  const [newReminder, setNewReminder] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    onReviewChange(localReview)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const addActionItem = () => {
    if (!newActionItem.trim()) return
    setLocalReview((prev) => ({
      ...prev,
      actionItems: [...prev.actionItems, newActionItem],
    }))
    setNewActionItem('')
  }

  const removeActionItem = (index: number) => {
    setLocalReview((prev) => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index),
    }))
  }

  const addReminder = () => {
    if (!newReminder.trim()) return
    setLocalReview((prev) => ({
      ...prev,
      followUpReminders: [...prev.followUpReminders, newReminder],
    }))
    setNewReminder('')
  }

  const removeReminder = (index: number) => {
    setLocalReview((prev) => ({
      ...prev,
      followUpReminders: prev.followUpReminders.filter((_, i) => i !== index),
    }))
  }

  const convertToTask = (item: string) => {
    onCreateTask({
      title: item,
      status: 'todo',
      priority: 'medium',
      tags: ['Review'],
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Review</h1>
          <p className="mt-1 text-muted-foreground">
            Transform scattered learning into actionable tasks and reminders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2 px-3 py-1.5">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Badge>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaved ? 'Saved!' : 'Save Review'}
          </Button>
        </div>
      </div>

      {/* Review Template */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* What I Learned Today */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-chart-1/10 p-2">
                <Lightbulb className="h-5 w-5 text-chart-1" />
              </div>
              What I Learned Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Summarize the key concepts, tools, or ideas you explored today..."
              value={localReview.whatLearned}
              onChange={(e) =>
                setLocalReview({ ...localReview, whatLearned: e.target.value })
              }
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Challenges & Blockers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              Challenges & Blockers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What obstacles did you face? What concepts were difficult to understand?"
              value={localReview.challenges}
              onChange={(e) =>
                setLocalReview({ ...localReview, challenges: e.target.value })
              }
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <ListTodo className="h-5 w-5 text-chart-2" />
              </div>
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add an action item..."
                value={newActionItem}
                onChange={(e) => setNewActionItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addActionItem()}
              />
              <Button onClick={addActionItem} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {localReview.actionItems.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No action items yet. Add tasks derived from your learning.
                </p>
              ) : (
                localReview.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs text-primary"
                        onClick={() => convertToTask(item)}
                      >
                        <ArrowRight className="h-3 w-3" />
                        To Task
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive"
                        onClick={() => removeActionItem(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Reminders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-chart-4/10 p-2">
                <Bell className="h-5 w-5 text-chart-4" />
              </div>
              Follow-up Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a reminder for future review..."
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addReminder()}
              />
              <Button onClick={addReminder} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {localReview.followUpReminders.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No reminders yet. Schedule future reviews and checkpoints.
                </p>
              ) : (
                localReview.followUpReminders.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs text-primary"
                        onClick={() => convertToTask(item)}
                      >
                        <ArrowRight className="h-3 w-3" />
                        To Task
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive"
                        onClick={() => removeReminder(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Daily Review Tips</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>- Be specific about what you learned - vague notes are hard to review later</li>
              <li>- Convert challenges into action items for tomorrow</li>
              <li>- Use &quot;To Task&quot; button to create actual tasks from your items</li>
              <li>- Schedule follow-up reviews for complex topics (e.g., &quot;Review RSC in 3 days&quot;)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
