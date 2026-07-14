"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CARD_COVERS } from "@/lib/cardCovers";

import heroImage from "@/assets/compassion-karuna.jpg";
import highlightImageOne from "@/assets/image2.avif";
import highlightImageTwo from "@/assets/image3.avif";
import highlightImageThree from "@/assets/image4.avif";

export default function Home() {
  const [fundraisers, setFundraisers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [fundraiserResponse, paymentsResponse] = await Promise.all([
          fetch("/api/get-fundraisers"),
          fetch("/api/get-payments"),
        ]);

        const fundraiserData = await fundraiserResponse.json();
        const paymentData = await paymentsResponse.json();

        if (fundraiserData.success) {
          setFundraisers(fundraiserData.fundraisers || []);
        }
        if (paymentData.success) {
          setPayments(paymentData.payments || []);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    fetchStats();
  }, []);

  const stats = useMemo(() => {
    const totalRaised = fundraisers.reduce(
      (sum, fund) => sum + Number(fund.amountRaised || 0),
      0
    );
    return {
      totalRaised,
      active: fundraisers.length,
      donors: payments.length,
    };
  }, [fundraisers, payments]);

  const featuredFundraisers = fundraisers.slice(0, 3);
  
  const fallbackUrgent = [
    {
      title: "GreenFund: Sustain Earth Now",
      org: "We Care",
      daysLeft: "7 days left",
      raised: 50240,
      goal: 120000,
      image: highlightImageOne.src,
      verified: true,
      creatorName: "Nitin Subhash Bhoir",
      category: "Medical",
      description: "Support our urgent drive to bring essential resources to those in need.",
      donors: 14,
    },
    {
      title: "SeniorHealth: Support Campaign",
      org: "Unicef",
      daysLeft: "19 days left",
      raised: 42400,
      goal: 100000,
      image: highlightImageTwo.src,
      verified: true,
      creatorName: "Priya Sharma",
      category: "Education",
      description: "Helping seniors with medical care and daily essentials.",
      donors: 42,
    },
    {
      title: "DisasterCare: Urgent Support",
      org: "Unity Foundation",
      daysLeft: "23 days left",
      raised: 21020,
      goal: 80000,
      image: highlightImageThree.src,
      verified: false,
      creatorName: "Unknown",
      category: "Disaster",
      description: "Immediate relief operations for recent disaster victims.",
      donors: 8,
    },
  ];

  const urgentCards = featuredFundraisers.length
    ? featuredFundraisers.map((fund, index) => {
        const avifImages = [highlightImageOne.src, highlightImageTwo.src, highlightImageThree.src];
        return {
          id: fund._id || index,
          title: fund.title || CARD_COVERS[index % CARD_COVERS.length].title,
          org: "Sahayak Community",
          daysLeft: "Urgent",
          raised: Number(fund.amountRaised || 0),
          goal: Number(fund.amountNeeded || 0),
          image: avifImages[index % avifImages.length] || CARD_COVERS[index % CARD_COVERS.length].src,
          verified: true,
          creatorName: fund.createdByName || "Unknown",
          category: fund.category || CARD_COVERS[index % CARD_COVERS.length].category || "Medical",
          description: fund.description || CARD_COVERS[index % CARD_COVERS.length].description || "Join us in making a difference for this important cause.",
          donors: fund.donorsCount || 14
        };
      })
    : fallbackUrgent;

  const communityCount = stats.donors > 0 ? stats.donors : 0;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] h-[500px]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Helping hands"
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 1100px"
              priority
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          </div>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center justify-center rounded-full bg-[#E5F5F0]/95 backdrop-blur-md px-6 py-2.5 shadow-md border border-[#E5F5F0]/50">
              <span className="text-sm md:text-[15px] font-bold text-[#1B6B45] tracking-wide">
                # Easy crowdfunding
              </span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 leading-none">
              <h1 className="text-[90px] md:text-[140px] font-bold text-white tracking-tighter leading-[0.85]">
                Sahayak
              </h1>
              <p className="text-2xl md:text-[36px] font-semibold text-white/90 leading-[1.1] md:mb-1">
                Help<br className="hidden md:block" />Others
              </p>
            </div>
            
            <Link
              href="/fundraiser-form"
              className="rounded-xl bg-[#BEE86A] px-8 py-3.5 text-lg font-bold text-[#1A1A1A] transition hover:opacity-90 shadow-lg text-center"
            >
              Start Fundraising
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mx-auto mt-24 max-w-4xl px-4 sm:px-6 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#1B6B45]/80">
          Welcome to Sahayak
        </p>
        <h2 className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-[#4A4A4A]">
          Your trusted platform for effortless crowdfunding. We make fundraising easy, empowering you to share your story and create campaigns that truly make a difference.
        </h2>
      </section>


      {/* Urgent Fundraising Section */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Urgent Fundraising!</h2>
        <p className="mt-2 text-[#666666]">
          Time is of the essence! Join our mission NOW to make an immediate impact. Every second counts!
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {urgentCards.map((card, index) => {
            const progress = card.goal > 0 ? Math.min((card.raised / card.goal) * 100, 100) : (card.raised === 50240 ? 85 : card.raised === 42400 ? 75 : 60);
            
            return (
              <div key={card.id || index} className="overflow-hidden rounded-2xl border border-[#E2EBE5] bg-white shadow-sm hover-lift card-hover flex flex-col">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-3 flex items-center">
                    {/* Badge Category */}
                    {(() => {
                      const cat = card.category?.toLowerCase() || 'medical';
                      let badgeColors = 'bg-[#E5F5F0] text-[#1B9B6E]';
                      let icon = (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      );
                      
                      if (cat === 'education') {
                        badgeColors = 'bg-[#EBF2FF] text-[#3B82F6]';
                        icon = (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        );
                      } else if (cat === 'disaster' || cat === 'emergency') {
                        badgeColors = 'bg-[#FFF0EB] text-[#F97316]';
                        icon = (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        );
                      }

                      return (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeColors}`}>
                          {icon}
                          {card.category || "Medical"}
                        </span>
                      );
                    })()}
                  </div>
                  
                  <h3 className="mb-1 text-[15px] font-bold text-[#1A1A1A] line-clamp-1">{card.title}</h3>
                  <p className="mb-4 text-xs text-[#666666] line-clamp-1">{card.description}</p>
                  
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E5F5F0] text-[10px] font-bold text-[#1B9B6E]">
                      {(() => {
                        const name = card.creatorName || "Unknown";
                        const parts = name.trim().split(" ");
                        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        return name.substring(0, 2).toUpperCase();
                      })()}
                    </div>
                    <span className="text-xs text-[#666666]">
                      by <span className="font-semibold text-[#1A1A1A]">{card.creatorName || "Unknown"}</span>
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#BEE86A] animate-pulse-subtle"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="mt-3 flex items-start justify-between text-xs">
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="font-bold text-[#1A1A1A]">₹{card.raised.toLocaleString()} </span>
                          <span className="text-[#1A1A1A] font-medium">raised</span>
                        </div>
                        <span className="text-gray-400">{card.donors || 14} donors</span>
                      </div>
                      <span className="text-gray-400">
                        {progress.toFixed(1)}% of ₹{card.goal.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={card.id ? `/payment?id=${card.id}` : "/payment"}
                      className="mt-5 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#BEE86A] px-6 py-2.5 text-sm font-bold text-[#1A1A1A] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEE86A]/50 hover:opacity-90"
                    >
                      Donate now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Section */}
      <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6 py-10 text-center">
        <div className="relative py-12 md:py-16">
          <div className="relative z-10 mx-auto max-w-3xl bg-transparent">
            <p className="text-xl md:text-2xl text-[#1A1A1A] mb-2 font-medium tracking-tight">Be The Part Of Sahayak With Over</p>
            <h2 className="text-[130px] md:text-[240px] font-serif font-light leading-[0.9] tracking-tighter text-[#1A1A1A] py-2">
              {communityCount.toLocaleString()}+
            </h2>
            <p className="mt-2 text-xl md:text-2xl text-[#1A1A1A] font-medium tracking-tight">People From Around The World Joined</p>
          </div>

          {/* Floating images completely pushed to the edges */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {/* Top Left */}
            <div className="absolute left-4 top-0 h-40 w-32 overflow-hidden rounded-[20px] grayscale opacity-90 shadow-md">
              <Image src={highlightImageOne} alt="Community" fill className="object-cover" />
            </div>
            {/* Bottom Left */}
            <div className="absolute left-20 bottom-4 h-36 w-36 overflow-hidden rounded-[24px] grayscale opacity-90 shadow-md">
              <Image src={highlightImageTwo} alt="Community" fill className="object-cover" />
            </div>
            {/* Top Right */}
            <div className="absolute right-4 top-4 h-48 w-32 overflow-hidden rounded-[20px] grayscale opacity-90 shadow-md">
              <Image src={highlightImageThree} alt="Community" fill className="object-cover" />
            </div>
            {/* Bottom Right */}
            <div className="absolute right-24 bottom-6 h-36 w-36 overflow-hidden rounded-[24px] grayscale opacity-90 shadow-md">
              <Image src={heroImage} alt="Community" fill className="object-cover" />
            </div>
          </div>
        </div>

        <Link href="/signup" className="mt-16 inline-block rounded-2xl bg-[#BEE86A] px-10 py-4 text-lg font-bold text-[#1A1A1A] transition hover:opacity-90 shadow-sm relative z-20">
          Join Sahayak Now!
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto mt-32 max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-10">Frequently Asked Questions.</h2>
        
        <div className="divide-y divide-gray-200">
          {[
            "How Can I Make Donation?",
            "Is My Donation Tax-Deductible?",
            "Can I Donate In Honor Or Memory Of Someone?",
            "How Will My Donation Be Used?",
            "Can I Set Up A Recurring Donation?",
          ].map((question, index) => (
            <details key={index} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-[#666666] group-hover:text-[#1A1A1A]">
                {question}
                <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-[#666666] leading-relaxed">
                Reach out to the campaign or check the donation flow for details and receipts.
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}


