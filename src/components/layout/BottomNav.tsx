import React from 'react';
import { Home, Radio, LayoutGrid, Database } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { ViewType } from '@/types';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView } = useWorkspaceStore();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={22} /> },
    { id: 'connect', label: 'Connect', icon: <Radio size={22} /> },
    { id: 'dashboard', label: 'Workspace', icon: <LayoutGrid size={22} /> },
    { id: 'data', label: 'Data', icon: <Database size={22} /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#f4f2ef] border-t border-gray-200/50 pb-safe pt-2 px-6 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-sm mx-auto h-16 pb-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id || (item.id === 'dashboard' && ['notes', 'table', 'canvas'].includes(activeView));
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 gap-1 transition-all",
                isActive ? "text-amber-900" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-full transition-all duration-300",
                isActive ? "bg-[#8b5a46] text-white shadow-md shadow-amber-900/20" : "bg-transparent"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-[#8b5a46]" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
