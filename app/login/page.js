"use client";

import { useRouter } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    async function loadProviders() {
      const providers = await getProviders();
      setGoogleEnabled(Boolean(providers?.google));
    }

    loadProviders();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false, // Prevent automatic redirects
        identifier,
        password,
      });

      if (res?.error) {
        setError("Login failed. Check your credentials.");
      } else {
        console.log("Login successful! Redirecting...");
        router.push("/dashboard"); // ✅ Redirect after successful login
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E2EBE5] bg-white p-6 text-center shadow-sm sm:p-8">
        <h1 className="mb-4 text-3xl font-bold text-[#1A1A1A]">Welcome back</h1>

        {/* Email or Username Input */}
        <input
          type="text"
          placeholder="Enter email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="my-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="my-2 w-full rounded-xl border border-[#E2EBE5] px-4 py-2.5 text-sm focus:border-[#1B6B45] focus:outline-none focus:ring-2 focus:ring-[#1B6B45]/20"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 w-full cursor-pointer rounded-xl bg-[#1B6B45] px-6 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Google Login Button */}
        {googleEnabled && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="mt-2 w-full cursor-pointer rounded-xl border border-[#E2EBE5] bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/30"
          >
            Login with Google
          </button>
        )}

        {/* Forgot Password & Signup Links */}
        <div className="mt-3 flex justify-between text-sm text-gray-500">
          <button onClick={() => router.push("/forgot-password")} className="hover:underline">
            Forgot Password?
          </button>
          <button onClick={() => router.push("/signup")} className="hover:underline">
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
