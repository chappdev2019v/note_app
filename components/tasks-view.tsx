'use client'

import { useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '@/lib/types'
import { DEFAULT_TAGS, generateId } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  X,
  Edit2,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TasksViewProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  customTags: string[]
  onAddCustomTag: (tag: string) => void
}

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'text-chart-2' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-success' },
  archived: { label: 'Archived', icon: CheckCircle2, color: 'text-muted-foreground' },
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-secondary text-secondary-foreground' },
  medium: { label: 'Medium', color: 'bg-chart-2/20 text-chart-2' },
  high: { label: 'High', color: 'bg-warning/20 text-warning' },
  urgent: { label: 'Urgent', color: 'bg-destructive/20 text-destructive' },
}

export function TasksView({ tasks, onTasksChange, customTags, onAddCustomTag }: TasksViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTagInput, setNewTagInput] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
    tags: [] as string[],
  })

  const allTags = [...DEFAULT_TAGS.map((t) => t.name), ...customTags]
  const activeTasks = tasks.filter((t) => !t.deletedAt)
  const trashedTasks = tasks.filter((t) => t.deletedAt)

  const filteredTasks = activeTasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterTag !== 'all' && !task.tags.includes(filterTag)) return false
    return true
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      tags: newTask.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onTasksChange([task, ...tasks])
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', tags: [] })
    setIsDialogOpen(false)
  }

  const handleUpdateTask = () => {
    if (!editingTask) return

    onTasksChange(
      tasks.map((t) =>
        t.id === editingTask.id ? { ...editingTask, updatedAt: new Date() } : t
      )
    )
    setEditingTask(null)
    setIsEditDialogOpen(false)
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    onTasksChange(
      tasks.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date() } : t))
    )
  }

  const handleMoveToTrash = (taskId: string) => {
    onTasksChange(
      tasks.map((t) =>
        t.id === taskId ? { ...t, deletedAt: new Date(), updatedAt: new Date() } : t
      )
    )
  }

  const handleRestoreTask = (taskId: string) => {
    onTasksChange(
      tasks.map((t) =>
        t.id === taskId ? { ...t, deletedAt: undefined, updatedAt: new Date() } : t
      )
    )
  }

  const handlePermanentDelete = (taskId: string) => {
    onTasksChange(tasks.filter((t) => t.id !== taskId))
  }

  const handleEmptyTrash = () => {
    onTasksChange(tasks.filter((t) => !t.deletedAt))
  }

  const toggleTag = (tag: string, isEditing = false) => {
    if (isEditing && editingTask) {
      setEditingTask({
        ...editingTask,
        tags: editingTask.tags.includes(tag)
          ? editingTask.tags.filter((t) => t !== tag)
          : [...editingTask.tags, tag],
      })
    } else {
      setNewTask((prev) => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      }))
    }
  }

  const handleAddNewTag = () => {
    if (newTagInput.trim() && !allTags.includes(newTagInput.trim())) {
      onAddCustomTag(newTagInput.trim())
      setNewTagInput('')
    }
  }

  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task })
    setIsEditDialogOpen(true)
  }

  const groupedTasks = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
  }

  // Trash View
  if (showTrash) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trash</h1>
            <p className="mt-1 text-muted-foreground">
              Deleted tasks can be restored or permanently removed.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTrash(false)}>
              Back to Tasks
            </Button>
            {trashedTasks.length > 0 && (
              <Button variant="destructive" onClick={handleEmptyTrash} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Empty Trash
              </Button>
            )}
          </div>
        </div>

        {trashedTasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trash2 className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Trash is empty</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {trashedTasks.map((task) => (
              <Card key={task.id} className="border-destructive/20 bg-destructive/5">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Deleted: {task.deletedAt ? new Date(task.deletedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreTask(task.id)}
                      className="gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handlePermanentDelete(task.id)}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks & Reminders</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your learning tasks, work items, and article organization.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTrash(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Trash
            {trashedTasks.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {trashedTasks.length}
              </Badge>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Add details..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={newTask.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddNewTag}>
                      Add
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAddTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {(Object.keys(groupedTasks) as (keyof typeof groupedTasks)[]).map((status) => {
          const config = statusConfig[status]
          const Icon = config.icon
          return (
            <Card key={status} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className={cn('h-5 w-5', config.color)} />
                  {config.label}
                  <Badge variant="secondary" className="ml-auto">
                    {groupedTasks[status].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {groupedTasks[status].length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No tasks
                  </p>
                ) : (
                  groupedTasks[status].map((task) => (
                    <div
                      key={task.id}
                      className="group relative rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-primary/30"
                    >
                      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openEditDialog(task)}
                          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleMoveToTrash(task.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <h4 className="pr-12 text-sm font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge className={cn('text-xs', priorityConfig[task.priority].color)}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                      {task.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {status !== 'completed' && (
                        <div className="mt-3 flex gap-2">
                          {status === 'todo' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleStatusChange(task.id, 'in-progress')}
                            >
                              Start
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Done
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <Textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Priority</label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(v) => setEditingTask({ ...editingTask, priority: v as TaskPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Status</label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(v) => setEditingTask({ ...editingTask, status: v as TaskStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={editingTask.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag, true)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleUpdateTask} className="w-full">
                Update Task
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
