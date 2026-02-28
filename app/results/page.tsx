"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { activities } from "@/lib/activities";
import { scoreActivities, getAnswerLabel } from "@/lib/scoring";
import { quizQuestions } from "@/lib/quiz-data";
import { QuizAnswers, ScoredActivity } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import { trackEvent } from "@/lib/analytics";

const DIRECTORY_URL =
  process.env.NEXT_PUBLIC_DIRECTORY_URL || "https://forsythkidsguide.com";

function ResultsContent() {
  const searchParams = useSearchParams();

  const answers: QuizAnswers = {
    age: searchParams.get("age") || "",
    personality: searchParams.get("personality") || "",
    interest: searchParams.get("interest") || "",
    schedule: searchParams.get("schedule") || "",
    budget: searchParams.get("budget") || "",
    location: searchParams.get("location") || "",
  };

  const results: ScoredActivity[] = scoreActivities(activities, answers);

  const handleResultClick = (activity: ScoredActivity, rank: number) => {
    trackEvent("result_click", {
      activityId: activity.id,
      activityName: activity.name,
      rank,
      matchPercent: activity.matchPercent,
      tier: activity.listingTier,
    });
  };

  const answerPills = Object.entries(answers)
    .filter(([, v]) => v)
    .map(([qId, val]) => ({
      key: qId,
      label: getAnswerLabel(quizQuestions, qId, val),
    }));

  const directoryParams = new URLSearchParams();
  if (answers.age) directoryParams.set("age", answers.age);
  if (answers.interest) directoryParams.set("category", answers.interest);

  return (
    <main className="min-h-screen bg-[#FAFBF9]">
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up stagger-1">
          <div className="inline-flex items-center gap-2 bg-[#E8F0E0] text-[#002147] px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            ✨ PERSONALIZED FOR YOUR CHILD
          </div>
          <h1 className="text-[clamp(24px,5vw,34px)] font-bold text-[#002147] mb-3 tracking-tight">
            Your Top Activity Picks
          </h1>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {answerPills.map((pill) => (
              <span
                key={pill.key}
                className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-[#7B8A92]"
              >
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        {/* Result Cards */}
        <div className="flex flex-col gap-4">
          {results.map((activity, i) => (
            <div
              key={activity.id}
              className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}
            >
              <ResultCard
                activity={activity}
                rank={i + 1}
                onClick={() => handleResultClick(activity, i + 1)}
              />
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#7B8A92] text-lg mb-4">
              No matching activities found for this combination.
            </p>
            <Link
              href="/quiz"
              className="text-[#002147] font-semibold hover:underline"
            >
              Try the quiz again →
            </Link>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="mt-8 text-center animate-fade-up stagger-5">
          <a
            href={`${DIRECTORY_URL}/listings/?${directoryParams.toString()}`}
            className="block w-full py-3.5 bg-white border-2 border-[#002147] text-[#002147] rounded-xl font-semibold text-[15px] hover:bg-[#F2F7ED] transition-colors mb-3"
          >
            Browse All 300+ Activities →
          </a>

          <div className="flex gap-3 justify-center mt-4">
            <Link
              href="/quiz"
              className="text-[#7B8A92] text-sm hover:text-[#37474F] underline transition-colors"
            >
              Retake Quiz
            </Link>
          </div>

          <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 text-center">
            <p className="text-sm font-bold text-[#002147] tracking-tight">
              FORSYTH<span className="text-[#9DC183]">KIDS</span>GUIDE
            </p>
            <p className="text-[10px] text-[#7B8A92] mt-1 tracking-wide">
              Where Forsyth Families Find Their Fit
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[#7B8A92]">Loading your results...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
