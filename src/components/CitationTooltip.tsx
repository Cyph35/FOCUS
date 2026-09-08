import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';

interface CitationTooltipProps {
  citation: string;
}

/**
 * Subtle lightbulb affordance that reveals the "Adapted from" source text
 * for a questionnaire section. Shows on desktop hover and toggles on
 * mobile tap/click; dismisses when tapping outside or pressing Escape.
 */
export default function CitationTooltip({ citation }: CitationTooltipProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-flex items-center justify-center align-middle"
    >
      <motion.button
        type="button"
        aria-label="View citation source"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`inline-flex w-6 h-6 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
          open
            ? 'border-[#594A42] bg-[#F4F0E6] text-[#594A42] shadow-xs'
            : 'border-[#C5BDB6]/70 bg-white/70 text-[#594A42]/70 hover:border-[#594A42] hover:bg-[#F4F0E6] hover:text-[#594A42]'
        }`}
      >
        <Lightbulb className="w-3.5 h-3.5" strokeWidth={2} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="citation-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 w-[min(88vw,440px)] rounded-xl bg-[#594A42] text-[#FAF8F5] text-[13px] sm:text-sm leading-relaxed text-left shadow-lg z-50 p-4"
          >
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F4F0E6]/85 mb-1.5">
              Citation Source
            </span>
            <span className="block">{citation}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}