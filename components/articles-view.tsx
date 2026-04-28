'use client'

import { useState } from 'react'
import { Article, ArticlePriority } from '@/lib/types'
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
  ExternalLink,
  BookOpen,
  BookMarked,
  Search,
  X,
  Star,
  StarOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticlesViewProps {
  articles: Article[]
  onArticlesChange: (articles: Article[]) => void
  customTags?: string[]
  onAddCustomTag?: (tag: string) => void
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-secondary text-secondary-foreground' },
  medium: { label: 'Medium', color: 'bg-chart-3/20 text-chart-3' },
  high: { label: 'High', color: 'bg-warning/20 text-warning' },
}

export function ArticlesView({
  articles,
  onArticlesChange,
  customTags = [],
  onAddCustomTag,
}: ArticlesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterRead, setFilterRead] = useState<string>('all')
  const [newTagInput, setNewTagInput] = useState('')
  const [newArticle, setNewArticle] = useState({
    title: '',
    url: '',
    source: '',
    summary: '',
    priority: 'medium' as ArticlePriority,
    tags: [] as string[],
  })

  const allTags = [...DEFAULT_TAGS.map((t) => t.name), ...customTags]

  const filteredArticles = articles.filter((article) => {
    if (filterTag !== 'all' && !article.tags.includes(filterTag)) return false
    if (filterPriority !== 'all' && article.priority !== filterPriority) return false
    if (filterRead === 'read' && !article.isRead) return false
    if (filterRead === 'unread' && article.isRead) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        article.title.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const handleAddArticle = () => {
    if (!newArticle.title.trim() || !newArticle.url.trim()) return

    const article: Article = {
      id: generateId(),
      title: newArticle.title,
      url: newArticle.url,
      source: newArticle.source || new URL(newArticle.url).hostname,
      summary: newArticle.summary,
      tags: newArticle.tags,
      priority: newArticle.priority,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onArticlesChange([article, ...articles])
    setNewArticle({ title: '', url: '', source: '', summary: '', priority: 'medium', tags: [] })
    setIsDialogOpen(false)
  }

  const handleToggleRead = (articleId: string) => {
    onArticlesChange(
      articles.map((a) =>
        a.id === articleId ? { ...a, isRead: !a.isRead, updatedAt: new Date() } : a
      )
    )
  }

  const handleDeleteArticle = (articleId: string) => {
    onArticlesChange(articles.filter((a) => a.id !== articleId))
  }

  const toggleTag = (tag: string) => {
    setNewArticle((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const handleAddNewTag = () => {
    if (newTagInput.trim() && !allTags.includes(newTagInput.trim()) && onAddCustomTag) {
      onAddCustomTag(newTagInput.trim())
      setNewTagInput('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Article Library</h1>
          <p className="mt-1 text-muted-foreground">
            Save and organize articles, URLs, and notes with tags and search.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  placeholder="Article title..."
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">URL</label>
                <Input
                  placeholder="https://..."
                  type="url"
                  value={newArticle.url}
                  onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Source</label>
                  <Input
                    placeholder="Medium, Dev.to..."
                    value={newArticle.source}
                    onChange={(e) => setNewArticle({ ...newArticle, source: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Priority</label>
                  <Select
                    value={newArticle.priority}
                    onValueChange={(v) => setNewArticle({ ...newArticle, priority: v as ArticlePriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Summary</label>
                <Textarea
                  placeholder="Brief summary or notes..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={newArticle.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {onAddCustomTag && (
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
                )}
              </div>
              <Button onClick={handleAddArticle} className="w-full">
                Save Article
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles by title, tag, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
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
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRead} onValueChange={setFilterRead}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{articles.filter((a) => !a.isRead).length} unread</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookMarked className="h-4 w-4" />
          <span>{articles.filter((a) => a.isRead).length} read</span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">
              No articles found. Start building your knowledge library!
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card
              key={article.id}
              className={cn(
                'group relative flex flex-col transition-colors',
                article.isRead && 'opacity-70'
              )}
            >
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleToggleRead(article.id)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title={article.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {article.isRead ? (
                    <StarOff className="h-3.5 w-3.5" />
                  ) : (
                    <Star className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      article.isRead ? 'bg-muted' : 'bg-primary/10'
                    )}
                  >
                    {article.isRead ? (
                      <BookMarked className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 pr-8">
                    <CardTitle className="line-clamp-2 text-base">{article.title}</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">{article.source}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                {article.summary && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
                )}
                <div className="mt-auto pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cn('text-xs', priorityConfig[article.priority].color)}>
                      {article.priority}
                    </Badge>
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Read article
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
