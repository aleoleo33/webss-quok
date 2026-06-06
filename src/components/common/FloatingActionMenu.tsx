import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Table2, Presentation } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <FileText size={20} />, label: 'Note', view: 'notes', color: 'bg-blue-100 text-blue-600' },
    { icon: <Table2 size={20} />, label: 'Table', view: 'table', color: 'bg-green-100 text-green-600' },
    { icon: <Presentation size={20} />, label: 'Canvas', view: 'canvas', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="fixed bottom-8 z-50 flex flex-col items-center" style={{ left: 'calc(50% + 128px)', transform: 'translateX(-50%)' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex items-center gap-4 mb-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveView(item.view as any);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
              >
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", item.color)}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Plus size={28} />
        </motion.div>
      </motion.button>
    </div>
  );
};
