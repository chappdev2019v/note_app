'use client'

import { useState } from 'react'
import { Flashcard } from '@/lib/types'
import { DEFAULT_TAGS, generateId } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Eye,
  EyeOff,
  Brain,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  X,
  Edit2,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FlashcardsViewProps {
  flashcards: Flashcard[]
  onFlashcardsChange: (flashcards: Flashcard[]) => void
  customTags: string[]
  onAddCustomTag: (tag: string) => void
}

export function FlashcardsView({
  flashcards,
  onFlashcardsChange,
  customTags,
  onAddCustomTag,
}: FlashcardsViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filterTag, setFilterTag] = useState<string>('all')
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyCards, setStudyCards] = useState<Flashcard[]>([])
  const [studyTag, setStudyTag] = useState<string>('all')
  const [showStudyOptions, setShowStudyOptions] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [newTagInput, setNewTagInput] = useState('')
  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    tags: [] as string[],
  })

  const allTags = [...DEFAULT_TAGS.map((t) => t.name), ...customTags]

  const filteredCards = flashcards.filter((card) => {
    if (filterTag !== 'all' && !card.tags.includes(filterTag)) return false
    return true
  })

  const handleAddCard = () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) return

    const card: Flashcard = {
      id: generateId(),
      question: newCard.question,
      answer: newCard.answer,
      tags: newCard.tags,
      reviewCount: 0,
      createdAt: new Date(),
    }

    onFlashcardsChange([card, ...flashcards])
    setNewCard({ question: '', answer: '', tags: [] })
    setIsDialogOpen(false)
  }

  const handleUpdateCard = () => {
    if (!editingCard) return

    onFlashcardsChange(
      flashcards.map((c) => (c.id === editingCard.id ? editingCard : c))
    )
    setEditingCard(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteCard = (cardId: string) => {
    onFlashcardsChange(flashcards.filter((c) => c.id !== cardId))
  }

  const openEditDialog = (card: Flashcard) => {
    setEditingCard({ ...card })
    setIsEditDialogOpen(true)
  }

  const toggleTag = (tag: string, isEditing = false) => {
    if (isEditing && editingCard) {
      setEditingCard({
        ...editingCard,
        tags: editingCard.tags.includes(tag)
          ? editingCard.tags.filter((t) => t !== tag)
          : [...editingCard.tags, tag],
      })
    } else {
      setNewCard((prev) => ({
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

  const startStudyMode = (shuffle = false, tagFilter = 'all') => {
    let cards = flashcards.filter((card) => {
      if (tagFilter !== 'all' && !card.tags.includes(tagFilter)) return false
      return true
    })
    if (shuffle) {
      cards = cards.sort(() => Math.random() - 0.5)
    }
    if (cards.length === 0) return
    setStudyCards(cards)
    setCurrentIndex(0)
    setShowAnswer(false)
    setIsStudyMode(true)
    setShowStudyOptions(false)
  }

  const handleNextCard = () => {
    if (currentIndex < studyCards.length - 1) {
      const currentCard = studyCards[currentIndex]
      onFlashcardsChange(
        flashcards.map((c) =>
          c.id === currentCard.id
            ? { ...c, reviewCount: c.reviewCount + 1, lastReviewed: new Date() }
            : c
        )
      )
      setCurrentIndex((prev) => prev + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setShowAnswer(false)
    }
  }

  const exitStudyMode = () => {
    setIsStudyMode(false)
    setStudyCards([])
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  // Study Mode UI
  if (isStudyMode && studyCards.length > 0) {
    const currentCard = studyCards[currentIndex]
    return (
      <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={exitStudyMode} className="gap-2">
              <X className="h-4 w-4" />
              Exit
            </Button>
            <Badge variant="outline" className="px-3 py-1.5">
              {currentIndex + 1} / {studyCards.length}
            </Badge>
            <Button
              variant="ghost"
              onClick={() => startStudyMode(true, studyTag)}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${((currentIndex + 1) / studyCards.length) * 100}%`,
              }}
            />
          </div>

          {/* Flashcard */}
          <Card
            className="min-h-[300px] cursor-pointer transition-all hover:border-primary/50"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <Badge variant="secondary" className="mb-4">
                {showAnswer ? 'Answer' : 'Question'}
              </Badge>
              <p className="text-xl font-medium leading-relaxed">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
              {!showAnswer && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Click to reveal answer
                </p>
              )}
              {currentCard.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {currentCard.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevCard}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAnswer(!showAnswer)}
              className="gap-2"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-5 w-5" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Show
                </>
              )}
            </Button>
            <Button
              size="lg"
              onClick={handleNextCard}
              disabled={currentIndex === studyCards.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="mt-1 text-muted-foreground">
            Convert knowledge into Q&A cards for effective learning and review.
          </p>
        </div>
        <div className="flex gap-2">
          {flashcards.length > 0 && (
            <>
              <Button variant="outline" onClick={() => startStudyMode(false)} className="gap-2">
                <Brain className="h-4 w-4" />
                Study All
              </Button>
              <Dialog open={showStudyOptions} onOpenChange={setShowStudyOptions}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Study by Tag
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Study Options</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Select Tag</label>
                      <Select value={studyTag} onValueChange={setStudyTag}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tags</SelectItem>
                          {allTags.map((tag) => {
                            const count = flashcards.filter((c) => c.tags.includes(tag)).length
                            if (count === 0) return null
                            return (
                              <SelectItem key={tag} value={tag}>
                                {tag} ({count})
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startStudyMode(false, studyTag)}
                        className="flex-1 gap-2"
                      >
                        <Brain className="h-4 w-4" />
                        Study
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startStudyMode(true, studyTag)}
                        className="flex-1 gap-2"
                      >
                        <Shuffle className="h-4 w-4" />
                        Shuffle
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Question</label>
                  <Textarea
                    placeholder="What concept do you want to remember?"
                    value={newCard.question}
                    onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Answer</label>
                  <Textarea
                    placeholder="The answer or explanation..."
                    value={newCard.answer}
                    onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={newCard.tags.includes(tag) ? 'default' : 'outline'}
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
                <Button onClick={handleAddCard} className="w-full">
                  Create Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filterTag === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilterTag('all')}
        >
          All ({flashcards.length})
        </Badge>
        {allTags.map((tag) => {
          const count = flashcards.filter((c) => c.tags.includes(tag)).length
          if (count === 0) return null
          return (
            <Badge
              key={tag}
              variant={filterTag === tag ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilterTag(tag)}
            >
              {tag} ({count})
            </Badge>
          )
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCards.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No flashcards yet. Start creating cards to boost your learning!
            </p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <Card key={card.id} className="group relative flex flex-col">
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEditDialog(card)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="pr-12 text-base">
                  <span className="text-xs font-normal text-muted-foreground">Q:</span>{' '}
                  {card.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex-1 rounded-lg bg-secondary/30 p-3">
                  <span className="text-xs text-muted-foreground">A: </span>
                  <span className="text-sm">{card.answer}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <RotateCcw className="mr-1 h-3 w-3" />
                    {card.reviewCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Question</label>
                <Textarea
                  value={editingCard.question}
                  onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Answer</label>
                <Textarea
                  value={editingCard.answer}
                  onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={editingCard.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag, true)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleUpdateCard} className="w-full">
                Update Card
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
