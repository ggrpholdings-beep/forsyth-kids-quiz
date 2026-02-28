"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions } from "@/lib/quiz-data";
import { trackEvent } from "@/lib/analytics";
import ProgressBar from "@/components/ProgressBar";
import QuizQuestion from "@/components/QuizQuestion";
import EmailGate from "@/components/EmailGate";

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track quiz start
  useEffect(() => {
    trackEvent("quiz_start", {});
  }, []);

  // Track abandonment on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentQ < quizQuestions.length - 1 && !showEmailGate) {
        trackEvent("quiz_abandon", { abandonedAt: currentQ, question: quizQuestions[currentQ].id });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentQ, showEmailGate]);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      setSelectedOption(value);
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);

      setTimeout(() => {
        setIsTransitioning(true);
        setAnimDir("forward");
        setTimeout(() => {
          if (currentQ < quizQuestions.length - 1) {
            setCurrentQ((prev) => prev + 1);
          } else {
            trackEvent("quiz_complete", { answers: newAnswers });
            setShowEmailGate(true);
          }
          setSelectedOption(null);
          setIsTransitioning(false);
        }, 300);
      }, 400);
    },
    [currentQ, answers]
  );

  const goBack = useCallback(() => {
    if (showEmailGate) {
      setShowEmailGate(false);
      return;
    }
    if (currentQ > 0) {
      setIsTransitioning(true);
      setAnimDir("back");
      setTimeout(() => {
        setCurrentQ((prev) => prev - 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      }, 300);
    } else {
      router.push("/");
    }
  }, [currentQ, showEmailGate, router]);

  const navigateToResults = useCallback(
    (email?: string, firstName?: string) => {
      const params = new URLSearchParams(answers);
      if (email) {
        fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName,
            quizAnswers: answers,
            resultsUrl: `${window.location.origin}/results?${params.toString()}`,
          }),
        }).catch(() => {});
        trackEvent("email_capture", { emailHash: btoa(email).slice(0, 12) });
      }
      router.push(`/results?${params.toString()}`);
    },
    [answers, router]
  );

  if (showEmailGate) {
    return (
      <main className="min-h-screen bg-[#FAFBF9]">
        <ProgressBar current={quizQuestions.length} total={quizQuestions.length} />
        <div className="pt-4 px-6 max-w-xl mx-auto">
          <button
            onClick={goBack}
            className="text-[#7B8A92] text-sm hover:text-[#37474F] transition-colors"
          >
            ← Back
          </button>
        </div>
        <EmailGate
          onSubmit={(email, firstName) => navigateToResults(email, firstName)}
          onSkip={() => navigateToResults()}
        />
      </main>
    );
  }

  const question = quizQuestions[currentQ];
  const animClass = isTransitioning
    ? animDir === "forward"
      ? "animate-slide-out"
      : "animate-slide-out-back"
    : animDir === "forward"
    ? "animate-slide-in"
    : "animate-slide-in-back";

  return (
    <main className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <ProgressBar current={currentQ + 1} total={quizQuestions.length} />

      <div className="flex justify-between items-center px-6 pt-4 pb-2 max-w-xl mx-auto w-full">
        <button
          onClick={goBack}
          className="text-[#7B8A92] text-sm hover:text-[#37474F] transition-colors"
        >
          ← {currentQ > 0 ? "Back" : "Home"}
        </button>
        <span className="text-sm text-[#7B8A92] font-medium">
          {currentQ + 1} of {quizQuestions.length}
        </span>
      </div>

      <div
        key={currentQ}
        className={`flex-1 flex flex-col justify-center px-6 pb-10 max-w-xl mx-auto w-full ${animClass}`}
      >
        <QuizQuestion
          question={question}
          selectedOption={selectedOption}
          onSelect={(value) => handleAnswer(question.id, value)}
        />
      </div>
    </main>
  );
}
