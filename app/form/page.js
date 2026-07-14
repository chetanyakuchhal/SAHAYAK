"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FundraiserForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    neededAmount: "",
    coverImage: "",
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/get-fundraisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          neededAmount: Number(formData.neededAmount),
          coverImage: formData.coverImage,
          documentName: formData.documents?.name || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create fundraiser");
      }

      alert("Fundraiser submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit fundraiser:", error);
      alert(error.message || "Failed to submit fundraiser");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-[#1A1A1A]">Create a fundraiser</h1>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E2EBE5] bg-white p-6">
        <input
          type="text"
          name="title"
          placeholder="Fundraiser Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        <textarea
          name="description"
          placeholder="Describe why you need funds"
          value={formData.description}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        ></textarea>

        <input
          type="number"
          name="neededAmount"
          placeholder="Amount Needed (₹)"
          value={formData.neededAmount}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        <input
          type="url"
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          value={formData.coverImage}
          onChange={handleChange}
          className="mb-3 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
          className="mb-4 w-full rounded-xl border border-[#E2EBE5] bg-[#F4F7F5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
        >
          {isSubmitting ? "Submitting..." : "Submit Fundraiser"}
        </button>
      </form>
      </div>
    </div>
  );
}
