import { motion } from 'motion/react';
import { Sparkles, Brain, Heart, Wind, Moon, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SkeletalResultsLoaderProps {
  onComplete?: () => void;
}

export default function SkeletalResultsLoader({ onComplete }: SkeletalResultsLoaderProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    { text: 'Harmonizing assessment metrics...', icon: Brain },
    { text: 'Analyzing physical & mental exertion...', icon: Heart },
    { text: 'Evaluating sleep & restorative patterns...', icon: Moon },
    { text: 'Formulating personalized suggestions...', icon: Sparkles },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
    }, 450);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete, phases.length]);

  const CurrentIcon = phases[phaseIndex].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl flex flex-col items-center mx-auto px-4 py-8 relative z-10"
    >
      {/* Cozy Center Pulse & Status */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="relative mb-6">
          {/* Glowing Ambient Rings */}
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-breathe" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-[#E8E3D9] shadow-lg flex items-center justify-center text-[#7A6455]">
            <motion.div
              key={phaseIndex}
              initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CurrentIcon className="w-9 h-9 sm:w-11 sm:h-11 stroke-[1.5] text-[#594A42]" />
            </motion.div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <motion.p
          key={phases[phaseIndex].text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base sm:text-lg font-serif font-semibold italic text-[#594A42]"
        >
          {phases[phaseIndex].text}
        </motion.p>
        <span className="text-xs tracking-widest uppercase font-semibold text-[#594A42]/60 mt-1">
          Please wait a moment
        </span>

        {/* Mini progress bar */}
        <div className="w-48 h-1.5 bg-[#E8E3D9] rounded-full mt-4 overflow-hidden">
          <motion.div
            initial={{ width: '15%' }}
            animate={{ width: `${((phaseIndex + 1) / phases.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-[#7A6455] to-amber-600 rounded-full"
          />
        </div>
      </div>

      {/* Skeletal UI Cards Mimicking Results Screen */}
      <div className="w-full flex flex-col gap-6 opacity-75 select-none pointer-events-none">
        
        {/* Status Card Skeleton */}
        <div className="bg-white rounded-[24px] border border-[#E8E3D9] p-6 sm:p-8 md:p-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col items-center md:items-start w-full max-w-sm">
            <div className="w-36 h-3 bg-[#E8E3D9]/70 rounded-full mb-4 animate-shimmer" />
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-amber-200 animate-pulse" />
              <div className="w-44 h-9 bg-[#E8E3D9] rounded-lg animate-shimmer" />
            </div>
            <div className="w-56 h-3 bg-[#E8E3D9]/60 rounded-md animate-shimmer" />
          </div>

          <div className="w-28 h-28 rounded-full border-8 border-[#E8E3D9] animate-pulse flex items-center justify-center">
            <div className="w-12 h-6 bg-[#E8E3D9] rounded-md animate-shimmer" />
          </div>
        </div>

        {/* Levels Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          <div className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div className="w-36 h-4 bg-[#E8E3D9] rounded-md animate-shimmer" />
              <div className="w-16 h-6 bg-[#E8E3D9] rounded-md animate-shimmer" />
            </div>
            <div className="w-full h-3.5 sm:h-4 bg-[#F4F0E6] rounded-full overflow-hidden">
              <div className="h-full bg-[#E8E3D9] w-3/5 rounded-full animate-shimmer" />
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div className="w-36 h-4 bg-[#E8E3D9] rounded-md animate-shimmer" />
              <div className="w-16 h-6 bg-[#E8E3D9] rounded-md animate-shimmer" />
            </div>
            <div className="w-full h-3.5 sm:h-4 bg-[#F4F0E6] rounded-full overflow-hidden">
              <div className="h-full bg-[#E8E3D9] w-1/2 rounded-full animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Percentage Breakdown Card Skeleton */}
        <div className="w-full bg-white rounded-[24px] border border-[#E8E3D9] p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="w-48 h-5 bg-[#E8E3D9] rounded-md animate-shimmer" />
            <div className="w-24 h-6 bg-[#E8E3D9] rounded-full animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3D9]">
                <div className="w-24 h-3 bg-[#E8E3D9] rounded mb-3 animate-shimmer" />
                <div className="w-16 h-7 bg-[#E8E3D9] rounded mb-2 animate-shimmer" />
                <div className="w-full h-2 bg-[#E8E3D9] rounded-full" />
              </div>
            ))}
          </div>
          <div className="w-full h-4 bg-[#E8E3D9] rounded-full animate-shimmer" />
        </div>

        {/* Suggestion Table Skeleton */}
        <div className="w-full bg-white rounded-[20px] border border-[#E8E3D9] overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-[#E8E3D9] bg-[#FAF8F5]">
            <div className="w-28 h-5 bg-[#E8E3D9] rounded-md animate-shimmer" />
          </div>
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2.5 w-40 shrink-0">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-300 animate-pulse" />
              <div className="w-24 h-4 bg-[#E8E3D9] rounded-md animate-shimmer" />
            </div>
            <div className="w-full flex-grow flex flex-col gap-2">
              <div className="w-full h-3.5 bg-[#E8E3D9]/80 rounded-md animate-shimmer" />
              <div className="w-4/5 h-3.5 bg-[#E8E3D9]/60 rounded-md animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Recommendations 3 Cards Skeleton */}
        <div className="w-full">
          <div className="w-56 h-6 bg-[#E8E3D9] rounded-md mb-6 animate-shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[20px] border border-[#E8E3D9] p-6 sm:p-8 flex flex-col shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#F4F0E6] mb-4 flex items-center justify-center text-[#594A42]/40">
                  {i === 1 && <Coffee className="w-5 h-5" />}
                  {i === 2 && <Wind className="w-5 h-5" />}
                  {i === 3 && <Moon className="w-5 h-5" />}
                </div>
                <div className="w-28 h-4 bg-[#E8E3D9] rounded-md mb-3 animate-shimmer" />
                <div className="w-full h-3 bg-[#E8E3D9]/70 rounded-md mb-2 animate-shimmer" />
                <div className="w-3/4 h-3 bg-[#E8E3D9]/60 rounded-md animate-shimmer" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
