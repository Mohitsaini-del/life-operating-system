"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
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
          Sign In to Your Workspace
        </h1>

        {/* Inline Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-[#FAF0F1] dark:bg-[#4D1A1E]/25 border border-[#EADEDF] dark:border-[#4D1A1E]/45 text-xs font-bold text-[#4D1A1E] dark:text-rose-450 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex justify-between items-center mb-1.5 pl-0.5">
              <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
                Password
              </label>
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-[#EADEDF] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#4D1A1E] dark:focus:ring-rose-450 transition text-sm font-medium"
              placeholder="••••••••"
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
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-4 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#4D1A1E] dark:text-rose-450 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}