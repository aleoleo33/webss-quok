import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Folder, Users, Star } from 'lucide-react';
import { cn } from '@/utils';

interface FolderData {
  id: string;
  title: string;
  count: number;
  color: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
}

const folders: FolderData[] = [
  {
    id: 'work',
    title: 'Work Projects',
    count: 12,
    color: 'bg-blue-50/50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: Folder,
  },
  {
    id: 'shared',
    title: 'Shared Assets',
    count: 45,
    color: 'bg-purple-50/50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: Users,
  },
  {
    id: 'design',
    title: 'Design System',
    count: 8,
    color: 'bg-rose-50/50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    icon: Star,
  },
  {
    id: 'archives',
    title: 'Archives',
    count: 124,
    color: 'bg-gray-50/50',
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-600',
    icon: Folder,
  },
];

const recentFiles = [
  {
    id: 'f1',
    name: 'Q3_Financial_Report.pdf',
    size: '2.4 MB',
    date: 'Oct 24, 2023',
    type: 'pdf',
    iconColor: 'text-white',
    iconBg: 'bg-red-500',
    containerBg: 'bg-red-50',
  },
];

export const DataView: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-24 px-4 md:px-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <span className="text-gray-500">Cloud Storage</span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="font-semibold text-gray-900">Documents</span>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {folders.map((folder) => {
          const Icon = folder.icon;
          return (
            <motion.div
              key={folder.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105", folder.iconBg)}>
                <Icon className={folder.iconColor} size={24} strokeWidth={2.5} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{folder.title}</h3>
              <p className="text-sm text-gray-500">{folder.count} items</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Files */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Files</h2>
        <div className="space-y-3">
          {recentFiles.map((file) => (
            <motion.div
              key={file.id}
              whileHover={{ x: 2 }}
              className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all gap-4"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", file.containerBg)}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", file.iconBg)}>
                  <span className={cn("text-[10px] font-bold", file.iconColor)}>PDF</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate mb-1">{file.name}</h4>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{file.size}</span>
                  <span className="text-gray-300">•</span>
                  <span>{file.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
