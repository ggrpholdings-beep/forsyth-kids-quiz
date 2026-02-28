"use client";

import { useState } from "react";

interface EmailGateProps {
  onSubmit: (email: string, firstName?: string) => void;
  onSkip: () => void;
}

export default function EmailGate({ onSubmit, onSkip }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitting(true);
    onSubmit(email, firstName || undefined);
  };

  const isValid = email.includes("@") && email.includes(".");

  return (
    <div className="animate-fade-in max-w-md mx-auto px-6 pt-12 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-[28px] font-bold text-[#002147] mb-2 tracking-tight">
        Your personalized picks are ready!
      </h2>
      <p className="text-[#7B8A92] text-[15px] leading-relaxed mb-8">
        Enter your email to see your top 5 recommended activities — plus get our
        weekly guide to the best kids activities in Forsyth County.
      </p>

      <div className="text-left mb-3">
        <label className="text-xs font-medium text-[#7B8A92] block mb-1">
          First name (optional)
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your first name"
          className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-200 text-base bg-white focus:border-[#002147] focus:ring-[3px] focus:ring-[rgba(0,33,71,0.1)] outline-none transition-all"
        />
      </div>

      <div className="text-left mb-6">
        <label className="text-xs font-medium text-[#7B8A92] block mb-1">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="parent@email.com"
          className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-200 text-base bg-white focus:border-[#002147] focus:ring-[3px] focus:ring-[rgba(0,33,71,0.1)] outline-none transition-all"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
          isValid && !submitting
            ? "bg-[#002147] text-white hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {submitting ? "Saving..." : "Show My Results →"}
      </button>

      <button
        onClick={onSkip}
        className="mt-2 text-[#7B8A92] text-sm underline hover:text-[#37474F] transition-colors py-3"
      >
        Skip and see results
      </button>

      <p className="text-[11px] text-gray-300 mt-4">
        We respect your privacy. Unsubscribe anytime. No spam, ever.
      </p>
    </div>
  );
}
