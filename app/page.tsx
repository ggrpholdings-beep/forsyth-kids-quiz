"use client";

import Link from "next/link";
import { ClipboardList, Sparkles, CheckCircle } from "lucide-react";

const categories = [
  { name: "Dance", emoji: "💃", slug: "dance" },
  { name: "Martial Arts", emoji: "🥋", slug: "martial-arts" },
  { name: "Sports", emoji: "⚽", slug: "sports" },
  { name: "Art", emoji: "🎨", slug: "art" },
  { name: "Tutoring", emoji: "📚", slug: "tutoring" },
  { name: "STEM", emoji: "🔬", slug: "stem" },
  { name: "Swim", emoji: "🏊", slug: "swimming" },
  { name: "Camps", emoji: "🏕️", slug: "summer-camps" },
  { name: "Theater", emoji: "🎭", slug: "theater" },
  { name: "Outdoor", emoji: "🌲", slug: "outdoor" },
  { name: "Preschool", emoji: "👶", slug: "preschool" },
  { name: "Parties", emoji: "🎉", slug: "parties" },
];

const DIRECTORY_URL =
  process.env.NEXT_PUBLIC_DIRECTORY_URL || "https://forsythkidsguide.com";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFBF9]">
      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-widest mb-6">
          🎯 FREE 2-MINUTE QUIZ
        </div>

        <h1 className="text-[clamp(28px,6vw,42px)] font-bold leading-[1.1] text-[#002147] mb-4 tracking-tight">
          Find the{" "}
          <span className="text-[#9DC183]">Perfect Activity</span> for
          Your Child in Forsyth County
        </h1>

        <p className="text-[16px] text-[#7B8A92] leading-relaxed max-w-md mx-auto mb-8">
          Answer 6 quick questions about your child and get personalized
          recommendations from 300+ local programs.
        </p>

        <Link
          href="/quiz"
          className="inline-block bg-[#002147] text-white text-lg font-semibold px-12 py-4 rounded-2xl shadow-[0_4px_14px_rgba(0,33,71,0.3)] hover:shadow-[0_6px_20px_rgba(0,33,71,0.4)] hover:-translate-y-0.5 transition-all"
        >
          Start the Quiz →
        </Link>

        <p className="mt-3 text-sm text-[#7B8A92]">
          No sign-up required. Results in under 2 minutes.
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            {
              icon: ClipboardList,
              title: "Answer 6 Questions",
              sub: "About your child's age, interests & schedule",
            },
            {
              icon: Sparkles,
              title: "Get Matched",
              sub: "Our algorithm finds your best fits",
            },
            {
              icon: CheckCircle,
              title: "Discover & Enroll",
              sub: "View full profiles and sign up",
            },
          ].map((step, i) => (
            <div key={i} className="p-4">
              <div className="w-12 h-12 bg-[#E8F0E0] rounded-xl flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-6 h-6 text-[#002147]" />
              </div>
              <h3 className="font-semibold text-sm text-[#002147] mb-1">{step.title}</h3>
              <p className="text-xs text-[#7B8A92] leading-snug">{step.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-[#002147] text-center mb-6">
          Explore 300+ Activities
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`${DIRECTORY_URL}/listing-category/${cat.slug}/`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#9DC183] hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-[#37474F]">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-6 py-8 border-t border-gray-100 text-center">
        <a
          href={DIRECTORY_URL}
          className="text-[#002147] font-semibold text-sm hover:underline"
        >
          Browse All Activities →
        </a>
        <p className="mt-4 text-xs text-[#7B8A92] leading-relaxed max-w-sm mx-auto">
          ForsythKidsGuide helps families in Forsyth County, GA discover the
          best activities, classes, and programs for their children.
        </p>
        <p className="text-sm font-bold text-[#002147] mt-3 tracking-tight">
          FORSYTH<span className="text-[#9DC183]">KIDS</span>GUIDE
        </p>
        <p className="text-[10px] text-[#7B8A92] mt-1 tracking-wide">
          Where Forsyth Families Find Their Fit
        </p>
        <p className="text-xs text-gray-300 mt-3">
          © {new Date().getFullYear()} ForsythKidsGuide. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
