"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MyFundraisersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const getFundStats = (fund) => {
    const needed = Number(fund.amountNeeded || 0);
    const raised = Number(fund.amountRaised || 0);
    const remaining = Math.max(needed - raised, 0);
    const progress = needed > 0 ? Math.min((raised / needed) * 100, 100) : 0;

    return { needed, raised, remaining, progress };
  };

  const fetchMyCampaigns = useCallback(async () => {
    try {
      setLoadingCampaigns(true);
      const email = encodeURIComponent(session?.user?.email || "");
      const userId = encodeURIComponent(session?.user?.id || "");
      const response = await fetch(
        `/api/get-fundraisers?mine=1&autoClaimLegacy=1&email=${email}&userId=${userId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setCampaigns(data.fundraisers || []);
      } else {
        console.error("Error fetching user campaigns:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch user campaigns:", error);
    } finally {
      setLoadingCampaigns(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchMyCampaigns();
    }
  }, [status, router, fetchMyCampaigns]);

  if (status === "loading" || loadingCampaigns) {
    return <div className="p-8 text-gray-600">Loading your fundraisers...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 md:px-10 md:py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#E2EBE5] bg-white p-5 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">My fundraisers ({campaigns.length})</h1>
          <button
            onClick={() => router.push("/fundraiser-form")}
            className="cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
          >
            Create new fundraiser
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-gray-500">
            <p>No fundraisers created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {campaigns.map((campaign) => {
              const stats = getFundStats(campaign);
              return (
                <div key={campaign._id} className="rounded-2xl border border-[#E2EBE5] bg-white p-4">
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">{campaign.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{campaign.description}</p>

                  <div className="mt-4">
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-[#22C37A] animate-pulse-subtle"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{stats.progress.toFixed(1)}% funded</p>
                  </div>

                  <div className="mt-4 space-y-1 text-xs text-gray-600">
                    <p>Needed: ₹{stats.needed.toLocaleString()}</p>
                    <p>Raised: ₹{stats.raised.toLocaleString()}</p>
                    <p>Remaining: ₹{stats.remaining.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
