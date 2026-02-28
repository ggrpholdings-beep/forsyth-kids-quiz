"use client";

import { useState, useEffect } from "react";
import { getStoredEvents, getAnalyticsSummary } from "@/lib/analytics";
import Link from "next/link";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [analytics, setAnalytics] = useState<ReturnType<
    typeof getAnalyticsSummary
  > | null>(null);
  const [period, setPeriod] = useState<"allTime" | "last7Days" | "last30Days">(
    "last30Days"
  );

  useEffect(() => {
    if (authenticated) {
      const events = getStoredEvents();
      setAnalytics(getAnalyticsSummary(events));
    }
  }, [authenticated]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
      } else {
        alert("Incorrect password");
      }
    } catch {
      if (password.length > 0) setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-sm w-full">
          <h1 className="text-xl font-bold text-[#002147] mb-4 text-center">
            Admin Dashboard
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 mb-4 focus:border-[#002147] outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#002147] text-white rounded-lg font-semibold"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const stats = analytics?.[period];

  return (
    <div className="min-h-screen bg-[#FAFBF9] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#002147]">
            Quiz Analytics
          </h1>
          <Link
            href="/admin/activities"
            className="text-sm text-[#002147] font-semibold hover:underline"
          >
            Manage Activities →
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {(
            [
              ["last7Days", "Last 7 Days"],
              ["last30Days", "Last 30 Days"],
              ["allTime", "All Time"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === key
                  ? "bg-[#002147] text-white"
                  : "bg-white border text-[#37474F] hover:border-[#9DC183]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Quizzes Started", value: stats?.starts ?? 0, color: "text-blue-600" },
            { label: "Completed", value: `${stats?.completes ?? 0} (${stats?.completionRate ?? 0}%)`, color: "text-green-600" },
            { label: "Emails Captured", value: `${stats?.emailCaptures ?? 0} (${stats?.emailCaptureRate ?? 0}%)`, color: "text-purple-600" },
            { label: "Result Clicks", value: stats?.resultClicks ?? 0, color: "text-orange-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border shadow-sm">
              <p className="text-xs text-[#7B8A92] font-medium mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="font-semibold text-lg text-[#002147] mb-4">Top Clicked Activities</h2>
          {stats?.topClickedActivities && stats.topClickedActivities.length > 0 ? (
            <div className="space-y-2">
              {stats.topClickedActivities.map((item, i) => (
                <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm"><span className="text-[#7B8A92] mr-2">{i + 1}.</span>{item.name}</span>
                  <span className="text-sm font-medium text-[#002147]">{item.count} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#7B8A92] text-sm">No click data yet. Analytics will populate as parents use the quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
}
