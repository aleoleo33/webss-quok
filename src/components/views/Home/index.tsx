import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Radio, Database } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const HomeView: React.FC = () => {
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  return (
    <div className="relative min-h-full pb-20 max-w-6xl mx-auto pt-6 px-4 md:px-8">
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#fbf9f6]">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[50%] bg-[#f3d9ce]/60 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-30%] w-[90%] h-[60%] bg-[#e8ded6]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[10%] w-[80%] h-[50%] bg-[#f3d9ce]/40 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 lg:col-span-4 mb-2 md:mb-6"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 md:p-12 shadow-sm border border-white">
            <p className="text-2xl md:text-4xl font-medium text-gray-800 leading-tight max-w-2xl">
              Your ecosystem is<br />
              harmonized and ready for the<br />
              day's tasks.
            </p>
          </div>
        </motion.div>

        {/* Workspace Card - Large */}
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('dashboard')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden bg-[#99948e] rounded-[40px] p-8 md:p-10 text-left group h-64 md:h-72 flex flex-col justify-center"
        >
          {/* Decorative Grid inside card */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3 md:gap-4 p-6 md:p-8">
              <div className="bg-white rounded-2xl" />
              <div className="bg-white rounded-2xl" />
              <div className="bg-white rounded-2xl" />
              <div className="bg-white rounded-2xl" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-6 backdrop-blur-md">
              <LayoutGrid size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Workspace</h2>
            <p className="text-white/90 font-medium text-base md:text-lg pr-12">
              Access your active projects<br />
              and tools.
            </p>
          </div>
        </motion.button>

        {/* Connect Card */}
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('connect')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#fcf1eb] rounded-[40px] p-6 text-center flex flex-col items-center justify-center h-56 md:h-72 shadow-sm border border-white hover:shadow-md transition-shadow"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-[#eccfbf] rounded-full flex items-center justify-center text-amber-900 mb-4 md:mb-6">
            <Radio size={36} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-gray-900 text-lg md:text-2xl">Connect</h3>
        </motion.button>

        {/* Data Card */}
        <motion.button
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('data')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#fcf1eb] rounded-[40px] p-6 text-center flex flex-col items-center justify-center h-56 md:h-72 shadow-sm border border-white hover:shadow-md transition-shadow"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-[#f4e4d8] rounded-full flex items-center justify-center text-amber-900 mb-4 md:mb-6">
            <Database size={36} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-gray-900 text-lg md:text-2xl">Data</h3>
        </motion.button>
      </div>
    </div>
  );
};
