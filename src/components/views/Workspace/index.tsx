import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Table2, Presentation, Plus } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { WorkspaceDashboard } from './WorkspaceDashboard';
import { DocsView } from './modules/DocsView';
import { DatabaseView } from './modules/DatabaseView';
import { CanvasView } from './modules/CanvasView';
import { cn } from '@/utils';

const FAB_ITEMS = [
  { icon: FileText, label: 'Note', sub: 'notes' as const, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { icon: Table2, label: 'Table', sub: 'table' as const, color: 'bg-stone-100 text-stone-700 hover:bg-stone-200' },
  { icon: Presentation, label: 'Canvas', sub: 'canvas' as const, color: 'bg-stone-100 text-stone-700 hover:bg-stone-200' },
];

const WorkspaceFAB: React.FC = () => {
  const { setWorkspaceSubView } = useWorkspaceStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex flex-col items-end gap-2"
          >
            {FAB_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setWorkspaceSubView(item.sub); setOpen(false); }}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-md border border-white/60 backdrop-blur-sm transition-all',
                  item.color
                )}
              >
                <item.icon size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-2xl bg-[#8b5a46] text-white shadow-xl shadow-[#8b5a46]/30 flex items-center justify-center transition-colors hover:bg-[#7a4f3e]"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <Plus size={26} strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </div>
  );
};



export const WorkspaceView: React.FC = () => {
  const { workspaceSubView } = useWorkspaceStore();

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {workspaceSubView === 'dashboard' && <WorkspaceDashboard key="dashboard" />}
          {workspaceSubView === 'notes'     && <DocsView key="notes" />}
          {workspaceSubView === 'table'     && <DatabaseView key="table" />}
          {workspaceSubView === 'canvas'    && <CanvasView key="canvas" />}
        </AnimatePresence>

        {/* FAB — only on dashboard */}
        {workspaceSubView === 'dashboard' && <WorkspaceFAB />}
      </div>
    </div>
  );
};
