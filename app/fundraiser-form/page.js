"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FundraiserCard from "@/components/FundraiserCard";
import { CARD_COVERS } from "@/lib/cardCovers";

export default function FundraiserForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    neededAmount: "",
    category: "Medical",
    coverImage: "",
    coverImageFile: null,
    documents: null,
  });
  const previewCover = CARD_COVERS[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files[0] });
  };

  const handleCoverImageChange = (e) => {
    setFormData({ ...formData, coverImageFile: e.target.files[0] });
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Step 1 of 2</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1A1A1A]">Create your fundraiser</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Share your story, set a target, and build credibility with supporting documents.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E2EBE5] bg-white p-5">
            <fieldset disabled={isSubmitting} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Fundraiser title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe why you need funds"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Target amount</label>
                <input
                  type="number"
                  name="neededAmount"
                  placeholder="₹ Amount needed"
                  value={formData.neededAmount}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                >
                  <option>Medical</option>
                  <option>Education</option>
                  <option>Disaster</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cover image URL</label>
                <input
                  type="url"
                  name="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Victim image (optional)
                </label>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E2EBE5] bg-[#F4F7F5] p-4 text-center text-sm text-gray-600 transition focus-visible:outline-none">
                  <span>Upload beneficiary image</span>
                  <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Supporting document (PDF)</label>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E2EBE5] bg-[#F4F7F5] p-4 text-center text-sm text-gray-600 transition focus-visible:outline-none">
                  <span>Upload supporting document</span>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} required className="hidden" />
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating
                </span>
              ) : (
                "Create fundraiser"
              )}
            </button>
          </form>

          <div className="rounded-2xl border border-[#E2EBE5] bg-white p-5 lg:sticky lg:top-20">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</p>
            <h2 className="mt-2 text-lg font-semibold text-[#1A1A1A]">Campaign card</h2>
            <p className="mt-2 text-sm text-gray-600">Preview how your fundraiser appears to donors.</p>

            <div className="mt-6">
              <FundraiserCard
                title={formData.title || "Campaign title"}
                description={
                  formData.description ||
                  "Share the story behind your campaign to inspire supporters."
                }
                category={formData.category}
                targetAmount={Number(formData.neededAmount || 0)}
                raisedAmount={0}
                coverImage={formData.coverImage || previewCover.src}
              />
              <div className="mt-4 rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5] p-4 text-xs text-gray-600">
                <p>Supporting document: {formData.documents?.name || "Not uploaded yet"}</p>
                <p className="mt-1">Victim image: {formData.coverImageFile?.name || "Not uploaded yet"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
