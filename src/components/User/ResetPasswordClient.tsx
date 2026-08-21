"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValidLink(false);
      toast.error("Invalid reset link. Please request a new one.");
    }
  }, [token]);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isStrongEnough = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        toast.success(
          data.message || "Password reset successfully! Redirecting to sign in..."
        );
        setTimeout(() => {
          router.push("/user/signin?reset=success");
        }, 2200);
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-[calc(100dvh-4rem)] w-full place-items-center bg-gray-50 font-sans antialiased overflow-hidden px-4">
      <div className="relative w-full max-w-6xl h-[min(640px,calc(100dvh-6rem))] rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Branding panel (left) */}
          <div className="relative hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-red-700 to-red-800 text-white px-10">
            <div className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path d="M100,0 C50,15 50,85 100,100 L100,0 Z" fill="white" />
              </svg>
            </div>
            <div className="text-center max-w-sm z-0">
              <div className="mb-8 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="font-bold text-2xl">I</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Set a new password</h2>
              <p className="text-red-100 text-sm leading-relaxed">
                Choose a strong password you don&apos;t use anywhere else. We
                recommend at least 8 characters with a mix of letters, numbers,
                and symbols.
              </p>
            </div>
          </div>

          {/* Form panel (right) */}
          <div className="flex w-full md:w-1/2 flex-col justify-center px-8 py-[22px] md:px-12 lg:px-16 overflow-hidden">
            <div className="w-full max-w-md mx-auto">
              {!isValidLink ? (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Invalid link
                  </h1>
                  <p className="text-gray-600 text-sm text-center mb-6">
                    This password reset link is missing or has expired.
                  </p>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
                    <p className="text-sm text-red-800">
                      ⚠️ Invalid reset link. Please request a new one from the
                      forgot password page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/user/forgot-password")}
                    className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 transition-colors"
                  >
                    Request a new link
                  </button>
                </div>
              ) : success ? (
                <div>
                  <div className="mb-8 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <span className="text-3xl">✓</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Password updated
                  </h1>
                  <p className="text-gray-600 text-sm text-center mb-8">
                    Your password has been reset successfully. Redirecting you
                    to sign in...
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/user/signin?reset=success")}
                    className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 transition-colors"
                  >
                    Go to sign in
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                      Create a new password
                    </h1>
                    <p className="text-gray-600 text-sm text-center">
                      Enter and confirm your new password below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="new-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          New Password
                        </label>
                        <span className="text-xs text-gray-500">
                          Min. 8 characters
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-red-700 focus:ring-2 focus:ring-red-700 focus:outline-none"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                    </div>

                    {/* Validation hints */}
                    {password.length > 0 && (
                      <ul className="text-xs space-y-1">
                        <li
                          className={
                            isStrongEnough
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          {isStrongEnough ? "✓" : "○"} At least 8 characters
                        </li>
                        <li
                          className={
                            passwordsMatch
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          {passwordsMatch ? "✓" : "○"} Passwords match
                        </li>
                      </ul>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !isStrongEnough || !passwordsMatch}
                      className="w-full rounded-lg bg-red-700 px-4 py-3 text-white font-medium hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>

                  <p className="mt-8 text-center text-sm text-gray-600">
                    Remembered your old password?{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/user/signin")}
                      className="font-medium text-red-700 hover:text-red-800"
                    >
                      Back to sign in
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="light"
        toastClassName={() =>
          "relative rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium leading-5 whitespace-normal break-words shadow-lg px-3 py-2 pr-8"
        }
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      />
    </div>
  );
}
