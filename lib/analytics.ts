/**
 * Lightweight analytics tracking for quiz events.
 * Stores events in the browser and optionally sends to a server endpoint.
 *
 * Events tracked:
 * - quiz_start: User begins the quiz
 * - quiz_complete: User finishes all 6 questions
 * - email_capture: User submits their email
 * - result_click: User clicks on a result card
 * - quiz_abandon: User leaves mid-quiz (tracked via beforeunload)
 */

interface TrackingEvent {
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

const STORAGE_KEY = "fkg_quiz_analytics";

/**
 * Track an event (client-side)
 */
export function trackEvent(
  type: string,
  data: Record<string, unknown> = {}
): void {
  const event: TrackingEvent = {
    type,
    timestamp: new Date().toISOString(),
    data,
  };

  // Store locally
  try {
    const existing = getStoredEvents();
    existing.push(event);
    // Keep last 1000 events max
    const trimmed = existing.slice(-1000);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  } catch {
    // localStorage not available, that's ok
  }

  // Also send to server (fire and forget)
  try {
    if (typeof window !== "undefined") {
      navigator.sendBeacon?.(
        "/api/analytics",
        JSON.stringify(event)
      );
    }
  } catch {
    // Beacon not available, that's ok
  }
}

/**
 * Get stored analytics events
 */
export function getStoredEvents(): TrackingEvent[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Get analytics summary for admin dashboard
 */
export function getAnalyticsSummary(events: TrackingEvent[]) {
  const now = new Date();
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filterByDate = (evts: TrackingEvent[], since: Date) =>
    evts.filter((e) => new Date(e.timestamp) >= since);

  const calc = (evts: TrackingEvent[]) => {
    const starts = evts.filter((e) => e.type === "quiz_start").length;
    const completes = evts.filter((e) => e.type === "quiz_complete").length;
    const emails = evts.filter((e) => e.type === "email_capture").length;
    const clicks = evts.filter((e) => e.type === "result_click");

    return {
      starts,
      completes,
      completionRate: starts > 0 ? Math.round((completes / starts) * 100) : 0,
      emailCaptures: emails,
      emailCaptureRate: completes > 0 ? Math.round((emails / completes) * 100) : 0,
      resultClicks: clicks.length,
      topClickedActivities: getTopClicked(clicks),
    };
  };

  return {
    allTime: calc(events),
    last7Days: calc(filterByDate(events, last7)),
    last30Days: calc(filterByDate(events, last30)),
  };
}

function getTopClicked(clicks: TrackingEvent[]) {
  const counts: Record<string, number> = {};
  clicks.forEach((c) => {
    const name = (c.data.activityName as string) || "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}
