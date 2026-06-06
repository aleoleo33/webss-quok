import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bluetooth, Clock, Battery, RefreshCw, Settings, Zap,
  Watch, Unlink, HardDrive, RotateCcw, CheckCircle2
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: EASE },
});

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}> = ({ icon, label, value, sub }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-2">
    <div className="text-amber-700 w-fit">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
  </div>
);

const deviceEvents = [
  { time: '8:10 PM', label: 'Data synced', sub: 'Workspace · 2.4 MB transferred', icon: <CheckCircle2 size={14} />, color: 'text-green-600 bg-green-50' },
  { time: '6:45 PM', label: 'Band charged', sub: '100% · USB-C', icon: <Zap size={14} />, color: 'text-blue-600 bg-blue-50' },
  { time: '4:30 PM', label: 'Firmware updated', sub: 'v2.1.4 → v2.2.0', icon: <RotateCcw size={14} />, color: 'text-amber-700 bg-amber-50' },
  { time: '9:00 AM', label: 'Band connected', sub: 'BLE 5.0 · Auto-paired', icon: <Bluetooth size={14} />, color: 'text-indigo-500 bg-indigo-50' },
  { time: '8:55 AM', label: 'Storage cleared', sub: '1.2 GB freed on device', icon: <HardDrive size={14} />, color: 'text-gray-600 bg-gray-100' },
];

export const ConnectView: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [unpairPrompt, setUnpairPrompt] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pt-6 pb-28 px-4 md:px-8">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-3">connect.</h1>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Quokka Band · Connected
          </div>
          <span className="text-gray-400 text-sm flex items-center gap-1.5">
            <Bluetooth size={13} className="text-amber-700" /> BLE 5.0
            <span className="text-gray-300">·</span>
            <Clock size={13} /> 1m ago
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Device Card + Actions */}
        <motion.div {...fadeUp(0.05)} className="lg:col-span-1 flex flex-col gap-4">

          {/* Device Visual Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <img src="/logo-quokka.png" alt="Quokka Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quokka Band</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Model QB-01 · USB Series</p>
                </div>
              </div>
              <Watch size={18} className="text-amber-700 mt-0.5" />
            </div>

            {/* Band illustration */}
            <div className="bg-[#f8f6f5] rounded-2xl aspect-square flex items-center justify-center mb-5 relative overflow-hidden group cursor-pointer">
              <div className="relative w-full h-8 flex items-center justify-center">
                <div className="absolute inset-x-0 h-4 bg-[#2a2a2a] flex items-center shadow-inner overflow-hidden">
                  <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
                </div>
                <div className="relative z-10 w-20 h-8 bg-gradient-to-b from-[#e5e5e5] to-[#c5c5c5] rounded-xl shadow-md border border-white/40 flex items-center justify-center transition-transform group-hover:scale-105">
                  <div className="w-6 h-3 bg-gray-400 rounded-full shadow-inner flex items-center justify-center">
                    <div className="w-2 h-1.5 bg-gray-600 rounded-[1px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Battery bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span className="flex items-center gap-1"><Battery size={12} /> Battery</span>
                <span className="font-semibold text-gray-800">78%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">~3 days remaining</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleSync}
              className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl py-4 shadow-sm hover:border-amber-200 hover:bg-amber-50 transition-all group cursor-pointer"
            >
              <RefreshCw size={18} className={`text-amber-700 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="text-xs font-medium text-gray-600">Sync</span>
            </button>
            <button
              onClick={() => setUnpairPrompt(true)}
              className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl py-4 shadow-sm hover:border-red-200 hover:bg-red-50 transition-all group cursor-pointer"
            >
              <Unlink size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-medium text-gray-600 group-hover:text-red-500 transition-colors">Unpair</span>
            </button>
            <button className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl py-4 shadow-sm hover:border-amber-200 hover:bg-amber-50 transition-all group cursor-pointer">
              <Settings size={18} className="text-amber-700" />
              <span className="text-xs font-medium text-gray-600">Settings</span>
            </button>
          </div>

          {/* Unpair confirm */}
          {unpairPrompt && (
            <motion.div
              {...fadeUp(0)}
              className="bg-red-50 border border-red-100 rounded-2xl p-4"
            >
              <p className="text-sm font-semibold text-red-700 mb-1">Unpair device?</p>
              <p className="text-xs text-red-400 mb-3">This will disconnect Quokka Band from your account.</p>
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl py-2 transition-colors cursor-pointer">
                  Confirm
                </button>
                <button
                  onClick={() => setUnpairPrompt(false)}
                  className="flex-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>

        {/* Right: Device Stats + Event Log */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2 flex flex-col gap-4">

          {/* Device Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard icon={<HardDrive size={18} />} label="Storage Used" value="3.2 GB" sub="of 8 GB" />
            <StatCard icon={<RefreshCw size={18} />} label="Last Synced" value="1m ago" sub="Auto-sync on" />
            <StatCard icon={<Zap size={18} />} label="Firmware" value="v2.2.0" sub="Up to date" />
          </div>

          {/* Sync Progress */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Storage</h3>
                <p className="text-xs text-gray-400 mt-0.5">On-device usage</p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">3.2 / 8 GB</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Workspace data', value: '1.8 GB', pct: 55, color: 'from-amber-500 to-amber-300' },
                { label: 'Cached files', value: '0.9 GB', pct: 27, color: 'from-gray-400 to-gray-300' },
                { label: 'System', value: '0.5 GB', pct: 15, color: 'from-gray-300 to-gray-200' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-400">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.3 as number, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Event Log */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Device Log</h3>
              <button className="text-xs text-amber-700 font-medium hover:underline cursor-pointer">See all</button>
            </div>
            <div className="space-y-3">
              {deviceEvents.map((event, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(0.2 + i * 0.06)}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${event.color}`}>
                    {event.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{event.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.sub}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{event.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
