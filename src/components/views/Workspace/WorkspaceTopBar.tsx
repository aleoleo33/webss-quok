import React, { useState } from 'react';
import { Search, Share2, Star, MoreHorizontal, Clock, ChevronRight, Zap } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

const moduleLabels: Record<string, string> = {
  docs: 'Docs',
  database: 'Database',
  canvas: 'Canvas',
  files: 'Files',
};

export const WorkspaceTopBar: React.FC = () => {
  const { workspaceSubView, pages, activePageId } = useWorkspaceStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activePage = pages.find(p => p.id === activePageId);
  const moduleLabel = moduleLabels[workspaceSubView] ?? 'Workspace';

  return (
    <div className="h-14 flex items-center gap-4 px-6 border-b border-gray-100 bg-white shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <span className="text-gray-400 font-medium hover:text-gray-700 cursor-pointer transition-colors">Workspace</span>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-400 font-medium hover:text-gray-700 cursor-pointer transition-colors">{moduleLabel}</span>
        {workspaceSubView === 'docs' && activePage && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {activePage.emoji} {activePage.title}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-56">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              />
              <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded font-mono">ESC</kbd>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
              title="Search (⌘K)"
            >
              <Search size={16} />
            </button>
          )}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Share2 size={14} />
          <span className="hidden md:inline">Share</span>
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <Star size={16} />
        </button>

        <div className="w-px h-5 bg-gray-100 mx-1" />

        {workspaceSubView === 'docs' && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-2">
            <Clock size={12} />
            <span>{pages.find(p => p.id === activePageId)?.updatedAt ?? ''}</span>
          </div>
        )}

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm">
          <Zap size={14} />
          <span className="hidden md:inline">Actions</span>
        </button>

        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};
