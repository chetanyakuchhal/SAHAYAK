"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "Not Selected",
    birthday: "Not Selected",
  });

  const loadProfile = async () => {
    try {
      setIsProfileLoading(true);
      const response = await fetch("/api/user/profile", { cache: "no-store" });
      const data = await response.json();

      if (response.ok && data?.profile) {
        setProfileData({
          name: data.profile.name || "User",
          email: data.profile.email || session?.user?.email || "",
          phone: data.profile.phone || "",
          address: data.profile.address || "",
          gender: data.profile.gender || "Not Selected",
          birthday: data.profile.birthday || "Not Selected",
        });
      } else {
        setProfileData((prev) => ({
          ...prev,
          name: session?.user?.name || "User",
          email: session?.user?.email || "",
        }));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setProfileData((prev) => ({
        ...prev,
        name: session?.user?.name || "User",
        email: session?.user?.email || "",
      }));
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadProfile();
    }
  }, [status, router, session]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const payload = {
        ...profileData,
        birthday: profileData.birthday || "Not Selected",
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Failed to save profile");
        return;
      }

      setProfileData((prev) => ({
        ...prev,
        name: data?.user?.name || prev.name,
        email: data?.user?.email || prev.email,
        phone: data?.user?.phone || "",
        address: data?.user?.address || "",
        gender: data?.user?.gender || "Not Selected",
        birthday: data?.user?.birthday || "Not Selected",
      }));
      setIsEditingProfile(false);
      alert("Profile saved successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isProfileLoading) {
    return <div className="p-8 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 md:px-10 md:py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#E2EBE5] bg-white p-5 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          <div>
            <div className="mb-6 flex h-44 w-44 items-center justify-center rounded-2xl border border-[#E2EBE5] bg-[#F4F7F5]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1B6B45]/10 text-3xl font-semibold text-[#1B6B45]">
                {profileData.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold leading-none">{profileData.name || "User"}</h1>
            <div className="h-px bg-[#E2EBE5]" />
          </div>

          <div>
            {!isEditingProfile ? (
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact information
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="min-w-28 font-semibold text-gray-700">Email:</span>
                      <span className="break-all text-gray-600">{profileData.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="min-w-28 font-semibold text-gray-700">Phone:</span>
                      <span className="text-gray-600">{profileData.phone || "0000000000"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="min-w-28 font-semibold text-gray-700">Address:</span>
                      <span className="text-gray-600">{profileData.address || "Not added"}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Basic information
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="min-w-28 font-semibold text-gray-700">Gender:</span>
                      <span className="text-gray-600">{profileData.gender}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="min-w-28 font-semibold text-gray-700">Birthday:</span>
                      <span className="text-gray-600">{profileData.birthday}</span>
                    </div>
                  </div>
                </section>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="mt-2 cursor-pointer rounded-xl border border-[#E2EBE5] px-6 py-2.5 text-sm font-medium text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileInputChange}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#E2EBE5] bg-gray-50 px-4 py-2.5 text-sm text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileInputChange}
                  placeholder="Phone"
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileInputChange}
                  placeholder="Address"
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleProfileInputChange}
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                >
                  <option>Not Selected</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input
                  type="date"
                  name="birthday"
                  value={profileData.birthday === "Not Selected" ? "" : profileData.birthday}
                  onChange={handleProfileInputChange}
                  className="w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30 disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="cursor-pointer rounded-xl border border-[#E2EBE5] px-6 py-2.5 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
