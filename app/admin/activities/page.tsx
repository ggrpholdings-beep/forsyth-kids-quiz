"use client";

import { useState, useEffect } from "react";
import { Activity, ListingTier } from "@/lib/types";
import Link from "next/link";

const TIER_LABELS: Record<ListingTier, string> = {
  spotlight: "Spotlight ($199/mo)",
  premium: "Premium ($99/mo)",
  enhanced: "Enhanced ($49/mo)",
  free: "Free ($0)",
};

const TIER_COLORS: Record<ListingTier, string> = {
  spotlight: "bg-[#FBF4E4] text-[#002147]",
  premium: "bg-blue-100 text-blue-800",
  enhanced: "bg-[#E8F0E0] text-[#37474F]",
  free: "bg-gray-100 text-gray-600",
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.activities);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tierCounts = {
    spotlight: activities.filter((a) => a.listingTier === "spotlight").length,
    premium: activities.filter((a) => a.listingTier === "premium").length,
    enhanced: activities.filter((a) => a.listingTier === "enhanced").length,
    free: activities.filter((a) => a.listingTier === "free").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#7B8A92]">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#002147]">Activity Manager</h1>
            <p className="text-sm text-[#7B8A92]">{activities.length} activities loaded</p>
          </div>
          <Link href="/admin" className="text-sm text-[#002147] font-semibold hover:underline">
            ← Back to Analytics
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {(Object.keys(TIER_LABELS) as ListingTier[]).map((tier) => (
            <div key={tier} className="bg-white rounded-lg p-4 border shadow-sm">
              <p className="text-xs text-[#7B8A92]">{TIER_LABELS[tier]}</p>
              <p className="text-2xl font-bold text-[#002147]">{tierCounts[tier]}</p>
              <p className="text-xs text-[#7B8A92]">
                {tier === "free" ? "Directory only" : "Appears in quiz results"}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-[#002147]">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#002147]">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#002147]">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#002147]">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#002147]">Tier</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-[#37474F]">{activity.name}</td>
                    <td className="py-3 px-4 text-[#7B8A92]">{activity.category}</td>
                    <td className="py-3 px-4 text-[#7B8A92]">{activity.location}</td>
                    <td className="py-3 px-4"><span className="text-yellow-500">★</span> {activity.rating}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${TIER_COLORS[activity.listingTier]}`}>
                        {activity.listingTier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#FBF4E4] border border-[#F7E9C7] rounded-lg text-sm text-[#37474F]">
          <strong>Note:</strong> To edit activities or change listing tiers, update the{" "}
          <code className="bg-[#F7E9C7] px-1 rounded">lib/activities.ts</code> file and redeploy.
        </div>
      </div>
    </div>
  );
}
