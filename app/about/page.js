"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-[#1A1A1A]">
      <section className="border-b border-[#E2EBE5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">About</p>
          <h1 className="mt-3 text-4xl font-bold">About Sahayak</h1>
          <p className="mt-3 text-sm text-gray-600">
            Empowering generosity through transparent, compassionate crowdfunding.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Who We Are</h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 mx-auto">
            Sahayak is a community-driven platform helping individuals, NGOs, and organizations raise funds
            for meaningful causes. We focus on trust, transparency, and a donor-first experience.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-center text-3xl font-semibold">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Start a campaign",
                desc: "Create a campaign in minutes and share your story with clarity.",
              },
              {
                title: "Receive donations",
                desc: "Accept contributions from people who care about your cause.",
              },
              {
                title: "Make an impact",
                desc: "Use funds to create real change in your community.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] p-5 text-center">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold">Our Impact</h2>
        <p className="mt-3 max-w-2xl text-sm text-gray-600 mx-auto">
          With thousands of donors and countless campaigns funded, Sahayak has transformed lives by
          providing financial assistance to those in need. Join our mission to spread kindness.
        </p>
      </section>

      <section className="border-t border-[#E2EBE5] bg-white py-12 text-center">
        <h2 className="text-3xl font-semibold">Get Involved</h2>
        <p className="mt-3 max-w-2xl text-sm text-gray-600 mx-auto">
          Whether you&apos;re looking to start a campaign, donate to a cause, or spread the word, you can make a
          difference today.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/signup")}
            className="cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
          >
            Start fundraising
          </button>
        </div>
      </section>
    </div>
  );
}
