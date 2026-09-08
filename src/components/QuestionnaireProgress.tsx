interface QuestionnaireProgressProps {
  step: number;
  totalSteps?: number;
}

/**
 * FOCUS questionnaire progress indicator: segmented step bar with
 * "STEP X OF Y" and completion percentage. Rendered per-screen with a
 * static `step` prop (each questionnaire screen passes its own position).
 */
export default function QuestionnaireProgress({
  step,
  totalSteps = 5,
}: QuestionnaireProgressProps) {
  const clampedStep = Math.max(1, Math.min(step, totalSteps));
  const percent = Math.round((clampedStep / totalSteps) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto mt-4">
      <div className="flex items-center justify-between w-full mb-2.5">
        <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42] opacity-90">
          STEP {clampedStep} OF {totalSteps}
        </span>
        <span className="text-[10px] sm:text-xs tracking-[0.15em] font-semibold text-[#594A42]">
          {percent}% COMPLETE
        </span>
      </div>
      <div
        className="w-full flex gap-1"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={clampedStep}
        aria-label={`Questionnaire progress: step ${clampedStep} of ${totalSteps} (${percent}% complete)`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={`step-${i + 1}`}
            className={`h-1.5 sm:h-2 flex-1 rounded-full transition-colors duration-500 ${
              i < clampedStep ? 'bg-[#594A42]' : 'bg-[#E8E3D9]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}