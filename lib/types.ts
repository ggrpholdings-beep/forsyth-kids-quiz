// === CORE TYPES ===

export type ListingTier = "free" | "enhanced" | "premium" | "spotlight";

export interface QuizOption {
  label: string;
  value: string;
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  icon: string;
  options: QuizOption[];
}

export interface QuizAnswers {
  age: string;
  personality: string;
  interest: string;
  schedule: string;
  budget: string;
  location: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  description: string;
  ageRanges: string[];
  personalityMatch: string[];
  interestMatch: string[];
  scheduleOptions: string[];
  priceRange: string;
  location: string;
  listingTier: ListingTier;
  website: string;
  phone: string;
  address: string;
  imageUrl: string;
  directoryUrl: string;
  rating: number;
  reviewCount: number;
  badges: string[];
}

export interface ScoredActivity extends Activity {
  organicScore: number;
  totalScore: number;
  matchPercent: number;
}

export interface EmailSubmission {
  email: string;
  firstName?: string;
  quizAnswers: QuizAnswers;
  resultsUrl?: string;
}

export interface AnalyticsEvent {
  type: "quiz_start" | "quiz_complete" | "email_capture" | "result_click" | "quiz_abandon";
  timestamp: string;
  data: Record<string, unknown>;
}
