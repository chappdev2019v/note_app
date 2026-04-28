'use client'

import { cn } from '@/lib/utils'
import {
  CheckSquare,
  FileText,
  BookOpen,
  Calendar,
  Brain,
  Globe,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type View = 'dashboard' | 'tasks' | 'notes' | 'articles' | 'review' | 'flashcards' | 'scraper'

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks' as View, label: 'Tasks & Reminders', icon: CheckSquare },
  { id: 'notes' as View, label: 'Quick Notes', icon: FileText },
  { id: 'articles' as View, label: 'Article Library', icon: BookOpen },
  { id: 'review' as View, label: 'Daily Review', icon: Calendar },
  { id: 'flashcards' as View, label: 'Flashcards', icon: Brain },
  { id: 'scraper' as View, label: 'Web Scraper', icon: Globe },
]

export function Sidebar({ currentView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Knowledge Hub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                currentView === item.id
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  )
}
