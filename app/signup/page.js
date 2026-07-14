"use client"; // Required for Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      const loginResponse = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResponse?.error) {
        setError("Account created, but login failed. Please login manually.");
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch (signupError) {
      console.error("Signup failed:", signupError);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2EBE5] bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A]">Create an account</h1>

        {/* Full Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="my-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="my-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="my-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Already have an account? Login Link */}
        <div className="mt-3 text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-[#1B6B45] hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
