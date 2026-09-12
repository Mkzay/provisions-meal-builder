"use client";

import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid username or password");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F5]">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border-[2.5px] border-stone-900 shadow-brutal-lg space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <ProvisionsLogo size={48} />
            </div>
            <h1 className="font-display text-2xl font-black text-stone-900">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Sign in to access your kitchen catalogue and meals.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-black uppercase tracking-wider text-stone-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-black uppercase tracking-wider text-stone-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-0.5 active:translate-y-0.5 mt-2 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-amber-200 text-stone-700 cursor-wait"
                  : "bg-amber-300 hover:bg-amber-400 text-stone-900"
              }`}
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Kitchen"}</span>
            </button>
          </form>

          {/* Info note */}
          <div className="pt-2 border-t border-stone-200 text-center">
            <span className="text-[11px] font-medium text-stone-500">
              Private access instance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-8 h-8 rounded-full border-3 border-stone-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
