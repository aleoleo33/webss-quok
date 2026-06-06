import React from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const NfcConnectView: React.FC = () => {
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  const ringColors = ['#fcece6', '#e3baab', '#9a6b57', '#643d2c'];

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-white z-50 p-6 pt-32 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 mb-2 tracking-tight"
      >
        Welcome To Quokka.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-sm text-gray-500 mb-24"
      >
        Tap your bracelet to get started
      </motion.p>
      
      {/* NFC Animation */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-20">
        {ringColors.map((color, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full"
            style={{ 
              width: `${100 - idx * 22}%`, 
              height: `${100 - idx * 22}%`, 
              backgroundColor: color,
              zIndex: idx
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15, ease: "easeInOut" }}
          />
        ))}
        {/* Center Icon */}
        <div className="absolute z-10 w-12 h-12 flex items-center justify-center text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-11a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2h-2V9z" opacity="0" />
             <rect x="8" y="7" width="8" height="10" rx="3" fill="white" />
             <circle cx="12" cy="12" r="1.5" fill="#643d2c" />
          </svg>
        </div>
      </div>
      
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        onClick={() => setActiveView('nfc-connected')}
        className="px-12 py-3 bg-[#643d2c] text-white text-sm rounded-full font-semibold hover:bg-[#4a2b1e] transition-colors shadow-md cursor-pointer"
      >
        Connect
      </motion.button>
    </div>
  );
};
