import React from 'react';
import { Menu, ChevronLeft, LayoutDashboard, Watch, Database, Home } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { SidebarDrawer } from './SidebarDrawer';
import { cn } from '@/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNav = false }) => {
  const { toggleSidebar, activeView } = useWorkspaceStore();

  if (hideNav) {
    return (
      <div className="flex h-screen bg-white overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#faf8f5' }}>
      <SidebarDrawer />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-4 z-40 px-4 mb-4">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-3 flex items-center justify-between w-full max-w-sm mx-auto">
            <button
              onClick={toggleSidebar}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo-quokka.png" alt="Quokka Logo" className="w-7 h-7 object-contain" />
              <span className="font-bold text-base text-[#8b5a46]">Quokka.</span>
            </div>
            <div className="w-9" />
          </div>
        </header>

        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col",
          activeView === 'dashboard' ? 'p-0' : 'p-4 md:p-8 md:pt-6 pb-24 lg:pb-8'
        )}>
          {activeView !== 'home' && activeView !== 'dashboard' && (
            <div className="max-w-6xl mx-auto w-full mb-4 px-4 lg:px-0">
              <button
                onClick={() => useWorkspaceStore.getState().setActiveView('home')}
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors bg-white/70 px-3 py-1.5 rounded-xl border border-stone-100 hover:bg-white"
              >
                <ChevronLeft size={16} />
                Home
              </button>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 pb-safe z-50">
        <div className="flex items-center justify-around p-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'connect', icon: Watch, label: 'Connect' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Workspace' },
            { id: 'data', icon: Database, label: 'Data' },
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  useWorkspaceStore.getState().setActiveView(item.id as any);
                  if (item.id === 'dashboard') useWorkspaceStore.getState().setWorkspaceSubView('dashboard');
                }}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors",
                  isActive ? "text-[#8b5a46]" : "text-stone-400 hover:text-stone-600"
                )}
              >
                <div className={cn("p-1 rounded-lg mb-1 transition-colors", isActive && "bg-[#f5ede9]")}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
