import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * "About" text trigger on the landing page that reveals a short
 * explanation of what FOCUS is. Shows on desktop hover and toggles on
 * mobile tap/click; dismisses when tapping outside or pressing Escape.
 */
export default function AboutTooltip() {
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
  }, [open ]);

  return (
    <span
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-flex items-start justify-start"
    >
      <button
        type="button"
        aria-label="About FOCUS"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        className="text-xs md:text-sm tracking-[0.25em] font-light uppercase hover:opacity-70 transition-opacity cursor-pointer"
      >
        About
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="about-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-3 w-[min(88vw,380px)] rounded-xl bg-[#594A42] text-[#FAF8F5] text-[13px] sm:text-sm leading-relaxed text-left shadow-lg z-50 p-4"
          >
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F4F0E6]/85 mb-1.5">
              About FOCUS
            </span>
            <span className="block">
              FOCUS is a short self-report questionnaire that Senior High School STEM students fill out{' '}
              <em>right after an academic assessment</em> (e.g., a quiz or exam). It measures how
              physically and mentally fatigued the student feels at that moment, gives them an
              instant plain-language result, and stores every submission so the researcher can
              analyze the data later.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
