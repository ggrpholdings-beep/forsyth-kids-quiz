interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="h-1 bg-gray-200 w-full sticky top-0 z-10">
      <div
        className="h-full bg-gradient-to-r from-[#002147] to-[#9DC183] rounded-r-sm transition-all duration-400 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
