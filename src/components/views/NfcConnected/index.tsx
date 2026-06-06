import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { BadgeCheck } from 'lucide-react';

export const NfcConnectedView: React.FC = () => {
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveView('home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setActiveView]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#5c3e30] z-50 p-6 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-20 tracking-tight"
      >
        You're All Set.
      </motion.h1>
      
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="w-48 h-48 bg-[#7a5445] rounded-full flex items-center justify-center mb-20 shadow-lg"
      >
        <BadgeCheck size={90} color="#5c3e30" fill="white" strokeWidth={1.5} />
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-sm text-white/90"
      >
        Your ecosystem is now harmonized.
      </motion.p>
    </div>
  );
};
