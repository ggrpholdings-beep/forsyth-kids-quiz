import { QuizQuestion as QuizQuestionType } from "@/lib/types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedOption: string | null;
  onSelect: (value: string) => void;
}

export default function QuizQuestion({
  question,
  selectedOption,
  onSelect,
}: QuizQuestionProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-[40px] block mb-3">{question.icon}</span>
        <h2 className="text-[clamp(22px,5vw,28px)] font-bold text-[#002147] mb-2 tracking-tight">
          {question.question}
        </h2>
        <p className="text-sm text-[#7B8A92]">{question.subtitle}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`
                w-full py-4 px-5 rounded-[14px] border-2 text-left
                flex items-center gap-3 transition-all duration-200
                ${
                  isSelected
                    ? "border-[#002147] bg-[#E8F0E0] shadow-[0_0_0_3px_rgba(0,33,71,0.1)]"
                    : "border-gray-200 bg-white hover:border-[#9DC183] hover:bg-[#F2F7ED] hover:-translate-y-0.5 hover:shadow-md"
                }
              `}
            >
              <span className="text-[22px] flex-shrink-0">{opt.emoji}</span>
              <span className="font-medium text-[16px] text-[#37474F]">
                {opt.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-[#002147] font-bold text-lg">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
