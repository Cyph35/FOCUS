import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ChevronDown, ChevronUp, Percent, Info, Activity, Brain, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnimatedPercentage } from './AnimatedPercentage';

interface PercentageBreakdownCardProps {
  rawPhysical: number;
  rawCognitive: number;
  rawTotal: number;
  vitalityPercent: number;
  resultLabel: string;
  dotColor: string;
}

export default function PercentageBreakdownCard({
  rawPhysical = 12,
  rawCognitive = 11,
  rawTotal = 23,
  vitalityPercent = 57,
  resultLabel = 'Mildly Fatigued',
  dotColor = '#E5A93C',
}: PercentageBreakdownCardProps) {
  const [showFormula, setShowFormula] = useState(false);

  const physicalPercent = Math.round((rawPhysical / 20) * 100);
  const cognitivePercent = Math.round((rawCognitive / 20) * 100);
  const fatigueLoadPercent = Math.round((rawTotal / 40) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28 }}
      className="w-full bg-white rounded-[24px] border border-[#E8E3D9] overflow-hidden shadow-sm mb-8"
    >
      {/* Header */}
      <div className="p-6 sm:p-7 border-b border-[#E8E3D9] bg-gradient-to-r from-[#FAF8F5] to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-800 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-sans font-bold text-[#332A25] flex items-center gap-2">
              Percentage Calculations & Breakdown
            </h3>
            <p className="text-xs sm:text-sm text-[#594A42]/70 font-medium">
              Statistical conversion of your responses into calibrated fatigue metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFormula(!showFormula)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F0E6] hover:bg-[#E8E3D9] text-[#594A42] font-semibold text-xs transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showFormula ? 'Hide Formula' : 'View Formula'}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          
          {/* Physical Fatigue % */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-[#594A42]/70 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#7A6455]" />
                Physical Fatigue
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E3D9] text-[#594A42]">
                {rawPhysical} / 20 pts
              </span>
            </div>
            
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <AnimatedPercentage
                  value={physicalPercent}
                  className="text-3xl sm:text-4xl font-bold font-sans text-[#332A25] tracking-tight"
                />
                <span className="text-xs font-semibold text-[#594A42]/60">intensity</span>
              </div>
            </div>

            <div className="w-full bg-[#E8E3D9]/60 h-2 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${physicalPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-[#7A6455] rounded-full"
              />
            </div>
          </div>

          {/* Cognitive Fatigue % */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-[#594A42]/70 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-[#7A6455]" />
                Cognitive Fatigue
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E3D9] text-[#594A42]">
                {rawCognitive} / 20 pts
              </span>
            </div>
            
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <AnimatedPercentage
                  value={cognitivePercent}
                  className="text-3xl sm:text-4xl font-bold font-sans text-[#332A25] tracking-tight"
                />
                <span className="text-xs font-semibold text-[#594A42]/60">mental load</span>
              </div>
            </div>

            <div className="w-full bg-[#E8E3D9]/60 h-2 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cognitivePercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.35 }}
                className="h-full bg-[#7A6455] rounded-full"
              />
            </div>
          </div>

          {/* Overall Vitality / Energy Index % */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] p-5 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-[#594A42]/70 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Vitality & Energy
              </span>
              <span 
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E3D9] text-[#594A42] flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                {resultLabel}
              </span>
            </div>
            
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <AnimatedPercentage
                  value={vitalityPercent}
                  className="text-3xl sm:text-4xl font-bold font-sans text-[#332A25] tracking-tight"
                />
                <span className="text-xs font-semibold text-[#594A42]/60">capacity</span>
              </div>
            </div>

            <div className="w-full bg-[#E8E3D9]/60 h-2 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${vitalityPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                className="h-full rounded-full"
                style={{ backgroundColor: dotColor }}
              />
            </div>
          </div>

        </div>

        {/* Visual Stacked Balance Bar */}
        <div className="bg-[#FAF8F5]/80 rounded-2xl border border-[#E8E3D9] p-5 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#594A42]">
              Cumulative Fatigue Load Distribution ({rawTotal} / 40 Max)
            </span>
            <span className="text-xs font-semibold text-[#594A42]/80">
              Total Fatigue Load: <AnimatedPercentage value={fatigueLoadPercent} className="font-bold text-[#332A25]" />
            </span>
          </div>

          <div className="w-full h-4 bg-[#E8E3D9] rounded-full overflow-hidden flex p-0.5 gap-0.5">
            {/* Physical slice */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(rawPhysical / 40) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              title={`Physical: ${(rawPhysical / 40) * 100}%`}
              className="h-full bg-[#7A6455] rounded-l-full relative"
            />
            {/* Cognitive slice */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(rawCognitive / 40) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              title={`Cognitive: ${(rawCognitive / 40) * 100}%`}
              className="h-full bg-[#9E8777] rounded-r-full relative"
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-[11px] text-[#594A42]/75 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A6455]" />
              <span>Physical Load ({Math.round((rawPhysical / 40) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9E8777]" />
              <span>Cognitive Load ({Math.round((rawCognitive / 40) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-2 text-[#594A42]/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8E3D9]" />
              <span>Remaining Reserve ({Math.max(0, 100 - fatigueLoadPercent)}%)</span>
            </div>
          </div>
        </div>

        {/* Expandable Mathematical Formula Explanation */}
        <AnimatePresence>
          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-[#E8E3D9] text-xs text-[#594A42] leading-relaxed flex flex-col gap-2.5 bg-[#FAF8F5] p-4 rounded-xl">
                <div className="font-bold text-[#332A25] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-700" />
                  Calculation Methodology:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                  <div className="bg-white p-3 rounded-lg border border-[#E8E3D9]/80">
                    <span className="font-semibold text-[#332A25] block mb-1">1. Subscale Percentages:</span>
                    <code>Physical % = (Raw Physical / 20) × 100 = {physicalPercent}%</code><br />
                    <code>Cognitive % = (Raw Cognitive / 20) × 100 = {cognitivePercent}%</code>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#E8E3D9]/80">
                    <span className="font-semibold text-[#332A25] block mb-1">2. Overall Vitality Score:</span>
                    <code>Vitality % = 100 - [((Total - 10) / 30) × 100] = {vitalityPercent}%</code>
                    <p className="text-[10px] text-[#594A42]/60 mt-1">Calibrated from minimum baseline (10 pts) to maximum fatigue (40 pts).</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
