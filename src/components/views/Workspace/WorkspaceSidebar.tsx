import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Database, Pen, FolderOpen, ChevronLeft, ChevronRight, Plus, Hash, ChevronDown, Settings, LayoutTemplate } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { WorkspaceSubView } from '@/types';

interface Props {
  onOpenTemplates: () => void;
}

const modules: { id: WorkspaceSubView; label: string; icon: React.ElementType }[] = [
  { id: 'docs', label: 'Docs', icon: FileText },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'canvas', label: 'Canvas', icon: Pen },
  { id: 'files', label: 'Files', icon: FolderOpen },
];

export const WorkspaceSidebar: React.FC<Props> = ({ onOpenTemplates }) => {
  const { workspaceSubView, setWorkspaceSubView, workspaceSidebarCollapsed, toggleWorkspaceSidebar, pages, activePageId, setActivePageId } = useWorkspaceStore();
  const collapsed = workspaceSidebarCollapsed;

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col bg-[#fafafa] border-r border-gray-100 shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="h-14 flex items-center px-3 shrink-0 border-b border-gray-100 justify-between">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">Q</div>
            <span className="font-semibold text-sm text-gray-900 truncate">Workspace</span>
          </motion.div>
        )}
        <button
          onClick={toggleWorkspaceSidebar}
          className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-all shrink-0", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Modules */}
      <div className={cn("p-2 border-b border-gray-100 space-y-0.5", collapsed && "px-1.5")}>
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 pb-1.5 pt-1.5">
            Modules
          </p>
        )}
        {modules.map(({ id, label, icon: Icon }) => {
          const active = workspaceSubView === id;
          return (
            <button
              key={id}
              onClick={() => setWorkspaceSubView(id)}
              title={collapsed ? label : undefined}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-lg transition-all text-sm font-medium',
                collapsed ? 'justify-center p-2' : 'px-3 py-2',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon
                size={15}
                className={active ? 'text-indigo-600' : 'text-gray-400'}
                strokeWidth={active ? 2.5 : 2}
              />
              {!collapsed && <span className="tracking-tight">{label}</span>}
            </button>
          );
        })}
      </div>

      {/* Page tree — only visible in Docs mode */}
      <AnimatePresence>
        {!collapsed && workspaceSubView === 'docs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto thin-scrollbar p-2"
          >
            <div className="flex items-center justify-between px-2 py-1.5 mb-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Pages</p>
              <button className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-all">
                <Plus size={12} />
              </button>
            </div>
            {pages.map(page => (
              <PageItem key={page.id} page={page} activePageId={activePageId} onSelect={setActivePageId} depth={0} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!collapsed && (
        <div className="p-2 border-t border-gray-100 space-y-0.5 shrink-0">
          <button onClick={onOpenTemplates} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <LayoutTemplate size={16} className="text-gray-400" />
            Templates
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <Settings size={16} className="text-gray-400" />
            Settings
          </button>
        </div>
      )}
    </motion.aside>
  );
};

const PageItem: React.FC<{ page: ReturnType<typeof useWorkspaceStore.getState>['pages'][0]; activePageId: string; onSelect: (id: string) => void; depth: number }> = ({ page, activePageId, onSelect, depth }) => {
  const [expanded, setExpanded] = React.useState(false);
  const isActive = activePageId === page.id;
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1.5 rounded-lg cursor-pointer transition-all px-2 py-1.5 text-sm',
          isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => onSelect(page.id)}
      >
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="w-4 h-4 flex items-center justify-center shrink-0 text-gray-400">
            <ChevronDown size={12} className={cn('transition-transform', expanded ? 'rotate-0' : '-rotate-90')} />
          </button>
        ) : (
          <Hash size={12} className="text-gray-300 shrink-0" />
        )}
        <span className="text-sm mr-1">{page.emoji}</span>
        <span className="truncate text-[13px]">{page.title}</span>
      </div>
    </div>
  );
};
