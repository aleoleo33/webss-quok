import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const SplashView: React.FC = () => {
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveView('nfc-connect');
    }, 2000);
    return () => clearTimeout(timer);
  }, [setActiveView]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        <img src="/logo-quokka.png" alt="Quokka Logo" className="w-28 h-28 object-contain" />
        <h1 className="text-4xl font-bold text-[#8b5a46] tracking-tight">Quokka</h1>
      </motion.div>
    </div>
  );
};
