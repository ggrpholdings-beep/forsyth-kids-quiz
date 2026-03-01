interface ProgressBarProps {
  current: number;
  total: number;
}

const ENCOURAGEMENT: Record<number, string> = {
  1: "Great start! 94% of parents who complete this find their perfect activity",
  2: "You're doing great — these details help us find the best match",
  3: "Halfway there! Your personalized results are taking shape",
  4: "Almost done — just 2 more questions",
  5: "One more! We're finalizing your top picks",
  6: "Last question — your results are almost ready!",
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  const message = ENCOURAGEMENT[current];

  return (
    <div className="w-full">
      {/* Row: "Question X of Y" ←→ "XX% complete" */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-[#37474F]">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-[#37474F]">
          {percentage}% complete
        </span>
      </div>

      {/* Track + fill */}
      <div className="h-2 w-full rounded-full bg-[#E8F0E0]">
        <div
          className="h-full rounded-full bg-[#002147] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Encouragement text */}
      {message && (
        <p className="mt-2 text-xs font-medium text-[#9DC183] text-center">
          {message}
        </p>
      )}
    </div>
  );
}
