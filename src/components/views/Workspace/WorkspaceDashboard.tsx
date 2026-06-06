import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Table2, Presentation, Plus, CheckCircle2, Circle,
  Trash2, ChevronDown, ArrowRight, X, Loader2,
} from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { PinnedItem, Task } from '@/types';
import { cn } from '@/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'in-progress' | 'done';

// ─── Pinned Card ─────────────────────────────────────────────────────────────

const typeIconMap = { note: FileText, table: Table2, canvas: Presentation };
const typeLabel   = { note: 'NOTE', table: 'TABLE', canvas: 'CANVAS' };

const PinnedCard: React.FC<{ item: PinnedItem; onClick: () => void }> = ({ item, onClick }) => {
  const Icon = typeIconMap[item.type];
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="min-w-[160px] max-w-[180px] p-4 rounded-2xl border bg-white shadow-sm cursor-pointer text-left flex flex-col gap-3 border-stone-200 hover:shadow-md transition-all shrink-0"
    >
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
      </div>
      <span className="text-[10px] font-bold tracking-widest text-stone-400">{typeLabel[item.type]}</span>
    </motion.button>
  );
};

// ─── Move Dropdown ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const MoveMenu: React.FC<{
  current: TaskStatus;
  onMove: (s: TaskStatus) => void;
  onClose: () => void;
}> = ({ current, onMove, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden w-36"
    >
      {STATUS_OPTIONS.filter((o) => o.value !== current).map((opt) => (
        <button
          key={opt.value}
          onClick={() => { onMove(opt.value); onClose(); }}
          className="w-full text-left text-sm px-3 py-2 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 transition-colors"
        >
          <ArrowRight size={13} />
          {opt.label}
        </button>
      ))}
    </motion.div>
  );
};

// ─── Task Row ─────────────────────────────────────────────────────────────────

const TaskRow: React.FC<{ task: Task }> = ({ task }) => {
  const { updateTask, deleteTask } = useWorkspaceStore();
  const [showMenu, setShowMenu] = useState(false);
  const isDone = task.status === 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0 group"
    >
      {/* Toggle */}
      <button
        onClick={() => updateTask(task.id, { status: isDone ? 'todo' : 'done' })}
        className="mt-0.5 shrink-0 transition-transform active:scale-90"
        aria-label="Toggle done"
      >
        {isDone
          ? <CheckCircle2 size={20} className="text-green-500" />
          : <Circle size={20} className="text-stone-300 group-hover:text-amber-500 transition-colors" />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-gray-900 leading-snug', isDone && 'line-through text-gray-400')}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
        )}
        <div className="flex gap-1.5 flex-wrap mt-1.5">
          {task.tags.map((tag, i) => (
            <span key={i} className={cn('text-[10px] px-2 py-0.5 rounded-md font-semibold', tag.color)}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {/* Move */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Move"
          >
            <ChevronDown size={14} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <MoveMenu
                current={task.status}
                onMove={(s) => updateTask(task.id, { status: s })}
                onClose={() => setShowMenu(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Delete */}
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Add Task Modal ───────────────────────────────────────────────────────────

const TAG_PRESETS = [
  { label: 'Design', color: 'bg-pink-100 text-pink-700' },
  { label: 'Engineering', color: 'bg-blue-100 text-blue-700' },
  { label: 'Research', color: 'bg-green-100 text-green-700' },
  { label: 'Content', color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Infrastructure', color: 'bg-gray-100 text-gray-700' },
  { label: 'Marketing', color: 'bg-purple-100 text-purple-700' },
];

const AddTaskModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addTask } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [selectedTags, setSelectedTags] = useState<typeof TAG_PRESETS>([]);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const toggleTag = (tag: typeof TAG_PRESETS[0]) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.label === tag.label)
        ? prev.filter((t) => t.label !== tag.label)
        : [...prev, tag],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setTimeout(() => {
      addTask({
        id: `t${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        tags: selectedTags,
      });
      setSaving(false);
      onClose();
    }, 280);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 48, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900">New Task</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 transition-colors text-stone-500"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Task name *</label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Write product brief..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8b5a46]/30 focus:border-[#8b5a46] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8b5a46]/30 focus:border-[#8b5a46] transition resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Column</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-semibold border transition-all',
                    status === opt.value
                      ? 'bg-[#8b5a46] text-white border-[#8b5a46] shadow-sm'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-[#c49a87]',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_PRESETS.map((tag) => {
                const active = selectedTags.find((t) => t.label === tag.label);
                return (
                  <button
                    type="button"
                    key={tag.label}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all',
                      active
                        ? cn(tag.color, 'border-current shadow-sm scale-105')
                        : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300',
                    )}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim() || saving}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mt-2',
              title.trim()
                ? 'bg-[#8b5a46] hover:bg-[#7a4f3e] text-white shadow-sm hover:shadow-md'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed',
            )}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? 'Adding…' : 'Add Task'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── WorkspaceDashboard ───────────────────────────────────────────────────────

export const WorkspaceDashboard: React.FC = () => {
  const { pinnedItems, tasks, setWorkspaceSubView } = useWorkspaceStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';

  const todoTasks      = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks      = tasks.filter((t) => t.status === 'done');
  const totalDone      = doneTasks.length;
  const progress       = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;

  const handlePinnedClick = (item: PinnedItem) => {
    if (item.type === 'note') setWorkspaceSubView('notes');
    else if (item.type === 'table') setWorkspaceSubView('table');
    else if (item.type === 'canvas') setWorkspaceSubView('canvas');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="h-full overflow-y-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 pb-32 space-y-8">

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
            workspace!
          </h1>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="relative overflow-hidden rounded-[28px] bg-[#8b5a46] text-white p-7 flex items-center justify-between"
          >
            <div className="relative z-10">
              <p className="text-xl font-bold mb-1">{greeting}</p>
              <p className="text-white/75 text-sm font-medium leading-relaxed">
                Ready to create<br />something amazing?
              </p>
            </div>

            {/* Progress ring */}
            <div className="relative z-10 flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4.5" />
                  <circle
                    cx="24" cy="24" r="19"
                    fill="none" stroke="white" strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 19}`}
                    strokeDashoffset={`${2 * Math.PI * 19 * (1 - progress / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">{progress}%</span>
              </div>
              <p className="text-white/70 text-[10px] font-medium">done</p>
              <p className="text-white text-xs font-bold">{totalDone}/{tasks.length}</p>
            </div>

            {/* Decoration */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -left-6 -bottom-8 w-40 h-40 bg-black/10 rounded-full pointer-events-none" />
          </motion.div>

          {/* Pinned to Desk */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-widest text-stone-400 uppercase">Pinned to Desk</h2>
              <button className="text-xs font-medium text-[#8b5a46] hover:opacity-75 transition-opacity">View all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {pinnedItems.map((item) => (
                <div key={item.id} className="snap-start">
                  <PinnedCard item={item} onClick={() => handlePinnedClick(item)} />
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="min-w-[120px] p-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-[#8b5a46] hover:border-[#c49a87] hover:bg-amber-50/30 transition-all cursor-pointer snap-start shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-medium">Pin item</span>
              </motion.button>
            </div>
          </section>

          {/* To Do Board */}
          <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">To Do Board</h2>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAddModal(true)}
                id="add-task-btn"
                className="flex items-center gap-1.5 text-sm font-semibold bg-[#8b5a46] hover:bg-[#7a4f3e] text-white px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                <Plus size={16} />
                New Task
              </motion.button>
            </div>

            {/* Columns */}
            <div className="space-y-4">
              {/* To Do */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">To Do</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                      {todoTasks.length}
                    </span>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-[#8b5a46] hover:text-white text-stone-500 flex items-center justify-center transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="px-4 divide-y divide-stone-50">
                  <AnimatePresence mode="popLayout">
                    {todoTasks.map((task) => <TaskRow key={task.id} task={task} />)}
                  </AnimatePresence>
                  {todoTasks.length === 0 && (
                    <p className="text-xs text-stone-400 py-4 text-center">All clear! Add a new task.</p>
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-amber-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">In Progress</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                    {inProgressTasks.length}
                  </span>
                </div>
                <div className="px-4 divide-y divide-stone-50">
                  <AnimatePresence mode="popLayout">
                    {inProgressTasks.map((task) => <TaskRow key={task.id} task={task} />)}
                  </AnimatePresence>
                  {inProgressTasks.length === 0 && (
                    <p className="text-xs text-stone-400 py-4 text-center">Nothing in progress yet.</p>
                  )}
                </div>
              </div>

              {/* Done */}
              {doneTasks.length > 0 && (
                <div className="bg-green-50/50 rounded-2xl border border-green-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-green-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs font-bold tracking-wider text-green-600 uppercase">Completed</span>
                    </div>
                    <span className="text-xs font-semibold text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                      {doneTasks.length}
                    </span>
                  </div>
                  <div className="px-4 divide-y divide-green-50">
                    <AnimatePresence mode="popLayout">
                      {doneTasks.map((task) => <TaskRow key={task.id} task={task} />)}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </>
  );
};
