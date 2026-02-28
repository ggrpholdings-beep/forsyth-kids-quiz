import { ScoredActivity } from "@/lib/types";
import { ExternalLink, Phone, MapPin } from "lucide-react";

interface ResultCardProps {
  activity: ScoredActivity;
  rank: number;
  onClick: () => void;
}

const rankEmojis = ["🥇", "🥈", "🥉"];

export default function ResultCard({ activity, rank, onClick }: ResultCardProps) {
  const isTop = rank === 1;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isTop
          ? "border-2 border-[#002147] shadow-[0_4px_20px_rgba(0,33,71,0.1)]"
          : "border border-gray-100 shadow-sm"
      }`}
    >
      {/* Top bar */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between ${
          isTop
            ? "bg-gradient-to-r from-[#002147] to-[#0A3A6B]"
            : "bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-bold ${
              isTop ? "text-white" : rank <= 3 ? "text-yellow-600" : "text-gray-400"
            }`}
          >
            {rank <= 3 ? rankEmojis[rank - 1] : rank}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
              isTop
                ? "bg-[#9DC183] text-[#002147]"
                : "bg-[#E8F0E0] text-[#002147]"
            }`}
          >
            {activity.matchPercent}% match
          </span>
        </div>

        <div className="flex gap-1.5">
          {activity.badges.map((badge) => (
            <span
              key={badge}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                badge === "Featured Partner"
                  ? isTop
                    ? "bg-[#F7E9C7] text-[#002147]"
                    : "bg-[#FBF4E4] text-[#002147]"
                  : isTop
                  ? "bg-white/20 text-white"
                  : "bg-purple-50 text-purple-700"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-[#002147] mb-1">
              {activity.name}
            </h3>
            <span className="bg-[#E8F0E0] text-[#37474F] px-2 py-0.5 rounded-md text-xs font-medium">
              {activity.category}
            </span>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-yellow-500 text-sm">
              {"★".repeat(Math.floor(activity.rating))}{" "}
              <span className="text-[#7B8A92] text-xs">{activity.rating}</span>
            </div>
            <div className="text-[11px] text-[#7B8A92]">
              {activity.reviewCount} reviews
            </div>
          </div>
        </div>

        <p className="text-sm text-[#7B8A92] leading-relaxed mb-3">
          {activity.description.length > 130
            ? activity.description.substring(0, 130) + "..."
            : activity.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7B8A92] mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {activity.address}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {activity.phone}
          </span>
        </div>

        <div className="flex gap-2" onClick={onClick}>
          <a
            href={activity.directoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-[#002147] text-white rounded-lg text-sm font-semibold text-center hover:bg-[#0A3A6B] transition-colors"
          >
            View Full Profile
          </a>
          <a
            href={activity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-white text-[#002147] border-[1.5px] border-[#002147] rounded-lg text-sm font-semibold text-center hover:bg-[#F2F7ED] transition-colors flex items-center justify-center gap-1"
          >
            Visit Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
