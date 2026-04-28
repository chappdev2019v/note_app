'use client'

import { useState } from 'react'
import { Article, ArticlePriority, ScrapedArticle } from '@/lib/types'
import { DEFAULT_TAGS, generateId } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Globe,
  Search,
  Loader2,
  ExternalLink,
  BookmarkPlus,
  AlertCircle,
  CheckCircle2,
  Link2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebScraperViewProps {
  onSaveArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function WebScraperView({ onSaveArticle }: WebScraperViewProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [scrapedData, setScrapedData] = useState<ScrapedArticle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveForm, setSaveForm] = useState({
    title: '',
    summary: '',
    priority: 'medium' as ArticlePriority,
    tags: [] as string[],
  })
  const [isSaved, setIsSaved] = useState(false)

  const handleScrape = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)
    setScrapedData(null)
    setIsSaved(false)

    try {
      // Simulate scraping - in a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract domain for source
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace('www.', '')

      // Simulated scraped data based on URL
      const simulatedData: ScrapedArticle = {
        title: getSimulatedTitle(url),
        url: url,
        content: getSimulatedContent(url),
        source: getSourceName(domain),
        publishedDate: new Date().toISOString().split('T')[0],
        author: 'Author Name',
      }

      setScrapedData(simulatedData)
      setSaveForm((prev) => ({
        ...prev,
        title: simulatedData.title,
        summary: simulatedData.content.substring(0, 200) + '...',
      }))
    } catch (err) {
      setError('Failed to fetch article. Please check the URL and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!scrapedData || !saveForm.title.trim()) return

    onSaveArticle({
      title: saveForm.title,
      url: scrapedData.url,
      source: scrapedData.source,
      summary: saveForm.summary,
      priority: saveForm.priority,
      tags: saveForm.tags,
      isRead: false,
    })

    setIsSaved(true)
  }

  const toggleTag = (tag: string) => {
    setSaveForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const recentUrls = [
    'https://medium.com/',
    'https://dev.to/',
    'https://hashnode.com/',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Web Scraper</h1>
        <p className="mt-1 text-muted-foreground">
          Collect and save articles from Medium, Dev.to, and other websites.
        </p>
      </div>

      {/* URL Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            Fetch Article
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Paste article URL (e.g., https://medium.com/...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleScrape} disabled={isLoading || !url.trim()} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Fetch
                </>
              )}
            </Button>
          </div>

          {/* Supported Sites */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Supported:</span>
            <Badge variant="outline">Medium</Badge>
            <Badge variant="outline">Dev.to</Badge>
            <Badge variant="outline">Hashnode</Badge>
            <Badge variant="outline">Any blog</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Scraped Result */}
      {scrapedData && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-chart-2" />
                Extracted Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Title
                </label>
                <p className="font-medium">{scrapedData.title}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Source
                </label>
                <p className="text-sm">{scrapedData.source}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Content Preview
                </label>
                <p className="text-sm text-muted-foreground">{scrapedData.content}</p>
              </div>
              <a
                href={scrapedData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View original
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          {/* Save Form */}
          <Card className={cn(isSaved && 'border-success/50')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {isSaved ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Saved to Library
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-5 w-5 text-chart-3" />
                    Save to Library
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                  value={saveForm.title}
                  onChange={(e) => setSaveForm({ ...saveForm, title: e.target.value })}
                  disabled={isSaved}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Summary</label>
                <Textarea
                  value={saveForm.summary}
                  onChange={(e) => setSaveForm({ ...saveForm, summary: e.target.value })}
                  rows={3}
                  disabled={isSaved}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Priority</label>
                <Select
                  value={saveForm.priority}
                  onValueChange={(v) => setSaveForm({ ...saveForm, priority: v as ArticlePriority })}
                  disabled={isSaved}
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
              <div>
                <label className="mb-2 block text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TAGS.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={saveForm.tags.includes(tag.name) ? 'default' : 'outline'}
                      className={cn('cursor-pointer', isSaved && 'pointer-events-none')}
                      onClick={() => !isSaved && toggleTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {!isSaved && (
                <Button onClick={handleSave} className="w-full gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  Save to Article Library
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Links */}
      {!scrapedData && !isLoading && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Try fetching one of these example URLs:
            </p>
            <div className="space-y-2">
              {recentUrls.map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  onClick={() => setUrl(exampleUrl)}
                  className="flex w-full items-center gap-2 rounded-lg border border-border bg-secondary/30 p-3 text-left text-sm transition-colors hover:border-primary/30"
                >
                  <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{exampleUrl}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper functions for simulated scraping
function getSimulatedTitle(url: string): string {
  if (url.includes('react')) return 'Understanding React Server Components: A Deep Dive'
  if (url.includes('typescript')) return 'TypeScript Best Practices for 2024'
  if (url.includes('ai')) return 'The Future of AI in Software Development'
  return 'Scraped Article Title from ' + new URL(url).hostname
}

function getSimulatedContent(url: string): string {
  if (url.includes('react')) {
    return 'React Server Components represent a paradigm shift in how we build React applications. They allow components to run on the server, reducing the JavaScript bundle size sent to the client and enabling direct database access. This article explores the architecture, benefits, and practical implementation patterns...'
  }
  if (url.includes('typescript')) {
    return 'TypeScript has become an essential tool for modern JavaScript development. In this comprehensive guide, we cover advanced type patterns, utility types, and best practices that will help you write more maintainable and type-safe code...'
  }
  if (url.includes('ai')) {
    return 'Artificial Intelligence is transforming software development at an unprecedented pace. From AI-powered code assistants to automated testing and deployment, developers are leveraging these tools to increase productivity and code quality...'
  }
  return 'This is a preview of the article content that was extracted from the webpage. The full article contains more detailed information and examples that you can read by visiting the original source.'
}

function getSourceName(domain: string): string {
  const sourceMap: Record<string, string> = {
    'medium.com': 'Medium',
    'dev.to': 'Dev.to',
    'hashnode.dev': 'Hashnode',
    'blog.example.com': 'Example Blog',
  }
  return sourceMap[domain] || domain
}
