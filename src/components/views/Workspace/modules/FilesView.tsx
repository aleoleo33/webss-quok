import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Upload, Search, FolderOpen, Clock, Users, Star, ChevronRight, MoreHorizontal, Eye, X } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { FileItem } from '@/types';

const fileTypeIcon = (type: FileItem['type']) => {
  const icons: Record<FileItem['type'], { bg: string; text: string; label: string }> = {
    pdf:    { bg: 'bg-red-100',    text: 'text-red-600',    label: 'PDF'  },
    image:  { bg: 'bg-pink-100',   text: 'text-pink-600',   label: 'IMG'  },
    doc:    { bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'DOC'  },
    sheet:  { bg: 'bg-green-100',  text: 'text-green-600',  label: 'XLS'  },
    folder: { bg: 'bg-amber-100',  text: 'text-amber-600',  label: '📁'  },
    video:  { bg: 'bg-purple-100', text: 'text-purple-600', label: 'VID'  },
  };
  return icons[type] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: 'FILE' };
};

const folders = [
  { id: 'all', label: 'All Files', icon: LayoutGrid },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'shared', label: 'Shared with me', icon: Users },
  { id: 'starred', label: 'Starred', icon: Star },
];

const tags = ['Strategy', 'Finance', 'Design', 'Research', 'Product', 'Brand', 'UX', 'Investor', 'Team'];

export const FilesView: React.FC = () => {
  const { files } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const filtered = files.filter(f => {
    const matchQuery = f.name.toLowerCase().includes(query.toLowerCase());
    const matchTag = !activeTag || f.tags.includes(activeTag);
    const matchFolder = activeFolder === 'shared' ? f.shared : true;
    return matchQuery && matchTag && matchFolder;
  });

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) { clearInterval(interval); setTimeout(() => setUploadProgress(null), 1200); return 100; }
        return prev + 12;
      });
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex overflow-hidden"
    >
      {/* Sidebar */}
      <div className="w-52 shrink-0 border-r border-gray-100 bg-gray-50/50 flex flex-col p-3 overflow-y-auto thin-scrollbar">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 pb-1.5 pt-1">Location</p>
        {folders.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveFolder(id)}
            className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full text-left', activeFolder === id ? 'bg-white text-indigo-700 shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}
          >
            <Icon size={15} className={activeFolder === id ? 'text-indigo-500' : 'text-gray-400'} />
            {label}
          </button>
        ))}

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 pb-1.5">Tags</p>
          <div className="flex flex-wrap gap-1.5 px-1">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium transition-all', activeTag === tag ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-3 px-6 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-sm text-gray-400">Files</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-sm font-semibold text-gray-900 capitalize">{folders.find(f => f.id === activeFolder)?.label}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files…"
                className="bg-transparent text-sm text-gray-700 outline-none w-40 placeholder-gray-400"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900')}>
                <LayoutGrid size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('w-7 h-7 rounded-md flex items-center justify-center transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900')}>
                <List size={14} />
              </button>
            </div>
            <button onClick={simulateUpload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">
              <Upload size={14} /> Upload
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropRef}
          className={cn('mx-6 mt-4 mb-2 rounded-xl border-2 border-dashed transition-all flex items-center justify-center py-5 cursor-pointer', isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30')}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={simulateUpload}
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-colors', isDragging ? 'bg-indigo-100' : 'bg-gray-100')}>
              <Upload size={18} className={isDragging ? 'text-indigo-600' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{isDragging ? 'Drop files to upload' : 'Drag & drop files here'}</p>
              <p className="text-xs text-gray-400">or click to browse — max 100 MB per file</p>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <FolderOpen size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No files found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4">
              {filtered.map((file, i) => {
                const ti = fileTypeIcon(file.type);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all group relative"
                    onClick={() => setPreviewFile(file)}
                  >
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-sm font-bold', ti.bg, ti.text)}>
                      {ti.label}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.size}</p>
                    {file.shared && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="Shared">
                        <Users size={10} className="text-green-600" />
                      </div>
                    )}
                    <button className="absolute bottom-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="pt-4 space-y-1">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <span>Name</span><span>Size</span><span>Modified</span><span>Tags</span><span></span>
              </div>
              {filtered.map((file, i) => {
                const ti = fileTypeIcon(file.type);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group items-center"
                    onClick={() => setPreviewFile(file)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0', ti.bg, ti.text)}>{ti.label}</div>
                      <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                      {file.shared && <Users size={12} className="text-green-500 shrink-0" />}
                    </div>
                    <span className="text-sm text-gray-500">{file.size}</span>
                    <span className="text-sm text-gray-500">{file.modified}</span>
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Eye size={14} /></button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"><MoreHorizontal size={14} /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress Toast */}
      <AnimatePresence>
        {uploadProgress !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-80"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Upload size={14} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{uploadProgress < 100 ? 'Uploading…' : 'Upload complete!'}</p>
                  <p className="text-xs text-gray-400">document.pdf</p>
                </div>
              </div>
              <button onClick={() => setUploadProgress(null)} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={14} /></button>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                animate={{ width: `${uploadProgress}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-right">{uploadProgress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Panel */}
      <AnimatePresence>
        {previewFile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setPreviewFile(null)} />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-100 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">File Info</h3>
                <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto thin-scrollbar p-6">
                <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto', fileTypeIcon(previewFile.type).bg, fileTypeIcon(previewFile.type).text)}>
                  {fileTypeIcon(previewFile.type).label}
                </div>
                <h4 className="font-semibold text-gray-900 text-center mb-1 break-all">{previewFile.name}</h4>
                <p className="text-sm text-gray-400 text-center mb-6">{previewFile.size}</p>
                {[
                  { label: 'Modified', value: previewFile.modified },
                  { label: 'Type', value: previewFile.type.toUpperCase() },
                  { label: 'Shared', value: previewFile.shared ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-xs font-medium text-gray-400">{label}</span>
                    <span className="text-sm text-gray-800">{value}</span>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {previewFile.tags.map(t => <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 space-y-2">
                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">Download</button>
                <button className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Share</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
