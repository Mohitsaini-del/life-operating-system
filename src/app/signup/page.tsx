"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong during signup");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      
      // Clear inputs
      setName("");
      setEmail("");
      setPassword("");

      // Smooth redirect
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6] dark:bg-[#1C1012]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6] dark:bg-[#1C1012] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 border border-[#EADEDF] dark:border-zinc-850 rounded-2xl shadow-sm space-y-6">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <span className="text-2xl font-extrabold tracking-wide text-zinc-900 dark:text-white leading-none">
            LIFE <span className="text-[#4D1A1E] dark:text-rose-450">OS</span>
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider uppercase">
            Build discipline. Design freedom.
          </span>
        </div>

        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white text-center">
          Create Your Account
        </h1>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#FAF0F1] dark:bg-[#4D1A1E]/25 border border-[#EADEDF] dark:border-[#4D1A1E]/45 text-xs font-bold text-[#4D1A1E] dark:text-rose-400 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mb-1.5 pl-0.5">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#EADEDF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#4D1A1E] dark:focus:ring-rose-450 transition text-sm font-medium"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mb-1.5 pl-0.5">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-[#EADEDF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#4D1A1E] dark:focus:ring-rose-450 transition text-sm font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mb-1.5 pl-0.5">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-[#EADEDF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#4D1A1E] dark:focus:ring-rose-450 transition text-sm font-medium"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4D1A1E] hover:bg-[#5C2429] dark:bg-rose-450 dark:hover:bg-rose-500 text-white rounded-xl font-bold text-sm transition shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-4 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4D1A1E] dark:text-rose-450 font-bold hover:underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}