import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { PinnedItem, Task } from '@/types';
import {
  FileText, Table2, Presentation, Clock, Plus, CheckCircle2, Circle,
  X, Trash2, ChevronDown, ArrowRight, Loader2,
} from 'lucide-react';
import { cn } from '@/utils';

// ─── Pinned Card ────────────────────────────────────────────────────────────

const PinnedCard: React.FC<{ item: PinnedItem }> = ({ item }) => {
  const Icon = item.type === 'note' ? FileText : item.type === 'table' ? Table2 : Presentation;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        'min-w-[240px] p-5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all hover:shadow-md',
        item.color.split(' ')[1],
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn('p-2.5 rounded-xl', item.color.split(' ')[0], item.color.split(' ')[2])}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
      <div className="flex items-center text-xs text-gray-500 gap-1.5">
        <Clock size={12} />
        <span>{item.updatedAt}</span>
      </div>
    </motion.div>
  );
};

// ─── Status Move Dropdown ────────────────────────────────────────────────────

type TaskStatus = 'todo' | 'in-progress' | 'done';

const statusOptions: { value: TaskStatus; label: string }[] = [
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
      {statusOptions.filter((o) => o.value !== current).map((opt) => (
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

// ─── Task Card ───────────────────────────────────────────────────────────────

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { updateTask, deleteTask } = useWorkspaceStore();
  const [showMenu, setShowMenu] = useState(false);

  const isDone = task.status === 'done';

  const handleToggle = () => {
    updateTask(task.id, { status: isDone ? 'todo' : 'done' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start gap-3">
        {/* Toggle Done */}
        <button
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
          aria-label="Toggle done"
        >
          {isDone
            ? <CheckCircle2 className="text-green-500" size={20} />
            : <Circle className="text-gray-300 group-hover:text-amber-400 transition-colors" size={20} />
          }
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-medium mb-1 leading-snug', isDone && 'line-through text-gray-400')}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag, i) => (
              <span key={i} className={cn('text-[10px] px-2 py-0.5 rounded-md font-medium', tag.color)}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Move column */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Move task"
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
            className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
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

const AddTaskModal: React.FC<{
  defaultStatus: TaskStatus;
  onClose: () => void;
}> = ({ defaultStatus, onClose }) => {
  const { addTask } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
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
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">New Task</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Task name *</label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Write product brief..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Column</label>
            <div className="flex gap-2">
              {statusOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                    status === opt.value
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_PRESETS.map((tag) => {
                const active = selectedTags.find((t) => t.label === tag.label);
                return (
                  <button
                    type="button"
                    key={tag.label}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-all',
                      active
                        ? cn(tag.color, 'border-current shadow-sm')
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300',
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
              'w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
              title.trim()
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
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

// ─── Dashboard View ───────────────────────────────────────────────────────────

const COLUMN_META: Record<TaskStatus, { title: string; accent: string; bg: string }> = {
  'todo': { title: 'To Do', accent: 'bg-gray-400', bg: 'bg-gray-50/50' },
  'in-progress': { title: 'In Progress', accent: 'bg-amber-400', bg: 'bg-amber-50/30' },
  'done': { title: 'Done', accent: 'bg-green-400', bg: 'bg-green-50/30' },
};

export const DashboardView: React.FC = () => {
  const { pinnedItems, tasks } = useWorkspaceStore();
  const [addModal, setAddModal] = useState<TaskStatus | null>(null);

  const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return ['Good', 'morning'];
    if (hour < 18) return ['Good', 'afternoon'];
    return ['Good', 'evening'];
  };

  const [greeting1, greeting2] = timeGreeting();

  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0;

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] bg-[#8c5946] text-white p-8 md:p-12 flex justify-between items-center"
        >
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-5 leading-[1.1]">
              {greeting1} <br />
              {greeting2},
            </h1>
            <p className="text-white/80 text-xl md:text-2xl font-medium leading-[1.3]">
              Ready to create<br />
              something<br />
              amazing?
            </p>
          </div>

          {/* Progress badge */}
          <div className="hidden md:flex flex-col items-center gap-2 relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none" stroke="white" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{progress}%</span>
            </div>
            <p className="text-white/80 text-xs font-medium">Tasks done</p>
            <p className="text-white text-sm font-semibold">{totalDone}/{tasks.length}</p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute right-0 md:right-52 top-1/2 -translate-y-1/2 translate-x-1/4 md:translate-x-0 opacity-80 md:opacity-100 pointer-events-none">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-white/40 to-white/5 rounded-full backdrop-blur-sm" />
              <div className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-white/30 rounded-full backdrop-blur-sm" />
              <div className="absolute -bottom-2 right-2 w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full backdrop-blur-sm" />
            </div>
          </div>
        </motion.section>

        {/* Pinned Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Pinned to Desk</h2>
            <button className="text-sm font-medium text-amber-600 hover:text-amber-700">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
            {pinnedItems.map((item) => (
              <div key={item.id} className="snap-start">
                <PinnedCard item={item} />
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="min-w-[240px] p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer snap-start"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium">Pin new item</span>
            </motion.button>
          </div>
        </section>

        {/* To Do Board */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">To Do Board</h2>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddModal('todo')}
              className="flex items-center gap-1.5 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <Plus size={16} />
              New Task
            </motion.button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(['todo', 'in-progress', 'done'] as TaskStatus[]).map((status) => {
              const columnTasks = tasks.filter((t) => t.status === status);
              const meta = COLUMN_META[status];

              return (
                <div key={status} className={cn('p-4 rounded-2xl border border-gray-100', meta.bg)}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', meta.accent)} />
                      <h3 className="font-medium text-sm text-gray-600">{meta.title}</h3>
                    </div>
                    <span className="bg-white text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {columnTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </AnimatePresence>

                    {/* Add button per column */}
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(217,119,6,0.06)' }}
                      onClick={() => setAddModal(status)}
                      className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-amber-600 rounded-xl transition-colors border border-dashed border-transparent hover:border-amber-200"
                    >
                      <Plus size={15} />
                      Add task
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {addModal !== null && (
          <AddTaskModal
            defaultStatus={addModal}
            onClose={() => setAddModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
