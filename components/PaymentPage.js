"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const fundraiserId = searchParams.get("fundraiserId") || searchParams.get("id") || "";
  const fallbackTitle = searchParams.get("fundraiserName") || "Unknown Fundraiser";
  const [fundraiserDetails, setFundraiserDetails] = useState({
    name: fallbackTitle,
    amountNeeded: 0,
    amountRaised: 0,
    reason: "",
    documents: [],
    coverImage: "",
  });
  const [loadingFundraiser, setLoadingFundraiser] = useState(true);

  // Donor input states
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("✅ Razorpay script loaded");
    script.onerror = () => console.error("❌ Failed to load Razorpay script");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchFundraiser = async () => {
      if (!fundraiserId) {
        setLoadingFundraiser(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-fundraisers?id=${fundraiserId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setFundraiserDetails({
            name: data.fundraiser.title,
            amountNeeded: Number(data.fundraiser.amountNeeded || 0),
            amountRaised: Number(data.fundraiser.amountRaised || 0),
            reason: data.fundraiser.description || "",
            documents: data.fundraiser.documentName
              ? [{ name: data.fundraiser.documentName, url: "#" }]
              : [],
            coverImage: data.fundraiser.coverImage || "",
          });
        } else {
          console.error("Failed to load fundraiser:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch fundraiser:", error);
      } finally {
        setLoadingFundraiser(false);
      }
    };

    fetchFundraiser();
  }, [fundraiserId]);

  // Handle Payment
  const handlePayment = async () => {
    if (!donorName || !donorEmail || !donationAmount) {
      alert("Please enter all details before proceeding.");
      return;
    }

    console.log("🚀 Creating order with amount:", donationAmount);

    try {
      // ✅ Create order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount }),
      });

      const data = await response.json();
      console.log("🚀 Order API Response:", data);

      if (!data.orderId) {
        console.error("❌ Order ID missing in response");
        alert("Order ID not found! Please try again.");
        return;
      }

      console.log("✅ Order ID:", data.orderId);

      // 🔹 Razorpay Payment Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_ShI2nkHcZZYXBE",
        amount: donationAmount * 100, // Convert to paise
        currency: "INR",
        name: fundraiserDetails.name,
        description: fundraiserDetails.reason,
        order_id: data.orderId,
        handler: async function (response) {
          alert(`✅ Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

          console.log("🚀 Verifying payment on server...");

          // ✅ Send verification request to server
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donorName,
              donorEmail,
              amount: donationAmount,
              fundraiser: fundraiserDetails.name,
              fundraiserId,
            }),
          });

          const verifyData = await verifyResponse.json();
          console.log("🔹 Payment Verification Response:", verifyData);

          if (verifyData.success) {
            alert("🎉 Payment Verified & Stored Successfully!");
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: donorName,
          email: donorEmail,
        },
        theme: { color: "#1B6B45" },
      };

      if (!window.Razorpay) {
        console.error("❌ Razorpay SDK not loaded");
        alert("Failed to load Razorpay. Please refresh and try again.");
        return;
      }

      console.log("🛠️ Opening Razorpay...");
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  const quickAmounts = [100, 500, 1000, 2000];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="min-h-screen px-4 py-10 md:py-16">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 rounded-2xl border border-[#E2EBE5] bg-white p-5">
            {fundraiserDetails.coverImage ? (
              <img
                src={fundraiserDetails.coverImage}
                alt={fundraiserDetails.name}
                className="mb-4 h-40 w-full rounded-xl object-cover"
              />
            ) : null}
            <h1 className="text-lg font-bold text-[#1A1A1A]">{fundraiserDetails.name}</h1>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {fundraiserDetails.reason || "No description added yet."}
            </p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#22C37A] animate-pulse-subtle"
                style={{
                  width:
                    fundraiserDetails.amountNeeded > 0
                      ? `${Math.min(
                          (fundraiserDetails.amountRaised / fundraiserDetails.amountNeeded) * 100,
                          100
                        )}%`
                      : "0%",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ₹{fundraiserDetails.amountRaised.toLocaleString()} raised •
              {" "}
              {fundraiserDetails.amountNeeded > 0
                ? Math.round(
                    (fundraiserDetails.amountRaised / fundraiserDetails.amountNeeded) * 100
                  )
                : 0}
              % of ₹{fundraiserDetails.amountNeeded.toLocaleString()} goal
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2EBE5] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Secure donation</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message (optional)</label>
              <textarea
                placeholder="Add a note of support"
                rows={3}
                className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#1A1A1A]">Choose an amount</p>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(String(amount))}
                    className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30 ${
                      donationAmount === String(amount)
                        ? "border-[#1B6B45] bg-[#1B6B45] text-white"
                        : "border-[#E2EBE5] bg-white text-gray-700"
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>
            </div>

            <button
              className="mt-6 w-full cursor-pointer rounded-xl bg-[#BEE86A] px-6 py-2.5 text-sm font-bold text-[#1A1A1A] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEE86A]/50 hover:opacity-90 shadow-sm"
              onClick={handlePayment}
            >
              Donate securely
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">🔒 Secured by Razorpay</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
