import { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "age",
    question: "How old is your child?",
    subtitle: "This helps us find age-appropriate programs",
    icon: "🎂",
    options: [
      { label: "Under 3", value: "under-3", emoji: "👶" },
      { label: "3 – 5", value: "3-5", emoji: "🧒" },
      { label: "6 – 8", value: "6-8", emoji: "🧑" },
      { label: "9 – 12", value: "9-12", emoji: "🧑‍🎓" },
      { label: "13+", value: "13+", emoji: "🎓" },
    ],
  },
  {
    id: "personality",
    question: "Which best describes your child?",
    subtitle: "No wrong answers — pick what feels closest",
    icon: "✨",
    options: [
      { label: "High-energy & athletic", value: "athletic", emoji: "⚡" },
      { label: "Creative & artistic", value: "creative", emoji: "🎨" },
      { label: "Curious & academic", value: "academic", emoji: "🔬" },
      { label: "Social butterfly", value: "social", emoji: "🦋" },
      { label: "A bit of everything", value: "everything", emoji: "🌈" },
    ],
  },
  {
    id: "interest",
    question: "What sounds most appealing?",
    subtitle: "Think about what would light up their face",
    icon: "🎯",
    options: [
      { label: "Team sports", value: "team-sports", emoji: "⚽" },
      { label: "Individual skill-building", value: "individual", emoji: "🏆" },
      { label: "Academic enrichment", value: "academic-enrichment", emoji: "📚" },
      { label: "Creative expression", value: "creative-expression", emoji: "🎭" },
      { label: "Outdoor adventure", value: "outdoor", emoji: "🌲" },
    ],
  },
  {
    id: "schedule",
    question: "When works best for your schedule?",
    subtitle: "We'll match programs that fit your routine",
    icon: "📅",
    options: [
      { label: "Weekday afternoons", value: "weekday-afternoon", emoji: "🌤️" },
      { label: "Weekday evenings", value: "weekday-evening", emoji: "🌙" },
      { label: "Weekends only", value: "weekends", emoji: "🎉" },
      { label: "Flexible / no preference", value: "flexible", emoji: "🤷" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly budget for activities?",
    subtitle: "All ranges have great options in Forsyth County",
    icon: "💰",
    options: [
      { label: "Under $50", value: "under-50", emoji: "💵" },
      { label: "$50 – $100", value: "50-100", emoji: "💵" },
      { label: "$100 – $200", value: "100-200", emoji: "💵" },
      { label: "$200+", value: "200-plus", emoji: "💵" },
      { label: "No preference", value: "no-preference", emoji: "✅" },
    ],
  },
  {
    id: "location",
    question: "Where in Forsyth County are you?",
    subtitle: "We'll prioritize programs near you",
    icon: "📍",
    options: [
      { label: "South Forsyth", value: "south", emoji: "🏘️" },
      { label: "North Forsyth", value: "north", emoji: "🏘️" },
      { label: "Cumming downtown", value: "cumming", emoji: "🏙️" },
      { label: "West Forsyth", value: "west", emoji: "🏘️" },
      { label: "Anywhere in the county", value: "anywhere", emoji: "🗺️" },
    ],
  },
];
