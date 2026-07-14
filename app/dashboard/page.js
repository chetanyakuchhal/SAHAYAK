"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FundraiserCard from "@/components/FundraiserCard";
import { CARD_COVERS } from "@/lib/cardCovers";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState([]);
  const [myFundraisers, setMyFundraisers] = useState([]);
  const [payments, setPayments] = useState([]); // ✅ Store payments

  const getFundStats = (fund) => {
    const needed = Number(fund.amountNeeded || 0);
    const raised = Number(fund.amountRaised || 0);
    const remaining = Math.max(needed - raised, 0);
    const progress = needed > 0 ? Math.min((raised / needed) * 100, 100) : 0;

    return { needed, raised, remaining, progress };
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch fundraisers from API
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await fetch("/api/get-fundraisers");
        const data = await response.json();
        if (data.success) {
          setFundraisers(data.fundraisers);
        } else {
          console.error("Error fetching fundraisers:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch fundraisers:", error);
      }
    };

    fetchFundraisers();
  }, []);

  // Fetch logged-in user's own fundraisers
  useEffect(() => {
    const fetchMyFundraisers = async () => {
      try {
        const email = encodeURIComponent(session?.user?.email || "");
        const userId = encodeURIComponent(session?.user?.id || "");
        const response = await fetch(
          `/api/get-fundraisers?mine=1&autoClaimLegacy=1&email=${email}&userId=${userId}`
        );
        const data = await response.json();

        if (data.success) {
          setMyFundraisers(data.fundraisers || []);
        } else {
          console.error("Error fetching my fundraisers:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch my fundraisers:", error);
      }
    };

    if (status === "authenticated") {
      fetchMyFundraisers();
    }
  }, [status, session]);

  // ✅ Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/get-payments");
        const data = await response.json();
        if (data.success) {
          setPayments(data.payments);
        } else {
          console.error("Error fetching payments:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    fetchPayments();
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while checking session
  }

  const totalRaised = fundraisers.reduce(
    (sum, fund) => sum + Number(fund.amountRaised || 0),
    0
  );

  const statusStyles = {
    Verified: "bg-[#22C37A]/10 text-[#22C37A]",
    Pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
    Failed: "bg-[#EF4444]/10 text-[#EF4444]",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const avatarColors = ["bg-[#1B6B45]/10 text-[#1B6B45]", "bg-[#22C37A]/10 text-[#22C37A]", "bg-[#5B7FD8]/10 text-[#5B7FD8]"];
  const coverForIndex = (index, offset = 0) => CARD_COVERS[(index + offset) % CARD_COVERS.length];

  return (
    <div className="mx-auto max-w-6xl min-h-screen px-4 py-8 sm:px-6 md:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Your dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Track your fundraisers and donations</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/fundraiser-form")}
              className="cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
            >
              Start a fundraiser
            </button>
            <button
              type="button"
              className="cursor-pointer text-sm font-medium text-[#1B6B45]"
            >
              Download report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Active campaigns",
              value: fundraisers.length,
              color: "text-[#1B6B45] bg-[#1B6B45]/10",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              label: "Total raised",
              value: `₹${totalRaised.toLocaleString()}`,
              color: "text-[#22C37A] bg-[#22C37A]/10",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 7h8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 17h8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              label: "Total donors",
              value: payments.length,
              color: "text-[#1B9B6E] bg-[#1B9B6E]/10",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 11a4 4 0 108 0 4 4 0 00-8 0z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              label: "Verified payments",
              value: payments.length,
              color: "text-[#22C37A] bg-[#22C37A]/10",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#E2EBE5] bg-white p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">My fundraisers</h2>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {myFundraisers.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#E2EBE5] bg-white p-6 text-center text-sm text-gray-500">
                You have not created any fundraiser yet.
              </div>
            ) : (
              myFundraisers.map((project, index) => {
                const stats = getFundStats(project);
                const coverData = coverForIndex(index);
                return (
                  <FundraiserCard
                    key={project._id || index}
                    _id={project._id}
                    title={project.title}
                    description={project.description || coverData.description}
                    category={index % 2 === 0 ? "Education" : "Medical"}
                    targetAmount={stats.needed}
                    raisedAmount={stats.raised}
                    coverImage={coverData.src}
                  />
                );
              })
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Active fundraisers</h2>
            <button type="button" className="cursor-pointer text-sm font-medium text-[#1B6B45]">View all</button>
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fundraisers.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[#E2EBE5] bg-white p-6 text-center text-sm text-gray-500">
                No active fundraisers.
              </div>
            ) : (
              fundraisers.map((project, index) => {
                const stats = getFundStats(project);
                const coverData = coverForIndex(index, myFundraisers.length);
                return (
                  <FundraiserCard
                    key={project._id || index}
                    _id={project._id}
                    title={project.title}
                    description={project.description || coverData.description}
                    category={index % 3 === 0 ? "Disaster" : "Medical"}
                    targetAmount={stats.needed}
                    raisedAmount={stats.raised}
                    coverImage={coverData.src}
                  />
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2EBE5] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent donations</h2>
          </div>

          {payments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#E2EBE5] bg-white p-6 text-center text-sm text-gray-500">
              No recent payments.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-semibold uppercase text-gray-500">
                  <tr className="border-b border-[#E2EBE5]">
                    <th className="pb-4">Donor name</th>
                    <th className="pb-4">Campaign</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 10).map((payment, index) => {
                    const status = payment.status || "Verified";
                    const statusClass = statusStyles[status] || "bg-gray-100 text-gray-600";
                    const dateValue = payment.createdAt || payment.date;
                    const dateLabel = dateValue
                      ? new Date(dateValue).toLocaleDateString()
                      : "--";

                    return (
                      <tr key={payment._id || index} className="border-b border-[#E2EBE5]/50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                avatarColors[index % avatarColors.length]
                              }`}
                            >
                              {getInitials(payment.donorName)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A1A]">
                                {payment.donorName || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-500">{payment.donorEmail || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-700">{payment.fundraiser || "--"}</td>
                        <td className="py-4 font-semibold text-[#1A1A1A]">₹{payment.amount}</td>
                        <td className="py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-gray-500">{dateLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
