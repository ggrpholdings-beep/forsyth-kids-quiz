import { EmailSubmission } from "./types";

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

/**
 * Add a subscriber to MailerLite's "Quiz Leads" group
 * with custom fields from quiz answers.
 *
 * This runs server-side only (in API routes) to protect the API key.
 */
export async function addSubscriber(submission: EmailSubmission): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    console.error("MailerLite API key or group ID not configured");
    return false;
  }

  try {
    // Add subscriber
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: submission.email,
        fields: {
          name: submission.firstName || "",
          child_age: submission.quizAnswers.age,
          child_personality: submission.quizAnswers.personality,
          child_interests: submission.quizAnswers.interest,
          preferred_schedule: submission.quizAnswers.schedule,
          budget_range: submission.quizAnswers.budget,
          location: submission.quizAnswers.location,
          quiz_date: new Date().toISOString().split("T")[0],
          quiz_results_url: submission.resultsUrl || "",
        },
        groups: [groupId],
        status: "active",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("MailerLite API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("MailerLite request failed:", error);
    return false;
  }
}
