import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Watch, Search, Database, Home } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { ViewType } from '@/types';

export const SidebarDrawer: React.FC = () => {
  const { activeView, setActiveView, sidebarOpen, toggleSidebar } = useWorkspaceStore();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'home',      label: 'Home',      icon: <Home size={20} /> },
    { id: 'dashboard', label: 'Workspace', icon: <LayoutDashboard size={20} /> },
    { id: 'connect',   label: 'Connect',   icon: <Watch size={20} /> },
    { id: 'data',      label: 'Data',      icon: <Database size={20} /> },
  ];

  const handleNav = (id: ViewType) => {
    setActiveView(id);
    // reset workspace sub-view to dashboard when navigating back to workspace
    if (id === 'dashboard') {
      useWorkspaceStore.getState().setWorkspaceSubView('dashboard');
    }
    if (sidebarOpen) toggleSidebar();
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-stone-100 flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-[280px] opacity-100" : "w-0 opacity-0 lg:w-64 lg:opacity-100"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo-quokka.png" alt="Quokka Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="font-bold text-lg tracking-tight text-stone-800">Quokka</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
            <input
              type="text"
              placeholder="Search…"
              className="w-full bg-stone-50 text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8b5a46]/20 border border-transparent focus:border-[#c49a87]/30 transition-all text-stone-700 placeholder-stone-400"
            />
          </div>

          {/* Nav */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#f5ede9] text-[#8b5a46]"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <span className={isActive ? "text-[#8b5a46]" : "text-stone-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User */}
        <div className="mt-auto p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#f5ede9] flex items-center justify-center text-[#8b5a46] font-bold text-sm shrink-0">
              M
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-stone-900 truncate">MyBook Hype AMD</p>
              <p className="text-xs text-stone-500 truncate">Pro Workspace</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
