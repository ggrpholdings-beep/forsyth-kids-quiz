import { Activity, QuizAnswers, ScoredActivity, ListingTier } from "./types";

// --- Point weights for each quiz dimension ---
const WEIGHTS = {
  age: 10,
  personality: 8,
  interest: 8,
  schedule: 5,
  budget: 5,
  location: 3,
} as const;

// --- Hidden tier bonuses (monetization engine) ---
const TIER_BONUS: Record<ListingTier, number> = {
  spotlight: 15,
  premium: 8,
  enhanced: 3,
  free: 0,
};

// Maximum possible organic score (for percentage calculation)
const MAX_ORGANIC = Object.values(WEIGHTS).reduce((sum, w) => sum + w, 0); // 39

/**
 * Score all activities against quiz answers.
 * Returns top 5, sorted by total score (organic + tier bonus).
 * Free tier listings are excluded from quiz results entirely.
 *
 * IMPORTANT: matchPercent is calculated from organic score ONLY.
 * The tier bonus affects ranking ORDER but NOT the displayed match percentage.
 * This ensures transparency — parents see genuine match quality.
 */
export function scoreActivities(
  activities: Activity[],
  answers: QuizAnswers
): ScoredActivity[] {
  return activities
    // Free tier never appears in quiz results
    .filter((a) => a.listingTier !== "free")
    .map((activity) => {
      let organic = 0;

      // Age match: +10
      if (activity.ageRanges.includes(answers.age)) {
        organic += WEIGHTS.age;
      }

      // Personality match: +8
      if (activity.personalityMatch.includes(answers.personality)) {
        organic += WEIGHTS.personality;
      }

      // Interest match: +8
      if (activity.interestMatch.includes(answers.interest)) {
        organic += WEIGHTS.interest;
      }

      // Schedule match: +5 (flexible matches everything)
      if (
        activity.scheduleOptions.includes(answers.schedule) ||
        answers.schedule === "flexible" ||
        activity.scheduleOptions.includes("flexible")
      ) {
        organic += WEIGHTS.schedule;
      }

      // Budget match: +5 (no-preference matches everything)
      if (
        activity.priceRange === answers.budget ||
        answers.budget === "no-preference"
      ) {
        organic += WEIGHTS.budget;
      }

      // Location match: +3 (anywhere matches everything)
      if (
        activity.location === answers.location ||
        answers.location === "anywhere" ||
        activity.location === "anywhere"
      ) {
        organic += WEIGHTS.location;
      }

      // Tier bonus (hidden from display)
      const bonus = TIER_BONUS[activity.listingTier];
      const total = organic + bonus;

      // Match percentage based on organic score only
      const matchPercent = Math.round((organic / MAX_ORGANIC) * 100);

      return {
        ...activity,
        organicScore: organic,
        totalScore: total,
        matchPercent,
      };
    })
    // Sort by total score (includes tier bonus)
    .sort((a, b) => b.totalScore - a.totalScore)
    // Return top 5
    .slice(0, 5);
}

/**
 * Get a human-readable label for a quiz answer value
 */
export function getAnswerLabel(
  questions: { id: string; options: { value: string; label: string }[] }[],
  questionId: string,
  value: string
): string {
  const q = questions.find((q) => q.id === questionId);
  return q?.options.find((o) => o.value === value)?.label || value;
}
