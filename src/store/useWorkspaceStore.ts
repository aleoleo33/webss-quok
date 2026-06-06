import { create } from 'zustand';
import type { ViewType, WorkspaceSubView, PinnedItem, Task, DocPage, DatabaseColumn, DatabaseRow, CanvasNode, FileItem } from '@/types';

interface WorkspaceState {
  activeView: ViewType;
  sidebarOpen: boolean;
  workspaceSubView: WorkspaceSubView;
  workspaceSidebarCollapsed: boolean;
  activePageId: string;
  pinnedItems: PinnedItem[];
  tasks: Task[];
  pages: DocPage[];
  dbColumns: DatabaseColumn[];
  dbRows: DatabaseRow[];
  canvasNodes: CanvasNode[];
  files: FileItem[];

  setActiveView: (view: ViewType) => void;
  toggleSidebar: () => void;
  setWorkspaceSubView: (sub: WorkspaceSubView) => void;
  toggleWorkspaceSidebar: () => void;
  setActivePageId: (id: string) => void;
  addPinnedItem: (item: PinnedItem) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateCanvasNode: (id: string, updates: Partial<CanvasNode>) => void;
  addCanvasNode: (node: CanvasNode) => void;
  updateDbCell: (rowId: string, colId: string, value: string | boolean | null) => void;
}

const initialPages: DocPage[] = [
  {
    id: 'p1',
    title: 'Product Roadmap',
    emoji: '🗺️',
    createdAt: '2 days ago',
    updatedAt: '1 hour ago',
    blocks: [
      { id: 'b1', type: 'h1', content: 'Product Roadmap — Q3 2025' },
      { id: 'b2', type: 'paragraph', content: 'This document outlines the strategic product direction for Q3, including key features, milestones, and success metrics.' },
      { id: 'b3', type: 'h2', content: '🎯 Goals' },
      { id: 'b4', type: 'bullet', content: 'Ship the unified workspace module to 100 beta users' },
      { id: 'b5', type: 'bullet', content: 'Reduce onboarding drop-off rate from 62% to under 30%' },
      { id: 'b6', type: 'bullet', content: 'Achieve NPS score of 45+' },
      { id: 'b7', type: 'h2', content: '📊 Key Metrics' },
      { id: 'b8', type: 'callout', content: 'All metrics are tracked weekly in the analytics dashboard. Data refreshes every Monday 9AM WIB.', icon: '📌' },
      { id: 'b9', type: 'h2', content: '🔧 Engineering Notes' },
      { id: 'b10', type: 'code', content: '// Workspace module entry point\nexport const WorkspaceView = () => {\n  const { workspaceSubView } = useWorkspaceStore();\n  return <SubViewRouter view={workspaceSubView} />;\n};', lang: 'tsx' },
      { id: 'b11', type: 'quote', content: 'The best products are not built, they are discovered through relentless iteration.' },
    ],
    children: ['p2', 'p3'],
  },
  {
    id: 'p2',
    title: 'Design System',
    emoji: '🎨',
    createdAt: '1 week ago',
    updatedAt: '3 hours ago',
    blocks: [
      { id: 'b1', type: 'h1', content: 'Quokka Design System' },
      { id: 'b2', type: 'paragraph', content: 'A comprehensive guide to colors, typography, spacing, and components used across the platform.' },
      { id: 'b3', type: 'h2', content: 'Typography Scale' },
      { id: 'b4', type: 'paragraph', content: 'We use Inter for all UI text. Headlines are set in font-weight 700, body in 400, and labels in 500.' },
      { id: 'b5', type: 'h2', content: 'Color Tokens' },
      { id: 'b6', type: 'bullet', content: 'Primary — #0a0a0a (near black)' },
      { id: 'b7', type: 'bullet', content: 'Accent — #6366f1 (indigo-500)' },
      { id: 'b8', type: 'bullet', content: 'Surface — #ffffff' },
      { id: 'b9', type: 'bullet', content: 'Border — #e5e5e5' },
    ],
  },
  {
    id: 'p3',
    title: 'Sprint Planning',
    emoji: '⚡',
    createdAt: '4 days ago',
    updatedAt: '2 days ago',
    blocks: [
      { id: 'b1', type: 'h1', content: 'Sprint 12 Planning' },
      { id: 'b2', type: 'paragraph', content: 'Two-week sprint starting May 12. Focus areas: workspace overhaul and performance optimizations.' },
      { id: 'b3', type: 'h2', content: 'Scope' },
      { id: 'b4', type: 'numbered', content: 'Rebuild workspace shell with sub-view navigation' },
      { id: 'b5', type: 'numbered', content: 'Implement block-based docs editor' },
      { id: 'b6', type: 'numbered', content: 'Build database grid with inline editing' },
      { id: 'b7', type: 'numbered', content: 'Infinite canvas with sticky notes' },
    ],
  },
  {
    id: 'p4',
    title: 'Meeting Notes',
    emoji: '📝',
    createdAt: '1 day ago',
    updatedAt: '30 minutes ago',
    blocks: [
      { id: 'b1', type: 'h1', content: 'Team Sync — May 10, 2025' },
      { id: 'b2', type: 'paragraph', content: 'Weekly team alignment. Attendees: Fariz, Nadia, Rizki, Andi.' },
      { id: 'b3', type: 'h2', content: 'Action Items' },
      { id: 'b4', type: 'bullet', content: 'Fariz: Finalize workspace layout by EOD Friday' },
      { id: 'b5', type: 'bullet', content: 'Nadia: User testing session with 5 participants' },
      { id: 'b6', type: 'bullet', content: 'Rizki: Backend API for file upload endpoint' },
    ],
  },
];

const initialColumns: DatabaseColumn[] = [
  { id: 'name', name: 'Name', type: 'text', width: 220 },
  { id: 'status', name: 'Status', type: 'select', width: 140, options: [
    { label: 'Backlog', color: 'bg-gray-100 text-gray-600' },
    { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Done', color: 'bg-green-100 text-green-700' },
  ]},
  { id: 'priority', name: 'Priority', type: 'select', width: 120, options: [
    { label: 'Low', color: 'bg-gray-100 text-gray-500' },
    { label: 'Medium', color: 'bg-orange-100 text-orange-600' },
    { label: 'High', color: 'bg-red-100 text-red-600' },
  ]},
  { id: 'assignee', name: 'Assignee', type: 'person', width: 140 },
  { id: 'due', name: 'Due Date', type: 'date', width: 130 },
  { id: 'estimate', name: 'Estimate (h)', type: 'number', width: 120 },
];

const initialRows: DatabaseRow[] = [
  { id: 'r1', cells: { name: 'Workspace Shell Redesign', status: 'In Progress', priority: 'High', assignee: 'Fariz', due: 'May 15', estimate: '12' } },
  { id: 'r2', cells: { name: 'Block-based Editor', status: 'In Progress', priority: 'High', assignee: 'Andi', due: 'May 17', estimate: '20' } },
  { id: 'r3', cells: { name: 'Database Grid View', status: 'Review', priority: 'Medium', assignee: 'Nadia', due: 'May 20', estimate: '16' } },
  { id: 'r4', cells: { name: 'Infinite Canvas', status: 'Backlog', priority: 'Medium', assignee: 'Rizki', due: 'May 24', estimate: '24' } },
  { id: 'r5', cells: { name: 'File Manager UI', status: 'Backlog', priority: 'Low', assignee: 'Fariz', due: 'May 28', estimate: '10' } },
  { id: 'r6', cells: { name: 'User onboarding flow', status: 'Done', priority: 'High', assignee: 'Nadia', due: 'May 8', estimate: '8' } },
  { id: 'r7', cells: { name: 'API integration layer', status: 'Done', priority: 'Medium', assignee: 'Rizki', due: 'May 5', estimate: '14' } },
];

const initialCanvasNodes: CanvasNode[] = [
  { id: 'cn1', type: 'sticky', x: 120, y: 80, w: 200, h: 160, content: '🎯 Core Features\n\n1. Docs editor\n2. Database\n3. Canvas\n4. Files', color: '#fef9c3' },
  { id: 'cn2', type: 'sticky', x: 380, y: 60, w: 200, h: 160, content: '💡 Ideas\n\nAI-powered\nsummaries\n\nTemplate gallery', color: '#dbeafe' },
  { id: 'cn3', type: 'sticky', x: 640, y: 100, w: 200, h: 140, content: '⚡ Sprint 12\nGoals\n\n→ Ship by May 24', color: '#dcfce7' },
  { id: 'cn4', type: 'shape', x: 200, y: 310, w: 160, h: 80, content: 'User Research', color: '#ede9fe', shape: 'rect' },
  { id: 'cn5', type: 'shape', x: 440, y: 310, w: 160, h: 80, content: 'Design Sprints', color: '#ede9fe', shape: 'rect' },
  { id: 'cn6', type: 'shape', x: 680, y: 310, w: 160, h: 80, content: 'Build & Ship', color: '#fce7f3', shape: 'rect' },
  { id: 'cn7', type: 'text', x: 300, y: 440, w: 250, h: 40, content: 'Target: 100 beta users by Q3', color: '#0a0a0a' },
];

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'Q3_Strategy.pdf', type: 'pdf', size: '2.4 MB', modified: 'Today, 11:32', tags: ['Strategy', 'Finance'], shared: true },
  { id: 'f2', name: 'Design_Mockups_v3.fig', type: 'image', size: '18.7 MB', modified: 'Yesterday', tags: ['Design'], shared: false },
  { id: 'f3', name: 'User_Research_Report.docx', type: 'doc', size: '890 KB', modified: 'May 8', tags: ['Research', 'UX'], shared: true },
  { id: 'f4', name: 'Revenue_Model_2025.xlsx', type: 'sheet', size: '1.1 MB', modified: 'May 6', tags: ['Finance'], shared: false },
  { id: 'f5', name: 'Onboarding_Flow_v2.mp4', type: 'video', size: '45.2 MB', modified: 'May 4', tags: ['Product'], shared: false },
  { id: 'f6', name: 'Brand_Assets.zip', type: 'folder', size: '234 MB', modified: 'Apr 30', tags: ['Brand', 'Design'], shared: true },
  { id: 'f7', name: 'Pitch_Deck_Seed.pdf', type: 'pdf', size: '5.6 MB', modified: 'Apr 25', tags: ['Investor'], shared: false },
  { id: 'f8', name: 'Team_Photo.jpg', type: 'image', size: '3.2 MB', modified: 'Apr 22', tags: ['Team'], shared: true },
];

const initialPinnedItems: PinnedItem[] = [
  { id: '1', title: 'The Architecture…', type: 'note', color: 'bg-amber-50 border-amber-100 text-amber-800', updatedAt: '2 hours ago' },
  { id: '2', title: 'Q3 Manifesto Ideas', type: 'note', color: 'bg-amber-50 border-amber-100 text-amber-800', updatedAt: 'Yesterday' },
  { id: '3', title: 'Product Roadmap', type: 'canvas', color: 'bg-stone-100 border-stone-200 text-stone-700', updatedAt: '3 days ago' },
  { id: '4', title: 'Sprint 12 Planning', type: 'table', color: 'bg-stone-100 border-stone-200 text-stone-700', updatedAt: '4 days ago' },
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Design System Polish', description: 'Ensure all components align with the new premium aesthetic.', status: 'in-progress', tags: [{ label: 'Design', color: 'bg-pink-100 text-pink-700' }] },
  { id: 't2', title: 'Implement Zustand Store', status: 'done', tags: [{ label: 'Engineering', color: 'bg-blue-100 text-blue-700' }] },
  { id: 't3', title: 'Setup Vite & Tailwind', status: 'done', tags: [{ label: 'Infrastructure', color: 'bg-gray-100 text-gray-700' }] },
  { id: 't4', title: 'User testing session', status: 'todo', tags: [{ label: 'Research', color: 'bg-green-100 text-green-700' }] },
  { id: 't5', title: 'Onboarding flow copy', status: 'todo', tags: [{ label: 'Content', color: 'bg-yellow-100 text-yellow-700' }] },
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeView: 'splash',
  sidebarOpen: false,
  workspaceSubView: 'dashboard',
  workspaceSidebarCollapsed: false,
  activePageId: 'p1',
  pinnedItems: initialPinnedItems,
  tasks: initialTasks,
  pages: initialPages,
  dbColumns: initialColumns,
  dbRows: initialRows,
  canvasNodes: initialCanvasNodes,
  files: initialFiles,

  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setWorkspaceSubView: (sub) => set({ workspaceSubView: sub }),
  toggleWorkspaceSidebar: () => set((state) => ({ workspaceSidebarCollapsed: !state.workspaceSidebarCollapsed })),
  setActivePageId: (id) => set({ activePageId: id }),
  addPinnedItem: (item) => set((state) => ({ pinnedItems: [...state.pinnedItems, item] })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
  })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  updateCanvasNode: (id, updates) => set((state) => ({
    canvasNodes: state.canvasNodes.map((n) => n.id === id ? { ...n, ...updates } : n),
  })),
  addCanvasNode: (node) => set((state) => ({ canvasNodes: [...state.canvasNodes, node] })),
  updateDbCell: (rowId, colId, value) => set((state) => ({
    dbRows: state.dbRows.map((r) => r.id === rowId ? { ...r, cells: { ...r.cells, [colId]: value } } : r),
  })),
}));
