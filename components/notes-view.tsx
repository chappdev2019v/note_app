'use client'

import { useState } from 'react'
import { QuickNote } from '@/lib/types'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Book, Lightbulb, Briefcase, GraduationCap, X, Edit2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotesViewProps {
  notes: QuickNote[]
  onNotesChange: (notes: QuickNote[]) => void
  customTags: string[]
  onAddCustomTag: (tag: string) => void
}

const noteTypeConfig = {
  diary: { label: 'Diary', icon: Book, color: 'text-chart-1', bgColor: 'bg-chart-1/10' },
  'vlog-idea': { label: 'Vlog Idea', icon: Lightbulb, color: 'text-chart-3', bgColor: 'bg-chart-3/10' },
  'work-review': { label: 'Work Review', icon: Briefcase, color: 'text-chart-2', bgColor: 'bg-chart-2/10' },
  'learning-note': { label: 'Learning Note', icon: GraduationCap, color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
}

export function NotesView({ notes, onNotesChange, customTags, onAddCustomTag }: NotesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null)
  const [viewingNote, setViewingNote] = useState<QuickNote | null>(null)
  const [newTagInput, setNewTagInput] = useState('')
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'learning-note' as QuickNote['type'],
    tags: [] as string[],
  })

  const allTags = [...DEFAULT_TAGS.map((t) => t.name), ...customTags]

  const filteredNotes = notes.filter((note) => {
    if (filterType !== 'all' && note.type !== filterType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note: QuickNote = {
      id: generateId(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      tags: newNote.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onNotesChange([note, ...notes])
    setNewNote({ title: '', content: '', type: 'learning-note', tags: [] })
    setIsDialogOpen(false)
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    onNotesChange(
      notes.map((n) =>
        n.id === editingNote.id
          ? { ...editingNote, updatedAt: new Date() }
          : n
      )
    )
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    onNotesChange(notes.filter((n) => n.id !== noteId))
  }

  const toggleTag = (tag: string, isEditing = false) => {
    if (isEditing && editingNote) {
      setEditingNote({
        ...editingNote,
        tags: editingNote.tags.includes(tag)
          ? editingNote.tags.filter((t) => t !== tag)
          : [...editingNote.tags, tag],
      })
    } else {
      setNewNote((prev) => ({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Notes</h1>
          <p className="mt-1 text-muted-foreground">
            Capture diary entries, vlog ideas, work reviews, and learning notes.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <Select
                  value={newNote.type}
                  onValueChange={(v) => setNewNote({ ...newNote, type: v as QuickNote['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(noteTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your thoughts..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={newNote.tags.includes(tag) ? 'default' : 'outline'}
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
              <Button onClick={handleAddNote} className="w-full">
                Save Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Note Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(noteTypeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No notes found. Start capturing your thoughts!</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const config = noteTypeConfig[note.type]
            const Icon = config.icon
            const isLongNote = note.content.length > 200
            return (
              <Card key={note.id} className="group relative flex flex-col">
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {isLongNote && (
                    <button
                      onClick={() => setViewingNote(note)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      title="View full note"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingNote(note)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className={cn('rounded-lg p-2', config.bgColor)}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="flex-1 pr-16">
                      <CardTitle className="text-base">{note.title}</CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p
                    className={cn(
                      'text-sm text-muted-foreground',
                      isLongNote ? 'line-clamp-4' : ''
                    )}
                  >
                    {note.content}
                  </p>
                  {isLongNote && (
                    <button
                      onClick={() => setViewingNote(note)}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Read more...
                    </button>
                  )}
                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* View Full Note Dialog */}
      <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {viewingNote && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  {(() => {
                    const config = noteTypeConfig[viewingNote.type]
                    const Icon = config.icon
                    return (
                      <div className={cn('rounded-lg p-2', config.bgColor)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                    )
                  })()}
                  <div>
                    <DialogTitle className="text-xl">{viewingNote.title}</DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {noteTypeConfig[viewingNote.type].label} - {new Date(viewingNote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh] mt-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed pr-4">
                  {viewingNote.content}
                </div>
              </ScrollArea>
              {viewingNote.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                  {viewingNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingNote(viewingNote)
                    setViewingNote(null)
                  }}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <Select
                  value={editingNote.type}
                  onValueChange={(v) => setEditingNote({ ...editingNote, type: v as QuickNote['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(noteTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Content</label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={editingNote.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag, true)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleUpdateNote} className="w-full">
                Update Note
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
